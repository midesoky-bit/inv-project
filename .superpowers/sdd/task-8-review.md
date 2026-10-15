# Task 8 Review: ISR segment config and tag revalidation (Amendment D)

**Reviewer:** Code review (task-scoped gate)  
**Range:** `54a71f1` → `5f13fbc`  
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
| `export const revalidate = 3600` on home | ✅ | `src/app/page.tsx` |
| `export const revalidate = 3600` + `dynamicParams = true` on service route | ✅ | `src/app/services/[slug]/page.tsx` |
| `REVALIDATE_SECRET` documented in `.env.example` | ✅ | `.env.example` append |
| `POST /api/revalidate` — JSON `{ tags: string[] }`, header `x-revalidate-secret` | ✅ | `src/app/api/revalidate/route.ts` |
| Secret gate: 503 unconfigured, 401 bad secret, 400 bad tags, 200 allowed tags | ✅ | Route logic + four Vitest cases |
| Route tests per brief (503 / 401 / 400 / 200) | ✅ | `src/app/api/revalidate/route.test.ts` |
| Page-level ISR enabled (Cache Components off) | ✅ | `next.config.ts` — `cacheComponents` / `partialPrefetching` removed |

**Brief steps**

| Step | Status |
|------|--------|
| 1 — Page ISR + `dynamicParams` | ✅ |
| 2 — Env vars (`.env.example`; local secret not committed) | ✅ |
| 3–6 — TDD route + implementation | ✅ (`vi.hoisted` mock is equivalent to brief’s pattern) |
| 7 — Manual smoke | ✅ Reported; not re-run in this review |
| 8 — Commit message / scope | ✅ `5f13fbc`; message matches brief |

**Produces / consumes**

- Consumes: `REVALIDATE_SECRET` — correct.
- Produces: on-demand tag revalidation aligned with CMS fetch tags (`services`, `insights`, `esg`, `case-studies`, `service:{slug}`) in `src/lib/cms/providers/*` and `cmsFetch` — correct.

**Missing**

- None material for Task 8 brief after applying controller-authorized `next.config` change.

**Extra (in commit, not in brief file list)**

- `next.config.ts` — **required** so segment `revalidate` applies (Task 7 contingency).
- `src/app/sitemap.ts` — restores `revalidate = 3600` now that Cache Components are disabled; closes Task 7 deferred ISR item.

**Misunderstood**

- None.

---

## Code quality

**Approved** for Task 8 scope.

The revalidate handler is small, uses `timingSafeEqual` with length check (avoids throwing on length mismatch), validates tags against a static set plus `service:[a-z0-9-]+` (matches mock slugs), and uses `revalidateTag(tag, "max")` appropriate for **Next 16.4.1** (`package.json`). Tests cover the brief’s four behaviors; hoisted mock is the correct Vitest 5 pattern.

Independent checks (2026-10-15):

- `npm test` → exit 0; 3 files, 10 tests (includes 4 revalidate route tests)
- `npm run build` → exit 0; `/` and `/services/*` show **Revalidate 1h**; `/sitemap.xml` **1h**; `/api/revalidate` dynamic **ƒ**

---

## Findings

### Critical

- None identified from diff, source read, and verification.

### Important

1. **Cache Components disabled project-wide** — Necessary for segment `revalidate` in this stack. Re-enabling later requires a deliberate caching strategy (page ISR + fetch `next.revalidate` + tag endpoint must stay coherent). Report concern is accurate; not a Task 8 blocker.
2. **Dual refresh model** — Pages/sitemap use hourly segment ISR; CMS data also uses `next.revalidate: 3600` and tags in `cmsFetch`. Operators should call `POST /api/revalidate` after CMS publishes to avoid waiting up to one hour. Document in runbooks when wiring webhooks.

### Minor

1. **Tests do not assert `revalidateTag` arguments** — Success case only checks call count, not `(tag, "max")` or tag strings; low risk given thin loop.
2. **Untested route branches** — Missing header, invalid JSON, and empty `tags` return 401/400 in implementation but have no dedicated tests (brief did not require them).
3. **Commit file list vs brief Step 8** — Commit includes `next.config.ts` and `sitemap.ts`; justified extras, not scope creep.
4. **`robots.txt` remains static** — No `revalidate` on `robots.ts`; unchanged and acceptable for Task 8.
5. **Tag allowlist maintenance** — New CMS cache tags must be added to `STATIC_TAGS` (or `service:` pattern) or on-demand revalidation will 400; matches current provider usage.

---

## ⚠️ Cannot verify from diff alone

- Live `curl` smoke against `npm run start` with production-like `REVALIDATE_SECRET`.
- End-to-end proof that a tag revalidation invalidates rendered HTML (requires CMS change + fetch after POST).
- Behavior when `REVALIDATE_SECRET` is set but empty string in deployment env (route treats as unconfigured → 503).

---

## Summary

Commit `5f13fbc` delivers Task 8: hourly ISR on home and service pages, `dynamicParams` on the dynamic segment, secret-protected `POST /api/revalidate` with tag allowlist and timing-safe comparison, env documentation, and tests. Controller-authorized removal of Cache Components plus sitemap `revalidate` closes the Task 7 ISR gap. **Spec ✅**, **quality Approved**; Important items are operational (Cache Components tradeoff, when to call the revalidate API), not merge blockers.
