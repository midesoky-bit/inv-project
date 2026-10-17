### Task 2: Seven-item navigation

**Files:**
- Modify: `src/components/layout/navigation.ts`
- Modify: `src/components/layout/DesktopNav.tsx`
- Modify: `src/components/layout/MobileNav.tsx`
- Modify: `messages/en.json`
- Modify: `messages/ar.json`
- Test: `src/components/layout/navigation.test.ts`

**Interfaces:**
- Consumes: `SectionLink`
- Produces: `NAV_LINKS` in this order, with these `href` and `messageKey` values: `/` home, `/about` about, `/services` services, `/work` work, `/insights` insights, `/careers` careers, `/contact` contact. Desktop and mobile nav render only those links. The services dropdown is gone. `DesktopNav` still accepts `services` so `Header` does not need a signature change in this task.

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, it } from "vitest";
import { NAV_LINKS } from "@/components/layout/navigation";

describe("NAV_LINKS", () => {
  it("lists the seven reference routes", () => {
    expect(NAV_LINKS.map((item) => [item.href, item.messageKey])).toEqual([
      ["/", "home"],
      ["/about", "about"],
      ["/services", "services"],
      ["/work", "work"],
      ["/insights", "insights"],
      ["/careers", "careers"],
      ["/contact", "contact"],
    ]);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/layout/navigation.test.ts`

Expected: FAIL because the current links are hash links and `home`, `work`, and `careers` are absent.

- [ ] **Step 3: Replace the nav data and menus**

```ts
export const NAV_LINKS = [
  { href: "/", messageKey: "home" },
  { href: "/about", messageKey: "about" },
  { href: "/services", messageKey: "services" },
  { href: "/work", messageKey: "work" },
  { href: "/insights", messageKey: "insights" },
  { href: "/careers", messageKey: "careers" },
  { href: "/contact", messageKey: "contact" },
] as const;
```

Add to `messages/en.json` `nav`: `"home": "Home"`, `"work": "Our Work"`, `"careers": "Careers"`.

Add to `messages/ar.json` `nav`: `"home": "الرئيسية"`, `"work": "أعمالنا"`, `"careers": "الوظائف"`.

Rewrite `DesktopNav` so each item is one `SectionLink` with `href={item.href}` and label `{t(item.messageKey)}`. Delete the open state, the services submenu, and the `Link` import if it becomes unused. Keep the `services` prop unused for this task so the header still compiles.

In `MobileNav`, delete the nested service list under Services. Render the same `NAV_LINKS` through `SectionLink`.

- [ ] **Step 4: Run tests**

Run: `npx vitest run src/components/layout/navigation.test.ts src/i18n/messages.parity.test.ts`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/layout/navigation.ts src/components/layout/navigation.test.ts src/components/layout/DesktopNav.tsx src/components/layout/MobileNav.tsx messages/en.json messages/ar.json
git commit -m "feat: point the menu at the reference pages"
```

