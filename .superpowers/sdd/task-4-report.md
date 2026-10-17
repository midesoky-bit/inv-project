# Task 4 Report: About page

## Status

DONE

## Summary

`/about` now hosts the profile sections that left the homepage: About, Positioning, Impact, Capability, Advantage, Clients, Principles, and ESG. Each block sits in `ScrollReveal`, matching the previous homepage wrapping. ESG is rendered on this page and is not a `NAV_LINKS` entry. The about title is `An integrated <g>communications</g> platform` / `منصة متكاملة <g>للاتصال</g>`, and `AboutSection` renders that title with `t.rich` and a `text-accent` span.

## TDD workflow

| Step | Action | Result |
|------|--------|--------|
| 1 | Added `src/app/[locale]/about/page.test.ts` from the brief | Created before `page.tsx` |
| 2 | `npx vitest run src/app/[locale]/about/page.test.ts` | FAIL — `page.tsx` does not exist (`ENOENT`) |
| 3 | Added the route, switched the about titles, rendered the heading with `t.rich` | Applied |
| 4 | `npx vitest run src/app/[locale]/about/page.test.ts` | PASS (1 test) |
| 5 | Git commit | `f214693` — feat: move the profile sections onto the about page |

## RED evidence

Command: `npx vitest run src/app/[locale]/about/page.test.ts`

```
 FAIL  src/app/[locale]/about/page.test.ts [ src/app/[locale]/about/page.test.ts ]
Error: ENOENT: no such file or directory, open 'D:\Projects\inv-project\src\app\[locale]\about\page.tsx'
 ❯ src/app/[locale]/about/page.test.ts:5:14
      3| import { NAV_LINKS } from "@/components/layout/navigation";
      4|
      5| const page = readFileSync("src/app/[locale]/about/page.tsx", "utf8");
       |              ^
      6|
      7| describe("about page", () => {

 Test Files  1 failed (1)
      Tests  no tests
   Start at  14:53:32
   Duration  134ms (worker 96%, environment 4%)
```

Failure reason matches the brief: the about route file did not exist, so the suite failed before any assertion.

## GREEN evidence

Command after the route existed: `npx vitest run src/app/[locale]/about/page.test.ts`

```
 Test Files  1 passed (1)
      Tests  1 passed (1)
   Start at  14:55:06
   Duration  173ms (transform 54%, import 30%, worker 9%, tests 6%)
```

Command after the catalog change: `npx vitest run src/app/[locale]/about/page.test.ts src/i18n/messages.parity.test.ts`

```
 Test Files  2 passed (2)
      Tests  2 passed (2)
   Start at  15:01:01
   Duration  128ms
```

Full suite: `npx vitest run` — 9 files, 29 tests, all passed (start 15:01:46, duration 201ms).

`npm run lint:direction`: `lint:direction OK — no physical direction utilities in src/`.

## Changes

### Route

`src/app/[locale]/about/page.tsx` follows the homepage for `generateStaticParams`, `generateMetadata`, and `setRequestLocale`. `revalidate` is 3600. Metadata title is the about title with the `<g>` tag stripped via `t.markup`, so the document title is plain text. Description is the first existing about paragraph. `fetchEsgCommitments(locale)` supplies commitments.

Render order, each inside `ScrollReveal` (Positioning keeps `delay={0.05}`, as the old homepage did):

1. `AboutSection`
2. `PositioningSection`
3. `ImpactSection`
4. `CapabilitySection`
5. `AdvantageSection`
6. `ClientsSection`
7. `PrinciplesSection`
8. `EsgSection commitments={esgCommitments}`

### Title

- English `about.title`: `An integrated <g>communications</g> platform`
- Arabic `about.title`: `منصة متكاملة <g>للاتصال</g>`

`AboutSection` renders the heading with:

```tsx
t.rich("title", {
  g: (chunks) => <span className="text-accent">{chunks}</span>,
})
```

`AboutTeaser` uses the same `t.rich` call. It shares `about.title`, so leaving `t("title")` would print the raw tag on the homepage.

ESG was not added to `NAV_LINKS`. No new statistics were added. New layout classes are logical utilities already used by the sections (`max-w-2xl`, `text-accent`, `text-balance`).

## Browser check

- `http://localhost:3000/en/about` — document title `An integrated communications platform | Inventure Communications`. Heading HTML: `An integrated <span class="text-accent">communications</span> platform`. Sections through Sustainability & ESG are present. No link text or href contains ESG. Mobile menu items: Home, About, Services, Our Work, Insights, Careers, Contact.
- `http://localhost:3000/ar/about` — `dir="rtl"`, `lang="ar"`. Document title `منصة متكاملة للاتصال | Inventure Communications`. Heading HTML: `منصة متكاملة <span class="text-accent">للاتصال</span>`. Opened menu has no ESG item.
- Homepage teaser heading HTML includes `An integrated <span class="text-accent">communications</span> platform`.

## Commit

`f2146939d99c9eac26261f06a41512cfa202978c`

`feat: move the profile sections onto the about page`

Files: `src/app/[locale]/about/page.tsx`, `src/app/[locale]/about/page.test.ts`, `src/components/home/ProfileSections.tsx`, `src/components/home/AboutTeaser.tsx`, `messages/en.json`, `messages/ar.json`.

Not pushed.

## Concerns

- The brief’s comparison `item.messageKey === "esg"` is a TypeScript `TS2367` error because `messageKey` cannot be `"esg"`. The test casts `messageKey` to `string` so `tsc` accepts the check. The assertion is still that no nav item uses the key `esg`.
- The design spec mentions a Home / About breadcrumb. This task brief does not, so no breadcrumb was added.
- The brief’s `git add` lists only the route and its test. The title strings and `t.rich` live in the message catalogs, `ProfileSections.tsx`, and `AboutTeaser.tsx`, so those files are in the same commit.
- Metadata uses `t.markup` so the `<g>` tag is not stored in the document title. The locale layout template still appends ` | Inventure Communications`.
- `npx tsc --noEmit` still reports pre-existing errors in `.next/types/validator.ts` for missing `src/app/page.js` and `src/app/services/[slug]/page.js`. Those are outside this task.

## Follow-up: About breadcrumb

The approved design requires a Home / About breadcrumb. The task brief omitted it. Added at the top of `src/app/[locale]/about/page.tsx` only. `getTranslations("nav")` supplies Home and About. Home uses the next-intl `Link` to `/`. About is the current page. Classes are the requested logical set (`px-6` is in the approved example; no `left`/`right`/`ml`/`mr`/`pl`/`pr`).

Rendered English markup:

```html
<nav aria-label="Primary"><ol class="mx-auto flex max-w-6xl items-center gap-2 px-6 pt-28 text-sm text-muted"><li><a class="hover:text-foreground" href="/en">Home</a></li><li aria-hidden="true">/</li><li class="text-foreground">About</li></ol></nav>
```

### Test output

Command: `npx vitest run src/app/[locale]/about/page.test.ts`

```
 Test Files  1 passed (1)
      Tests  1 passed (1)
   Start at  15:02:51
   Duration  109ms (import 43%, transform 33%, worker 13%, tests 9%, environment 1%)
```

### Commit

`975e39fa6c731dea0fbc81a63e38c5ca14ed1ae1`

`fix: add the about breadcrumb`

File: `src/app/[locale]/about/page.tsx`. Not pushed. Not an amend.

## Follow-up: breadcrumb landmark name

The breadcrumb `nav` used `nav.primary` ("Primary"), the same label as the header. It now uses `nav.breadcrumb`. The About item is marked `aria-current="page"`. Section order and `NAV_LINKS` are unchanged.

- `messages/en.json`: `"breadcrumb": "Breadcrumb"`
- `messages/ar.json`: `"breadcrumb": "مسار التنقل"`

Rendered English markup:

```html
<nav aria-label="Breadcrumb"><ol class="mx-auto flex max-w-6xl items-center gap-2 px-6 pt-28 text-sm text-muted"><li><a class="hover:text-foreground" href="/en">Home</a></li><li aria-hidden="true">/</li><li class="text-foreground" aria-current="page">About</li></ol></nav>
```

### Test output

Command: `npx vitest run src/app/[locale]/about/page.test.ts src/i18n/messages.parity.test.ts`

```
 Test Files  2 passed (2)
      Tests  2 passed (2)
   Start at  15:07:25
   Duration  132ms (transform 49%, import 32%, worker 11%, tests 7%, environment 1%)
```

### Commit

`491d8e443aafe3412479507ee94ccff65e364ea3`

`fix: name the about breadcrumb landmark`

Files: `messages/en.json`, `messages/ar.json`, `src/app/[locale]/about/page.tsx`. Not pushed. Not an amend.
