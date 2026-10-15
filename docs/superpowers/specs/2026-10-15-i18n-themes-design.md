# Inventure Communications — i18n, RTL & Themes Design

**Date:** 2026-10-15  
**Status:** Approved (pending final user review of this document)  
**Branch target:** `feat/inventure-website-bootstrap` (or follow-on feature branch)  
**Source of truth (copy):** `d:\Projects\Inventure Communications.docx` (extracted to `.superpowers/sdd/inventure-profile.txt`)

## Goal

Evolve the bootstrap site to support English (LTR) and Arabic (RTL), light/dark/system appearance via `next-themes`, and CSS-level multi-theme readiness (`data-theme`), while preserving the CMS-agnostic service layer and institutional aesthetic.

## Decisions locked

| Decision | Choice |
|----------|--------|
| i18n approach | Hybrid: `next-intl` for UI chrome; CMS `fetch*(locale)` for content |
| Locale URLs | Prefixed both: `/en/...`, `/ar/...`; `/` → `/en` (or detected locale later optional) |
| Theme UI | Light / Dark / System in Header only |
| Multi-theme | CSS `[data-theme='desert']` prepared; **no** Header palette switcher |
| Architecture | next-intl App Router + next-themes + semantic CSS variables |

## Tech additions

- `next-intl` (App Router middleware + `[locale]` layouts)
- `next-themes` (class-based dark mode)
- Arabic-capable font: IBM Plex Sans Arabic (or Noto Sans Arabic) alongside existing IBM Plex Sans/Serif

## Routing & structure

```
src/
  middleware.ts
  i18n/routing.ts
  i18n/request.ts
  messages/en.json
  messages/ar.json
  app/
    layout.tsx              # fonts, globals; no Header
    globals.css
    [locale]/
      layout.tsx            # lang, dir, providers, Header, Footer
      page.tsx
      services/[slug]/page.tsx
    api/revalidate/route.ts # unchanged locale-agnostic
    sitemap.ts              # emit /en and /ar URLs
    robots.ts
  components/
    layout/LanguageSwitcher.tsx
    layout/ThemeSwitcher.tsx
    layout/ThemeProvider.tsx
```

- Locales: `en` | `ar`; `defaultLocale: en`
- `<html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>`
- Navigation helpers from `next-intl` so links stay locale-aware
- Nav items: `/${locale}/#services`, `/#insights`, `/#esg`, `/#contact` (hash targets on homepage)

## Content & CMS

### Public API changes

- `fetchServices(locale: Locale): Promise<Service[]>`
- `fetchServiceBySlug(slug: string, locale: Locale): Promise<Service | null>`
- `fetchEsgCommitments(locale: Locale)`, `fetchInsights(locale)`, `fetchCaseStudies(locale)` similarly
- Slugs remain language-stable (English kebab-case)

### Mock content (from company profile)

Expand services to seven offerings:

1. Media Production  
2. Media & Content Management  
3. Digital Media & Platforms  
4. Public Relations & Strategic Partnerships  
5. Events & Exhibitions  
6. Public Affairs & Government Relations  
7. Capital Markets & Financial Communications  

Populate ESG commitments from profile priorities:

1. Responsible Operations  
2. Sustainable Communication  
3. Measurable Impact  

Professional institutional Arabic translations derived from the profile document for titles, summaries, and descriptions.

### UI messages

`messages/en.json` and `messages/ar.json` cover: brand, nav, hero headline/subhead/CTAs, services section chrome, footer, theme/language control labels, common “Learn more” / “All services”.

Hero chrome uses messages; service grid body uses CMS.

## Theme system

### Semantic CSS variables

| Token | Role |
|-------|------|
| `--background` | Page background |
| `--foreground` | Primary text |
| `--surface` | Elevated surface |
| `--muted` | Secondary text |
| `--border` | Borders |
| `--brand` | Deep navy identity (`#0B1D36`) |
| `--brand-mid` | Mid navy |
| `--accent` | Steel blue accent |

- **Light (`:root`):** light surfaces, navy text, navy brand  
- **Dark (`.dark`):** navy surfaces, light text; brand remains navy identity  
- **`[data-theme='desert']`:** warmer sand/mist accents (CSS only; not exposed in UI)

Tailwind `@theme` maps `background`, `foreground`, `surface`, `muted`, `border`, `brand`, `accent` to these variables. Components migrate off hard-coded `bg-inv-white` / `text-inv-navy` toward semantic utilities where theming matters; brand navy may remain for institutional chrome that should stay navy in both modes (e.g. primary Header bar can stay `bg-brand`).

### Providers

- `ThemeProvider`: `attribute="class"`, `defaultTheme="system"`, `enableSystem`, no forced theme  
- Suppress hydration mismatch on theme toggles (`suppressHydrationWarning` on `<html>` as needed)

## RTL / logical CSS

Replace physical directional utilities with logical ones across layout and home components:

- `ml/mr` → `ms/me`  
- `pl/pr` → `ps/pe`  
- `left/right` → `start/end`  
- `text-left/right` → `text-start/end`  
- `border-l/r` → `border-s/e`

## UI switchers

- **LanguageSwitcher:** EN | AR; swaps locale prefix, preserves path + hash  
- **ThemeSwitcher:** light / dark / system (icons + accessible labels)  
- Both in Header end-side cluster; repeated at bottom of MobileNav  
- Aesthetic: minimal, institutional — no pill clusters, no desert control

## SEO & metadata

- Per-locale `generateMetadata` / layout metadata  
- `alternates.languages` for `en` and `ar` where applicable  
- Sitemap lists both `/en` and `/ar` home + service URLs  
- Canonicals remain self-referencing under the active locale path

## Testing

- CMS tests: `fetchServices("en")` and at least one Arabic title assertion for `fetchServices("ar")`  
- Existing revalidate + site URL tests remain green  
- `npm run build` produces `/en`, `/ar`, and localized service routes

## Out of scope

- Desert theme UI control  
- Full Insights pages  
- Remote Directus/Supabase localized field mapping (stubs may accept `locale` and ignore until wired)  
- Certified human translation QA  
- Re-enabling Next.js Cache Components

## Success criteria

1. `/en` LTR and `/ar` RTL render correctly with flipped layout  
2. Language and theme switchers work from Header and mobile menu  
3. Mock CMS returns profile-aligned EN/AR content for 7 services + ESG  
4. Light/dark/system adapt via CSS variables; `[data-theme='desert']` exists in CSS  
5. CMS public API remains the only content entry point for pages  

## Implementation order (for planning)

1. Install `next-intl`, `next-themes`; add i18n routing + middleware  
2. Restructure App Router under `[locale]`; fix links/sitemap  
3. Messages EN/AR; LanguageSwitcher  
4. Semantic tokens + ThemeProvider + ThemeSwitcher; logical CSS pass  
5. Locale-aware CMS mock (7 services + ESG + Arabic)  
6. Wire Hero/ServiceGrid/detail pages to locale + messages  
7. Verify build, RTL smoke, theme smoke, unit tests  
