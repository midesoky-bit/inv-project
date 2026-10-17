### Task 8: Contact, footer, and sitemap

**Files:**
- Create: `src/app/[locale]/contact/page.tsx`
- Modify: `src/components/layout/Footer.tsx`
- Modify: `src/app/sitemap.ts`
- Test: `src/app/sitemap.test.ts`

**Interfaces:**
- Consumes: `NAV_LINKS`, `getSiteUrl`, `localePath`, `languageAlternates`, `routing.locales`, `fetchServices`
- Produces: sitemap entries for `""`, `/about`, `/services`, `/work`, `/insights`, `/careers`, `/contact`, plus each service slug. Footer drops `id="contact"` and links the seven routes with `Link`, not only `SectionLink`.

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, it, vi } from "vitest";

vi.mock("@/services/cms", () => ({
  fetchServices: vi.fn(async () => []),
}));
vi.mock("@/lib/site", () => ({ getSiteUrl: () => "https://inventure.example" }));

import sitemap from "@/app/sitemap";

describe("sitemap", () => {
  it("includes the reference pages in both locales", async () => {
    const urls = (await sitemap()).map((entry) => entry.url);
    expect(urls).toContain("https://inventure.example/en/contact");
    expect(urls).toContain("https://inventure.example/ar/work");
    expect(urls).toContain("https://inventure.example/en/careers");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/app/sitemap.test.ts`

Expected: FAIL because those URLs are absent.

- [ ] **Step 3: Add the contact page, footer links, and static paths**

`contact/page.tsx` renders a heading `Contact` / `تواصل` with the whole word inside `text-accent`, then `footer.email` as a `mailto:` link, `footer.web` as an `https://` link, and the four `presence` market names. Add `contact.heading` in both catalogs for that heading.

Footer: remove `id="contact"`. Map every `NAV_LINKS` item through `Link` from `@/i18n/navigation`.

In `sitemap.ts`, add:

```ts
const STATIC_PATHS = ["", "/about", "/services", "/work", "/insights", "/careers", "/contact"];
```

Emit one entry per locale per path, using `localePath(locale, path)` and `languageAlternates(path)`. Keep the existing service entries.

- [ ] **Step 4: Run the full check**

Run: `npx vitest run && npm run typecheck && npm run lint:direction`

Expected: all three succeed. `lint:direction` prints no physical-direction violations.

- [ ] **Step 5: Commit**

```bash
git add src/app/[locale]/contact/page.tsx src/components/layout/Footer.tsx src/app/sitemap.ts src/app/sitemap.test.ts
git commit -m "feat: add contact and list the new pages in the sitemap"
```
