# Task 7 Report: Insights and careers collections

## Status

DONE

## Summary

`/insights` and `/careers` are locale routes that read empty Directus collections. A missing or empty list renders the brief's empty sentence. When rows exist, insights show title, `publishedAt`, and summary; careers show title, location, and summary. Titles use `t.rich` with a `text-accent` span named `g`. No sample insights or jobs were inserted.

## TDD workflow

| Step | Action | Result |
|------|--------|--------|
| 1 | Added `src/lib/cms/listings.test.ts` and the bare `careers` case in `route.test.ts` from the brief | Created before the mappers and tag existed |
| 2 | `npx vitest run src/lib/cms/listings.test.ts src/app/api/revalidate/route.test.ts` | FAIL — mappers missing, `careers` rejected with 400 |
| 3 | Mapped, fetched, seeded, and rendered both pages | Applied |
| 4 | `npx vitest run src/lib/cms/listings.test.ts src/app/api/revalidate/route.test.ts src/services/cms.test.ts src/i18n/messages.parity.test.ts` | PASS (22 tests) |
| 5 | Git commit | `4259a13` — feat: add empty insight and career listings |

## RED evidence

Command, before any production change for this task: `npx vitest run src/lib/cms/listings.test.ts src/app/api/revalidate/route.test.ts`

```
 RUN  v5.0.5 D:/Projects/inv-project

 ❯ src/lib/cms/listings.test.ts (2 tests | 2 failed) 3ms
   ❯ listing mappers (2)
     × maps an insight translation 2ms
     × maps a career translation 0ms
 ❯ src/app/api/revalidate/route.test.ts (7 tests | 1 failed) 12ms
   ❯ POST /api/revalidate (7)
     × expands a bare careers tag 3ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 3 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/lib/cms/listings.test.ts > listing mappers > maps an insight translation
TypeError: mapDirectusInsight is not a function
 ❯ src/lib/cms/listings.test.ts:7:7
      5|   it("maps an insight translation", () => {
      6|     expect(
      7|       mapDirectusInsight({
       |       ^
      8|         id: 4,
      9|         slug: "note",

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/3]⎯

 FAIL  src/lib/cms/listings.test.ts > listing mappers > maps a career translation
TypeError: mapDirectusCareer is not a function
 ❯ src/lib/cms/listings.test.ts:24:7
     22|   it("maps a career translation", () => {
     23|     expect(
     24|       mapDirectusCareer({
       |       ^
     25|         id: 2,
     26|         translations: [{ title: "Advisor", summary: "Counsel", locatio…

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/3]⎯

 FAIL  src/app/api/revalidate/route.test.ts > POST /api/revalidate > expands a bare careers tag
AssertionError: expected 400 to be 200 // Object.is equality

- Expected
+ Received

- 200
+ 400

 ❯ src/app/api/revalidate/route.test.ts:64:24
     62|   it("expands a bare careers tag", async () => {
     63|     const res = await POST(request({ tags: ["careers"] }, "test-secret…
     64|     expect(res.status).toBe(200);
       |                        ^
     65|     expect(await res.json()).toEqual({
     66|       revalidated: ["careers:en", "careers:ar"],

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/3]⎯


 Test Files  2 failed (2)
      Tests  3 failed | 6 passed (9)
   Start at  15:49:54
   Duration  176ms (import 42%, transform 42%, tests 12%, worker 4%)
```

Failure reason matches the brief: `mapDirectusInsight` and `mapDirectusCareer` were not functions, and a bare `careers` tag was unknown (400).

## GREEN evidence

Command after the mappers, fetchers, pages, messages, and seed scripts existed: `npx vitest run src/lib/cms/listings.test.ts src/app/api/revalidate/route.test.ts src/services/cms.test.ts src/i18n/messages.parity.test.ts`

```
 RUN  v5.0.5 D:/Projects/inv-project


 Test Files  4 passed (4)
      Tests  22 passed (22)
   Start at  15:51:34
   Duration  178ms (transform 52%, import 34%, tests 8%, worker 5%)
```

ESLint on the touched TypeScript files: exit 0, no findings.

`npm run lint:direction`: `lint:direction OK — no physical direction utilities in src/`.

## Changes

### Types and mappers

`Career` is `{ id, title, summary, location }` on `src/types/cms.ts`.

`mapDirectusInsight` and `mapDirectusCareer` sit beside `mapDirectusEsg` and use `firstTranslation`. Missing title, summary, and location become `""`. Missing `published_at` becomes `""`. The insight fixture maps `id: 4` to `"4"`, slug `note`, title `Note`, summary `Short`, publishedAt `2026-10-17`. The career fixture maps `id: 2` to `"2"`, title `Advisor`, summary `Counsel`, location `Cairo`.

### Fetch

`directusFetchInsights` calls `emptyIfMissing` for `/items/insights` with fields `id,slug,published_at,translations.title,translations.summary`, deep filter `languages_code` equals the locale, and tags `["insights", "insights:${locale}"]`, then maps rows.

`directusFetchCareers` does the same for `/items/careers` with fields `id,translations.title,translations.summary,translations.location` and tags `["careers", "careers:${locale}"]`.

`fetchInsights` keeps its signature. `fetchCareers(locale = "en")` switches on `getCmsProvider()` the same way. Mock and Supabase `fetchCareers` return `[]`.

`careers` is in `BARE_TAGS` and in the locale-scoped regex, so a bare tag expands to `careers:en` and `careers:ar`.

### Seed

After the ESG public-read loop, both seed scripts create `insights` and `careers` if missing. Each parent has required unique `slug` and `status` defaulting to `published`. Insights also has nullable `published_at`. Translation collections have `title`, `summary`, `languages_code`, and the parent id. Insights translations also have `body`. Careers translations also have `location`. Each parent gets a `translations` alias and the same two relations services uses, plus `ensureLanguageLink` and `ensureTranslationsInterface`. Public read is granted. No items are inserted. `seed-data.json` was not changed. `deploy/scripts/seed-directus.mjs` is a byte-identical copy of `scripts/seed-directus.mjs`.

`node scripts/seed-directus.mjs` against the local Directus finished with `Seeded 7 services and 3 ESG commitments at http://localhost:8055`. Public `GET /items/insights` and `GET /items/careers` both returned zero rows.

### Messages

English insights title is `<g>Insights</g>` and empty is `Articles will be added in Directus.` English careers title is `<g>Careers</g>` and empty is `Openings will be added in Directus.`

Arabic insights title is `<g>الرؤى</g>` and empty is `ستُضاف المقالات في Directus.` Arabic careers title is `<g>الوظائف</g>` and empty is `ستُضاف الوظائف في Directus.`

The previous `insights.comingSoon` key remains in both catalogs.

### Pages

Both pages keep `generateStaticParams`, `setRequestLocale`, and `export const revalidate = 3600`. Metadata uses `t.markup` so the document title is plain text. The visible `h1` is `t.rich("title")` with `<span className="text-accent">` for `g`. Fetch and translations run in `Promise.all`. `length === 0` renders `t("empty")`. Otherwise the list shows title and summary, plus `publishedAt` on insights and `location` on careers. Layout classes are logical (`px`, `pt`, `pb`, `max-w`). No breadcrumb was added.

## Browser check

- `/en/insights`: document title `Insights | Inventure Communications`. Heading text `Insights`, span class `text-accent`, color `rgb(31, 169, 113)`. Empty sentence `Articles will be added in Directus.`
- Menu link to Careers opened `/en/careers`. Document title `Careers | Inventure Communications`. Empty sentence `Openings will be added in Directus.`
- `/ar/insights`: document title `الرؤى | Inventure Communications`. Empty sentence `ستُضاف المقالات في Directus.`
- `/ar/careers`: document title `الوظائف | Inventure Communications`. Heading `الوظائف` with the same accent green. `dir` is `rtl`, `lang` is `ar`. Empty sentence `ستُضاف الوظائف في Directus.` No list items.
- `/en/services` still lists the seven service cards, so the CMS switch for services is intact.

## Commit

`4259a1321ac200f905281d6de2e32de1f4cf0e99`

`feat: add empty insight and career listings`

Files:

- `src/types/cms.ts`
- `src/lib/cms/directus-map.ts`
- `src/lib/cms/providers/directus.ts`
- `src/lib/cms/providers/mock.ts`
- `src/lib/cms/providers/supabase.ts`
- `src/services/cms.ts`
- `src/app/api/revalidate/route.ts`
- `src/app/api/revalidate/route.test.ts`
- `src/lib/cms/listings.test.ts`
- `src/app/[locale]/insights/page.tsx`
- `src/app/[locale]/careers/page.tsx`
- `scripts/seed-directus.mjs`
- `deploy/scripts/seed-directus.mjs`
- `messages/en.json`
- `messages/ar.json`

Not pushed. Not an amend.

## Concerns

The populated list was not rendered in the browser. The collections stay empty, by design, so only the empty sentence was visible. The mapper tests cover the item shape.

`npx tsc --noEmit` still reports missing modules in `.next/types/validator.ts` for `src/app/page.js` and `src/app/services/[slug]/page.js`. Those paths are not part of this task, and the new files were not in that error list.
