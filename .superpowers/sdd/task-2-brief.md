### Task 2: CMS types, client, mock provider, and public service API

**Files:**
- Create: `src/types/cms.ts`
- Create: `src/lib/cms/errors.ts`
- Create: `src/lib/cms/client.ts`
- Create: `src/lib/cms/providers/mock.ts`
- Create: `src/lib/cms/providers/directus.ts`
- Create: `src/lib/cms/providers/supabase.ts`
- Create: `src/services/cms.ts`
- Create: `src/services/cms.test.ts`
- Create: `.env.example`
- Create: `.env.local` (gitignored; mock defaults)

**Interfaces:**
- Consumes: none
- Produces:
  - `Service`, `Insight`, `EsgCommitment`, `CaseStudy` types
  - `fetchServices(): Promise<Service[]>`
  - `fetchServiceBySlug(slug: string): Promise<Service | null>`
  - `fetchInsights(): Promise<Insight[]>`
  - `fetchEsgCommitments(): Promise<EsgCommitment[]>`
  - `fetchCaseStudies(): Promise<CaseStudy[]>`
  - `REVALIDATE_SECONDS = 3600`
  - `cmsFetch(path, init?, tags?)` helper for remote providers

- [ ] **Step 1: Write failing CMS tests**

Create `src/services/cms.test.ts`:

```ts
import { beforeEach, describe, expect, it } from "vitest";
import {
  fetchServiceBySlug,
  fetchServices,
  fetchInsights,
  fetchEsgCommitments,
  fetchCaseStudies,
} from "@/services/cms";

describe("cms service (mock provider)", () => {
  beforeEach(() => {
    process.env.CMS_PROVIDER = "mock";
  });

  it("returns ordered services including public affairs", async () => {
    const services = await fetchServices();
    expect(services.length).toBeGreaterThanOrEqual(4);
    expect(services.map((s) => s.slug)).toContain("public-affairs");
    const orders = services.map((s) => s.order);
    expect(orders).toEqual([...orders].sort((a, b) => a - b));
  });

  it("fetches a service by slug", async () => {
    const service = await fetchServiceBySlug("media-production");
    expect(service).not.toBeNull();
    expect(service?.title).toMatch(/media production/i);
  });

  it("returns null for unknown slug", async () => {
    expect(await fetchServiceBySlug("does-not-exist")).toBeNull();
  });

  it("exposes future content helpers", async () => {
    await expect(fetchInsights()).resolves.toEqual([]);
    await expect(fetchEsgCommitments()).resolves.toEqual([]);
    await expect(fetchCaseStudies()).resolves.toEqual([]);
  });
});
```

- [ ] **Step 2: Run tests — expect FAIL**

```powershell
npm test
```

Expected: FAIL (module `@/services/cms` not found).

- [ ] **Step 3: Implement types**

Create `src/types/cms.ts`:

```ts
export type Service = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  description: string;
  order: number;
  icon?: string;
};

export type Insight = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  publishedAt: string;
};

export type EsgCommitment = {
  id: string;
  title: string;
  summary: string;
  order: number;
};

export type CaseStudy = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  serviceSlug?: string;
};

export type CmsProviderName = "mock" | "directus" | "supabase";
```

- [ ] **Step 4: Implement errors + client**

Create `src/lib/cms/errors.ts`:

```ts
export class CmsError extends Error {
  constructor(
    message: string,
    readonly code: "CONFIG" | "NETWORK" | "NOT_FOUND" | "PARSE",
    readonly cause?: unknown,
  ) {
    super(message);
    this.name = "CmsError";
  }
}
```

Create `src/lib/cms/client.ts`:

```ts
import { CmsError } from "@/lib/cms/errors";

export const REVALIDATE_SECONDS = 3600;

export function getCmsProvider(): "mock" | "directus" | "supabase" {
  const value = (process.env.CMS_PROVIDER ?? "mock").toLowerCase();
  if (value === "directus" || value === "supabase" || value === "mock") {
    return value;
  }
  return "mock";
}

type CmsFetchOptions = {
  tags?: string[];
  revalidate?: number | false;
  headers?: HeadersInit;
};

export async function cmsFetch<T>(
  path: string,
  options: CmsFetchOptions = {},
): Promise<T> {
  const baseUrl = process.env.CMS_URL;
  if (!baseUrl) {
    throw new CmsError("CMS_URL is not configured", "CONFIG");
  }

  const token = process.env.CMS_TOKEN;
  const url = `${baseUrl.replace(/\/$/, "")}${path.startsWith("/") ? path : `/${path}`}`;

  let response: Response;
  try {
    response = await fetch(url, {
      headers: {
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
      next: {
        tags: options.tags,
        revalidate: options.revalidate ?? REVALIDATE_SECONDS,
      },
    });
  } catch (cause) {
    throw new CmsError(`CMS request failed for ${path}`, "NETWORK", cause);
  }

  if (!response.ok) {
    throw new CmsError(
      `CMS responded ${response.status} for ${path}`,
      response.status === 404 ? "NOT_FOUND" : "NETWORK",
    );
  }

  try {
    return (await response.json()) as T;
  } catch (cause) {
    throw new CmsError(`Failed to parse CMS response for ${path}`, "PARSE", cause);
  }
}
```

- [ ] **Step 5: Implement mock + remote stubs**

Create `src/lib/cms/providers/mock.ts`:

```ts
import type {
  CaseStudy,
  EsgCommitment,
  Insight,
  Service,
} from "@/types/cms";

const SERVICES: Service[] = [
  {
    id: "1",
    slug: "media-production",
    title: "Media Production",
    summary:
      "Broadcast-quality storytelling that carries institutional narratives with clarity and restraint.",
    description:
      "From executive films to multi-format campaigns, we produce media that meets the standards of government, enterprise, and multilateral stakeholders across the Middle East.",
    order: 1,
    icon: "media",
  },
  {
    id: "2",
    slug: "digital-media",
    title: "Digital Media",
    summary:
      "Owned and earned digital ecosystems designed for influence, not noise.",
    description:
      "We architect digital presence, content systems, and performance frameworks that advance reputation and policy objectives in complex regional markets.",
    order: 2,
    icon: "digital",
  },
  {
    id: "3",
    slug: "events",
    title: "Events",
    summary:
      "High-stakes convenings staged with diplomatic precision and operational excellence.",
    description:
      "Summits, forums, and private briefings delivered end-to-end — messaging, staging, stakeholder management, and post-event narrative continuity.",
    order: 3,
    icon: "events",
  },
  {
    id: "4",
    slug: "public-affairs",
    title: "Public Affairs",
    summary:
      "Strategic counsel at the intersection of policy, reputation, and public discourse.",
    description:
      "We advise leadership teams on stakeholder mapping, issues management, and communications that withstand scrutiny in the Middle East’s institutional landscape.",
    order: 4,
    icon: "affairs",
  },
];

export async function mockFetchServices(): Promise<Service[]> {
  return [...SERVICES].sort((a, b) => a.order - b.order);
}

export async function mockFetchServiceBySlug(
  slug: string,
): Promise<Service | null> {
  const services = await mockFetchServices();
  return services.find((s) => s.slug === slug) ?? null;
}

export async function mockFetchInsights(): Promise<Insight[]> {
  return [];
}

export async function mockFetchEsgCommitments(): Promise<EsgCommitment[]> {
  return [];
}

export async function mockFetchCaseStudies(): Promise<CaseStudy[]> {
  return [];
}
```

Create `src/lib/cms/providers/directus.ts`:

```ts
import { cmsFetch } from "@/lib/cms/client";
import { CmsError } from "@/lib/cms/errors";
import type {
  CaseStudy,
  EsgCommitment,
  Insight,
  Service,
} from "@/types/cms";

type DirectusList<T> = { data: T[] };
type DirectusItem<T> = { data: T };

export async function directusFetchServices(): Promise<Service[]> {
  const result = await cmsFetch<DirectusList<Service>>(
    "/items/services?sort=order",
    { tags: ["services"] },
  );
  return result.data;
}

export async function directusFetchServiceBySlug(
  slug: string,
): Promise<Service | null> {
  try {
    const result = await cmsFetch<DirectusList<Service>>(
      `/items/services?filter[slug][_eq]=${encodeURIComponent(slug)}&limit=1`,
      { tags: ["services", `service:${slug}`] },
    );
    return result.data[0] ?? null;
  } catch (error) {
    if (error instanceof CmsError && error.code === "NOT_FOUND") return null;
    throw error;
  }
}

export async function directusFetchInsights(): Promise<Insight[]> {
  const result = await cmsFetch<DirectusList<Insight>>("/items/insights", {
    tags: ["insights"],
  });
  return result.data;
}

export async function directusFetchEsgCommitments(): Promise<EsgCommitment[]> {
  const result = await cmsFetch<DirectusList<EsgCommitment>>(
    "/items/esg_commitments?sort=order",
    { tags: ["esg"] },
  );
  return result.data;
}

export async function directusFetchCaseStudies(): Promise<CaseStudy[]> {
  const result = await cmsFetch<DirectusList<CaseStudy>>("/items/case_studies", {
    tags: ["case-studies"],
  });
  return result.data;
}

// Reserved for single-item patterns
export type { DirectusItem };
```

Create `src/lib/cms/providers/supabase.ts`:

```ts
import { cmsFetch } from "@/lib/cms/client";
import type {
  CaseStudy,
  EsgCommitment,
  Insight,
  Service,
} from "@/types/cms";

export async function supabaseFetchServices(): Promise<Service[]> {
  return cmsFetch<Service[]>(
    "/rest/v1/services?select=*&order=order.asc",
    {
      tags: ["services"],
      headers: {
        apikey: process.env.CMS_TOKEN ?? "",
      },
    },
  );
}

export async function supabaseFetchServiceBySlug(
  slug: string,
): Promise<Service | null> {
  const rows = await cmsFetch<Service[]>(
    `/rest/v1/services?select=*&slug=eq.${encodeURIComponent(slug)}&limit=1`,
    {
      tags: ["services", `service:${slug}`],
      headers: {
        apikey: process.env.CMS_TOKEN ?? "",
      },
    },
  );
  return rows[0] ?? null;
}

export async function supabaseFetchInsights(): Promise<Insight[]> {
  return cmsFetch<Insight[]>("/rest/v1/insights?select=*", {
    tags: ["insights"],
    headers: { apikey: process.env.CMS_TOKEN ?? "" },
  });
}

export async function supabaseFetchEsgCommitments(): Promise<EsgCommitment[]> {
  return cmsFetch<EsgCommitment[]>(
    "/rest/v1/esg_commitments?select=*&order=order.asc",
    {
      tags: ["esg"],
      headers: { apikey: process.env.CMS_TOKEN ?? "" },
    },
  );
}

export async function supabaseFetchCaseStudies(): Promise<CaseStudy[]> {
  return cmsFetch<CaseStudy[]>("/rest/v1/case_studies?select=*", {
    tags: ["case-studies"],
    headers: { apikey: process.env.CMS_TOKEN ?? "" },
  });
}
```

- [ ] **Step 6: Implement public `src/services/cms.ts`**

```ts
import { getCmsProvider } from "@/lib/cms/client";
import * as directus from "@/lib/cms/providers/directus";
import * as mock from "@/lib/cms/providers/mock";
import * as supabase from "@/lib/cms/providers/supabase";
import type {
  CaseStudy,
  EsgCommitment,
  Insight,
  Service,
} from "@/types/cms";

function provider() {
  switch (getCmsProvider()) {
    case "directus":
      return directus;
    case "supabase":
      return supabase;
    default:
      return mock;
  }
}

export async function fetchServices(): Promise<Service[]> {
  const p = provider();
  if ("mockFetchServices" in p) return mock.mockFetchServices();
  if (getCmsProvider() === "directus") return directus.directusFetchServices();
  return supabase.supabaseFetchServices();
}

export async function fetchServiceBySlug(
  slug: string,
): Promise<Service | null> {
  switch (getCmsProvider()) {
    case "directus":
      return directus.directusFetchServiceBySlug(slug);
    case "supabase":
      return supabase.supabaseFetchServiceBySlug(slug);
    default:
      return mock.mockFetchServiceBySlug(slug);
  }
}

export async function fetchInsights(): Promise<Insight[]> {
  switch (getCmsProvider()) {
    case "directus":
      return directus.directusFetchInsights();
    case "supabase":
      return supabase.supabaseFetchInsights();
    default:
      return mock.mockFetchInsights();
  }
}

export async function fetchEsgCommitments(): Promise<EsgCommitment[]> {
  switch (getCmsProvider()) {
    case "directus":
      return directus.directusFetchEsgCommitments();
    case "supabase":
      return supabase.supabaseFetchEsgCommitments();
    default:
      return mock.mockFetchEsgCommitments();
  }
}

export async function fetchCaseStudies(): Promise<CaseStudy[]> {
  switch (getCmsProvider()) {
    case "directus":
      return directus.directusFetchCaseStudies();
    case "supabase":
      return supabase.supabaseFetchCaseStudies();
    default:
      return mock.mockFetchCaseStudies();
  }
}

export { REVALIDATE_SECONDS } from "@/lib/cms/client";
```

Simplify `fetchServices` to the same switch pattern as the other functions (do not leave the `"mockFetchServices" in p` branch — use an explicit switch matching `fetchServiceBySlug`).

Final `fetchServices`:

```ts
export async function fetchServices(): Promise<Service[]> {
  switch (getCmsProvider()) {
    case "directus":
      return directus.directusFetchServices();
    case "supabase":
      return supabase.supabaseFetchServices();
    default:
      return mock.mockFetchServices();
  }
}
```

- [ ] **Step 7: Add env files**

Create `.env.example`:

```env
CMS_PROVIDER=mock
CMS_URL=
CMS_TOKEN=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Create `.env.local` with the same mock defaults. Ensure `.gitignore` includes `.env*.local`.

- [ ] **Step 8: Run tests — expect PASS**

```powershell
npm test
```

Expected: all CMS tests PASS.

- [ ] **Step 9: Commit**

```powershell
git add src/types src/lib/cms src/services .env.example
git commit -m "feat: add CMS-agnostic service layer with mock provider"
```

---

