# Task 3 Report: Design tokens, layout, mobile nav, SEO metadata

**Date:** 2026-10-15  
**Branch:** `feat/inventure-website-bootstrap`  
**Commit:** `2d75868` — feat: add institutional layout, tokens, mobile nav, and SEO metadata

## Summary

Institutional design tokens in `globals.css`, `cn()` utility, `Button`, shared `NAV_ITEMS`, client `MobileNav` (Escape + link close), server `Header`/`Footer`, and root `layout.tsx` with IBM Plex Sans/Serif and Metadata API (no root `alternates.canonical`). Dependencies: `clsx`, `tailwind-merge`.

## Steps executed

| Step | Action | Result |
|------|--------|--------|
| 1 | `npm install clsx tailwind-merge`; `src/lib/utils.ts` | OK |
| 2 | Replace `src/app/globals.css` with inv palette + `@theme inline` | OK |
| 3 | `src/components/ui/Button.tsx` | OK |
| 4a–d | `navigation.ts`, `MobileNav.tsx`, `Header.tsx`, `Footer.tsx` | OK |
| 5 | Replace `layout.tsx` (fonts, metadata, Header/main/Footer) | OK |
| 6 | `npx tsc --noEmit` | Exit 0 |
| 7 | Commit per brief | `2d75868` |

## Verification

| Check | Result |
|--------|--------|
| `npx tsc --noEmit` | No errors |
| Root metadata `alternates.canonical` | Absent (Amendment C1) |
| `metadataBase` / OG / Twitter | Present; inline `siteUrl` from env fallback |
| Shared nav | Header, Footer, MobileNav import `NAV_ITEMS` |
| Starter `page.tsx` | Unchanged (Task 4) |

Manual mobile nav (≤767px): not run in this session — code matches brief (toggle, Escape, link `onClick` close).

## Self-review

**Strengths**

- Matches brief verbatim; single source of truth for nav links.
- Mobile nav isolated as client leaf; header/footer remain server components.
- Tokens exposed to Tailwind v4 via `@theme inline`; selection styling uses accent mix.

**Gaps / risks**

1. **Header contrast on starter page:** Absolute header uses white text; default homepage is light — expected until Task 4 hero.
2. **Mobile panel positioning:** Dropdown uses `absolute top-full` without `relative` on header inner row — may need adjustment if panel misaligns in QA.
3. **`Button` unused until Task 4+** — no compile-time issue; no component tests added (brief did not require).
4. **`siteUrl` inline** — Task 7 will replace with `getSiteUrl()`.
5. **No E2E for a11y** — aria attributes present per brief; keyboard Escape wired in `useEffect`.

## Artifacts

- Brief: `.superpowers/sdd/task-3-brief.md`
- Report: `.superpowers/sdd/task-3-report.md`
