# Task 2 Report: Seven-item navigation

## Status

DONE

## Summary

Replaced hash navigation with seven page routes (home, about, services, work, insights, careers, contact) in English and Arabic. Desktop and mobile menus render only those links. The services dropdown and the mobile nested service list are gone. `DesktopNav` and `MobileNav` still accept `services` so `Header` did not need a signature change.

## TDD workflow

| Step | Action | Result |
|------|--------|--------|
| 1 | Added `src/components/layout/navigation.test.ts` per brief | Created before any production edit |
| 2 | `npx vitest run src/components/layout/navigation.test.ts` | FAIL — hash links; `home`, `work`, and `careers` absent |
| 3 | Replaced `NAV_LINKS`, both menus, and `nav` catalog keys | Applied |
| 4 | `npx vitest run src/components/layout/navigation.test.ts src/i18n/messages.parity.test.ts` | PASS (2 tests, 2 files) |
| 5 | Git commit | `9a46a2f` — feat: point the menu at the reference pages |

## RED evidence

Command: `npx vitest run src/components/layout/navigation.test.ts`

```
FAIL  src/components/layout/navigation.test.ts > NAV_LINKS > lists the seven reference routes
AssertionError: expected [ [ '/#about', 'about' ], …(3) ] to deeply equal [ [ '/', 'home' ], …(6) ]

- Expected
+ Received

  [
    [
-     "/",
-     "home",
-   ],
-   [
-     "/about",
+     "/#about",
      "about",
    ],
    [
-     "/services",
+     "/#services",
      "services",
    ],
    [
-     "/work",
-     "work",
+     "/#impact",
+     "approach",
    ],
    [
-     "/insights",
-     "insights",
-   ],
-   [
-     "/careers",
-     "careers",
-   ],
-   [
-     "/contact",
+     "/#contact",
      "contact",
    ],
  ]

 Test Files  1 failed (1)
      Tests  1 failed (1)
```

Failure reason matches the brief: current links were hash links, and `home`, `work`, and `careers` were absent.

## GREEN evidence

Command: `npx vitest run src/components/layout/navigation.test.ts src/i18n/messages.parity.test.ts`

```
 Test Files  2 passed (2)
      Tests  2 passed (2)
```

Also clean: `npx eslint` on the nav files (no warnings), `npm run lint:direction` (`lint:direction OK — no physical direction utilities in src/`).

## Changes

### `src/components/layout/navigation.ts`

`NAV_LINKS` is now, in order:

| href | messageKey |
|------|------------|
| `/` | `home` |
| `/about` | `about` |
| `/services` | `services` |
| `/work` | `work` |
| `/insights` | `insights` |
| `/careers` | `careers` |
| `/contact` | `contact` |

`detailKey` was removed. `NavMessageKey` remains derived from this list.

### Menus

- `DesktopNav`: one `SectionLink` per item (`href={item.href}`, label `{t(item.messageKey)}`). Open state, services submenu, and the `Link` import are gone.
- `MobileNav`: nested service list under Services is gone. The same `NAV_LINKS` render through `SectionLink`. Panel, escape-to-close, and language switcher stay.
- Both components still take `services`. `void services` keeps the prop for `Header` without an unused-var warning (same pattern as `src/lib/cms/providers/mock.ts`).
- `Header` was not edited. No search or social icons were added. New classes use logical utilities only.

### Messages

- `messages/en.json` `nav`: `"home": "Home"`, `"work": "Our Work"`, `"careers": "Careers"`.
- `messages/ar.json` `nav`: `"home": "الرئيسية"`, `"work": "أعمالنا"`, `"careers": "الوظائف"`.

## Self-review

- Scope of the commit is the six files named in the brief. Header, footer source, and unrelated working-tree files were not included.
- Link order, hrefs, and message keys match the brief verbatim.
- Desktop English menu (1280px): Home, About, Services, Our Work, Insights, Careers, Contact → `/en`, `/en/about`, `/en/services`, `/en/work`, `/en/insights`, `/en/careers`, `/en/contact`. No nested submenu.
- Mobile English menu (390px): the same seven links, zero nested lists, language switcher still present.
- Desktop Arabic menu: الرئيسية، من نحن، الخدمات، أعمالنا، رؤى، الوظائف، تواصل → `/ar` and the matching `/ar/...` paths. No nested submenu.
- `services` remains on both nav prop types, so `Header`'s existing calls still typecheck.

## Test summary

```
RED:  npx vitest run src/components/layout/navigation.test.ts
      → 1 failed (hash links; home/work/careers missing)
GREEN: npx vitest run src/components/layout/navigation.test.ts src/i18n/messages.parity.test.ts
      → 2 passed (2 files)
```

## Commits

| SHA | Subject |
|-----|---------|
| `9a46a2f` | feat: point the menu at the reference pages |

Not pushed.

## Concerns

- `Footer` reads `NAV_LINKS` and still filters out `contact`. It now lists Home, About, Services, Our Work, Insights, and Careers as page routes instead of the old hash links (including Approach). Footer source was not edited; this is the shared constant. Confirm that is intended before a later footer task.
- The new hrefs are linked now. Those pages are not part of this task, so `/about`, `/work`, `/insights`, `/careers`, and `/contact` can 404 until the page tasks land. `/services` already exists under the locale.
- `npx tsc --noEmit` reports existing errors in `.next/types/validator.ts` (`src/app/page.js` and `src/app/services/[slug]/page.js` missing). None of the errors are in the nav files. Not fixed here.

## Review fix

The seven-link row overflowed the fixed `h-16` bar from `md` (768px) until about 1100px, because `DesktopNav` used `hidden md:block` while the hamburger used `md:hidden`.

Moved the desktop/mobile switch together from `md` to `xl` in `DesktopNav.tsx` (`hidden xl:block`) and `MobileNav.tsx` (hamburger and panel `xl:hidden`). Routes, copy, and the `services` prop were not changed. `Header` was not edited.

Commit: `9e4db29` — fix: show the full menu only when the row fits

Command:

```
npx vitest run src/components/layout/navigation.test.ts src/i18n/messages.parity.test.ts
```

Output:

```
 RUN  v5.0.5 D:/Projects/inv-project

 Test Files  2 passed (2)
      Tests  2 passed (2)
   Start at  14:32:44
   Duration  111ms (import 38%, transform 38%, worker 12%, tests 11%, environment 1%)
```
