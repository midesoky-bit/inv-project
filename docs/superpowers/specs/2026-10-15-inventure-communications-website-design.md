# Inventure Communications — Corporate Website Bootstrap Design

**Date:** 2026-10-15  
**Status:** Approved (pending final user review of this document)  
**Product:** Inventure Communications — Strategic Communications & Public Affairs (Middle East)

## Goal

Bootstrap a high-end, institutional Next.js corporate site that is performant, SEO-optimized, and ready to connect to a headless CMS (Directus or Supabase) via a CMS-agnostic service layer. First deliverable is a runnable shell: global layout/SEO, homepage (Hero + ServiceGrid), Header/Footer, and dynamic service pages with mock CMS data.

## Decisions locked

| Decision | Choice |
|----------|--------|
| CMS strategy | CMS-agnostic adapter + mock fallback (`CMS_PROVIDER`) |
| Hero composition | Full-bleed dark institutional (navy) |
| Bootstrap scope | Minimal + Header/Footer shell (not Insights/ESG pages yet) |
| Architecture | Adapter + mock (Approach 1) |

## Tech stack

- Next.js (App Router), TypeScript strict mode
- Tailwind CSS
- Framer Motion (leaf client components only — premium micro-interactions)
- Native `fetch` with tags + `revalidate` (ISR / SSG)
- Headless CMS via abstract `src/services/cms.ts` (providers: `mock` | `directus` | `supabase`)

## Folder structure

```
src/
  app/
    layout.tsx
    page.tsx
    globals.css
    services/
      [slug]/page.tsx
  components/
    layout/
      Header.tsx
      Footer.tsx
    home/
      HeroSection.tsx
      ServiceGrid.tsx
    ui/
      Button.tsx
  lib/
    cms/
      client.ts
      providers/
        mock.ts
        directus.ts   # stub
        supabase.ts   # stub
    utils.ts
  services/
    cms.ts
  types/
    cms.ts
```

Path alias: `@/*` → `src/*`.

## Data layer

### Public API (`src/services/cms.ts`)

- `fetchServices(): Promise<Service[]>`
- `fetchServiceBySlug(slug: string): Promise<Service | null>`
- Future-ready stubs (typed, may return empty/mock): `fetchInsights`, `fetchEsgCommitments`, `fetchCaseStudies`

### Provider switch

`CMS_PROVIDER` env selects implementation. Default for local/bootstrap: `mock`.

- **mock:** typed fixtures (Media Production, Digital Media, Events, Public Affairs, and related offerings)
- **directus / supabase:** thin stubs that call REST with the shared client; not required to be fully wired for bootstrap

### Caching

- Tagged fetches: `services`, `service:{slug}`
- ISR revalidate window: `3600` seconds (configurable constant)
- Parallel independent fetches via `Promise.all` when multiple resources are needed
- No client-side initial content fetching for public pages

### Types (`src/types/cms.ts`)

Minimum `Service` shape:

- `id`, `slug`, `title`, `summary`, `description`, `order`, optional `icon` key

## Visual system

### Palette (CSS variables)

| Token | Value | Use |
|-------|--------|-----|
| `--inv-navy` | `#0B1D36` | Hero, dark header |
| `--inv-navy-mid` | `#132A4A` | Depth / hover |
| `--inv-slate` | `#5C6B7A` | Secondary text |
| `--inv-mist` | `#F3F5F7` | Light sections |
| `--inv-white` | `#FFFFFF` | Primary light surfaces |
| Accent | `#3A6B8C` | Focus / thin accent line (not purple) |

### Typography

- Display / headlines: **IBM Plex Serif**
- UI / body: **IBM Plex Sans**

### UI rules

- Hero: brand, one headline, one supporting sentence, one CTA group only — no cards, stats, badges, or overlays
- ServiceGrid: quiet interactive tiles/rows linking to `/services/[slug]`
- Header: Services, Insights, ESG, Contact (Insights/ESG may link to `#` or placeholder until later)
- Footer: firm name, Middle East region line, legal placeholders
- Motion: subtle fade/rise only; `"use client"` pushed to leaf interactive components

## Routes & SEO

### Global (`layout.tsx`)

- Metadata API: title template `%s | Inventure Communications`
- Default description targeting Strategic Communications & Public Affairs in the Middle East
- Open Graph + Twitter cards
- `metadataBase` from `NEXT_PUBLIC_SITE_URL`
- Robots indexable; locale `en`

### Homepage (`page.tsx`)

- Server Component
- Renders Header (via layout), HeroSection, ServiceGrid (CMS-backed), Footer (via layout)
- ISR via CMS fetch revalidation

### Service detail (`services/[slug]/page.tsx`)

- `generateStaticParams()` from `fetchServices()`
- `generateMetadata()` from `fetchServiceBySlug(slug)`
- `notFound()` when slug missing
- Same ISR tags as list/detail fetches

## Environment

```
CMS_PROVIDER=mock
CMS_URL=
CMS_TOKEN=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Out of scope (this bootstrap)

- Full Insights and ESG page implementations
- CMS admin / auth
- i18n / RTL (structure should not block later addition)
- Production Directus/Supabase credential wiring beyond stubs
- Analytics, forms backend, cookie consent

## Error handling

- Providers throw typed errors for network/config failures
- Pages call `notFound()` for missing entities
- Mock provider succeeds offline so `next build` / `next dev` work without credentials

## Success criteria

1. `create-next-app` + Tailwind + TypeScript scaffold under `src/`
2. Homepage renders institutional hero + service grid from mock CMS
3. `/services/[slug]` statically generated for mock services
4. Global SEO metadata present and industry-targeted
5. Switching `CMS_PROVIDER` later does not require UI rewrites

## Implementation order (for planning)

1. Initialize Next.js (App Router, TS, Tailwind, `src/`)
2. Types, CMS client, mock provider, `services/cms.ts`
3. `globals.css` tokens + fonts; `layout.tsx` metadata + Header/Footer
4. HeroSection + ServiceGrid + homepage
5. `services/[slug]` with `generateStaticParams` / `generateMetadata`
6. Directus/Supabase stub providers + `.env.example`
7. Verify `next build` and basic route smoke check
