### Task 4: About page

**Files:**
- Create: `src/app/[locale]/about/page.tsx`
- Test: `src/app/[locale]/about/page.test.ts`

**Interfaces:**
- Consumes: `AboutSection`, `PositioningSection`, `ImpactSection`, `CapabilitySection`, `AdvantageSection`, `ClientsSection`, `PrinciplesSection`, `EsgSection`, `fetchEsgCommitments`, `ScrollReveal`, `buildPageMetadata`
- Produces: `src/app/[locale]/about/page.tsx` default export. ESG is rendered here and is not a `NAV_LINKS` entry.

- [ ] **Step 1: Write the failing test**

```ts
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { NAV_LINKS } from "@/components/layout/navigation";

const page = readFileSync("src/app/[locale]/about/page.tsx", "utf8");

describe("about page", () => {
  it("hosts the profile sections and keeps ESG off the menu", () => {
    expect(page).toContain("<EsgSection");
    expect(page).toContain("<ImpactSection");
    expect(page).toContain("<PrinciplesSection");
    expect(NAV_LINKS.some((item) => item.messageKey === "esg")).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/app/[locale]/about/page.test.ts`

Expected: FAIL because the file does not exist.

- [ ] **Step 3: Create the route**

Follow `src/app/[locale]/page.tsx` for `generateStaticParams`, `generateMetadata`, and `setRequestLocale`. Metadata title is the about title. The page renders, inside `ScrollReveal` where the home page did:

`AboutSection`, `PositioningSection`, `ImpactSection`, `CapabilitySection`, `AdvantageSection`, `ClientsSection`, `PrinciplesSection`, and `EsgSection commitments={esgCommitments}`.

`fetchEsgCommitments(locale)` supplies the commitments.

The page’s main heading is `about.title`. Change that string to `An integrated <g>communications</g> platform` in English and `منصة متكاملة <g>للاتصال</g>` in Arabic. In `AboutSection`, render the title with `t.rich("title", { g: (chunks) => <span className="text-accent">{chunks}</span> })`.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/app/[locale]/about/page.test.ts`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/app/[locale]/about/page.tsx src/app/[locale]/about/page.test.ts
git commit -m "feat: move the profile sections onto the about page"
```

