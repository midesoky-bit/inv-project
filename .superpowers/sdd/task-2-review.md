# Task 2 Review: CMS types, client, mock provider, and public service API

**Reviewer:** Code review (task-scoped gate)  
**Range:** `02f8a98` → `b6b45a6`  
**Date:** 2026-10-15

## Verdict

| Gate | Result |
|------|--------|
| **Spec compliance** | ✅ |
| **Code quality** | Approved |

---

## Spec compliance

**Met**

- **Types** (`src/types/cms.ts`): `Service`, `Insight`, `EsgCommitment`, `CaseStudy`, `CmsProviderName` match brief field shapes.
- **Errors** (`src/lib/cms/errors.ts`): `CmsError` with `CONFIG` \| `NETWORK` \| `NOT_FOUND` \| `PARSE`.
- **Client** (`src/lib/cms/client.ts`): `REVALIDATE_SECONDS = 3600`, `getCmsProvider()` for `mock` \| `directus` \| `supabase` (invalid/unset → `mock`), `cmsFetch()` with `CMS_URL`/`CMS_TOKEN`, Bearer auth when token set, and Next.js `next.tags` + `next.revalidate` (default 3600).
- **Mock provider**: Four ordered services including `public-affairs`; insights/ESG/case studies return `[]`; no network I/O (offline-safe).
- **Remote stubs**: Directus list/item REST patterns with cache tags; Supabase PostgREST paths with per-request `apikey` header; slug lookup returns `null` when no row (Supabase) or empty `data[0]` (Directus success path).
- **Public API** (`src/services/cms.ts`): `fetchServices`, `fetchServiceBySlug`, `fetchInsights`, `fetchEsgCommitments`, `fetchCaseStudies`; explicit `switch (getCmsProvider())` on all five (including final `fetchServices` pattern—no `provider()` / `"mockFetchServices" in p` branch).
- **Re-export**: `REVALIDATE_SECONDS` from `@/services/cms`.
- **Tests** (`src/services/cms.test.ts`): Matches brief cases; `CMS_PROVIDER=mock` in `beforeEach`.
- **Env**: `.env.example` committed with mock defaults; `.env*.local` in `.gitignore`; `.env.local` not tracked (correct).
- **Commit**: Message and file set align with brief Step 9 (`src/types`, `src/lib/cms`, `src/services`, `.env.example`).

**Global constraints**

| Constraint | Status |
|------------|--------|
| `CMS_PROVIDER` mock \| directus \| supabase | ✅ |
| Public fetch helpers (five functions) | ✅ |
| `REVALIDATE_SECONDS = 3600` | ✅ |
| Tagged remote fetch | ✅ (`services`, `insights`, `esg`, `case-studies`, `service:{slug}`) |
| Mock works offline | ✅ |

**Missing**

- `.env.local` in repo — intentional (gitignored local file per brief); not a spec fail.

**Extra**

- None in commit scope.

**Misunderstood**

- None material. Brief “Produces” line lists `cmsFetch(path, init?, tags?)`; implemented API is `cmsFetch(path, options)` with `tags` inside `options`, which matches brief Step 4 source—interface bullet is shorthand only.

---

## Code quality

**Approved** for Task 2 scope.

Layering is clear: types → errors/client → providers → thin public service. Provider routing is consistent and readable. Mock content is substantive for downstream UI. `cmsFetch` centralizes config errors, network/parse handling, auth, and cache options. Tests cover the mock path the app will use by default.

Independent check: `npm test` → **4 passed**, exit 0 (2026-10-15).

Non-blocking follow-ups belong in later integration/CI tasks (remote provider tests, Supabase auth hardening).

---

## Findings

### Critical

- None identified from diff and verification.

### Important

1. **Remote providers untested** — Vitest only exercises `CMS_PROVIDER=mock`. Directus/Supabase and `cmsFetch` behavior (including Next `fetch` `next` options) are unverified until integration tests or manual wiring with `CMS_URL`/`CMS_TOKEN`.
2. **Directus slug “not found” semantics** — `directusFetchServiceBySlug` maps only `CmsError` with code `NOT_FOUND` (HTTP 404) to `null`. A 200 with empty `data` already returns `null`; a non-404 error still propagates. Acceptable for stubs; confirm against real Directus when connecting.
3. **Supabase auth minimal** — Providers pass `apikey` from `CMS_TOKEN`; global `cmsFetch` may also set `Authorization: Bearer`. Service-role / RLS patterns may need explicit `Authorization` + `apikey` pairing when Supabase is wired for production.

### Minor

1. **Repeated `apikey` header blocks** in `supabase.ts` — Five near-identical `headers` objects; small DRY opportunity when touching Supabase again.
2. **`getCmsProvider()` return type** — Inline union instead of `CmsProviderName`; cosmetic consistency with `src/types/cms.ts`.
3. **No tests for** `REVALIDATE_SECONDS` re-export, invalid `CMS_PROVIDER` fallback, or `getCmsProvider()` — Brief does not require; optional hardening.
4. **`fetchServiceBySlug` on mock** — Resolves via full sorted list each time; trivial at four items; no change needed now.

---

## ⚠️ Cannot verify from diff alone

- `.env.local` exists locally with mock defaults (report claim)
- Strict TDD ordering (fail before implement) — process, not diff-proven
- `cmsFetch` cache tags/revalidate behavior under Next.js App Router runtime (only mock path runs in Vitest)
- End-to-end Directus/Supabase responses against real backends

---

## Summary

Task 2 delivers a CMS-agnostic service layer that matches the brief and global constraints: typed content models, shared fetch helper with 3600s revalidate and tags, mock provider suitable for offline dev, and switch-based public API. Commit `b6b45a6` is scoped correctly; tests pass on mock. **Spec ✅**, **quality Approved**; treat Important items as integration-task inputs, not blockers for Task 2.
