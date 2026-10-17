# Inventure Communications — Reference layout

**Date:** 2026-10-17  
**Status:** Approved  
**Next.js:** 16.4.1 (`src/proxy.ts`, App Router, `[locale]` routes)  
**Extends:** `docs/superpowers/specs/2026-10-15-inventure-communications-website-design.md` and `docs/superpowers/specs/2026-10-15-i18n-themes-design.md`

## Goal

Restyle the public site to follow the approved reference layout: photo heroes, a green accent, rounded buttons, and separate pages for Home, About, Services, Our Work, Insights, Careers, and Contact. Keep English and Arabic, the light / dark / system switch, Directus-backed services, and only content that already exists.

## Decisions locked

| Decision | Choice |
|----------|--------|
| Information architecture | Real routes. The long homepage is split. Text is not duplicated across Home and the new pages. |
| Accent | Green `#1FA971` replaces steel `#3A6B8C` for labels, icons, primary buttons, and one phrase in each page’s main heading. Navy `#0B1D36` stays. The green phrase is a `next-intl` rich-text chunk in the message catalog, not an automatic first or last word. Home uses “decision-makers” / “لصناع القرار”. Other pages name their green phrase in the same catalog entry as the heading. |
| Themes | Light, dark, and system stay. Hero panels use the photograph and a navy wash in both themes. |
| Header | Brand, then Home, About, Services, Our Work, Insights, Careers, Contact. Theme icon and language switch stay at the end. No search. No social icons. |
| Stats | No number bar. No invented counts, client names, project titles, or results. |
| Our Work | Gallery of the five existing photos, filtered by the services those photos belong to. |
| Insights and Careers | Real pages. Empty Directus collections. The page shows one sentence until an editor adds items. No sample articles or jobs. |
| ESG | Stays off the menu. The section moves to About. |
| Brand name | Latin “Inventure Communications” in both locales, wrapped in `<bdi>` in Arabic. |
| Numerals | Western digits. |
| Motion | Hero line draw on load. Section fade on scroll. Slight card lift on hover. Off when the user prefers reduced motion. |

## Visual system

Tokens in `src/app/globals.css`:

| Token | Value | Use |
|-------|--------|-----|
| `--brand` | `#0B1D36` | Navy panels, dark hero wash, primary text in light mode |
| `--accent` | `#1FA971` | Eyebrows, one headline word, icons, primary buttons, focus ring companion |
| `--background` / `--foreground` | Existing light and dark pairs | Page canvas and body text |

Light mode is white canvas, navy text, white cards with a border. Dark mode is deep navy canvas, off-white text, and a raised navy card surface. Green does not change between themes.

Primary buttons are fully rounded, green background, white label. Secondary buttons are an outline with transparent fill. Cards use a green icon, title, one sentence, and a “Learn more” line. Hover lifts the card slightly.

Typography stays IBM Plex Sans and Serif for Latin, IBM Plex Sans Arabic for Arabic UI, and Noto Naskh Arabic for Arabic headings.

Layout CSS stays logical (`ms` / `me` / `ps` / `pe`, `text-start`). No physical `left` / `right` utilities.

## Routes

All routes stay under `src/app/[locale]/` and keep `generateStaticParams`, `setRequestLocale`, and `revalidate = 3600`.

| Route | Page |
|-------|------|
| `/` | Home |
| `/about` | About |
| `/services` | Services index |
| `/services/[slug]` | Existing service page, restyled |
| `/work` | Our Work |
| `/insights` | Insights |
| `/careers` | Careers |
| `/contact` | Contact |

`src/components/layout/navigation.ts` points at these paths. Homepage hash links (`/#about`, `/#services`, `/#impact`, `/#contact`) are removed from the header and footer. In-page anchors may remain inside a page for its own sections.

Sitemap entries gain the new paths for both locales. Each page gets its own canonical and Open Graph title through the existing `buildPageMetadata` helper.

## Pages

### Home

1. **Hero.** Full-bleed `hero.webp` with a navy wash and the existing animated lines. Current hero eyebrow, title, and subtitle. One word of the title is green. Primary button links to `/services`. Secondary button links to `/contact`.
2. **Service icon row.** All seven published services, icon plus title, each linking to `/services/[slug]`. They wrap onto extra lines on narrow screens.
3. **About teaser.** The short about introduction, `about.webp`, and a link to `/about`.
4. **Markets.** Egypt, Saudi Arabia, the United Arab Emirates, and Qatar, as named places. No counts.

The homepage no longer renders positioning, impact, capability, advantage, clients, principles, ESG, or the full service-card grid.

### About

Breadcrumb: Home / About. Headline and the existing about paragraphs. `about.webp` beside the opening text on wide screens, stacked on narrow screens.

Then, in this order, the current sections moved off the homepage:

- Positioning
- How we deliver impact
- Institutional capability
- Advantage
- Who we work with
- Principles
- ESG

### Services

Photograph band (`forum.webp`) and the existing services eyebrow, title, and subtitle. Below it, the seven Directus cards: title, summary, and “Learn more” to `/services/[slug]`.

Each service page keeps its current title, summary, description, and highlights from Directus. The page chrome matches the new system: green eyebrow, navy or photo band, and the same card style for “Other capabilities.”

### Our Work

Dark photo band (`forum.webp`) with a short introduction written from the existing events and delivery language. No project claims.

The gallery shows these five files, each assigned once:

| Photo | Filter group | Linked service |
|-------|----------------|----------------|
| `forum.webp` | Events and media production | `events-exhibitions` |
| `analytics.webp` | Digital and content | `digital-media-platforms` |
| `briefing.webp` | Public affairs | `public-affairs-government-relations` |
| `hero.webp` | Capital markets | `capital-markets-financial-communications` |
| `about.webp` | Partnerships | `public-relations-partnerships` |

Filters are All plus those five groups. A filter shows only its photo. The photo links to the service page. Captions are the service title already stored in Directus, not a new project name.

`media-production` and `media-content-management` do not get their own photo. They remain on the Services page only.

### Insights

Route `/insights`. Directus collection `insights` with translations (`title`, `summary`, `body`, `languages_code`) and `status` / `published_at` / `slug`. The seed creates the collection and public read, and inserts no rows.

When the locale has no published items, the page shows the heading and one sentence: articles will be added in Directus. When items exist, they render as a list of title, date, and summary. This pass does not add an insight detail route.

### Careers

Route `/careers`. Directus collection `careers` with translations (`title`, `summary`, `location`, `languages_code`) and `status`. The seed creates the collection and public read, and inserts no rows.

Empty state: one sentence that openings will be added in Directus. When items exist, each opening shows title, location, and summary. This pass does not add an application form or a detail route.

### Contact

The email `info@inventurecommunications.com`, the site `inventurecommunications.com`, and the four markets. No form, because the profile has no form endpoint.

The footer on every page keeps the brand, the existing tagline, the email, and links to About, Services, Our Work, Insights, Careers, and Contact.

## Content ownership

| Content | Source |
|---------|--------|
| Nav, hero, about, positioning, presence, impact, capability, advantage, clients, principles, page introductions, empty states, footer | `messages/en.json` and `messages/ar.json` |
| Service title, summary, description, highlights | Directus `services` |
| ESG title and summary | Directus `esg_commitments` |
| Insight items | Directus `insights` (empty until an editor adds them) |
| Career openings | Directus `careers` (empty until an editor adds them) |
| Our Work photos and filter ids | Code constant next to the work page. Visible caption comes from the linked service title. |

New message strings are added in both catalogs with the same key tree. Arabic strings are AI-drafted institutional Arabic and remain pending human review.

## CMS

`scripts/seed-directus.mjs` and `deploy/scripts/seed-directus.mjs` stay in sync. `scripts/seed-data.json` is copied to `deploy/scripts/seed-data.json` when the seed data changes. This pass does not add insight or career rows to the JSON.

The seed, on an existing database:

- Leaves the seven services and three ESG commitments in place.
- Creates `insights`, `insights_translations`, `careers`, and `careers_translations` if missing.
- Grants public read on those collections.
- Inserts nothing into them.

The website reads insights and careers with the same locale-scoped tagged fetch pattern as services (`insights:{locale}`, `careers:{locale}`). A bare revalidate tag `insights` or `careers` expands to both locales in `src/app/api/revalidate/route.ts`.

A missing or empty collection returns an empty list. The page renders the empty sentence. A Directus error on these optional collections does the same, matching the current optional-collection behavior.

## Components

| Unit | Responsibility |
|------|----------------|
| `Header` / `DesktopNav` / `MobileNav` | Render the seven routes. Services no longer opens a dropdown of all titles; the Services link goes to `/services`. |
| `HeroSection` | Home hero only. |
| `ServiceIconRow` | Home icon row from `fetchServices`. |
| `AboutTeaser` / `MarketList` | Home fragments. |
| `AboutPage` sections | Existing about, positioning, impact, capability, advantage, clients, principles, and ESG blocks, composed by the About route. |
| `ServiceGrid` | Used on `/services` only. |
| `WorkGallery` | Client leaf for the filter buttons and the five photos. |
| `InsightList` / `CareerList` | Render items or the empty sentence. |
| `Button` | Green primary and outline secondary. |

`ProfileSections.tsx` is split only as far as the About route needs named sections. Behavior and copy of those sections stay.

## Testing

- Message catalogs still share one key tree.
- `/en` and `/ar` render the hero, seven service links, and four market names.
- `/en/about` contains the ESG heading and does not require a new menu item.
- `/en/services` lists seven cards.
- `/en/work` shows five photos; selecting the capital-markets filter leaves `hero.webp` and hides the others.
- `/en/insights` and `/en/careers` show the empty sentence when Directus returns no rows.
- `/en/contact` shows the email.
- A page has no string matching invented counts such as `200+` or `10+`.
- Reduced-motion CSS still disables the hero line animation.

## Out of scope

- Search.
- Social profile links.
- A contact form.
- Insight or career detail pages.
- New photography, case-study writeups, or statistics.
- Removing the theme switch or the Arabic locale.
- Changing service slugs or the Directus service schema.
