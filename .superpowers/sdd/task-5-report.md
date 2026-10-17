# Task 5 Report: Services index

## Status

DONE

## Summary

`/services` is a locale route that loads Directus services and renders them with `ServiceGrid`. A full-width `forum.webp` band carries the services eyebrow, title, and subtitle. The title is `Core <g>offerings</g>` in English and `الخدمات <g>الأساسية</g>` in Arabic, rendered with `t.rich` and a `text-accent` span. Service detail pages link back to `/services`, and their eyebrow is green.

## TDD workflow

| Step | Action | Result |
|------|--------|--------|
| 1 | Added `src/app/[locale]/services/page.test.ts` from the brief | Created before `page.tsx` |
| 2 | `npx vitest run src/app/[locale]/services/page.test.ts` | FAIL — `page.tsx` does not exist (`ENOENT`) |
| 3 | Added the route, titles, rich heading, and detail-page link | Applied |
| 4 | `npx vitest run src/app/[locale]/services/page.test.ts` | PASS (1 test) |
| 5 | Git commit | `70ddf0f` — feat: add a services index in the reference layout |

## RED evidence

Command: `npx vitest run src/app/[locale]/services/page.test.ts`

```
 FAIL  src/app/[locale]/services/page.test.ts [ src/app/[locale]/services/page.test.ts ]
Error: ENOENT: no such file or directory, open 'D:\Projects\inv-project\src\app\[locale]\services\page.tsx'
 ❯ src/app/[locale]/services/page.test.ts:4:14
      2| import { describe, expect, it } from "vitest";
      3|
      4| const page = readFileSync("src/app/[locale]/services/page.tsx", "utf8"…
       |              ^
      5|
      6| describe("services index", () => {

 Test Files  1 failed (1)
      Tests  no tests
   Start at  15:13:25
   Duration  123ms (worker 96%, environment 4%)
```

Failure reason matches the brief: the services index file did not exist, so the suite failed before any assertion.

## GREEN evidence

Command after the route existed: `npx vitest run src/app/[locale]/services/page.test.ts`

```
 Test Files  1 passed (1)
      Tests  1 passed (1)
   Start at  15:21:51
   Duration  117ms (import 46%, transform 27%, worker 17%, tests 10%, environment 1%)
```

Command after the final layout: `npx vitest run src/app/[locale]/services/page.test.ts`

```
 Test Files  1 passed (1)
      Tests  1 passed (1)
   Start at  15:28:59
   Duration  109ms (import 46%, transform 27%, worker 16%, tests 10%, environment 1%)
```

`npm run lint:direction`: `lint:direction OK — no physical direction utilities in src/`.

ESLint on the services page, its test, the slug page, and `ServiceGrid`: exit 0, no findings.

## Changes

### Route

`src/app/[locale]/services/page.tsx` follows the homepage for `generateStaticParams`, `generateMetadata`, `setRequestLocale`, and `revalidate = 3600`. Metadata uses `services.title` and `services.subtitle`. The title passes through `t.markup` so the document title is plain text (`Core offerings` / `الخدمات الأساسية`) rather than the raw `<g>` tags.

The page fetches `fetchServices(locale)` and image messages together. The band image is `src="/images/forum.webp"`. Alt text is `images.forum` when that key exists, otherwise `images.hero`. Both catalogs have `images.forum`, so the rendered English alt is "Audience at an institutional forum".

Under the photograph, the page renders `<ServiceGrid services={services} />`.

### Heading

`ServicesHeading` in `src/components/home/ServiceGrid.tsx` is the services heading. It renders `t("eyebrow")`, `t.rich("title")` with `<span className="text-accent">`, and `t("subtitle")`. The index renders that component once, as the `h1` on the photograph. The card grid does not render a second copy of the same title.

Titles:

- `messages/en.json`: `Core <g>offerings</g>`
- `messages/ar.json`: `الخدمات <g>الأساسية</g>`

### Service detail

`src/app/[locale]/services/[slug]/page.tsx`:

- The `h1` is still only `service.title`, and its class still includes `text-balance`.
- A green eyebrow using `t("eyebrow")` sits above the title. The existing `index — label` eyebrow also uses `text-accent`.
- "All services" points at `/services` instead of `/#services`.
- Service slugs and Directus fields are unchanged.

## Browser check

- `/en/services`: document title `Core offerings | Inventure Communications`. One `h1`, "Core offerings", with "offerings" in `rgb(31, 169, 113)` (`#1FA971`). Seven Directus cards. Image alt is the forum string.
- `/ar/services`: document title `الخدمات الأساسية | Inventure Communications`. One `h1`. The accented word is `الأساسية`, same green. Seven cards. `dir` is `rtl`.
- `/en/services/media-production`: `h1` is the Directus title "Media Production". Eyebrows "Capabilities" and "01 — Service" are both green. "All services" href is `/en/services`.

## Commit

`70ddf0f0429e0eab15f097938e90a91c265e3fc2`

`feat: add a services index in the reference layout`

Files:

- `src/app/[locale]/services/page.tsx`
- `src/app/[locale]/services/page.test.ts`
- `src/app/[locale]/services/[slug]/page.tsx`
- `src/components/home/ServiceGrid.tsx`
- `messages/en.json`
- `messages/ar.json`

Not pushed. Not an amend.

## Concerns

The card grid does not repeat the eyebrow, title, and subtitle. Those render once, on the photograph, through `ServicesHeading`. Repeating them inside `ServiceGrid` showed the same title twice on `/services`.
