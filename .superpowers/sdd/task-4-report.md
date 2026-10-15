# Task 4 Report: HeroSection, ServiceGrid, Homepage

## Status
**Complete** — build passes; homepage wired with Hero + CMS-backed ServiceGrid.

## Commits
1. `07faedc` — feat: add institutional hero and CMS-backed service grid
2. `5f1c71c` — fix: defer footer copyright year for prerender (build unblock)

## Implementation Notes
- **Amendment C2:** `metadata.alternates.canonical` set to `"/"`.
- **Hero Contact CTA:** `href="/#contact"` (not `#contact`).
- **No `<main>` wrapper** on homepage; layout owns `main`.
- **Motion leaves:** `HeroSection` and `ServiceCardMotion` are client components; `ServiceGrid` remains a server component importing the motion leaf.
- **Data:** `fetchServices()` from `@/services/cms` (mock provider by default).

## Build Summary
```
npm run build — exit 0
Route (app): ○ / (Static)
```

## Concerns / Follow-ups
- Footer copyright required a small out-of-scope fix (`CopyrightYear` + `Suspense`) for Next.js 16 prerender rules; consider documenting pattern for layout components.
- Service detail routes (`/services/[slug]`) not yet implemented — cards link ahead of Task 5+.
- Verify hash navigation `/#services` and `/#contact` against Header nav once all sections exist.

## Files Touched
| File | Action |
|------|--------|
| `src/components/home/HeroSection.tsx` | Created |
| `src/components/home/ServiceCardMotion.tsx` | Created |
| `src/components/home/ServiceGrid.tsx` | Created |
| `src/app/page.tsx` | Replaced |
| `src/components/layout/CopyrightYear.tsx` | Created (build fix) |
| `src/components/layout/Footer.tsx` | Modified (build fix) |
