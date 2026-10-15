# Final Branch Review — Inventure Communications Website Bootstrap

**Reviewer:** Senior Code Reviewer (final whole-branch pass)
**Date:** 2026-10-15
**Range:** `2dfcfaf..07b3552` (11 commits, 42 files, ~1815 insertions excluding lockfile)
**Spec:** `docs/superpowers/specs/2026-10-15-inventure-communications-website-design.md`
**Plan:** `docs/superpowers/plans/2026-10-15-inventure-communications-website.md`

**Verdict: Approve for merge.** No critical defects. Two issues should be fixed before the site is pointed at a real domain, but neither blocks landing this bootstrap on the main line.

---

## Verification performed

All commands run against `07b3552` with a clean working tree (only untracked `AGENTS.md`):

| Check | Result |
|---|---|
| `npm test` | 3 files / 10 tests passed |
| `npx tsc --noEmit` | exit 0 |
| `npm run lint` | clean |
| `npm run build` | success (Next 16.4.1, Turbopack) |

Build output matches the plan exactly: `/` static with 1h revalidate, four SSG service pages (`media-production`, `digital-media`, `events`, `public-affairs`), `/sitemap.xml` and `/robots.txt` static, `/api/revalidate` dynamic.

I also inspected the generated artifacts in `.next/server/app/` rather than trusting source alone — findings I1, I2, and I3 below come from the actual prerendered HTML.

---

## Strengths

1. **The CMS seam is real, not decorative.** Pages import only `fetchServices` / `fetchServiceBySlug` from `@/services/cms`; every provider detail (Directus `data` envelopes, Supabase `apikey` headers, PostgREST filter syntax) stays behind the boundary. Success criterion 5 — "switching `CMS_PROVIDER` later does not require UI rewrites" — is genuinely satisfied. The dispatch is a plain `switch` in all five functions, consistent and trivially readable.

2. **The revalidation endpoint is better than most hand-rolled webhook handlers.** It returns 503 when unconfigured rather than silently accepting an empty secret, compares with `timingSafeEqual` after a length guard, and validates tags against an allow-list (`STATIC_TAGS` plus a `^service:[a-z0-9-]+$` pattern) instead of forwarding arbitrary strings into `revalidateTag`. Requiring a custom header also makes cross-site POSTs non-trivial. All four behaviours are covered by tests.

3. **Per-page SEO actually lands in the HTML.** `/services/events` emits `<link rel="canonical" href=".../services/events">`, a service-specific description, and service-specific `og:title` / `og:description` / `og:url`. Amendment C is implemented correctly, including the `robots: { index: false }` fallback in `generateMetadata` for unknown slugs.

4. **Design tokens are disciplined.** Palette lives once in `:root` and is exposed to Tailwind via `@theme inline`; no component carries a raw hex. The hero honours the spec's hard constraint — brand line, one headline, one supporting sentence, one CTA group, no cards or stats or badges.

5. **Client boundaries are tight.** Exactly two `"use client"` leaves for motion (`HeroSection`, `ServiceCardMotion`) plus `MobileNav`. `ServiceGrid` stays a server component and passes plain props down, which is the right shape.

6. **Error model and offline story.** `CmsError` carries a discriminating `code`, Directus maps `NOT_FOUND` to `null`, and the mock provider needs no network — `next build` works with zero credentials, as the spec requires.

7. **Hygiene.** No secrets committed (`.env.example` has empty values, `.env*.local` is ignored), lockfile tracked, commit history maps one-to-one onto plan tasks with clear messages, and accessibility basics are present: `aria-expanded`/`aria-controls` on the menu button, `aria-labelledby` on the services section, visible `focus-visible` rings on every interactive element.

---

## Critical issues

**None.** Nothing in this branch risks data loss, security compromise, or a broken build.

---

## Important issues

### I1. Motion initial state is prerendered as `opacity: 0` — the page is blank without JavaScript

`.next/server/app/index.html` contains eight `opacity:0` inline styles, including on the `<h1>`:

```html
<h1 class="max-w-3xl font-serif text-4xl ..." style="opacity:0;transform:translateY(16px)">
  Strategic communications for decision-makers
```

Framer Motion serializes `initial` into SSR markup and only reverses it on hydration. If JavaScript fails, is blocked, or hydration errors out, a visitor sees an empty navy screen — on an institutional site whose entire purpose is credibility. It also means the LCP element paints only after the client bundle executes, rather than on first paint.

Every service card has the same problem via `whileInView`, so a hydration failure also empties the capabilities grid.

Related: `prefers-reduced-motion` is not honoured anywhere. Framer Motion does not do this automatically; it needs `<MotionConfig reducedMotion="user">` or explicit per-component handling.

**Suggested fix:** animate from a visible baseline (CSS-driven fade with `@starting-style`, or render at `opacity: 1` and let motion enhance only on the client), and wrap the app in `MotionConfig reducedMotion="user"`.

### I2. `NEXT_PUBLIC_SITE_URL` falls back to localhost silently, and it is baked in at build time

`getSiteUrl()` defaults to `http://localhost:3000` with no warning. Because `NEXT_PUBLIC_*` is inlined during the build, a deploy pipeline that forgets the variable ships a production site whose canonicals, sitemap, and robots all point at localhost. The current build artifacts demonstrate exactly what that looks like:

```
<link rel="canonical" href="http://localhost:3000/services/events"/>
<loc>http://localhost:3000/services/media-production</loc>
Host: http://localhost:3000
Sitemap: http://localhost:3000/sitemap.xml
```

This is correct locally, but the failure mode in production is silent and expensive — search engines will index canonical tags pointing to an unreachable host, and nobody notices until rankings drop.

**Suggested fix:** throw (or at minimum `console.warn` loudly) from `getSiteUrl()` when `NODE_ENV === "production"` and the variable is unset. The existing `src/lib/site.test.ts` makes this a three-line change plus one test.

### I3. The transparent white-text header only works over a dark hero

`Header` is `absolute inset-x-0 top-0` with `text-inv-white` and `text-white/80`, and no background of its own. That is correct over the navy hero and the navy service-page masthead, but it breaks on any light-topped page. The built `/_not-found` page already shows it: white brand text and white nav links painted over Next's default white 404 screen, effectively invisible.

Since the plan explicitly anticipates Insights and ESG pages later, this will bite again the first time someone adds a page that does not open with a navy block.

**Suggested fix:** either give the header a surface variant (solid navy by default, transparent only where a page opts in), or add a branded `src/app/not-found.tsx` with a dark top section as a stopgap.

### I4. `summary_large_image` Twitter card with no image, and no per-page Twitter tags

There is no `og:image` or `twitter:image` anywhere in the site, yet the card type is `summary_large_image`. Link previews on LinkedIn, X, and Slack — the exact channels a public affairs firm cares about — will render as a bare text card. Additionally, service pages do not override the Twitter block, so `/services/events` emits `twitter:title = "Inventure Communications"` rather than the service name (verified in the prerendered head).

This is a launch blocker rather than a merge blocker: adding a static OG image and moving the Twitter fields into `generateMetadata` is a contained follow-up.

---

## Minor issues

**CMS layer**

- `cmsFetch` types `headers` as `HeadersInit` but object-spreads it. A `Headers` instance or `string[][]` would silently spread to `{}` and drop every header. Narrow the type to `Record<string, string>` to make the contract honest.
- Under the default `mock` provider no fetch tags are ever registered, so `POST /api/revalidate` returns `200 {"revalidated":[...]}` while changing nothing. Worth one sentence in the README so the first person to test it is not confused.
- `supabaseFetchServiceBySlug` does not map a `NOT_FOUND` `CmsError` to `null` the way `directusFetchServiceBySlug` does — the two providers behave differently for a missing row.
- Remote responses are cast with `as T` and never shape-validated; `CmsError("PARSE")` only fires on malformed JSON, not on a schema mismatch. (This is the known "untested stubs" ledger item; a Zod or hand-rolled guard belongs in the task that wires real credentials.)
- `CmsError` takes `cause` as a readonly parameter property, shadowing the native `Error.cause` instead of passing it through `super(message, { cause })`. Debuggers and `--stack-trace-limit` tooling will not chain it.
- Directus and Supabase service queries have no pagination bound or published-state filter. Fine for a stub; not fine the day a real collection has 500 rows.

**SEO / crawl surface**

- Sitemap emits the homepage as `http://localhost:3000` (no trailing slash) while the homepage canonical is `/` (with slash). Normalize one or the other.
- Sitemap entries omit `lastModified`.
- `robots.ts` sets `host: "http://localhost:3000"` — the `Host` directive conventionally takes a bare hostname without scheme.

**UI / accessibility**

- `MobileNav` has no focus trap, does not return focus to the toggle on close, does not lock body scroll, and does not reset `open` when the viewport crosses the `md` breakpoint (CSS hides the panel; React state stays stale). The ledger correctly notes the manual click test was not automated — there is still no component test covering the toggle, Escape, or link-tap-closes behaviours.
- No skip-to-content link, and `<main>` has no `id` or `tabIndex` to target.
- `/#insights` and `/#esg` have no matching element on any page, so those two nav items scroll nowhere. In scope per the ledger, but as shipped they read as broken links rather than as placeholders.
- Spec asks for "legal placeholders" in the footer; only the copyright line exists. No Privacy/Terms stubs.
- The footer year reverted to `new Date().getFullYear()` in a server component (`07b3552`). Correct now that Cache Components is off, and `/` and `/services/*` re-bake hourly — but fully static routes such as `/_not-found` have no revalidate window and will freeze the build-time year.

**Project hygiene**

- Default scaffold leftovers are still tracked: `public/next.svg`, `vercel.svg`, `file.svg`, `globe.svg`, `window.svg`, and the stock `favicon.ico`. Unbranded dead weight on a brand site.
- Tailwind is wired via `@tailwindcss/turbopack` plus a `next.config.ts` turbopack rule instead of the planned `postcss.config.mjs`. It works — the build is verified — but it is undocumented and silently breaks under `next build --webpack` or any PostCSS-based tooling.
- `next.config.ts` still carries the scaffold's `/* config options here */` comment and no record of *why* `cacheComponents` / `partialPrefetching` were removed. One comment line would save a future reader a git-blame.
- `src/services/cms.test.ts` mutates `process.env.CMS_PROVIDER` without restoring it, and no test exercises the `directus`/`supabase` dispatch branches. A `getCmsProvider()` dispatch test is cheap insurance for the layer the whole architecture rests on.
- `generateMetadata` and the page body each call `fetchServiceBySlug`. Harmless for mock, deduped by Next for real fetches — noted for awareness only.
- `AGENTS.md` sits untracked in the working tree. Decide whether it belongs in the repo before merging.

---

## Plan alignment

All eight tasks landed in the planned order (1 → 2 → 3 → 4 → 5 → 7 → 8 → 6), and every file in the plan's file map exists with the intended responsibility. Amendments A–E are all present: shared `NAV_ITEMS` and `MobileNav` (A), `sitemap.ts` / `robots.ts` / `getSiteUrl()` (B), per-page canonicals and OG (C), `revalidate = 3600` plus the tag endpoint (D), and the extended verification sweep including a `typecheck` script and README (E).

All five spec success criteria are met: the scaffold is in place, the homepage renders hero plus CMS-backed grid, four service routes are statically generated, global SEO metadata is industry-targeted, and the provider switch requires no UI changes.

**Deviations from the plan, all deliberate and acceptable:**

- CSS is wired through the Turbopack Tailwind loader rather than the planned `postcss.config.mjs`.
- `cacheComponents: true` and `partialPrefetching: true` were removed in `5f13fbc` so classic ISR works — the right call for this Next version, and the build output confirms the 1h/1y revalidate windows took effect.
- The `CopyrightYear` client component added in `5f1c71c` was reverted in `07b3552`; with Cache Components off it was no longer needed.

**Ledger triage for merge:**

| Ledger item | Disposition |
|---|---|
| Remote CMS providers untested stubs | **Accept.** Spec explicitly scopes them as "not required to be fully wired." Pair contract tests with the credential-wiring task. |
| Cache Components disabled for classic ISR | **Accept.** Necessary and verified; add a one-line comment in `next.config.ts` explaining why. |
| Manual mobile menu click not automated | **Accept.** Low risk; a jsdom test for the toggle is a good first follow-up. |
| Insights/ESG hash placeholders | **Accept** as scope, but note the anchors resolve to nothing (Minor, above). |

---

## Merge readiness

**Merge.** This is a clean, well-factored bootstrap that does what the spec asked and nothing it did not. The architecture decision that matters most — the CMS seam — is sound, and the build, type, lint, and test gates are all green on `07b3552`.

Before pointing the site at a production domain, land I1 (no-JS blank page) and I2 (localhost canonical guard); both are small and self-contained. I3 and I4 should be queued with the first real content page. The Minor list is follow-up backlog, not merge conditions.

---

## Fixes applied

| Finding | Fix |
|---|---|
| **I1** Framer Motion SSR `opacity: 0` | `HeroSection` and `ServiceCardMotion` defer motion `initial` until after mount; `useReducedMotion()` skips animation when the user prefers reduced motion. SSR HTML renders visible without JavaScript. |
| **I2** `NEXT_PUBLIC_SITE_URL` localhost trap | `getSiteUrl()` emits a loud `console.warn` in production when the env var is missing or localhost; README **Production** section documents build-time requirement; unit test covers the warning. |
| **I3** Header invisible on light pages | `Header` keeps absolute positioning and adds solid `bg-inv-navy` so white nav text stays readable on 404 and other light-topped pages. |
| **Minor** Mock revalidate no-op | README CMS section notes that the mock provider does not register fetch tags, so `/api/revalidate` may succeed without updating mock pages until a remote provider is wired. |

**Not in this pass:** I4 (OG / Twitter images) — deferred per review triage.
