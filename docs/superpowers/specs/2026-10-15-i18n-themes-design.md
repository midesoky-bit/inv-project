# Inventure Communications — i18n, RTL & Themes Design

**Date:** 2026-10-15 (revised after design review)  
**Status:** Draft — pending user review  
**Next.js:** 16.4.1 (use `src/proxy.ts`, not `middleware.ts`)  
**Branch target:** `feat/inventure-website-bootstrap` (or follow-on feature branch)  
**Source of truth (copy):** `d:\Projects\Inventure Communications.docx` (extracted profile text available under `.superpowers/sdd/inventure-profile.txt`)  
**Arabic copy status:** AI-drafted institutional Arabic from the profile — pending human review

## Goal

Evolve the bootstrap site to support English (LTR) and Arabic (RTL), light/dark/system appearance via `next-themes`, and CSS-level multi-theme readiness (`data-theme`), while preserving the CMS-agnostic service layer and institutional aesthetic.

## Decisions locked

| Decision | Choice |
|----------|--------|
| i18n approach | Hybrid: `next-intl` for UI chrome; CMS `fetch*(locale)` for content |
| Locale URLs | Prefixed both: `/en/...`, `/ar/...` |
| First-visit `/` | `localeDetection: true` (Accept-Language + `NEXT_LOCALE` cookie) → redirect into `/en` or `/ar` |
| Theme UI | Light / Dark / System in Header only |
| Multi-theme | `[data-theme='desert']` in CSS; settable via `next-themes` `attribute={['class','data-theme']}` for future/demo; **no** Header palette control |
| Proxy file | `src/proxy.ts` (Next 16 rename of middleware) |
| Insights / case studies this pass | Soft homepage placeholder sections (`id="insights"`, `id="esg"`) with “coming soon” copy from messages — **not** full pages; keep typed CMS stubs returning empty insights/case studies |
| Arabic brand display | Keep Latin “Inventure Communications” in both locales (wrapped in `<bdi>` inside Arabic strings); no Arabic transliteration of the brand this pass |
| Numerals | Western digits in both locales via `next-intl` formatters |
| Architecture | next-intl App Router + next-themes + semantic CSS variables |

## Tech additions

- `next-intl` (App Router proxy + `[locale]` layouts)
- `next-themes` (class-based dark mode; dual attribute for future `data-theme`)
- Fonts: IBM Plex Sans + IBM Plex Serif (Latin); **IBM Plex Sans Arabic** for Arabic UI/body; **Noto Naskh Arabic** for Arabic display/headings (`subsets: ['arabic']`)

## Routing & structure

```
src/
  proxy.ts                         # next-intl createMiddleware (Next 16 proxy convention)
  i18n/
    routing.ts                     # locales, defaultLocale, localeDetection, shared Locale type
    request.ts                     # getRequestConfig + message loaders
    navigation.ts                  # createNavigation(routing) → Link, redirect, usePathname, useRouter
  messages/
    en.json
    ar.json
  types/
    intl.d.ts                      # AppConfig / IntlMessages for type-safe messages
  app/
    layout.tsx                     # PASS-THROUGH only: {children}; fonts loaded here and CSS vars applied on html in [locale] layout
    globals.css
    [locale]/
      layout.tsx                   # owns <html> + <body>; lang, dir, font variables, ThemeProvider, NextIntlClientProvider, Header, Footer
      page.tsx
      services/[slug]/page.tsx
      not-found.tsx
      error.tsx
      [...rest]/page.tsx           # catch-all → notFound()
    api/revalidate/route.ts
    sitemap.ts
    robots.ts
  components/
    layout/LanguageSwitcher.tsx
    layout/ThemeSwitcher.tsx
    layout/ThemeProvider.tsx
    layout/SkipLink.tsx
```

### Root vs locale layout (ownership)

- `app/layout.tsx`: minimal pass-through returning `children` only (required by App Router). Fonts are **instantiated** here and their `variable` class names are passed down **or** re-exported/consumed so `[locale]/layout.tsx` can put font CSS variables on `<html>`.
- `[locale]/layout.tsx`: **owns** `<html lang dir className={fontVars} suppressHydrationWarning>` and `<body>`. Sets `dir={locale === 'ar' ? 'rtl' : 'ltr'}`.

### Static rendering (required)

Every `[locale]` layout and page must:

1. `generateStaticParams()` returning `{ locale }` for `en` and `ar`
2. Validate locale with `hasLocale(routing.locales, locale)` → else `notFound()`
3. Call `setRequestLocale(locale)` before rendering

Service detail also:

4. `generateStaticParams()` as locale × slug cartesian product from `fetchServices(locale)` (or fetch once in `en` for slug list, then emit both locales)
5. `generateMetadata` from CMS content for that locale

Without these, `/en` and `/ar` may silently become dynamic and fail the static-build success criterion.

### Navigation module

`src/i18n/navigation.ts` must exist via `createNavigation(routing)` and export locale-aware `Link`, `redirect`, `usePathname`, `useRouter`, `getPathname`. All app links import from here — never raw `next/link` for internal routes.

### Nav href consistency

All primary nav items use localized `Link` with path-only hrefs:

- `/#services`, `/#insights`, `/#esg`, `/#contact`

(next-intl prefixes locale automatically.) Homepage includes real sections:

- `#services` — ServiceGrid  
- `#insights` — soft placeholder (“coming soon”)  
- `#esg` — ESG commitments from CMS when present, else soft placeholder with same id  
- `#contact` — Footer (`id="contact"`)

No bare `/#…` that bypasses the locale prefix.

### Language switcher hash/query preservation

`next-intl` path replace does **not** keep the hash. LanguageSwitcher (client) must:

1. Read `window.location.hash` and `window.location.search`
2. Navigate to the counterpart locale path via `useRouter` / `usePathname`
3. Re-apply search + hash after navigation (e.g. `router.replace(pathname + search + hash)` pattern documented in the implementation plan)

### Locale detection

`localeDetection: true` in routing config. First visit to `/` uses `Accept-Language` and may set `NEXT_LOCALE`. Users can still force locale via the switcher (cookie update).

### Message fallbacks & type safety

- Missing keys fall back to English; log in development  
- `types/intl.d.ts` declares `IntlMessages` matching `en.json`  
- CI/unit test: `en.json` and `ar.json` have **identical key trees**

### Error routes

Localized `not-found.tsx` and `error.tsx` under `[locale]`, plus `[...rest]` catch-all calling `notFound()`.

## Content & CMS

### Shared `Locale` type

Exported from `src/i18n/routing.ts` (`(typeof routing.locales)[number]`) and used by CMS, pages, and tests — one type everywhere.

### Public API

```ts
fetchServices(locale: Locale): Promise<Service[]>
fetchServiceBySlug(slug: string, locale: Locale): Promise<Service | null>
fetchEsgCommitments(locale: Locale): Promise<EsgCommitment[]>
fetchInsights(locale: Locale): Promise<Insight[]>        // returns [] this pass
fetchCaseStudies(locale: Locale): Promise<CaseStudy[]>  // returns [] this pass
```

Slugs remain language-stable English kebab-case.

### Mock data model (parity)

One record with translations — **not** two parallel arrays:

```ts
type LocalizedString = { en: string; ar: string };

type ServiceRecord = {
  id: string;
  slug: string;
  order: number;
  icon?: string;
  title: LocalizedString;
  summary: LocalizedString;
  description: LocalizedString;
};
```

Resolver picks `record.title[locale]` (fallback `en` if missing). Same pattern for ESG.

### Mock catalog (from company profile)

Seven services:

1. `media-production` — Media Production  
2. `media-content-management` — Media & Content Management  
3. `digital-media-platforms` — Digital Media & Platforms  
4. `public-relations-partnerships` — Public Relations & Strategic Partnerships  
5. `events-exhibitions` — Events & Exhibitions  
6. `public-affairs-government-relations` — Public Affairs & Government Relations  
7. `capital-markets-financial-communications` — Capital Markets & Financial Communications  

Three ESG commitments:

1. Responsible Operations  
2. Sustainable Communication  
3. Measurable Impact  

### CMS caller migration (explicit)

All existing callers of zero-arg `fetchServices()` / `fetchServiceBySlug(slug)` must be updated in the same change set:

- Homepage, service detail, sitemap  
- `src/services/cms.test.ts` (pass `"en"` / `"ar"`)  
- Any future Directus/Supabase stubs: accept `locale` (may ignore until wired)

### Cache tag scheme (locale-aware)

Tags include locale:

- `services:{locale}`  
- `service:{locale}:{slug}`  
- `esg:{locale}`  
- `insights:{locale}`  
- `case-studies:{locale}`  

`POST /api/revalidate` allow-list updates accordingly. When a webhook sends a generic `services` tag, the handler **expands** to `services:en` and `services:ar` (and similarly for other known prefixes) so both locales invalidate.

## Theme system

### Semantic CSS variables

| Token | Role |
|-------|------|
| `--background` | Page background |
| `--foreground` | Primary text |
| `--surface` | Elevated surface |
| `--surface-muted` | Subtle elevated / section alt |
| `--muted` | Secondary text |
| `--border` | Borders |
| `--brand` | Deep navy identity |
| `--brand-mid` | Mid navy |
| `--brand-foreground` | Text/icon on brand surfaces (light on navy) |
| `--accent` | Steel / desert accent |
| `--accent-foreground` | Text on accent |
| `--ring` | Focus ring |
| `--overlay` | Scrim / modal overlay |

- **Light (`:root`):** light surfaces, navy text; `color-scheme: light`  
- **Dark (`.dark`):** navy surfaces, light text; `--brand` may stay navy but **`--brand-foreground` / borders / accents** must remain visible (lighter accents for text-on-navy); `color-scheme: dark`  
- **`[data-theme='desert']`:** warmer sand/mist accents on top of light or dark class  

Implementation must run a **WCAG AA contrast check** for `--muted` and `--accent` (and text-on-brand) in light, dark, and desert×light/dark.

### Tailwind v4 dark variant (required)

```css
@custom-variant dark (&:where(.dark, .dark *));
```

Without this, `dark:` utilities follow prefers-color-scheme and ignore `next-themes` class mode.

### ThemeProvider strategy

```tsx
attribute={['class', 'data-theme']}
defaultTheme="system"
enableSystem
disableTransitionOnChange
```

- `class` carries `light` / `dark`  
- `data-theme` defaults to brand theme value (e.g. `default`) so `[data-theme='desert']` can be activated later without a second system; Header does not expose desert this pass  
- Document how to demo desert (dev-only or future control)

Also:

- `<meta name="theme-color">` matching active scheme (via theme or CSS)  
- Optional dark-mode wordmark treatment (CSS `currentColor` / invert sparingly — prefer `text-brand-foreground` on navy header)  
- ThemeSwitcher: **mounted guard** with same-size placeholder to avoid hydration mismatch; control is a **radiogroup** or menu with `aria-checked`, not a single opaque cycling icon

## RTL & typography

- Logical properties only: `ms/me`, `ps/pe`, `start/end`, `text-start/end`, `border-s/e`  
- Under `[dir=rtl]`: zero letter-spacing / disable uppercase tracking; line-height ≥ ~1.7 for Arabic body  
- Mirror directional icons: `rtl:-scale-x-100` on arrows/chevrons; prefer `gap-*` over `space-x-*`  
- Latin brand inside Arabic copy: `<bdi>Inventure Communications</bdi>`  
- Numerals: Western digits; format dates/numbers through `next-intl` `useFormatter` / `getFormatter`  
- **Regression guard:** ESLint rule or CI grep failing on `\b(ml|mr|pl|pr|left|right|text-left|text-right|border-l|border-r)-`

## UI switchers & a11y

- **LanguageSwitcher:** shows `EN` / `العربية` with `lang="ar"` on the Arabic label; uses `hreflang` on links where applicable; preserves path + search + hash  
- **ThemeSwitcher:** light / dark / system radiogroup; mounted placeholder  
- Both in Header end-side cluster and at bottom of MobileNav  
- **SkipLink** localized via messages  
- All aria-labels for menu/theme/language from messages

## SEO & metadata

- `metadataBase` from `getSiteUrl()`  
- Per-locale canonical under `/en/...` or `/ar/...`  
- `alternates.languages`: `{ en: '...', ar: '...', 'x-default': '...' }`  
- `openGraph.locale` + `alternateLocale` (`en_US` / `ar_AR`)  
- Sitemap: each URL entry includes `alternates.languages` (not only a flat dual list)  
- Organization JSON-LD with localized `name`  
- Service `generateMetadata` from CMS title/summary for active locale

## Testing & success criteria

### Automated

- CMS: exactly 7 services; exactly 3 ESG; `fetchServiceBySlug` unknown → `null`; Arabic title assertion; every service/ESG record has both `en` and `ar` strings  
- Message key parity EN ↔ AR  
- Existing revalidate + site URL tests updated for new tag scheme / remain green  
- Optional later: Playwright EN/AR × light/dark smoke; axe; Lighthouse budgets (enhancement — not blocking this pass)

### Measurable success criteria

1. `/en` is LTR and `/ar` is RTL; layout flips via logical CSS  
2. Language and theme switchers work from Header and mobile menu; hash preserved on language switch  
3. Mock CMS returns profile-aligned EN/AR for 7 services + 3 ESG  
4. Light/dark/system adapt via CSS variables; `[data-theme='desert']` exists and is reachable via theme attribute plumbing  
5. CMS public API remains the only content entry point for pages  
6. Build statically generates both locales (and locale × service routes)  
7. No hydration warnings from theme/locale switchers in smoke  
8. No flash of wrong theme when `disableTransitionOnChange` + mounted guard are applied  
9. Zero physical-direction utilities remaining (CI grep clean)  
10. Both locales present in sitemap with `alternates.languages` / `x-default`

## Out of scope

- Desert theme Header control  
- Full Insights / Case Study pages  
- Remote Directus/Supabase localized field mapping beyond accepting `locale`  
- Certified human translation QA  
- Re-enabling Next.js Cache Components  
- Playwright / Lighthouse budgets (tracked as follow-up enhancements)

## Implementation order (revised)

Do logical-CSS together with the `[locale]` move to avoid rewriting components twice. Add a verification step after each stage.

1. Install deps; `i18n/routing.ts`, `request.ts`, `navigation.ts`, `proxy.ts`, messages + `intl.d.ts` + key-parity test  
2. Restructure under `[locale]` **and** logical-CSS pass + static params / `setRequestLocale` / error routes; update all CMS callers + sitemap tags; verify build lists `/en` and `/ar`  
3. LanguageSwitcher (hash/query preserve) + SkipLink + MobileNav integration; verify locale switch smoke  
4. Semantic tokens, `@custom-variant dark`, ThemeProvider dual attribute, ThemeSwitcher radiogroup, contrast pass; verify theme smoke  
5. Locale-aware mock model `{en,ar}` with 7 services + 3 ESG + Arabic; CMS tests; wire Hero/ServiceGrid/detail/ESG placeholder  
6. SEO alternates, JSON-LD, metadata from CMS; final `npm test` / lint / build / RTL+theme smoke  

## Review disposition (this revision)

| Review item | Disposition |
|-------------|-------------|
| Critical 1–10 | Incorporated above |
| Theming / RTL / i18n / CMS / SEO additions | Incorporated with locked defaults |
| Playwright / Lighthouse | Deferred to enhancements |
| Status wording | Set to Draft — pending user review |
| Implementation order | Revised (locale + logical CSS together; verify per stage) |
| Insights | Soft homepage placeholders; stubs stay empty |
