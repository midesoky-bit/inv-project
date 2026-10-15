# Task 4 Review: HeroSection, ServiceGrid, Homepage

**Reviewer:** Code review (task-scoped gate)  
**Range:** `2d75868` → `5f1c71c`  
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
| Homepage canonical `/` | ✅ | `src/app/page.tsx` — `metadata.alternates.canonical: "/"` (Amendment C2); root `layout.tsx` still has no root canonical |
| Contact CTA `/#contact` | ✅ | `HeroSection.tsx` — `Button href="/#contact"`; matches `NAV_ITEMS` and footer `id="contact"` |
| No page-level `<main>` wrapper | ✅ | `HomePage` returns fragment with `HeroSection` + `ServiceGrid`; layout owns `<main>{children}</main>` (resolves Task 3 nested-`<main>` note) |
| Hero + ServiceGrid from CMS | ✅ | `await fetchServices()` in server `HomePage`; `ServiceGrid` maps `Service[]` to cards with `/services/${slug}` |

**Brief steps**

| Step | Status |
|------|--------|
| 1 — `HeroSection` (client, motion, CTAs) | ✅ Matches brief source block |
| 2 — `ServiceCardMotion` + `ServiceGrid` | ✅ Server grid + client motion leaf; `id="services"`, `aria-labelledby` |
| 3 — Wire `page.tsx` | ✅ Metadata, async fetch, composition |
| 4 — Build verify | ✅ Independent `npm run build` exit 0; route `○ /` (Static) |
| 5 — Commit scope | ⚠️ Primary commit matches brief files; follow-up commit adds layout build fix (see Extra) |

**Produces / consumes**

- Consumes: `fetchServices()`, `Button`, `Service` type — all wired correctly.
- Produces: institutional homepage with hero + CMS-backed capabilities grid.

**Missing**

- None material for Task 4 scope.

**Extra (in review range, not in brief)**

- `CopyrightYear.tsx` + `Footer.tsx` change in `5f1c71c` — defers copyright year to client to satisfy Next.js 16 static prerender (replaces `new Date().getFullYear()` in server `Footer`).

**Misunderstood**

- None. Implementation aligns with brief blocks and Amendment C2.

---

## Code quality

**Approved** for Task 4 scope.

Architecture matches the intended pattern: server `HomePage` fetches data; `ServiceGrid` stays a server component; motion isolated in client leaves (`HeroSection`, `ServiceCardMotion`). Reuses Task 3 `Button`, tokens, and `/#` nav conventions. Hero navy background restores header contrast called out in Task 3 review.

Independent checks (2026-10-15):

- `npx tsc --noEmit` → exit 0  
- `npm run build` → exit 0; `/` static

---

## Findings

### Critical

- None identified from diff, source read, and verification.

### Important

1. **Service detail routes not implemented** — Cards link to `/services/[slug]`; those pages are out of Task 4 scope. Expect 404 until a later task; acceptable if planned.
2. **Hash navigation QA deferred** — Report notes verifying `/#services` and `/#contact` with header/mobile nav once all sections exist; code targets (`id="services"`, footer `id="contact"`) are correct for current homepage + footer.

### Minor

1. **Out-of-scope commit in gate range** — Footer copyright fix is justified for build green but expands Task 4 diff; consider noting in SDD changelog or folding pattern into layout guidance (as report suggests).
2. **`Suspense` around `CopyrightYear`** — Client-only year with `fallback={2026}` works and passes typecheck; `Suspense` is not required for this leaf unless a future async boundary appears. Optional simplification: client year only, or static SSR year with `suppressHydrationWarning`.
3. **No `prefers-reduced-motion`** — Framer Motion on hero and cards; brief-silent; optional a11y polish later.
4. **Empty CMS list** — No empty-state UI if `fetchServices()` returns `[]`; brief-silent.

---

## ⚠️ Cannot verify from diff alone

- In-browser motion performance and reduced-motion behavior.
- Visual parity with design (spacing, typography at breakpoints).
- Mock vs live CMS provider content in production env.
- Click-through from service cards to future detail pages.

---

## Summary

Commits `07faedc` + `5f1c71c` deliver Task 4 as specified: CMS-backed `ServiceGrid`, institutional `HeroSection`, homepage canonical on `/` only, Contact CTA at `/#contact`, and no duplicate `<main>`. Build and typecheck pass. **Spec ✅**, **quality Approved**; Important items are integration/QA follow-ups, not Task 4 blockers.
