# Task 2 Report: CMS types, client, mock provider, and public service API

**Date:** 2026-10-15  
**Branch:** `feat/inventure-website-bootstrap`  
**Commit:** `b6b45a6` — feat: add CMS-agnostic service layer with mock provider

## Summary

CMS-agnostic service layer implemented per brief: shared types, `CmsError`, `cmsFetch` with Next.js cache tags/revalidate, mock provider with four ordered services, Directus/Supabase remote stubs, and public `fetch*` API routed by `CMS_PROVIDER`. TDD followed (tests first → fail → implement → pass). `.env.example` and gitignored `.env.local` use mock defaults.

## Steps executed

### Step 1–2: Failing tests

Created `src/services/cms.test.ts` with four cases (ordered services, slug lookup, unknown slug, empty future content).  
`npm test` → **FAIL** — `Cannot find package '@/services/cms'`.

### Step 3–6: Implementation

| File | Purpose |
|------|---------|
| `src/types/cms.ts` | `Service`, `Insight`, `EsgCommitment`, `CaseStudy`, `CmsProviderName` |
| `src/lib/cms/errors.ts` | `CmsError` with CONFIG/NETWORK/NOT_FOUND/PARSE |
| `src/lib/cms/client.ts` | `REVALIDATE_SECONDS`, `getCmsProvider()`, `cmsFetch()` |
| `src/lib/cms/providers/mock.ts` | Four services incl. `public-affairs`; empty arrays for future content |
| `src/lib/cms/providers/directus.ts` | Directus REST list/item patterns + NOT_FOUND → null for slug |
| `src/lib/cms/providers/supabase.ts` | PostgREST-style paths with `apikey` header |
| `src/services/cms.ts` | Public API; **all** fetchers use explicit `switch (getCmsProvider())` (no `provider()` helper; `fetchServices` uses final switch-only pattern) |

### Step 7: Env files

- `.env.example` — committed (mock defaults, empty CMS_URL/TOKEN).
- `.env.local` — same content; covered by existing `.env*.local` in `.gitignore`; **not committed**.

### Step 8: Passing tests

```
npm test
```

**Result:** 1 file, **4 tests passed**, exit 0.

### Step 9: Commit

```
git add src/types src/lib/cms src/services .env.example
git commit -m "feat: add CMS-agnostic service layer with mock provider"
```

## Verification

| Check | Result |
|--------|--------|
| Mock `fetchServices` order | Sorted by `order`; includes `public-affairs` |
| `fetchServiceBySlug("media-production")` | Non-null; title matches /media production/i |
| Unknown slug | `null` |
| `fetchInsights` / ESG / case studies (mock) | `[]` |
| `REVALIDATE_SECONDS` re-export | From `@/lib/cms/client` via `@/services/cms` |
| `.env.local` in git | Not tracked |

## Self-review

**Strengths**

- Matches brief code structure; provider routing is consistent switch-based dispatch.
- Mock data is substantive enough for upcoming UI tasks (summaries/descriptions/icons).
- Remote providers are stubbed but wired for later integration tests with `CMS_URL`/`CMS_TOKEN`.
- `cmsFetch` centralizes auth, revalidate, tags, and error mapping.

**Gaps / risks**

1. **`cmsFetch` in Vitest:** Uses Next.js `fetch` `next` option; not unit-tested here (only mock path). Remote providers untested until integration task.
2. **`getCmsProvider()` invalid values:** Silently fall back to `mock` — intentional per brief; no logging.
3. **Directus slug 404:** Only maps `CmsError` with `NOT_FOUND`; HTTP 404 on list endpoint may surface as NETWORK unless API returns empty `data`.
4. **Supabase `apikey` only:** No `Authorization: Bearer` for RLS service role patterns; may need extension when wiring real Supabase.
5. **Untracked repo meta:** `README.md`, `AGENTS.md` still untracked (same as post–Task 1).

## Artifacts

- Brief: `.superpowers/sdd/task-2-brief.md`
- This report: `.superpowers/sdd/task-2-report.md`
