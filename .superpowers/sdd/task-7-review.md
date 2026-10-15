# Task 7 Review: Site URL helper, sitemap, robots (Amendment B)

**Reviewer:** Code review (task-scoped gate)  
**Range:** `11af923` → `54a71f1`  
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
| `getSiteUrl()` — default localhost + trailing-slash strip | ✅ | `src/lib/site.ts` L1–4 matches brief |
| Vitest coverage for helper | ✅ | `src/lib/site.test.ts` — 2 cases per brief |
| `layout.tsx` uses helper for site URL | ✅ | `src/app/layout.tsx` L5, L22 — `metadataBase`, OG `url` |
| `/sitemap.xml` — home + `/services/{slug}` from `fetchServices()` | ✅ | `src/app/sitemap.ts` L81–96 pattern in diff |
| `/robots.txt` — allow `/`, disallow `/api/`, sitemap + host | ✅ | `src/app/robots.ts` L63–69 pattern in diff |
| `export const revalidate = 3600` on sitemap | ✅ (waived) | Omitted in implementation; **approved controller contingency** — incompatible with `cacheComponents: true` in `next.config.ts` (see Task 5 ledger note). Document follow-up in Task 8 / shared revalidate strategy. |

**Brief steps**

| Step | Status |
|------|--------|
| 1–3 — TDD helper + `layout.tsx` wire-up | ✅ Files and behavior match brief |
| 4 — Sitemap | ✅ Logic matches brief; `revalidate` omitted per contingency above |
| 5 — Robots | ✅ Matches brief source block |
| 6 — Tests + build | ✅ Report + independent run: `npm test` exit 0 (6 tests); build lists `/sitemap.xml`, `/robots.txt` as static ○ |
| 7 — Commit message / scope | ✅ `54a71f1`; five files per diff package |

**Produces / consumes**

- Consumes: `fetchServices()` from `@/services/cms` — correct.
- Produces: `getSiteUrl()`, metadata routes `/sitemap.xml` and `/robots.txt` — correct.

**Missing**

- None material for Task 7 scope after applying the approved `revalidate` contingency.

**Extra (in review range, not in brief)**

- Trailing-slash normalization now applies to `metadataBase` and OG `url` (previously only raw env default). Behavior improvement, not scope creep.

**Misunderstood**

- None. Implementation aligns with the brief except the documented, approved `revalidate` omission.

---

## Code quality

**Approved** for Task 7 scope.

Helper is minimal, testable, and reused consistently across layout, sitemap, and robots. Sitemap and robots follow Next.js `MetadataRoute` conventions; sitemap stays async only where CMS data is needed; robots remains synchronous. Import paths and CMS facade usage match existing app patterns.

Independent checks (2026-10-15):

- `npm test` → exit 0; 2 files, 6 tests (includes 2 new `getSiteUrl` tests)
- `npm run build` → exit 0; Cache Components enabled; `/sitemap.xml` and `/robots.txt` static ○; service slugs still pre-rendered under `/services/[slug]`

---

## Findings

### Critical

- None identified from diff, source read, and verification.

### Important

1. **Sitemap ISR deferred** — Brief Step 4 specified `revalidate = 3600`; build fails if retained with `cacheComponents: true`. Current sitemap is build-time static content driven by `fetchServices()` at generation. Track a Cache Components–compatible refresh pattern in Task 8 (report concern is accurate).
2. **CMS-driven sitemap vs deploy cadence** — New service slugs in live CMS will not appear in `/sitemap.xml` until the next production build (or until Task 8 introduces runtime revalidation). Expected given static ○ output; operators should know sitemap freshness is build-coupled for now.

### Minor

1. **No automated tests for sitemap/robots payloads** — Brief required helper tests only; optional future snapshot or route tests if SEO regressions become a concern.
2. **Sitemap surface area** — Entries are home + service detail URLs only (per brief). Homepage sections (`/#services`, future insight routes) are intentionally omitted until product/SEO tasks expand scope.
3. **`robots.host`** — Included per brief; some crawlers ignore `Host:` in robots.txt. Harmless and spec-correct.
4. **Duplicate `fetchServices()` at build** — Sitemap generation calls CMS independently of `generateStaticParams` on service pages; normal for this architecture; optional `React.cache()` dedupe only if profiling warrants.

---

## ⚠️ Cannot verify from diff alone

- Live HTTP responses for `/sitemap.xml` and `/robots.txt` (XML/text shape, absolute URLs with production `NEXT_PUBLIC_SITE_URL`).
- Sitemap contents when `CMS_PROVIDER` is Directus/Supabase with real credentials (mock path used in local build).
- Search-console acceptance of `host` and sitemap URL after deploy.

---

## Summary

Commit `54a71f1` delivers Task 7: shared `getSiteUrl()` with tests, layout wired for `metadataBase`/OG, CMS-backed sitemap (home + services), and robots with API disallow plus sitemap/host references. **`revalidate = 3600` is omitted per approved controller contingency** (`cacheComponents`); hourly sitemap refresh remains a Task 8 follow-up. **Spec ✅**, **quality Approved**; Important items are deferred ISR/sitemap freshness, not Task 7 blockers.
