# Task 8 Report: ISR segment config and tag revalidation (Amendment D)

## Status
**DONE**

## Deliverables
| File | Action |
|------|--------|
| `next.config.ts` | Modified — removed `cacheComponents` / `partialPrefetching` so segment `revalidate` works |
| `src/app/page.tsx` | Modified — `export const revalidate = 3600` |
| `src/app/services/[slug]/page.tsx` | Modified — `revalidate = 3600`, `dynamicParams = true` |
| `src/app/sitemap.ts` | Modified — restored `export const revalidate = 3600` |
| `src/app/api/revalidate/route.ts` | Created — secret-protected tag revalidation (`revalidateTag(tag, "max")`) |
| `src/app/api/revalidate/route.test.ts` | Created — 4 handler tests (Vitest `vi.hoisted` mock) |
| `.env.example` | Modified — `REVALIDATE_SECRET=` documented |
| `.env.local` | Modified locally — generated secret for smoke (not committed) |

## Requirements checklist
| Requirement | Status |
|-------------|--------|
| Page-level ISR (`revalidate = 3600`) on home + services | ✓ |
| `dynamicParams = true` on service route | ✓ |
| Disable Cache Components for ISR compatibility | ✓ |
| `POST /api/revalidate` with allowlist + timing-safe secret | ✓ |
| `REVALIDATE_SECRET` in `.env.example` | ✓ |
| TDD route tests | ✓ |

## Test summary (`npm test`)
- Exit code: 0
- 3 files, 10 tests passed (4 new revalidate route tests)

## Build summary (`npm run build`)
- Exit code: 0
- Home, service slugs, and sitemap show **Revalidate 1h** in route table
- `/api/revalidate` listed as dynamic (ƒ)

## Manual smoke (`npm run start` + curl)
- `POST /api/revalidate` with header `x-revalidate-secret` and body `{"tags":["services"]}` → `{"revalidated":["services"]}`

## Commit
```
feat: add ISR window and secret-protected tag revalidation
```
(5f13fbc)

## Concerns
- **Cache Components disabled:** Needed for segment `revalidate`; re-enable later only if the team adopts a Cache Components–compatible caching strategy.
- **Test mock:** Brief’s `vi.mock` pattern required `vi.hoisted()` for Vitest 5 hoisting; behavior unchanged.
- **PowerShell curl:** JSON body needs careful quoting; use a file or `-d '{"tags":["services"]}'` style escaping.
