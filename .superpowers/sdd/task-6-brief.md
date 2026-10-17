### Task 6: Our Work gallery

**Files:**
- Create: `src/components/work/work-items.ts`
- Create: `src/components/work/WorkGallery.tsx`
- Create: `src/app/[locale]/work/page.tsx`
- Modify: `messages/en.json` and `messages/ar.json`
- Test: `src/components/work/work-items.test.ts`

**Interfaces:**
- Consumes: service slugs `events-exhibitions`, `digital-media-platforms`, `public-affairs-government-relations`, `capital-markets-financial-communications`, `public-relations-partnerships`
- Produces:

```ts
export type WorkItem = {
  src: "/images/forum.webp" | "/images/analytics.webp" | "/images/briefing.webp" | "/images/hero.webp" | "/images/about.webp";
  filter: "events" | "digital" | "affairs" | "capital" | "partnerships";
  serviceSlug: string;
};

export const WORK_ITEMS: readonly WorkItem[];
export function filterWork(filter: "all" | WorkItem["filter"]): WorkItem[];
```

`WorkGallery` is a client component. Props: `{ items: WorkItem[]; labels: Record<WorkItem["filter"] | "all", string>; captions: Record<string, string> }`. `captions` is keyed by `serviceSlug`.

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, it } from "vitest";
import { WORK_ITEMS, filterWork } from "@/components/work/work-items";

describe("work gallery", () => {
  it("has the five existing photos", () => {
    expect(WORK_ITEMS.map((item) => item.src)).toEqual([
      "/images/forum.webp",
      "/images/analytics.webp",
      "/images/briefing.webp",
      "/images/hero.webp",
      "/images/about.webp",
    ]);
  });

  it("filters to capital markets", () => {
    expect(filterWork("capital").map((item) => item.src)).toEqual([
      "/images/hero.webp",
    ]);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/work/work-items.test.ts`

Expected: FAIL because the module does not exist.

- [ ] **Step 3: Add the catalog, gallery, and page**

```ts
export const WORK_ITEMS = [
  { src: "/images/forum.webp", filter: "events", serviceSlug: "events-exhibitions" },
  { src: "/images/analytics.webp", filter: "digital", serviceSlug: "digital-media-platforms" },
  { src: "/images/briefing.webp", filter: "affairs", serviceSlug: "public-affairs-government-relations" },
  { src: "/images/hero.webp", filter: "capital", serviceSlug: "capital-markets-financial-communications" },
  { src: "/images/about.webp", filter: "partnerships", serviceSlug: "public-relations-partnerships" },
] as const satisfies readonly WorkItem[];

export function filterWork(filter: "all" | WorkItem["filter"]) {
  if (filter === "all") return [...WORK_ITEMS];
  return WORK_ITEMS.filter((item) => item.filter === filter);
}
```

Add a `work` message object in both catalogs:

English: `title` “Our <g>work</g>”, `intro` “Photographs from the disciplines we deliver.”, filters `all` “All”, `events` “Events and media production”, `digital` “Digital and content”, `affairs` “Public affairs”, `capital` “Capital markets”, `partnerships` “Partnerships”.

Arabic: `title` “<g>أعمالنا</g>”, `intro` “صور من التخصصات التي نقدّمها.” The work page renders `title` with `t.rich` and a `text-accent` span., filters “الكل”, “الفعاليات والإنتاج الإعلامي”, “الرقمي والمحتوى”, “الشؤون العامة”, “أسواق رأس المال”, “الشراكات”.

`WorkGallery` holds `useState<"all" | WorkItem["filter"]>("all")`. Buttons call `setFilter`. The grid maps `filterWork(filter)` to a `Link` `/services/${item.serviceSlug}` wrapping `Image` with `alt={captions[item.serviceSlug] ?? ""}`.

The work page fetches services, builds `captions` from `slug -> title`, and passes labels from `getTranslations("work")`. The intro band uses `forum.webp` only as the page hero, which is separate from the gallery item.

- [ ] **Step 4: Run tests**

Run: `npx vitest run src/components/work/work-items.test.ts src/i18n/messages.parity.test.ts`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/work/work-items.ts src/components/work/work-items.test.ts src/components/work/WorkGallery.tsx src/app/[locale]/work/page.tsx messages/en.json messages/ar.json
git commit -m "feat: add the work gallery from existing photos"
```

