# Final review fixes

## Status

DONE

## What changed

- Homepage service marks are 24px stroke SVGs chosen by `service.icon` (`media`, `content`, `digital`, `pr`, `events`, `affairs`, `capital`). Unknown keys render a dot. Titles and links stay.
- Directus insight and career queries send `filter[status][_eq]=published`. Insights sort by `-published_at`.
- The header language switcher is `hidden xl:block`. Header no longer fetches services, and `DesktopNav` and `MobileNav` no longer take a services prop.
- The accent test looks up a newline plus `.dark {`, so it does not match `@custom-variant`. `.dark` now also sets `--inv-accent: #1fa971`, which the old lookup was reading from `:root`.
- `/insights` and `/careers` metadata use `insights.description` and `careers.description`. The on-page empty sentences are unchanged.

## Commands

`npx vitest run src/app/globals.accent.test.ts src/lib/cms/listings.test.ts src/services/cms.test.ts src/i18n/messages.parity.test.ts src/components/layout/navigation.test.ts`

```
 RUN  v5.0.5 D:/Projects/inv-project

 Test Files  5 passed (5)
      Tests  17 passed (17)
   Start at  16:17:44
   Duration  179ms (transform 54%, import 30%, tests 8%, worker 8%)
```

`npm run lint:direction`

```
> inv-project@0.1.0 lint:direction
> node scripts/lint-direction.mjs

lint:direction OK — no physical direction utilities in src/
```
