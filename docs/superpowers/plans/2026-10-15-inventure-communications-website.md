# Inventure Communications Website Bootstrap Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bootstrap a performant, SEO-optimized Next.js corporate site for Inventure Communications with a CMS-agnostic data layer, institutional homepage shell, and static service detail routes.

**Architecture:** App Router Server Components fetch content through `src/services/cms.ts`, which dispatches to `mock` | `directus` | `supabase` providers. UI stays institutional (navy/white/gray); Framer Motion is confined to leaf client components. ISR uses tagged native `fetch` with a 3600s revalidate window.

**Tech Stack:** Next.js (App Router), TypeScript strict, Tailwind CSS, Framer Motion, native `fetch` + ISR/SSG

## Global Constraints

- Path alias `@/*` → `src/*`
- Default `CMS_PROVIDER=mock` so build/dev works offline
- Palette tokens: `--inv-navy` `#0B1D36`, `--inv-navy-mid` `#132A4A`, `--inv-slate` `#5C6B7A`, `--inv-mist` `#F3F5F7`, `--inv-white` `#FFFFFF`, accent `#3A6B8C`
- Fonts: IBM Plex Serif (display) + IBM Plex Sans (body)
- Hero: brand + one headline + one subhead + CTA group only — no cards, stats, badges, overlays
- `"use client"` only on interactive leaf components
- Insights/ESG full pages are out of scope (nav uses `/#insights` / `/#esg` / `/#contact` so links work from any route)
- Spec: `docs/superpowers/specs/2026-10-15-inventure-communications-website-design.md`
- Amendments A–E applied 2026-10-15: mobile nav, sitemap/robots, per-page canonicals/OG, ISR revalidate API, extended verification
- Task order: 1 → 2 → 3 → 4 → 5 → 7 → 8 → 6 (final verification last)

---

## File map

| File | Responsibility |
|------|----------------|
| `src/types/cms.ts` | Shared CMS domain types |
| `src/lib/cms/errors.ts` | Typed CMS errors |
| `src/lib/cms/client.ts` | Tagged `fetch` helper + revalidate constant |
| `src/lib/cms/providers/mock.ts` | Offline fixtures |
| `src/lib/cms/providers/directus.ts` | Directus REST stub |
| `src/lib/cms/providers/supabase.ts` | Supabase REST stub |
| `src/lib/utils.ts` | `cn()` class helper |
| `src/services/cms.ts` | Public CMS API used by pages |
| `src/components/ui/Button.tsx` | Shared CTA control |
| `src/components/layout/navigation.ts` | Shared `NAV_ITEMS` (`/#…` hrefs) |
| `src/components/layout/MobileNav.tsx` | Mobile menu client leaf |
| `src/components/layout/Header.tsx` | Site header |
| `src/components/layout/Footer.tsx` | Site footer |
| `src/components/home/HeroSection.tsx` | Full-bleed institutional hero (client leaf for motion) |
| `src/components/home/ServiceGrid.tsx` | Services grid (server + motion leaf) |
| `src/lib/site.ts` | `getSiteUrl()` helper |
| `src/app/globals.css` | Tailwind + design tokens |
| `src/app/layout.tsx` | Fonts, metadata, Header/Footer shell |
| `src/app/page.tsx` | Homepage |
| `src/app/services/[slug]/page.tsx` | Service detail SSG/ISR |
| `src/app/sitemap.ts` | `/sitemap.xml` |
| `src/app/robots.ts` | `/robots.txt` |
| `src/app/api/revalidate/route.ts` | Secret-protected tag revalidation |
| `.env.example` | Documented env vars (`REVALIDATE_SECRET` included) |
| `src/services/cms.test.ts` | Unit tests for CMS public API (mock provider) |

---

### Task 1: Scaffold Next.js App Router project

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `eslint.config.mjs`, `src/app/*` (via create-next-app)
- Preserve: `docs/superpowers/**`

**Interfaces:**
- Consumes: none
- Produces: runnable Next.js app with `src/`, TypeScript, Tailwind, `@/*` alias

- [ ] **Step 1: Scaffold in the repo root**

From `D:\Projects\inv-project` (non-empty because of `docs/` — use create-next-app; if it refuses a non-empty directory, scaffold into `_tmp` then move files up, keeping `docs/` and `.git`):

```powershell
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --turbopack --yes
```

If blocked by existing files:

```powershell
npx create-next-app@latest _scaffold --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --turbopack --yes
# Move scaffold contents into root, excluding overwriting docs/ and .git
Copy-Item -Path _scaffold\* -Destination . -Recurse -Force
Remove-Item -Recurse -Force _scaffold
```

- [ ] **Step 2: Enable TypeScript strict (verify `tsconfig.json`)**

Ensure `"strict": true` in `tsconfig.json`. If create-next-app left it true, leave as-is.

- [ ] **Step 3: Install Framer Motion**

```powershell
npm install framer-motion
```

- [ ] **Step 4: Add Vitest for CMS unit tests**

```powershell
npm install -D vitest @vitejs/plugin-react vite-tsconfig-paths
```

Create `vitest.config.ts`:

```ts
import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
```

Add to `package.json` scripts:

```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 5: Smoke the scaffold**

```powershell
npm run build
```

Expected: build succeeds (default starter page).

- [ ] **Step 6: Commit**

```powershell
git add package.json package-lock.json tsconfig.json next.config.ts postcss.config.mjs eslint.config.mjs vitest.config.ts src public
git commit -m "chore: scaffold Next.js App Router with Tailwind and Vitest"
```

---

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

### Task 3: Design tokens, utilities, Button, Header, Footer, layout SEO

**Files:**
- Create: `src/lib/utils.ts`
- Create: `src/components/ui/Button.tsx`
- Create: `src/components/layout/navigation.ts`
- Create: `src/components/layout/MobileNav.tsx`
- Create: `src/components/layout/Header.tsx`
- Create: `src/components/layout/Footer.tsx`
- Modify: `src/app/globals.css`
- Modify: `src/app/layout.tsx`
- Delete or replace: default `src/app/page.tsx` starter chrome as needed (homepage filled in Task 4)

**Interfaces:**
- Consumes: design tokens from spec
- Produces: `cn()`, `Button`, `NAV_ITEMS`, `MobileNav`, `Header`, `Footer`, global metadata + fonts (no root canonical — homepage sets its own in Task 4)

- [ ] **Step 1: Add `cn` utility**

Create `src/lib/utils.ts`:

```ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

Install helpers:

```powershell
npm install clsx tailwind-merge
```

- [ ] **Step 2: Write globals with tokens**

Replace `src/app/globals.css` with:

```css
@import "tailwindcss";

:root {
  --inv-navy: #0b1d36;
  --inv-navy-mid: #132a4a;
  --inv-slate: #5c6b7a;
  --inv-mist: #f3f5f7;
  --inv-white: #ffffff;
  --inv-accent: #3a6b8c;
  --background: var(--inv-white);
  --foreground: var(--inv-navy);
}

@theme inline {
  --color-inv-navy: var(--inv-navy);
  --color-inv-navy-mid: var(--inv-navy-mid);
  --color-inv-slate: var(--inv-slate);
  --color-inv-mist: var(--inv-mist);
  --color-inv-white: var(--inv-white);
  --color-inv-accent: var(--inv-accent);
  --font-sans: var(--font-ibm-plex-sans);
  --font-serif: var(--font-ibm-plex-serif);
}

body {
  background: var(--background);
  color: var(--foreground);
  font-family: var(--font-ibm-plex-sans), system-ui, sans-serif;
}

::selection {
  background: color-mix(in srgb, var(--inv-accent) 35%, white);
}
```

- [ ] **Step 3: Implement Button**

Create `src/components/ui/Button.tsx`:

```tsx
import Link from "next/link";
import { cn } from "@/lib/utils";

type ButtonProps = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "ghost";
  className?: string;
};

export function Button({
  href,
  children,
  variant = "primary",
  className,
}: ButtonProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center justify-center px-6 py-3 text-sm font-medium tracking-wide transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inv-accent",
        variant === "primary" &&
          "bg-inv-white text-inv-navy hover:bg-inv-mist",
        variant === "ghost" &&
          "bg-transparent text-inv-white underline-offset-4 hover:underline",
        className,
      )}
    >
      {children}
    </Link>
  );
}
```

- [ ] **Step 4a: Shared nav items** (Amendment A)

Create `src/components/layout/navigation.ts`:

```ts
export const NAV_ITEMS = [
  { href: "/#services", label: "Services" },
  { href: "/#insights", label: "Insights" },
  { href: "/#esg", label: "ESG" },
  { href: "/#contact", label: "Contact" },
] as const;
```

- [ ] **Step 4b: Mobile nav (client leaf)** (Amendment A)

Create `src/components/layout/MobileNav.tsx`:

```tsx
"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";
import { NAV_ITEMS } from "@/components/layout/navigation";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <>
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
        className="inline-flex h-10 w-10 items-center justify-center text-inv-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inv-accent md:hidden"
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 22 22"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden
        >
          {open ? (
            <path d="M4 4l14 14M18 4L4 18" />
          ) : (
            <path d="M3 6h16M3 11h16M3 16h16" />
          )}
        </svg>
      </button>

      {open ? (
        <nav
          id={panelId}
          aria-label="Mobile"
          className="absolute inset-x-0 top-full border-b border-white/10 bg-inv-navy md:hidden"
        >
          <ul className="mx-auto flex max-w-6xl flex-col px-6 py-4">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block py-3 text-base text-white/85 transition-colors hover:text-inv-white"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </>
  );
}
```

- [ ] **Step 4c: Header** (Amendment A)

Replace `src/components/layout/Header.tsx`:

```tsx
import Link from "next/link";
import { MobileNav } from "@/components/layout/MobileNav";
import { NAV_ITEMS } from "@/components/layout/navigation";

export function Header() {
  return (
    <header className="absolute inset-x-0 top-0 z-20 border-b border-white/10">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          className="font-serif text-lg tracking-tight text-inv-white"
        >
          Inventure Communications
        </Link>
        <nav aria-label="Primary" className="hidden gap-8 md:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-white/80 transition-colors hover:text-inv-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <MobileNav />
      </div>
    </header>
  );
}
```

- [ ] **Step 4d: Footer** (Amendment A)

Replace `src/components/layout/Footer.tsx`:

```tsx
import Link from "next/link";
import { NAV_ITEMS } from "@/components/layout/navigation";

export function Footer() {
  return (
    <footer
      id="contact"
      className="border-t border-inv-navy/10 bg-inv-navy text-inv-white"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-14 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm space-y-3">
          <p className="font-serif text-xl tracking-tight">
            Inventure Communications
          </p>
          <p className="text-sm text-white/70">
            Strategic Communications & Public Affairs — Middle East.
          </p>
        </div>
        <div className="space-y-2 text-sm text-white/70">
          {NAV_ITEMS.filter((item) => item.label !== "Contact").map((item) => (
            <p key={item.href}>
              <Link href={item.href} className="hover:text-inv-white">
                {item.label}
              </Link>
            </p>
          ))}
          <p className="pt-4 text-xs text-white/50">
            © {new Date().getFullYear()} Inventure Communications. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 4e: Verify nav** (Amendment A)

```powershell
npx tsc --noEmit
```

Expected: no errors. Manual check at ≤767px: menu toggles, Escape closes, link tap closes.

- [ ] **Step 5: Implement global layout with Metadata API** (Amendment C1: no root canonical)

Replace `src/app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import { IBM_Plex_Sans, IBM_Plex_Serif } from "next/font/google";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import "./globals.css";

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-ibm-plex-sans",
  display: "swap",
});

const ibmPlexSerif = IBM_Plex_Serif({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-ibm-plex-serif",
  display: "swap",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Inventure Communications",
    template: "%s | Inventure Communications",
  },
  description:
    "Inventure Communications is a Strategic Communications & Public Affairs firm advising institutions across the Middle East on reputation, media, and stakeholder engagement.",
  keywords: [
    "Strategic Communications",
    "Public Affairs",
    "Middle East",
    "Media Production",
    "Corporate Communications",
    "ESG Communications",
  ],
  authors: [{ name: "Inventure Communications" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Inventure Communications",
    title: "Inventure Communications — Strategic Communications & Public Affairs",
    description:
      "Institutional communications counsel for decision-makers across the Middle East.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Inventure Communications",
    description:
      "Strategic Communications & Public Affairs for institutional audiences in the Middle East.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${ibmPlexSans.variable} ${ibmPlexSerif.variable} min-h-screen antialiased`}
      >
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
```

Note: Task 7 later swaps the inline `siteUrl` for `getSiteUrl()`.

- [ ] **Step 6: Verify typecheck**

```powershell
npx tsc --noEmit
```

Expected: no errors (homepage may still be starter until Task 4).

- [ ] **Step 7: Commit**

```powershell
git add src/lib/utils.ts src/components src/app/globals.css src/app/layout.tsx package.json package-lock.json
git commit -m "feat: add institutional layout, tokens, mobile nav, and SEO metadata"
```

---

### Task 4: HeroSection, ServiceGrid, and homepage

**Files:**
- Create: `src/components/home/HeroSection.tsx`
- Create: `src/components/home/ServiceCardMotion.tsx` (leaf client motion)
- Create: `src/components/home/ServiceGrid.tsx`
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: `fetchServices()`, `Button`, `Service` type
- Produces: homepage composition with Hero + ServiceGrid

- [ ] **Step 1: Implement HeroSection (client leaf for motion)**

Create `src/components/home/HeroSection.tsx`:

```tsx
"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";

export function HeroSection() {
  return (
    <section className="relative flex min-h-[88vh] items-center bg-inv-navy px-6 pt-24 pb-20 text-inv-white">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(58,107,140,0.25),_transparent_55%)]"
      />
      <div className="relative mx-auto w-full max-w-6xl">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-6 font-serif text-sm tracking-[0.2em] text-white/70 uppercase"
        >
          Inventure Communications
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.05, ease: "easeOut" }}
          className="max-w-3xl font-serif text-4xl leading-tight tracking-tight text-balance sm:text-5xl md:text-6xl"
        >
          Strategic communications for decision-makers
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.12, ease: "easeOut" }}
          className="mt-6 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg"
        >
          We counsel institutions across the Middle East on reputation, media,
          and public affairs — with clarity, discipline, and regional fluency.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.18, ease: "easeOut" }}
          className="mt-10 flex flex-wrap items-center gap-6"
        >
          <Button href="/#services">Explore our services</Button>
          <Button href="/#contact" variant="ghost">
            Contact
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Implement ServiceGrid + motion leaf**

Create `src/components/home/ServiceCardMotion.tsx`:

```tsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";

type ServiceCardMotionProps = {
  href: string;
  title: string;
  summary: string;
  index: number;
};

export function ServiceCardMotion({
  href,
  title,
  summary,
  index,
}: ServiceCardMotionProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: "easeOut" }}
      className="group border border-inv-navy/10 bg-inv-white p-8 transition-colors hover:border-inv-accent/40"
    >
      <Link href={href} className="block space-y-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-inv-accent">
        <h3 className="font-serif text-2xl tracking-tight text-inv-navy">
          {title}
        </h3>
        <p className="text-sm leading-relaxed text-inv-slate">{summary}</p>
        <span className="inline-flex items-center gap-2 text-sm font-medium text-inv-accent transition-transform group-hover:translate-x-1">
          Learn more
          <span aria-hidden>→</span>
        </span>
      </Link>
    </motion.article>
  );
}
```

Create `src/components/home/ServiceGrid.tsx`:

```tsx
import { ServiceCardMotion } from "@/components/home/ServiceCardMotion";
import type { Service } from "@/types/cms";

type ServiceGridProps = {
  services: Service[];
};

export function ServiceGrid({ services }: ServiceGridProps) {
  return (
    <section
      id="services"
      className="bg-inv-mist px-6 py-20 md:py-28"
      aria-labelledby="services-heading"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 max-w-2xl">
          <p className="mb-3 text-xs font-medium tracking-[0.18em] text-inv-accent uppercase">
            Capabilities
          </p>
          <h2
            id="services-heading"
            className="font-serif text-3xl tracking-tight text-inv-navy md:text-4xl"
          >
            Core offerings
          </h2>
          <p className="mt-4 text-base text-inv-slate">
            Integrated communications disciplines for institutional clients.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {services.map((service, index) => (
            <ServiceCardMotion
              key={service.id}
              href={`/services/${service.slug}`}
              title={service.title}
              summary={service.summary}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Wire homepage** (Amendment C2: homepage canonical)

Replace `src/app/page.tsx`:

```tsx
import type { Metadata } from "next";
import { HeroSection } from "@/components/home/HeroSection";
import { ServiceGrid } from "@/components/home/ServiceGrid";
import { fetchServices } from "@/services/cms";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const services = await fetchServices();

  return (
    <>
      <HeroSection />
      <ServiceGrid services={services} />
    </>
  );
}
```

- [ ] **Step 4: Build verify**

```powershell
npm run build
```

Expected: successful build; homepage route present.

- [ ] **Step 5: Commit**

```powershell
git add src/components/home src/app/page.tsx
git commit -m "feat: add institutional hero and CMS-backed service grid"
```

---

### Task 5: Dynamic service route (SSG + metadata)

**Files:**
- Create: `src/app/services/[slug]/page.tsx`

**Interfaces:**
- Consumes: `fetchServices()`, `fetchServiceBySlug(slug)`
- Produces: statically generated `/services/[slug]` pages with per-page metadata

- [ ] **Step 1: Implement service detail page**

Create `src/app/services/[slug]/page.tsx`:

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchServiceBySlug, fetchServices } from "@/services/cms";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const services = await fetchServices();
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = await fetchServiceBySlug(slug);
  if (!service) {
    return { title: "Service not found", robots: { index: false } };
  }

  const path = `/services/${service.slug}`;

  return {
    title: service.title,
    description: service.summary,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "en_US",
      siteName: "Inventure Communications",
      url: path,
      title: `${service.title} | Inventure Communications`,
      description: service.summary,
    },
  };
}

export default async function ServicePage({ params }: PageProps) {
  const { slug } = await params;
  const service = await fetchServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  return (
    <article className="bg-inv-white">
      <div className="bg-inv-navy px-6 pt-28 pb-16 text-inv-white">
        <div className="mx-auto max-w-3xl">
          <p className="mb-4 text-xs tracking-[0.18em] text-white/60 uppercase">
            Service
          </p>
          <h1 className="font-serif text-4xl tracking-tight md:text-5xl">
            {service.title}
          </h1>
          <p className="mt-6 text-lg text-white/75">{service.summary}</p>
        </div>
      </div>
      <div className="mx-auto max-w-3xl px-6 py-16">
        <p className="text-base leading-relaxed text-inv-slate">
          {service.description}
        </p>
        <Link
          href="/#services"
          className="mt-10 inline-flex text-sm font-medium text-inv-accent hover:underline"
        >
          ← All services
        </Link>
      </div>
    </article>
  );
}
```

- [ ] **Step 2: Build and confirm static params**

```powershell
npm run build
```

Expected: build lists `/services/media-production`, `/services/digital-media`, `/services/events`, `/services/public-affairs` (or equivalent static generation messages).

- [ ] **Step 3: Commit**

```powershell
git add src/app/services
git commit -m "feat: add SSG service detail routes with CMS metadata"
```

Note: `export const revalidate = 3600` and `dynamicParams = true` are added in Task 8 (keep Task 5 focused on SSG + metadata).

---

### Task 7: Site URL helper, sitemap, robots (Amendment B)

**Files:**
- Create: `src/lib/site.ts`
- Create: `src/lib/site.test.ts`
- Create: `src/app/sitemap.ts`
- Create: `src/app/robots.ts`
- Modify: `src/app/layout.tsx` (use the helper)

**Interfaces:**
- Consumes: `fetchServices()`
- Produces: `getSiteUrl()`, `/sitemap.xml`, `/robots.txt`

- [ ] **Step 1: Write failing test**

Create `src/lib/site.test.ts`:

```ts
import { afterEach, describe, expect, it } from "vitest";
import { getSiteUrl } from "@/lib/site";

describe("getSiteUrl", () => {
  const original = process.env.NEXT_PUBLIC_SITE_URL;

  afterEach(() => {
    if (original === undefined) delete process.env.NEXT_PUBLIC_SITE_URL;
    else process.env.NEXT_PUBLIC_SITE_URL = original;
  });

  it("defaults to localhost", () => {
    delete process.env.NEXT_PUBLIC_SITE_URL;
    expect(getSiteUrl()).toBe("http://localhost:3000");
  });

  it("strips trailing slashes", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://example.com//";
    expect(getSiteUrl()).toBe("https://example.com");
  });
});
```

- [ ] **Step 2: Run — expect FAIL**

```powershell
npm test
```

Expected: FAIL (`@/lib/site` not found).

- [ ] **Step 3: Implement helper**

Create `src/lib/site.ts`:

```ts
export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return raw.replace(/\/+$/, "");
}
```

In `src/app/layout.tsx`, replace the inline `siteUrl` constant:

```tsx
import { getSiteUrl } from "@/lib/site";

const siteUrl = getSiteUrl();
```

- [ ] **Step 4: Sitemap**

Create `src/app/sitemap.ts`:

```ts
import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";
import { fetchServices } from "@/services/cms";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const services = await fetchServices();

  return [
    {
      url: base,
      changeFrequency: "monthly" as const,
      priority: 1,
    },
    ...services.map((service) => ({
      url: `${base}/services/${service.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
```

`revalidate` must stay a literal number here; Next analyzes it statically.

- [ ] **Step 5: Robots**

Create `src/app/robots.ts`:

```ts
import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  const base = getSiteUrl();
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: "/api/" }],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
```

- [ ] **Step 6: Run tests and build**

```powershell
npm test
npm run build
```

Expected: tests PASS; build output lists `/sitemap.xml` and `/robots.txt`.

- [ ] **Step 7: Commit**

```powershell
git add src/lib/site.ts src/lib/site.test.ts src/app/sitemap.ts src/app/robots.ts src/app/layout.tsx
git commit -m "feat: add sitemap, robots, and site URL helper"
```

---

### Task 8: ISR segment config and tag revalidation endpoint (Amendment D)

**Files:**
- Modify: `src/app/page.tsx`, `src/app/services/[slug]/page.tsx`
- Create: `src/app/api/revalidate/route.ts`
- Create: `src/app/api/revalidate/route.test.ts`
- Modify: `.env.example`, `.env.local`

**Interfaces:**
- Consumes: `REVALIDATE_SECRET` env var
- Produces: `POST /api/revalidate` accepting `{ "tags": string[] }` with header `x-revalidate-secret`

- [ ] **Step 1: Page-level ISR window**

Add to `src/app/page.tsx` and `src/app/services/[slug]/page.tsx`:

```ts
export const revalidate = 3600;
```

For the service route, also add:

```ts
export const dynamicParams = true;
```

- [ ] **Step 2: Env vars**

Append to `.env.example` and `.env.local`:

```env
REVALIDATE_SECRET=
```

Generate a value for real environments:

```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

- [ ] **Step 3: Write failing handler test**

Create `src/app/api/revalidate/route.test.ts`:

```ts
import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const revalidateTag = vi.fn();
vi.mock("next/cache", () => ({ revalidateTag }));

import { POST } from "@/app/api/revalidate/route";

function request(body: unknown, secret?: string) {
  return new NextRequest("http://localhost/api/revalidate", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...(secret ? { "x-revalidate-secret": secret } : {}),
    },
    body: JSON.stringify(body),
  });
}

describe("POST /api/revalidate", () => {
  beforeEach(() => {
    revalidateTag.mockReset();
    process.env.REVALIDATE_SECRET = "test-secret";
  });

  it("503s when no secret is configured", async () => {
    delete process.env.REVALIDATE_SECRET;
    const res = await POST(request({ tags: ["services"] }, "x"));
    expect(res.status).toBe(503);
  });

  it("401s on a wrong secret", async () => {
    const res = await POST(request({ tags: ["services"] }, "nope"));
    expect(res.status).toBe(401);
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it("400s on unknown tags", async () => {
    const res = await POST(request({ tags: ["secrets"] }, "test-secret"));
    expect(res.status).toBe(400);
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it("revalidates allowed tags", async () => {
    const res = await POST(
      request({ tags: ["services", "service:events"] }, "test-secret"),
    );
    expect(res.status).toBe(200);
    expect(revalidateTag).toHaveBeenCalledTimes(2);
  });
});
```

- [ ] **Step 4: Run — expect FAIL**

```powershell
npm test
```

Expected: FAIL (route module not found).

- [ ] **Step 5: Implement the route**

Create `src/app/api/revalidate/route.ts`:

```ts
import { timingSafeEqual } from "node:crypto";
import { revalidateTag } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";

const STATIC_TAGS = new Set(["services", "insights", "esg", "case-studies"]);
const SERVICE_TAG = /^service:[a-z0-9-]+$/;

function isAllowedTag(tag: unknown): tag is string {
  return (
    typeof tag === "string" && (STATIC_TAGS.has(tag) || SERVICE_TAG.test(tag))
  );
}

function secretMatches(provided: string, expected: string): boolean {
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function POST(request: NextRequest) {
  const expected = process.env.REVALIDATE_SECRET;
  if (!expected) {
    return NextResponse.json(
      { error: "Revalidation is not configured" },
      { status: 503 },
    );
  }

  const provided = request.headers.get("x-revalidate-secret") ?? "";
  if (!secretMatches(provided, expected)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const tags = (body as { tags?: unknown })?.tags;
  if (!Array.isArray(tags) || tags.length === 0 || !tags.every(isAllowedTag)) {
    return NextResponse.json(
      { error: "Provide a non-empty `tags` array of known tags" },
      { status: 400 },
    );
  }

  for (const tag of tags) {
    revalidateTag(tag, "max");
  }

  return NextResponse.json({ revalidated: tags });
}
```

**Next version note:** `revalidateTag(tag, "max")` is the Next 16 signature. If Task 1 installed Next 15, call `revalidateTag(tag)` with one argument. Check `package.json` and adjust.

- [ ] **Step 6: Run tests — expect PASS**

```powershell
npm test
```

- [ ] **Step 7: Manual smoke**

```powershell
npm run build
npm run start
# in a second terminal (set REVALIDATE_SECRET in .env.local first):
curl.exe -X POST http://localhost:3000/api/revalidate `
  -H "content-type: application/json" `
  -H "x-revalidate-secret: <your secret>" `
  -d "{\"tags\":[\"services\"]}"
```

Expected: `{"revalidated":["services"]}`.

- [ ] **Step 8: Commit**

```powershell
git add src/app/page.tsx "src/app/services/[slug]/page.tsx" src/app/api .env.example
git commit -m "feat: add ISR window and secret-protected tag revalidation"
```

---

### Task 6: Final verification (Amendment E)

**Files:**
- Modify: `README.md` (brief run instructions only)
- Optionally modify: `package.json` (`"typecheck": "tsc --noEmit"`)

**Interfaces:**
- Consumes: full app
- Produces: verified build + documented bootstrap commands

- [ ] **Step 1: Run unit tests**

```powershell
npm test
```

Expected: PASS.

- [ ] **Step 2: Typecheck and lint** (Amendment E)

```powershell
npx tsc --noEmit
npm run lint
```

Expected: both clean. Optionally add `"typecheck": "tsc --noEmit"` to `package.json` scripts.

- [ ] **Step 3: Production build**

```powershell
npm run build
```

Expected: PASS with homepage + service routes + sitemap/robots.

- [ ] **Step 4: Crawl surface check** (Amendment E)

```powershell
npm run start
curl.exe http://localhost:3000/sitemap.xml
curl.exe http://localhost:3000/robots.txt
```

Expected: sitemap lists `/` plus four `/services/*` URLs; robots allows `/`, disallows `/api/`, references sitemap.

- [ ] **Step 5: Canonical and nav spot-check** (Amendment E)

View source of `/services/events` and confirm a self-referencing canonical. Open at mobile width and confirm the menu works from a service page; Contact scrolls to the footer.

- [ ] **Step 6: Write concise README**

Replace or create `README.md`:

```md
# Inventure Communications

Institutional corporate website (Next.js App Router) with a CMS-agnostic content layer.

## Stack

Next.js, TypeScript, Tailwind CSS, Framer Motion, native fetch ISR/SSG.

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

## CMS

Set `CMS_PROVIDER` to `mock` (default), `directus`, or `supabase`. Configure `CMS_URL` and `CMS_TOKEN` for remote providers.

Set `REVALIDATE_SECRET` for `POST /api/revalidate` (header `x-revalidate-secret`, body `{ "tags": ["services"] }`).

## Scripts

- `npm run dev` — local development
- `npm run build` — production build
- `npm test` — unit tests
- `npm run typecheck` — TypeScript check (if script added)
```

- [ ] **Step 7: Commit**

```powershell
git add README.md package.json
git commit -m "docs: add bootstrap README and verify build"
```

---

## Plan self-review

1. **Spec coverage:** Scaffold, CMS abstraction + mock/directus/supabase stubs, tokens/fonts, layout SEO, Header/Footer/mobile nav, Hero, ServiceGrid, `services/[slug]` SSG/metadata, sitemap/robots, ISR revalidate API, env example, build verification — all mapped. Insights/ESG pages correctly omitted.
2. **Amendments A–E:** Integrated into Tasks 3–6 and new Tasks 7–8. Execution order: 1→2→3→4→5→7→8→6.
3. **Placeholders:** None remaining; `fetchServices` switch pattern made explicit; `revalidateTag` arity noted for Next 15 vs 16.
4. **Type consistency:** `Service` fields consistent across mock, CMS API, ServiceGrid, and detail page.
