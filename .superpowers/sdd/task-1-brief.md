### Task 1: Green accent and buttons

**Files:**
- Modify: `src/app/globals.css` (`:root` and `.dark` accent tokens)
- Modify: `src/components/ui/Button.tsx`
- Test: `src/app/globals.accent.test.ts`

**Interfaces:**
- Consumes: existing CSS variables `--accent`, `--accent-foreground`, `--ring`, `--inv-accent`
- Produces: those four variables equal `#1FA971` / `#ffffff` in `:root` and `.dark`. `Button` primary uses `bg-accent text-accent-foreground` and `rounded-full`. Ghost uses `border border-current`.

- [ ] **Step 1: Write the failing test**

```ts
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const css = readFileSync("src/app/globals.css", "utf8");

function block(selector: string) {
  const start = css.indexOf(selector);
  const end = css.indexOf("}", start);
  return css.slice(start, end);
}

describe("accent token", () => {
  it("uses the same green in light and dark", () => {
    for (const selector of [":root", ".dark"]) {
      const body = block(selector);
      expect(body).toContain("--accent: #1fa971;");
      expect(body).toContain("--accent-foreground: #ffffff;");
      expect(body).toContain("--ring: #1fa971;");
      expect(body).toContain("--inv-accent: #1fa971;");
    }
    expect(css).toContain('[data-theme="desert"]');
    expect(block("[data-theme=\"desert\"]")).toContain("--accent: #8b6914;");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/app/globals.accent.test.ts`

Expected: FAIL because `--accent` is still `#3a6b8c` in `:root` and `#6ba3c4` in `.dark`.

- [ ] **Step 3: Update tokens and Button**

In `:root` and `.dark`, set:

```css
--inv-accent: #1fa971;
--accent: #1fa971;
--accent-foreground: #ffffff;
--ring: #1fa971;
```

Leave `[data-theme="desert"]` and `.dark[data-theme="desert"]` unchanged.

Replace the `Button` variant classes with:

```tsx
variant === "primary" &&
  "rounded-full bg-accent text-accent-foreground hover:bg-accent/90",
variant === "ghost" &&
  "rounded-full border border-current bg-transparent text-foreground",
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/app/globals.accent.test.ts`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/app/globals.css src/app/globals.accent.test.ts src/components/ui/Button.tsx
git commit -m "feat: switch the accent to green pills"
```

