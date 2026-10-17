# Task 1 Report: Green accent and buttons

## Status

DONE

## Summary

Switched default light and dark accent tokens to green (`#1fa971`) with white accent foreground, added a Vitest guard for those tokens (and unchanged desert theme), and updated `Button` primary/ghost variants to pill styling with accent and border-current respectively.

## TDD workflow

| Step | Action | Result |
|------|--------|--------|
| 1 | Added `src/app/globals.accent.test.ts` per brief | Created |
| 2 | `npx vitest run src/app/globals.accent.test.ts` | FAIL (expected: `--accent: #3a6b8c` in `:root`) |
| 3 | Updated `globals.css` tokens and `Button.tsx` variants | Applied |
| 4 | Re-ran Vitest | PASS (1 test) |
| 5 | Git commit | `f451b0b` — feat: switch the accent to green pills |

## Changes

### `src/app/globals.css`

In `:root`:

- `--inv-accent`, `--accent`, `--ring` → `#1fa971`
- `--accent-foreground` → `#ffffff` (unchanged value, reaffirmed)

In `.dark`:

- `--accent`, `--ring` → `#1fa971` (from `#6ba3c4`)
- `--accent-foreground` → `#ffffff` (from `#0a1628`)

Left unchanged:

- `[data-theme="desert"]` (`--accent: #8b6914`, etc.)
- `.dark[data-theme="desert"]`

### `src/components/ui/Button.tsx`

- **primary:** `rounded-full bg-accent text-accent-foreground hover:bg-accent/90` (was brand navy)
- **ghost:** `rounded-full border border-current bg-transparent text-foreground` (was underline hover)

Shared focus and layout classes unchanged.

### `src/app/globals.accent.test.ts`

New file; asserts green tokens in `:root` and `.dark` blocks and desert accent remains `#8b6914`.

## Self-review

- **Scope:** Only the three files named in the brief were modified and committed.
- **Requirements:** Token values match the brief verbatim (lowercase hex in CSS). Button class strings match the brief.
- **Desert theme:** Not touched; test confirms `[data-theme="desert"]` still uses `#8b6914`.
- **Regression risk:** Any UI using `bg-accent` / `text-accent-foreground` in default themes now reads green; desert override still applies when `data-theme="desert"` is set.
- **Ghost button UX:** Underline-on-hover removed in favor of bordered pill; intentional per task spec.

## Test summary

```
npx vitest run src/app/globals.accent.test.ts
→ 1 passed (1 file)
```

## Commits

| SHA | Subject |
|-----|---------|
| `f451b0b` | feat: switch the accent to green pills |

## Concerns

None blocking. Optional note: the test helper `block(".dark")` uses `indexOf(".dark")`, which resolves to the first `.dark` substring in the file (inside `@custom-variant`), not strictly the `.dark { … }` rule block. The test still passes and matches the brief as written; a future hardening could anchor selectors more precisely.

## Verification not run

- Full test suite (`npm test` / all vitest files)
- Visual / browser check of buttons on pages

Per task scope, only the accent test file was required.
