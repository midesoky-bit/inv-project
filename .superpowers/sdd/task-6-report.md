# Task 6 Report — Final verification (Amendment E)

**Branch:** `feat/inventure-website-bootstrap`  
**Date:** 2026-10-15  
**Commit:** `879a6f5` — `docs: add bootstrap README and verify build`

## Summary

| Step | Command | Result |
|------|---------|--------|
| Unit tests | `npm test` | **PASS** — 3 files, 10 tests |
| Typecheck | `npx tsc --noEmit` / `npm run typecheck` | **PASS** (exit 0) |
| Lint | `npm run lint` | **FAIL** — 3 errors (see Concerns) |
| Build | `npm run build` | **PASS** — `/`, 4× `/services/*`, sitemap, robots, `/api/revalidate` |
| Crawl surface | curl (existing server on :3000) | **PASS** |
| Canonical | curl `/services/events` | **PASS** — self-referencing canonical |
| Mobile nav | Browser snapshot @ 390px + code review | **Partial** — menu button visible; Contact → `/#contact` → `footer#contact` in markup |

## Step 1: Unit tests

```
npm test
> vitest run
Test Files  3 passed (3)
     Tests  10 passed (10)
Duration  147ms
```

## Step 2: Typecheck and lint

**Typecheck (`npx tsc --noEmit`):** exit 0, no diagnostics.

**Added script:** `"typecheck": "tsc --noEmit"` in `package.json`.

**Lint (`npm run lint`):** exit 1.

```
.superpowers/sdd/extract-brief.js
  1:12  error  A `require()` style import is forbidden  @typescript-eslint/no-require-imports
  2:14  error  A `require()` style import is forbidden  @typescript-eslint/no-require-imports

src/components/layout/CopyrightYear.tsx
  9:5  error  Avoid calling setState() directly within an effect  react-hooks/set-state-in-effect
```

## Step 3: Production build

```
npm run build
▲ Next.js 16.4.1 (Turbopack)
✓ Compiled successfully
✓ Generating static pages (11/11)

Route (app)
┌ ○ /
├ ƒ /api/revalidate
├ ○ /robots.txt
├ ● /services/media-production
├ ● /services/digital-media
├ ● /services/events
├ ● /services/public-affairs
└ ○ /sitemap.xml
```

## Step 4: Crawl surface

`npm run start` failed with `EADDRINUSE` (port 3000 already in use by PID 21764). Verification used the running production server.

### `curl.exe http://localhost:3000/sitemap.xml`

Five URLs:

- `http://localhost:3000`
- `http://localhost:3000/services/media-production`
- `http://localhost:3000/services/digital-media`
- `http://localhost:3000/services/events`
- `http://localhost:3000/services/public-affairs`

### `curl.exe http://localhost:3000/robots.txt`

```
User-Agent: *
Allow: /
Disallow: /api/

Host: http://localhost:3000
Sitemap: http://localhost:3000/sitemap.xml
```

## Step 5: Canonical and nav spot-check

**Canonical** (`/services/events` HTML):

```html
<link rel="canonical" href="http://localhost:3000/services/events"/>
```

**Mobile nav:** At 390×844 emulation, accessibility snapshot shows `Open menu` button (`md:hidden` hamburger). `MobileNav` renders `NAV_ITEMS` including Contact (`href="/#contact"`). Layout footer has `id="contact"`. Interactive open-menu → Contact scroll was not exercised in-browser (automation blocked); structure matches spec.

## Step 6: README

Replaced default create-next-app README with bootstrap docs: stack, setup, CMS providers, `REVALIDATE_SECRET` for `POST /api/revalidate` (`x-revalidate-secret`, body `{ "tags": ["services"] }`), scripts including `typecheck`.

## Step 7: Commit

```
git add README.md package.json
git commit -m "docs: add bootstrap README and verify build"
879a6f5 docs: add bootstrap README and verify build
```

## Cleanup

Stopped PID **21764** (`next start` on :3000). No `LISTENING` on port 3000 after cleanup (TIME_WAIT only).

## Concerns / follow-ups

1. **Lint not clean** — exclude `.superpowers/**` from ESLint and/or fix `CopyrightYear.tsx` (prefer `useSyncExternalStore` or static year) before treating CI lint as gate.
2. **Sitemap/robots Host URLs** use `http://localhost:3000` locally; production needs correct `NEXT_PUBLIC_SITE_URL` (or equivalent) if not already env-driven.
3. **Vitest warning** — ESM/CJS in `vitest.config.ts`; non-blocking for tests.

## Artifacts changed (this task)

- `README.md` — project bootstrap documentation
- `package.json` — `typecheck` script

---

## Lint fix follow-up (2026-10-15)

**Commit:** `07b3552` — `fix: resolve lint errors for CopyrightYear and eslint ignore`

| Step | Command | Result |
|------|---------|--------|
| Lint | `npm run lint` | **PASS** (exit 0) |
| Unit tests | `npm test` | **PASS** — 3 files, 10 tests |

**Changes:**

- `eslint.config.mjs` — added `.superpowers/**` to `globalIgnores` (SDD helpers use CommonJS `require`).
- `Footer.tsx` — copyright year via `{new Date().getFullYear()}` in Server Component; removed `Suspense` wrapper.
- Deleted `CopyrightYear.tsx` client component (no longer needed).
