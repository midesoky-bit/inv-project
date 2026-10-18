import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const baseUrl = (process.env.DIRECTUS_URL ?? "http://localhost:8055").replace(
  /\/$/,
  "",
);
const email = process.env.DIRECTUS_ADMIN_EMAIL ?? "admin@inventure.com";
const password = process.env.DIRECTUS_ADMIN_PASSWORD ?? "change-me-admin";

function loadSeedData() {
  const file = path.join(scriptDir, "seed-data.json");
  const data = JSON.parse(fs.readFileSync(file, "utf8"));
  if (!Array.isArray(data.services) || !Array.isArray(data.esg)) {
    throw new Error(`Expected services and esg arrays in ${file}`);
  }
  return data;
}

async function api(token, method, pathname, body) {
  const response = await fetch(`${baseUrl}${pathname}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const text = await response.text();
  const json = text ? JSON.parse(text) : null;
  return { ok: response.ok, status: response.status, json };
}

async function waitForLogin() {
  const deadline = Date.now() + 120_000;
  let lastError = "Directus is not ready";
  while (Date.now() < deadline) {
    try {
      const result = await api(null, "POST", "/auth/login", { email, password });
      if (result.ok && result.json?.data?.access_token) {
        return result.json.data.access_token;
      }
      lastError = JSON.stringify(result.json);
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error);
    }
    await new Promise((resolve) => setTimeout(resolve, 3000));
  }
  throw new Error(`Could not log in to Directus: ${lastError}`);
}

async function ensureCollection(token, collection, meta) {
  const existing = await api(token, "GET", `/collections/${collection}`);
  if (existing.ok) return;
  const created = await api(token, "POST", "/collections", {
    collection,
    schema: {},
    meta,
  });
  if (!created.ok) {
    throw new Error(`Create collection ${collection}: ${JSON.stringify(created.json)}`);
  }
}

async function ensureField(token, collection, field) {
  const existing = await api(token, "GET", `/fields/${collection}/${field.field}`);
  if (existing.ok) return;
  const created = await api(token, "POST", `/fields/${collection}`, field);
  if (!created.ok) {
    throw new Error(
      `Create field ${collection}.${field.field}: ${JSON.stringify(created.json)}`,
    );
  }
}

async function ensureRelation(token, relation) {
  const existing = await api(
    token,
    "GET",
    `/relations/${relation.collection}/${relation.field}`,
  );
  if (existing.ok) return;
  const created = await api(token, "POST", "/relations", relation);
  if (!created.ok) {
    throw new Error(`Create relation ${relation.field}: ${JSON.stringify(created.json)}`);
  }
}

const LANGUAGE_DIRECTION_OPTIONS = {
  choices: [
    { text: "LTR", value: "ltr" },
    { text: "RTL", value: "rtl" },
  ],
};

async function createLanguagesCollection(token) {
  const created = await api(token, "POST", "/collections", {
    collection: "languages",
    schema: {},
    meta: { icon: "translate", display_template: "{{name}}" },
    fields: [
      {
        field: "code",
        type: "string",
        schema: {
          is_primary_key: true,
          has_auto_increment: false,
          length: 16,
          is_nullable: false,
        },
        meta: { interface: "input", required: true, width: "half" },
      },
      {
        field: "name",
        type: "string",
        schema: { is_nullable: false },
        meta: { interface: "input", required: true, width: "half" },
      },
      {
        field: "direction",
        type: "string",
        schema: { default_value: "ltr" },
        meta: {
          interface: "select-dropdown",
          options: LANGUAGE_DIRECTION_OPTIONS,
        },
      },
    ],
  });
  if (!created.ok) {
    throw new Error(`Create languages: ${JSON.stringify(created.json)}`);
  }
}

async function ensureLanguagesCollection(token) {
  const existing = await api(token, "GET", "/collections/languages");
  if (!existing.ok) {
    await createLanguagesCollection(token);
    return;
  }

  const code = await api(token, "GET", "/fields/languages/code");
  if (code.ok && code.json?.data?.schema?.is_primary_key) return;

  const items = await api(
    token,
    "GET",
    "/items/languages?fields=code,name,direction&limit=-1",
  );
  const rows = items.ok ? (items.json?.data ?? []) : [];
  const removed = await api(token, "DELETE", "/collections/languages");
  if (!removed.ok) {
    throw new Error(`Could not rebuild languages: ${JSON.stringify(removed.json)}`);
  }
  await createLanguagesCollection(token);
  for (const row of rows) {
    if (!row.code) continue;
    await upsertLanguage(token, row.code, row.name ?? row.code, row.direction ?? "ltr");
  }
}

async function ensureLanguageLink(token, collection, parentField) {
  await ensureRelation(token, {
    collection,
    field: "languages_code",
    related_collection: "languages",
    schema: { on_delete: "RESTRICT" },
    meta: {
      many_collection: collection,
      many_field: "languages_code",
      one_collection: "languages",
      one_field: null,
      junction_field: parentField,
    },
  });
}

async function ensureTranslationsInterface(token, collection) {
  const updated = await api(token, "PATCH", `/fields/${collection}/translations`, {
    meta: {
      interface: "translations",
      special: ["translations"],
      options: {
        languageField: "code",
        languageDirectionField: "direction",
        defaultLanguage: "en",
      },
    },
  });
  if (!updated.ok) {
    throw new Error(
      `Translations interface ${collection}: ${JSON.stringify(updated.json)}`,
    );
  }
}

async function publicPolicyId(token) {
  const policies = await api(token, "GET", "/policies?limit=-1");
  const named = policies.json?.data?.find((policy) => policy.name === "$t:public_label");
  if (named?.id) return named.id;
  const access = await api(token, "GET", "/access?limit=-1");
  return access.json?.data?.find((entry) => entry.role == null && entry.user == null)?.policy ?? null;
}

async function ensurePublicRead(token, collection) {
  const policy = await publicPolicyId(token);
  if (policy) {
    const existing = await api(
      token,
      "GET",
      `/permissions?filter[policy][_eq]=${policy}&filter[collection][_eq]=${collection}&filter[action][_eq]=read`,
    );
    if (existing.json?.data?.length) {
      for (const permission of existing.json.data) {
        const fields = permission.fields;
        const hasAll = Array.isArray(fields) && fields.includes("*");
        if (hasAll) continue;
        await api(token, "PATCH", `/permissions/${permission.id}`, {
          fields: ["*"],
        });
      }
      return;
    }
    const created = await api(token, "POST", "/permissions", {
      policy,
      collection,
      action: "read",
      fields: ["*"],
    });
    if (created.ok) return;
  }

  const legacy = await api(token, "POST", "/permissions", {
    role: null,
    collection,
    action: "read",
    fields: ["*"],
  });
  if (!legacy.ok && legacy.status !== 400) {
    throw new Error(`Public read for ${collection}: ${JSON.stringify(legacy.json)}`);
  }
}

async function upsertLanguage(token, code, name, direction) {
  const existing = await api(
    token,
    "GET",
    `/items/languages?filter[code][_eq]=${encodeURIComponent(code)}&limit=1`,
  );
  if (existing.json?.data?.length) return;
  const created = await api(token, "POST", "/items/languages", {
    code,
    name,
    direction,
  });
  if (!created.ok) {
    throw new Error(`Language ${code}: ${JSON.stringify(created.json)}`);
  }
}

function translationsFor(record, fields) {
  return ["en", "ar"].map((code) => {
    const row = { languages_code: code };
    for (const field of fields) {
      row[field] = record[field][code];
    }
    return row;
  });
}

async function upsertService(token, record) {
  const found = await api(
    token,
    "GET",
    `/items/services?filter[slug][_eq]=${encodeURIComponent(record.slug)}&fields=id&limit=1`,
  );
  const payload = {
    slug: record.slug,
    order: record.order,
    icon: record.icon ?? null,
    status: "published",
    translations: translationsFor(record, [
      "title",
      "summary",
      "description",
      "highlights",
    ]),
  };
  const id = found.json?.data?.[0]?.id;
  if (id) return;
  const result = await api(token, "POST", "/items/services", payload);
  if (!result.ok) {
    throw new Error(`Service ${record.slug}: ${JSON.stringify(result.json)}`);
  }
}

async function upsertEsg(token, record) {
  const found = await api(
    token,
    "GET",
    `/items/esg_commitments?filter[order][_eq]=${record.order}&fields=id&limit=1`,
  );
  const payload = {
    order: record.order,
    translations: translationsFor(record, ["title", "summary"]),
  };
  const id = found.json?.data?.[0]?.id;
  if (id) return;
  const result = await api(token, "POST", "/items/esg_commitments", payload);
  if (!result.ok) {
    throw new Error(`ESG ${record.order}: ${JSON.stringify(result.json)}`);
  }
}

const { services, esg } = loadSeedData();
const token = await waitForLogin();

await ensureLanguagesCollection(token);
await ensureField(token, "languages", {
  field: "name",
  type: "string",
  schema: { is_nullable: false },
  meta: { interface: "input", required: true, width: "half" },
});
await ensureField(token, "languages", {
  field: "direction",
  type: "string",
  schema: { default_value: "ltr" },
  meta: {
    interface: "select-dropdown",
    options: LANGUAGE_DIRECTION_OPTIONS,
  },
});

await ensureCollection(token, "services", {
  icon: "design_services",
  display_template: "{{slug}}",
});
await ensureField(token, "services", {
  field: "slug",
  type: "string",
  schema: { is_unique: true, is_nullable: false },
  meta: { interface: "input", required: true, width: "half" },
});
await ensureField(token, "services", {
  field: "order",
  type: "integer",
  schema: { default_value: 0 },
  meta: { interface: "input", width: "half" },
});
await ensureField(token, "services", {
  field: "icon",
  type: "string",
  meta: { interface: "input", width: "half" },
});
await ensureField(token, "services", {
  field: "image",
  type: "uuid",
  meta: {
    interface: "file-image",
    special: ["file"],
    display: "image",
    width: "full",
  },
});
await ensureRelation(token, {
  collection: "services",
  field: "image",
  related_collection: "directus_files",
  schema: { on_delete: "SET NULL" },
  meta: {
    one_field: null,
    sort_field: null,
    one_deselect_action: "nullify",
  },
});
await ensureField(token, "services", {
  field: "status",
  type: "string",
  schema: { default_value: "published", is_nullable: false },
  meta: {
    interface: "select-dropdown",
    width: "half",
    options: {
      choices: [
        { text: "Published", value: "published" },
        { text: "Draft", value: "draft" },
      ],
    },
  },
});

await ensureCollection(token, "services_translations", { hidden: true, icon: "translate" });
await ensureField(token, "services_translations", {
  field: "title",
  type: "string",
  schema: { is_nullable: false },
  meta: { interface: "input", required: true },
});
await ensureField(token, "services_translations", {
  field: "summary",
  type: "text",
  meta: { interface: "input-multiline" },
});
await ensureField(token, "services_translations", {
  field: "description",
  type: "text",
  meta: { interface: "input-rich-text-md" },
});
await ensureField(token, "services_translations", {
  field: "highlights",
  type: "json",
  schema: { default_value: [] },
  meta: { interface: "tags" },
});
await ensureField(token, "services_translations", {
  field: "languages_code",
  type: "string",
  schema: { is_nullable: false, length: 16 },
  meta: { interface: "input", required: true, width: "half" },
});
await ensureField(token, "services_translations", {
  field: "services_id",
  type: "integer",
  schema: { is_nullable: false },
  meta: { hidden: true },
});
await ensureField(token, "services", {
  field: "translations",
  type: "alias",
  meta: { interface: "translations", special: ["translations"] },
});
await ensureRelation(token, {
  collection: "services_translations",
  field: "services_id",
  related_collection: "services",
  schema: { on_delete: "CASCADE" },
  meta: {
    one_field: "translations",
    junction_field: "languages_code",
    one_collection: "services",
    many_collection: "services_translations",
    many_field: "services_id",
  },
});
await ensureCollection(token, "esg_commitments", { icon: "park", display_template: "{{order}}" });
await ensureField(token, "esg_commitments", {
  field: "order",
  type: "integer",
  schema: { default_value: 0 },
  meta: { interface: "input" },
});
await ensureCollection(token, "esg_commitments_translations", { hidden: true });
await ensureField(token, "esg_commitments_translations", {
  field: "title",
  type: "string",
  schema: { is_nullable: false },
  meta: { interface: "input", required: true },
});
await ensureField(token, "esg_commitments_translations", {
  field: "summary",
  type: "text",
  meta: { interface: "input-multiline" },
});
await ensureField(token, "esg_commitments_translations", {
  field: "languages_code",
  type: "string",
  schema: { is_nullable: false, length: 16 },
  meta: { interface: "input", required: true, width: "half" },
});
await ensureField(token, "esg_commitments_translations", {
  field: "esg_commitments_id",
  type: "integer",
  schema: { is_nullable: false },
  meta: { hidden: true },
});
await ensureField(token, "esg_commitments", {
  field: "translations",
  type: "alias",
  meta: { interface: "translations", special: ["translations"] },
});
await ensureRelation(token, {
  collection: "esg_commitments_translations",
  field: "esg_commitments_id",
  related_collection: "esg_commitments",
  schema: { on_delete: "CASCADE" },
  meta: {
    one_field: "translations",
    junction_field: "languages_code",
    one_collection: "esg_commitments",
    many_collection: "esg_commitments_translations",
    many_field: "esg_commitments_id",
  },
});
for (const collection of [
  "languages",
  "services",
  "services_translations",
  "esg_commitments",
  "esg_commitments_translations",
]) {
  await ensurePublicRead(token, collection);
}
try {
  await ensurePublicRead(token, "directus_files");
} catch (error) {
  console.warn(
    `Public read for directus_files skipped: ${error instanceof Error ? error.message : error}`,
  );
}

const statusField = {
  field: "status",
  type: "string",
  schema: { default_value: "published", is_nullable: false },
  meta: {
    interface: "select-dropdown",
    width: "half",
    options: {
      choices: [
        { text: "Published", value: "published" },
        { text: "Draft", value: "draft" },
      ],
    },
  },
};

await ensureCollection(token, "insights", {
  icon: "article",
  display_template: "{{slug}}",
});
await ensureField(token, "insights", {
  field: "slug",
  type: "string",
  schema: { is_unique: true, is_nullable: false },
  meta: { interface: "input", required: true, width: "half" },
});
await ensureField(token, "insights", statusField);
await ensureField(token, "insights", {
  field: "published_at",
  type: "timestamp",
  schema: { is_nullable: true },
  meta: { interface: "datetime", width: "half" },
});
await ensureCollection(token, "insights_translations", { hidden: true, icon: "translate" });
await ensureField(token, "insights_translations", {
  field: "title",
  type: "string",
  schema: { is_nullable: false },
  meta: { interface: "input", required: true },
});
await ensureField(token, "insights_translations", {
  field: "summary",
  type: "text",
  meta: { interface: "input-multiline" },
});
await ensureField(token, "insights_translations", {
  field: "body",
  type: "text",
  meta: { interface: "input-multiline" },
});
await ensureField(token, "insights_translations", {
  field: "languages_code",
  type: "string",
  schema: { is_nullable: false, length: 16 },
  meta: { interface: "input", required: true, width: "half" },
});
await ensureField(token, "insights_translations", {
  field: "insights_id",
  type: "integer",
  schema: { is_nullable: false },
  meta: { hidden: true },
});
await ensureField(token, "insights", {
  field: "translations",
  type: "alias",
  meta: { interface: "translations", special: ["translations"] },
});
await ensureRelation(token, {
  collection: "insights_translations",
  field: "insights_id",
  related_collection: "insights",
  schema: { on_delete: "CASCADE" },
  meta: {
    one_field: "translations",
    junction_field: "languages_code",
    one_collection: "insights",
    many_collection: "insights_translations",
    many_field: "insights_id",
  },
});

await ensureCollection(token, "careers", {
  icon: "badge",
  display_template: "{{slug}}",
});
await ensureField(token, "careers", {
  field: "slug",
  type: "string",
  schema: { is_unique: true, is_nullable: false },
  meta: { interface: "input", required: true, width: "half" },
});
await ensureField(token, "careers", statusField);
await ensureCollection(token, "careers_translations", { hidden: true, icon: "translate" });
await ensureField(token, "careers_translations", {
  field: "title",
  type: "string",
  schema: { is_nullable: false },
  meta: { interface: "input", required: true },
});
await ensureField(token, "careers_translations", {
  field: "summary",
  type: "text",
  meta: { interface: "input-multiline" },
});
await ensureField(token, "careers_translations", {
  field: "location",
  type: "string",
  meta: { interface: "input", width: "half" },
});
await ensureField(token, "careers_translations", {
  field: "languages_code",
  type: "string",
  schema: { is_nullable: false, length: 16 },
  meta: { interface: "input", required: true, width: "half" },
});
await ensureField(token, "careers_translations", {
  field: "careers_id",
  type: "integer",
  schema: { is_nullable: false },
  meta: { hidden: true },
});
await ensureField(token, "careers", {
  field: "translations",
  type: "alias",
  meta: { interface: "translations", special: ["translations"] },
});
await ensureRelation(token, {
  collection: "careers_translations",
  field: "careers_id",
  related_collection: "careers",
  schema: { on_delete: "CASCADE" },
  meta: {
    one_field: "translations",
    junction_field: "languages_code",
    one_collection: "careers",
    many_collection: "careers_translations",
    many_field: "careers_id",
  },
});

for (const collection of [
  "insights",
  "insights_translations",
  "careers",
  "careers_translations",
]) {
  await ensurePublicRead(token, collection);
}

await upsertLanguage(token, "en", "English", "ltr");
await upsertLanguage(token, "ar", "Arabic", "rtl");
await ensureLanguageLink(token, "services_translations", "services_id");
await ensureLanguageLink(token, "esg_commitments_translations", "esg_commitments_id");
await ensureLanguageLink(token, "insights_translations", "insights_id");
await ensureLanguageLink(token, "careers_translations", "careers_id");
await ensureTranslationsInterface(token, "services");
await ensureTranslationsInterface(token, "esg_commitments");
await ensureTranslationsInterface(token, "insights");
await ensureTranslationsInterface(token, "careers");

for (const record of services) await upsertService(token, record);
for (const record of esg) await upsertEsg(token, record);

console.log(`Seeded ${services.length} services and ${esg.length} ESG commitments at ${baseUrl}`);
