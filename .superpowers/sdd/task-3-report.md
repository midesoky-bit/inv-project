# Task 3 Report: Short homepage

## Status

DONE

## Summary

The homepage now renders only the hero, a service icon row, an about teaser, and the market strip. The long profile (positioning, service grid, impact, capability, advantage, ESG, clients, principles) is no longer composed here. The hero photograph, navy wash, and animated SVG lines stay. The green phrase is “decision-makers” / “لصناع القرار”.

## TDD workflow

| Step | Action | Result |
|------|--------|--------|
| 1 | Added `src/app/[locale]/home-composition.test.ts` per brief | Created before any production edit |
| 2 | `npx vitest run src/app/[locale]/home-composition.test.ts` | FAIL — `ServiceIconRow` absent; page still composed `ServiceGrid` |
| 3 | Short home: rich hero title, `ServiceIconRow`, `AboutTeaser`, page body, catalog keys | Applied |
| 4 | `npx vitest run src/app/[locale]/home-composition.test.ts src/i18n/messages.parity.test.ts` | PASS (2 tests, 2 files) |
| 5 | Git commit | `33a88af` — feat: shorten the homepage to the reference intro |

## RED evidence

Command: `npx vitest run src/app/[locale]/home-composition.test.ts`

```
FAIL  src/app/[locale]/home-composition.test.ts > home composition > keeps the intro blocks and drops the long profile
AssertionError: expected 'import type { Metadata } from "next";…' to contain '<ServiceIconRow'

- Expected
+ Received

- <ServiceIconRow
+ import type { Metadata } from "next";
+ ...
+       <HeroSection />
+       <ScrollReveal>
+         <AboutSection />
+       </ScrollReveal>
+       ...
+         <ServiceGrid services={services} />
+       ...
+         <ImpactSection />
+       ...
+         <EsgSection commitments={esgCommitments} />

 Test Files  1 failed (1)
      Tests  1 failed (1)
   Start at  14:41:23
   Duration  129ms
```

Failure reason matches the brief: `ServiceIconRow` and `AboutTeaser` were absent, and `ServiceGrid` was still present.

## GREEN evidence

Command: `npx vitest run src/app/[locale]/home-composition.test.ts src/i18n/messages.parity.test.ts`

```
 Test Files  2 passed (2)
      Tests  2 passed (2)
   Start at  14:42:42
   Duration  155ms
```

Full suite after the change: `npx vitest run` — 8 files, 28 tests, all passed.

`npm run lint:direction`: `lint:direction OK — no physical direction utilities in src/`.

## Changes

### Homepage composition

`src/app/[locale]/page.tsx` fetches services only and renders:

```tsx
<div>
  <HeroSection />
  <ServiceIconRow services={services} />
  <AboutTeaser />
  <PresenceStrip />
</div>
```

Profile section imports, `ScrollReveal`, `ServiceGrid`, and `fetchEsgCommitments` are gone from this page. `generateStaticParams`, `revalidate = 3600`, and `setRequestLocale` stay. The about route was not created.

Document title and Open Graph title use `tHero.markup("title", { g: (chunks) => chunks })` so the `<g>` tags are not literal in metadata.

### Hero

`HeroSection` still uses `hero.webp`, the `#0B1D36` wash, and the three `inv-hero-line` paths. The title renders with:

```tsx
{t.rich("title", {
  g: (chunks) => <span className="text-accent">{chunks}</span>,
})}
```

English title: `Strategic communications for <g>decision-makers</g>`

Arabic title: `اتصالات استراتيجية <g>لصناع القرار</g>`

### Service icon row

`ServiceIconRow` takes `{ slug, title, icon? }[]` and links each item to `/services/${slug}`. Missing icons fall back to `•`. Classes match the brief. No new statistics.

### About teaser

Async server component. `getTranslations("about")` supplies `eyebrow`, `title`, and `paragraphs[0]`. Image is `/images/about.webp` with the existing `images.about` alt. Button `href="/about"` label is `t("readMore")`.

- English `about.readMore`: `Our story`
- Arabic `about.readMore`: `اقرأ قصتنا`

On a wide screen the text and photo sit in two columns. On a narrow screen they stack. New classes are logical (`px`, `py`, `gap`; no `left` / `right` / `ml` / `mr` / `pl` / `pr` / `text-left` / `text-right`).

### Wrapper

The `home-huly` class was on the old long-profile wrapper. The brief’s replacement body is a plain `div`, so that class is no longer on the homepage.

## Browser check

Dev server already on `http://localhost:3000`.

- `/en` title: `Inventure Communications — Strategic communications for decision-makers` (no raw `<g>`).
- Hero photo, navy wash, three SVG lines, and green “decision-makers” (`rgb(31, 169, 113)` in light mode) are present.
- Seven service links, from `/en/services/media-production` through `/en/services/capital-markets-financial-communications`.
- About teaser shows the first about paragraph, `Our story` → `/en/about`, and `about.webp`.
- Presence strip still names Egypt, Saudi Arabia, the United Arab Emirates, and Qatar.
- Page text has no `200+`, no impact heading, no ESG heading, and no positioning heading.
- At 1280px the about grid is `560px 560px` and the icon row is four columns. Narrow width stacks the teaser.
- `/en/services/media-production` still renders the existing service page.
- `/ar` title: `Inventure Communications — اتصالات استراتيجية لصناع القرار`. Heading, seven services, `اقرأ قصتنا`, the first Arabic paragraph, and the four markets are present.

## Test summary

```
RED:  npx vitest run src/app/[locale]/home-composition.test.ts
      → 1 failed (ServiceIconRow absent; ServiceGrid still present)
GREEN: npx vitest run src/app/[locale]/home-composition.test.ts src/i18n/messages.parity.test.ts
      → 2 passed (2 files)
FULL: npx vitest run → 28 passed (8 files)
```

## Commits

| SHA | Subject |
|-----|---------|
| `33a88af` | feat: shorten the homepage to the reference intro |

Not pushed.

## Concerns

- Hero primary button is still `href="/#services"`. `ServiceGrid` (the `id="services"` target) is no longer on the homepage, so that button no longer lands on a section. Secondary `href="/#contact"` still reaches the footer `id="contact"`. The design says those buttons should go to `/services` and `/contact`. The brief only changed the title render, so the hrefs were left as they were.
- The service detail page still links “All services” to `/#services`. That file was out of scope.
- `Our story` / `اقرأ قصتنا` point at `/about`. That route is intentionally not created in this task, so the button 404s until the about page exists.
- Directus `icon` values are words (`media`, `content`, `digital`, `pr`, `events`, `affairs`, `capital`). The row shows those words, as the brief’s `{service.icon ?? "•"}` specifies. No icon artwork was invented.
- `npx tsc --noEmit` still fails in `.next/types/validator.ts` on stale paths `src/app/page.js` and `src/app/services/[slug]/page.js`. None of the errors are in the files changed here.
- The long-running dev server’s compiled dark stylesheet still had `.dark { --accent: #6ba3c4 }` while `src/app/globals.css` on disk sets `--accent: #1fa971` for `.dark` as well. Light mode on that server computed `#1fa971`. Not changed in this task.

## Correctness fix

The homepage no longer has a `#services` section. In `src/components/home/HeroSection.tsx` only:

- Primary button `href` changed from `/#services` to `/services`.
- Secondary button `href` changed from `/#contact` to `/contact`.

Commit: `5992f08` — fix: point the hero buttons at the new pages

Command: `npx vitest run src/app/[locale]/home-composition.test.ts src/i18n/messages.parity.test.ts`

```
 RUN  v5.0.5 D:/Projects/inv-project

 Test Files  2 passed (2)
      Tests  2 passed (2)
   Start at  14:47:13
   Duration  128ms (import 45%, transform 30%, worker 13%, tests 11%, environment 1%)
```

The first concern above is resolved by this commit. The service-detail “All services” link to `/#services` is unchanged.
