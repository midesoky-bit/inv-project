# Task 5 Review: Dynamic service route (SSG + metadata)

**Reviewer:** Code review (task-scoped gate)  
**Range:** `5f1c71c` → `11af923`  
**Date:** 2026-10-15

## Verdict

| Gate | Result |
|------|--------|
| **Spec compliance** | ✅ |
| **Code quality** | Approved |

---

## Spec compliance

**Must-verify checkpoints**

| Checkpoint | Status | Evidence |
|------------|--------|----------|
| `generateStaticParams` via `fetchServices()` | ✅ | `src/app/services/[slug]/page.tsx` L10–13 — maps `service.slug` |
| Per-slug canonical | ✅ | L24, L29 — `alternates.canonical: `/services/${service.slug}`` (resolved with root `metadataBase`) |
| Full Open Graph | ✅ | L30–37 — `type`, `locale`, `siteName`, `url`, `title`, `description` |
| Missing slug: `robots: { index: false }` in metadata | ✅ | L20–21 |
| Missing slug: `notFound()` in page | ✅ | L45–47 |
| No `export const revalidate` (deferred Task 8) | ✅ | File has no `revalidate` or `dynamicParams` exports |

**Brief steps**

| Step | Status |
|------|--------|
| 1 — Implement `[slug]/page.tsx` | ✅ Matches brief source block (imports, types, metadata, UI) |
| 2 — Build confirms static params | ✅ Independent `npm run build` exit 0; four slugs under `/services/[slug]` |
| 3 — Commit message / scope | ✅ Single file `src/app/services/[slug]/page.tsx`; commit `11af923` per diff package |

**Produces / consumes**

- Consumes: `fetchServices()`, `fetchServiceBySlug(slug)` from `@/services/cms` — correct.
- Produces: statically generated service detail pages with per-slug metadata; integrates with Task 4 card links (`/services/${slug}`) and back link `/#services`.

**Missing**

- None material for Task 5 scope.

**Extra (in review range, not in brief)**

- None. Diff is a single new page file only.

**Misunderstood**

- None. Implementation matches the brief verbatim.

---

## Code quality

**Approved** for Task 5 scope.

The page follows established app patterns: async server component, `params: Promise<{ slug }>` (Next 16), CMS facade imports, and relative canonical/OG paths consistent with homepage canonical on `/` in `page.tsx`. Layout supplies `metadataBase`, title template, and default OG/Twitter; service pages override title, description, canonical, and OG per slug without duplicating root-only concerns.

Independent checks (2026-10-15):

- `npx tsc --noEmit` → exit 0  
- `npm run build` → exit 0; `/services/media-production`, `/services/digital-media`, plus `[+2 more paths]` (events, public-affairs)

---

## Findings

### Critical

- None identified from diff, source read, and verification.

### Important

1. **Partial Prerender on `[slug]` segment** — Build shows `◐` on `/services/[slug]` and some child paths (Next.js 16 Cache Components). All four mock slugs are still pre-rendered at build time; not a spec gap, but worth tracking if future tasks expect pure `○` static markers.
2. **Unknown slugs at runtime** — `dynamicParams` is not set (Task 8). Default App Router behavior may still allow on-demand handling for slugs not in `generateStaticParams`; invalid slugs get `robots: { index: false }` in metadata and `notFound()` in the page when CMS returns null. Acceptable until Task 8 documents ISR/`dynamicParams`.

### Minor

1. **Duplicate CMS fetch** — `fetchServiceBySlug` runs in both `generateMetadata` and the page component. Normal Next.js pattern; optional dedupe via React `cache()` later if profiling shows cost.
2. **No page-level Twitter overrides** — Brief requires full OG only; service pages inherit root `twitter` from `layout.tsx`. Optional parity with OG title/description later.
3. **No service-specific OG image** — Brief-silent; root layout has no `images` on OG either.
4. **Plain-text body** — `service.description` rendered in a single `<p>`; fine for mock CMS strings; rich HTML from CMS would need sanitization in a future task.

---

## ⚠️ Cannot verify from diff alone

- In-browser metadata tags (canonical link, OG tags) for a live slug vs missing slug.
- CMS provider switching (Directus/Supabase) with real credentials.
- Visual/layout QA at breakpoints (navy hero, typography tokens).

---

## Summary

Commit `11af923` delivers Task 5 as specified: SSG params from `fetchServices()`, per-slug canonical and full Open Graph, noindex metadata for missing services, `notFound()` on the page, and no `revalidate` export. Build and typecheck pass. **Spec ✅**, **quality Approved**; Important items are Next 16 prerender semantics and deferred Task 8 ISR behavior, not Task 5 blockers.
