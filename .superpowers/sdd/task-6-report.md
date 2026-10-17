# Task 6 Report: Our Work gallery

## Status

DONE

## Summary

`/work` is a locale route with a `forum.webp` hero and a five-photo gallery. Captions are the Directus service titles for the linked slugs. The title is `Our <g>work</g>` in English and `<g>أعمالنا</g>` in Arabic, rendered with `t.rich` and a `text-accent` span. Filters are All plus the five groups from the brief. Each photo links to `/services/${serviceSlug}`.

## TDD workflow

| Step | Action | Result |
|------|--------|--------|
| 1 | Added `src/components/work/work-items.test.ts` from the brief | Created before `work-items.ts` |
| 2 | `npx vitest run src/components/work/work-items.test.ts` | FAIL — module `@/components/work/work-items` does not exist |
| 3 | Added the catalog, `WorkGallery`, the `/work` page, and both `work` message objects | Applied |
| 4 | `npx vitest run src/components/work/work-items.test.ts src/i18n/messages.parity.test.ts` | PASS (3 tests) |
| 5 | Git commit | `aa55901` — feat: add the work gallery from existing photos |

## RED evidence

Command: `npx vitest run src/components/work/work-items.test.ts`

```
 FAIL  src/components/work/work-items.test.ts [ src/components/work/work-items.test.ts ]
Error: Cannot find package '@/components/work/work-items' imported from D:/Projects/inv-project/src/components/work/work-items.test.ts
 ❯ src/components/work/work-items.test.ts:2:1
      1| import { describe, expect, it } from "vitest";
      2| import { WORK_ITEMS, filterWork } from "@/components/work/work-items";
       | ^
      3|
      4| describe("work gallery", () => {

 Test Files  1 failed (1)
      Tests  no tests
   Start at  15:37:00
   Duration  125ms (worker 96%, environment 4%)
```

Failure reason matches the brief: the catalog module did not exist, so the suite failed before any assertion.

## GREEN evidence

Command after the catalog, gallery, page, and message catalogs existed: `npx vitest run src/components/work/work-items.test.ts src/i18n/messages.parity.test.ts`

```
 Test Files  2 passed (2)
      Tests  3 passed (3)
   Start at  15:38:49
   Duration  128ms (transform 63%, import 24%, worker 7%, tests 6%)
```

Command after the final gallery match (same suite, committed code):

```
 Test Files  2 passed (2)
      Tests  3 passed (3)
   Start at  15:43:52
   Duration  110ms (import 41%, transform 34%, worker 13%, tests 11%, environment 1%)
```

`npm run lint:direction`: `lint:direction OK — no physical direction utilities in src/`.

ESLint on `work-items.ts`, `work-items.test.ts`, `WorkGallery.tsx`, and `src/app/[locale]/work/page.tsx`: exit 0, no findings.

## Changes

### Catalog

`src/components/work/work-items.ts` exports `WorkItem`, `WORK_ITEMS`, and `filterWork`. The five photos, in order, are `forum.webp` (events / `events-exhibitions`), `analytics.webp` (digital / `digital-media-platforms`), `briefing.webp` (affairs / `public-affairs-government-relations`), `hero.webp` (capital / `capital-markets-financial-communications`), and `about.webp` (partnerships / `public-relations-partnerships`). `filterWork("all")` returns every item. Any other filter returns only that group.

### Messages

Both catalogs gained a `work` object:

- English: title `Our <g>work</g>`, intro `Photographs from the disciplines we deliver.`, filters All, Events and media production, Digital and content, Public affairs, Capital markets, Partnerships.
- Arabic: title `<g>أعمالنا</g>`, intro `صور من التخصصات التي نقدّمها.`, filters الكل, الفعاليات والإنتاج الإعلامي, الرقمي والمحتوى, الشؤون العامة, أسواق رأس المال, الشراكات.

### Page

`src/app/[locale]/work/page.tsx` follows the services index for `generateStaticParams`, `generateMetadata`, `setRequestLocale`, and `revalidate = 3600`. Metadata uses `t.markup` so the document title is plain text (`Our work` / `أعمالنا`). The description is the intro.

The page fetches `fetchServices(locale)` in parallel with the `work` and `images` translators. Captions are `slug -> title`. Labels come from `getTranslations("work")`. The hero is a separate `forum.webp` with alt `images.forum`. The `h1` is `t.rich("title")` with `<span className="text-accent">` for the `g` tag.

### Gallery

`WorkGallery` is a client component. It holds `useState<"all" | WorkItem["filter"]>("all")`. Buttons call `setFilter` and expose `aria-pressed`. The grid starts from `filterWork(filter)` and keeps the items the page passed, matched by `src`, `filter`, and `serviceSlug`. That match is by value because the server serializes props; object identity would drop every photo. Each item is a `Link` to `/services/${item.serviceSlug}` wrapping `Image`, with `alt={captions[item.serviceSlug] ?? ""}` and the same string as the visible caption.

## Browser check

- `/en/work`: document title `Our work | Inventure Communications`. One `h1`, "Our work", with "work" in `rgb(31, 169, 113)`. Intro is the English sentence. Hero image alt is "Audience at an institutional forum" and its src is `/images/forum.webp`. Five gallery links, in order, use the service titles Events & Exhibitions, Digital Media & Platforms, Public Affairs & Government Relations, Capital Markets & Financial Communications, and Public Relations & Strategic Partnerships. Their hrefs are the five slugs above. `dir` is `ltr`.
- Capital markets filter leaves one link, Capital Markets & Financial Communications, and that link opens `/en/services/capital-markets-financial-communications` with that service as the `h1`.
- `/ar/work`: document title `أعمالنا | Inventure Communications`. The whole title is the accent span, same green. `dir` is `rtl`, `lang` is `ar`. Hero alt is `جمهور في منتدى مؤسسي`. Filters and captions are the Arabic strings. The partnerships filter leaves `العلاقات العامة والشراكات الاستراتيجية`.
- At 1440px the gallery images sit in three columns (about 373px each). At 390px they stack in one column (342px) with captions underneath. No extra photos.

## Commit

`aa559018dc53fd28c002d5eef000665916b384da`

`feat: add the work gallery from existing photos`

Files:

- `src/components/work/work-items.ts`
- `src/components/work/work-items.test.ts`
- `src/components/work/WorkGallery.tsx`
- `src/app/[locale]/work/page.tsx`
- `messages/en.json`
- `messages/ar.json`

Not pushed. Not an amend.

## Concerns

The dev server logged that `/images/forum.webp` was the LCP image and was lazy. The hero copy uses `priority`. The gallery copy is the same file and is lazy, and on a short viewport it can sit below the hero. The brief asks for both uses of that photo.

`npx tsc --noEmit` still reports missing modules in `.next/types/validator.ts` for `src/app/page.js` and `src/app/services/[slug]/page.js`. Those paths are not part of this task, and the new work files were not in that error list.
