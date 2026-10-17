### Task 5: Services index

**Files:**
- Create: `src/app/[locale]/services/page.tsx`
- Modify: `src/app/[locale]/services/[slug]/page.tsx` (heading only)
- Test: `src/app/[locale]/services/page.test.ts`

**Interfaces:**
- Consumes: `fetchServices`, `ServiceGrid`, `buildPageMetadata`
- Produces: `/services` renders `ServiceGrid`. The service detail `h1` wraps no new data; it adds `className` including `text-balance` and a green eyebrow using `t("eyebrow")` if that eyebrow is not already above the title.

- [ ] **Step 1: Write the failing test**

```ts
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const page = readFileSync("src/app/[locale]/services/page.tsx", "utf8");

describe("services index", () => {
  it("renders the Directus grid", () => {
    expect(page).toContain("fetchServices");
    expect(page).toContain("<ServiceGrid");
    expect(page).toContain('src="/images/forum.webp"');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/app/[locale]/services/page.test.ts`

Expected: FAIL because the file does not exist.

- [ ] **Step 3: Add the index page**

Create the locale page with the same static-param and metadata pattern as the home page, using `services.title` and `services.subtitle`. Render a full-width `Image` `/images/forum.webp` with `alt` from `images.forum` if that key exists, otherwise `images.hero`. Under it render:

```tsx
<ServiceGrid services={services} />
```

On the slug page, add `text-accent` to the existing eyebrow. Do not change the Directus fields or the slug.

Change `services.title` to `Core <g>offerings</g>` and the Arabic services title to `الخدمات <g>الأساسية</g>`. Render that heading with `t.rich` and a `text-accent` span, on both the index and the existing services heading component.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/app/[locale]/services/page.test.ts`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/app/[locale]/services/page.tsx src/app/[locale]/services/page.test.ts src/app/[locale]/services/[slug]/page.tsx
git commit -m "feat: add a services index in the reference layout"
```

