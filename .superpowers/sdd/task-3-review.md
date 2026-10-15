# Task 3 Review: Design tokens, layout, mobile nav, SEO metadata

**Reviewer:** Code review (task-scoped gate)  
**Range:** `b6b45a6` → `2d75868`  
**Date:** 2026-10-15

## Verdict

| Gate | Result |
|------|--------|
| **Spec compliance** | ✅ |
| **Code quality** | Approved |

---

## Spec compliance

**Must-verify checkpoints**

| Checkpoint | Status | Evidence |
|------------|--------|----------|
| `MobileNav` + shared `NAV_ITEMS` | ✅ | `navigation.ts` exported const; `MobileNav.tsx`, `Header.tsx`, and `Footer.tsx` import and map `NAV_ITEMS` |
| Nav hrefs use `/#` anchors | ✅ | `/#services`, `/#insights`, `/#esg`, `/#contact` in `navigation.ts`; used in desktop nav, mobile links, and footer |
| No root `alternates.canonical` | ✅ | `layout.tsx` metadata has no `alternates`; repo grep under `src/` finds no `canonical` / `alternates` |
| IBM Plex fonts | ✅ | `IBM_Plex_Sans` / `IBM_Plex_Serif` in `layout.tsx` (weights 400/500/600, CSS variables on `body`); `globals.css` body + `@theme` `--font-sans` / `--font-serif` |
| Institutional palette tokens | ✅ | `:root` inv navy/mid/slate/mist/white/accent; `@theme inline` `--color-inv-*`; `::selection` accent mix |
| `Header` / `Footer` | ✅ | Server components match brief markup, `id="contact"` on footer, footer filters Contact from link list |

**Brief steps**

| Step | Status |
|------|--------|
| 1 — `cn()` + `clsx` / `tailwind-merge` | ✅ `src/lib/utils.ts`; deps in `package.json` |
| 2 — `globals.css` tokens | ✅ Matches brief (removed Geist/dark-mode starter theme) |
| 3 — `Button` | ✅ Primary/ghost variants, `cn`, focus ring |
| 4a–d — nav, mobile, header, footer | ✅ Verbatim structure and a11y attrs on mobile toggle |
| 5 — root layout + metadata | ✅ `metadataBase`, title template, OG/Twitter/robots; **no** root canonical (Amendment C1) |
| 6 — typecheck | ✅ `npx tsc --noEmit` exit 0 (independent re-run 2026-10-15) |
| 7 — commit scope | ✅ Message and files align with brief |

**Produces / consumes**

- Design tokens consumed and exposed to Tailwind v4 via `@theme inline`.
- Layout shell: `Header` → `<main>{children}</main>` → `Footer`.
- Starter `page.tsx` unchanged (Task 4 homepage) — per brief.

**Missing**

- None material for Task 3 scope.

**Extra**

- None in commit scope.

**Misunderstood**

- None material. Diff matches brief source blocks.

---

## Code quality

**Approved** for Task 3 scope.

Clear separation: shared `NAV_ITEMS`, client-only `MobileNav` leaf, server `Header`/`Footer`. Tokens and fonts are centralized; metadata follows Next.js Metadata API without preempting Task 4 homepage canonical. `Button` and `cn()` are ready for downstream sections.

Independent check: `npx tsc --noEmit` → exit 0 (2026-10-15).

---

## Findings

### Critical

- None identified from diff, source read, and verification.

### Important

1. **Manual mobile nav QA not executed** — Report notes ≤767px toggle, Escape, and link-close were not run in session. Code matches brief (`aria-expanded`, Escape `useEffect`, `onClick` close); confirm in browser before release QA sign-off.
2. **Header contrast on current starter homepage** — Absolute header uses white text/borders; default `page.tsx` is light (`bg-zinc-50` / white). Expected until Task 4 hero; verify contrast once homepage lands.

### Minor

1. **Nested `<main>`** — Root layout wraps children in `<main>` while starter `page.tsx` still contains its own `<main>`. Valid HTML concern; resolve when Task 4 replaces starter page (or remove inner `main` in Task 4).
2. **Mobile menu UX gaps (brief-silent)** — No scroll lock or focus trap when panel open; optional polish if QA requests it.
3. **Inline `siteUrl`** — Brief defers `getSiteUrl()` to Task 7; no action for Task 3.
4. **`Button` unused** — No compile impact; first consumer expected Task 4+.

---

## ⚠️ Cannot verify from diff alone

- Visual alignment of mobile dropdown panel across viewports (positioning uses `absolute` + `top-full` under positioned `header`).
- OG/Twitter rendering in production with real `NEXT_PUBLIC_SITE_URL`.
- Keyboard/tab order through mobile menu beyond Escape handler.

---

## Summary

Commit `2d75868` implements Task 3 as specified: institutional CSS tokens, IBM Plex wiring, `cn`/`Button`, shared `NAV_ITEMS` with `/#` hrefs, `MobileNav`/`Header`/`Footer`, and root metadata without root canonical. **Spec ✅**, **quality Approved**; Important items are QA/integration follow-ups, not Task 3 blockers.
