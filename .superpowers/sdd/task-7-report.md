# Task 7 Report: Site URL helper, sitemap, robots (Amendment B)

## Status
**DONE_WITH_CONCERNS**

## Deliverables
| File | Action |
|------|--------|
| `src/lib/site.ts` | Created — `getSiteUrl()` with env default + trailing-slash strip |
| `src/lib/site.test.ts` | Created — TDD tests (2 cases) |
| `src/app/sitemap.ts` | Created — home + `/services/*` from `fetchServices()` |
| `src/app/robots.ts` | Created — allow `/`, disallow `/api/`, sitemap + host |
| `src/app/layout.tsx` | Modified — uses `getSiteUrl()` for `metadataBase` / OG |

## Requirements checklist
| Requirement | Status |
|-------------|--------|
| `getSiteUrl()` helper + vitest coverage | ✓ |
| `layout.tsx` wired to helper | ✓ |
| `/sitemap.xml` route | ✓ |
| `/robots.txt` route | ✓ |
| `export const revalidate = 3600` on sitemap | ✗ (see concerns) |

## Test summary (`npm test`)
- Exit code: 0
- 2 files, 6 tests passed (includes 2 new `getSiteUrl` tests)

## Build summary (`npm run build`)
- Exit code: 0
- Route table includes `/sitemap.xml` and `/robots.txt` (static ○)
- Service slugs still pre-rendered via mock CMS

## Commit
```
feat: add sitemap, robots, and site URL helper
```

## Concerns
- **`revalidate = 3600` incompatible with `cacheComponents: true`:** Next.js 16 build fails with `Route segment config "revalidate" is not compatible with nextConfig.cacheComponents`. Removed `export const revalidate` from `sitemap.ts` so the build passes without changing `next.config.ts`. Sitemap still generates at build time via `fetchServices()`; hourly ISR for sitemap may need a Cache Components–compatible pattern in a follow-up (e.g. Task 8 / shared revalidate strategy).
