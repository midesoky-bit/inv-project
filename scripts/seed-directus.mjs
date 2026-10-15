import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const baseUrl = (process.env.DIRECTUS_URL ?? "http://localhost:8055").replace(
  /\/$/,
  "",
);
const email = process.env.DIRECTUS_ADMIN_EMAIL ?? "admin@inventure.local";
const password = process.env.DIRECTUS_ADMIN_PASSWORD ?? "change-me-admin";

function loadRecords(exportName) {
  const source = fs.readFileSync(
    path.join(root, "src/lib/cms/providers/mock.ts"),
    "utf8",
  );
  const marker = `export const ${exportName}`;
  const start = source.indexOf(marker);
  if (start < 0) throw new Error(`Missing ${exportName} in mock.ts`);
  const eq = source.indexOf("=", start);
  const end = source.indexOf(";\n", eq);
  return Function(`"use strict"; return (${source.slice(eq + 1, end).trim()});`)();
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

async function publicPolicyId(token) {
  const roles = await api(token, "GET", "/roles?limit=-1");
  const publicRole = roles.json?.data?.find(
    (role) => role.admin_access === false && /public/i.test(role.name ?? ""),
  );
  if (!publicRole) return null;
  const access = await api(
    token,
    "GET",
    `/access?filter[role][_eq]=${publicRole.id}&limit=-1`,
  );
  return access.json?.data?.[0]?.policy ?? null;
}

async function ensurePublicRead(token, collection) {
  const policy = await publicPolicyId(token);
  if (policy) {
    const existing = await api(
      token,
      "GET",
      `/permissions?filter[policy][_eq]=${policy}&filter[collection][_eq]=${collection}&filter[action][_eq]=read`,
    );
    if (existing.json?.data?.length) return;
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
  const existing = await api(token, "GET", `/items/languages/${code}`);
  if (existing.ok) return;
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
  const result = id
    ? await api(token, "PATCH", `/items/services/${id}`, payload)
    : await api(token, "POST", "/items/services", payload);
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
  const result = id
    ? await api(token, "PATCH", `/items/esg_commitments/${id}`, payload)
    : await api(token, "POST", "/items/esg_commitments", payload);
  if (!result.ok) {
    throw new Error(`ESG ${record.order}: ${JSON.stringify(result.json)}`);
  }
}

const services = loadRecords("SERVICE_RECORDS");
const esg = loadRecords("ESG_COMMITMENT_RECORDS");
const token = await waitForLogin();

await ensureCollection(token, "languages", {
  icon: "translate",
  display_template: "{{name}}",
});
await ensureField(token, "languages", {
  field: "code",
  type: "string",
  schema: { is_primary_key: true, has_auto_increment: false, length: 16, is_nullable: false },
  meta: { interface: "input", required: true, width: "half" },
});
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
    options: { choices: [{ text: "LTR", value: "ltr" }, { text: "RTL", value: "rtl" }] },
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
  schema: { is_nullable: false },
  meta: { interface: "select-dropdown-m2o", required: true },
});
await ensureField(token, "services_translations", {
  field: "services_id",
  type: "integer",
  schema: { is_nullable: false },
  meta: { hidden: true },
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
await ensureRelation(token, {
  collection: "services_translations",
  field: "languages_code",
  related_collection: "languages",
  schema: { on_delete: "CASCADE" },
  meta: { one_collection: "languages", many_collection: "services_translations", many_field: "languages_code" },
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
  schema: { is_nullable: false },
  meta: { interface: "select-dropdown-m2o", required: true },
});
await ensureField(token, "esg_commitments_translations", {
  field: "esg_commitments_id",
  type: "integer",
  schema: { is_nullable: false },
  meta: { hidden: true },
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
await ensureRelation(token, {
  collection: "esg_commitments_translations",
  field: "languages_code",
  related_collection: "languages",
  schema: { on_delete: "CASCADE" },
  meta: {
    one_collection: "languages",
    many_collection: "esg_commitments_translations",
    many_field: "languages_code",
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

await upsertLanguage(token, "en", "English", "ltr");
await upsertLanguage(token, "ar", "Arabic", "rtl");

for (const record of services) await upsertService(token, record);
for (const record of esg) await upsertEsg(token, record);

console.log(`Seeded ${services.length} services and ${esg.length} ESG commitments at ${baseUrl}`);
