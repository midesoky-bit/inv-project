# Reference layout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restyle the public site into the approved photo-hero, green-accent, multi-page layout without inventing stats, clients, or sample articles.

**Architecture:** Semantic tokens and the header change first. The homepage then keeps only the hero, a service-icon row, an about teaser, and the four markets. Existing profile sections move to `/about`. New routes cover services index, work, insights, careers, and contact. Insights and careers read empty Directus collections through the current CMS switch.

**Tech Stack:** Next.js 16.4.1 App Router, TypeScript strict, Tailwind CSS 4, next-intl, next-themes, Vitest, Directus seed script.

## Global Constraints

- Next.js 16.4.1 uses `src/proxy.ts`, not `middleware.ts`.
- Every `[locale]` page keeps `generateStaticParams`, `setRequestLocale`, and `export const revalidate = 3600`.
- Locales stay `en` and `ar`. Brand name stays Latin in both, inside `<bdi>` in Arabic strings.
- Light, dark, and system stay. Hero panels keep the photograph and navy wash in both themes.
- Accent green is `#1FA971` in light and dark. Navy `#0B1D36` stays. Desert theme accent stays gold.
- The green phrase in a heading is a `next-intl` rich-text chunk named `g`, not an automatic first or last word.
- Layout CSS is logical. Do not add `left`, `right`, `ml-`, `mr-`, `pl-`, `pr-`, `text-left`, or `text-right`.
- No search, social icons, contact form, insight detail route, career detail route, or application form.
- No invented counts, client names, project titles, or results. Forbidden visible strings include `200+` and `10+`.
- Arabic additions are AI-drafted and stay pending human review.
- `scripts/seed-directus.mjs` and `deploy/scripts/seed-directus.mjs` stay identical.

---

## File structure

- Modify `src/app/globals.css` — green accent tokens only.
- Modify `src/components/ui/Button.tsx` — green pill primary, outline secondary.
- Modify `src/components/layout/navigation.ts` — seven real routes.
- Modify `src/components/layout/DesktopNav.tsx` and `MobileNav.tsx` — drop the services dropdown.
- Modify `messages/en.json` and `messages/ar.json` — nav labels, green phrases, empty states, work filters.
- Modify `src/app/[locale]/page.tsx` — short home.
- Create `src/components/home/ServiceIconRow.tsx`, `AboutTeaser.tsx`.
- Create `src/app/[locale]/about/page.tsx`, `services/page.tsx`, `work/page.tsx`, `insights/page.tsx`, `careers/page.tsx`, `contact/page.tsx`.
- Create `src/components/work/work-items.ts` and `WorkGallery.tsx`.
- Modify `src/types/cms.ts`, `src/services/cms.ts`, `src/lib/cms/providers/directus.ts`, `src/lib/cms/directus-map.ts`.
- Modify `src/app/api/revalidate/route.ts` and `src/app/sitemap.ts`.
- Modify both seed scripts. Do not add insight or career rows to `seed-data.json`.

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

### Task 3: Short homepage

**Files:**
- Create: `src/components/home/ServiceIconRow.tsx`
- Create: `src/components/home/AboutTeaser.tsx`
- Modify: `src/components/home/HeroSection.tsx`
- Modify: `src/app/[locale]/page.tsx`
- Modify: `messages/en.json` and `messages/ar.json` hero titles
- Test: `src/app/[locale]/home-composition.test.ts`

**Interfaces:**
- Consumes: `fetchServices(locale)`, `Service.slug`, `Service.title`, `Service.icon`, `Button`, `PresenceStrip`, hero translations
- Produces: `ServiceIconRow({ services }: { services: { slug: string; title: string; icon?: string }[] })` and `AboutTeaser()`. Home page renders hero, icon row, about teaser, and `PresenceStrip` only.

- [ ] **Step 1: Write the failing test**

```ts
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const page = readFileSync("src/app/[locale]/page.tsx", "utf8");

describe("home composition", () => {
  it("keeps the intro blocks and drops the long profile", () => {
    expect(page).toContain("<HeroSection />");
    expect(page).toContain("<ServiceIconRow");
    expect(page).toContain("<AboutTeaser />");
    expect(page).toContain("<PresenceStrip />");
    expect(page).not.toContain("<ServiceGrid");
    expect(page).not.toContain("<EsgSection");
    expect(page).not.toContain("<ImpactSection");
    expect(page).not.toContain("200+");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/app/[locale]/home-composition.test.ts`

Expected: FAIL because `ServiceIconRow` and `AboutTeaser` are absent and `ServiceGrid` is present.

- [ ] **Step 3: Implement the short home**

Change hero titles to rich text.

English: `"title": "Strategic communications for <g>decision-makers</g>"`

Arabic: `"title": "اتصالات استراتيجية <g>لصناع القرار</g>"`

In `HeroSection`, render the title with:

```tsx
{t.rich("title", {
  g: (chunks) => <span className="text-accent">{chunks}</span>,
})}
```

`ServiceIconRow.tsx`:

```tsx
import { Link } from "@/i18n/navigation";

type Item = { slug: string; title: string; icon?: string };

export function ServiceIconRow({ services }: { services: Item[] }) {
  return (
    <ul className="mx-auto grid max-w-6xl grid-cols-2 gap-4 px-6 py-10 sm:grid-cols-3 lg:grid-cols-4">
      {services.map((service) => (
        <li key={service.slug}>
          <Link
            href={`/services/${service.slug}`}
            className="flex h-full flex-col gap-3 rounded-2xl border border-border bg-surface p-5 text-foreground transition-transform hover:-translate-y-1"
          >
            <span className="text-sm font-medium tracking-[0.14em] text-accent uppercase">
              {service.icon ?? "•"}
            </span>
            <span className="font-serif text-lg">{service.title}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
```

`AboutTeaser.tsx` is an async server component. It uses `getTranslations("about")`, shows `eyebrow`, `title`, `paragraphs[0]`, `Image` `/images/about.webp`, and a `Button` `href="/about"` whose label is `t("readMore")` after adding `"readMore": "Our story"` and Arabic `"اقرأ قصتنا"`.

Replace the home page body with:

```tsx
const services = await fetchServices(cmsLocale);

return (
  <div>
    <HeroSection />
    <ServiceIconRow services={services} />
    <AboutTeaser />
    <PresenceStrip />
  </div>
);
```

Remove the unused profile imports and the ESG fetch from this page.

- [ ] **Step 4: Run tests**

Run: `npx vitest run src/app/[locale]/home-composition.test.ts src/i18n/messages.parity.test.ts`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/home/ServiceIconRow.tsx src/components/home/AboutTeaser.tsx src/components/home/HeroSection.tsx src/app/[locale]/page.tsx src/app/[locale]/home-composition.test.ts messages/en.json messages/ar.json
git commit -m "feat: shorten the homepage to the reference intro"
```

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

### Task 7: Insights and careers collections

**Files:**
- Modify: `src/types/cms.ts`
- Modify: `src/lib/cms/directus-map.ts`
- Modify: `src/lib/cms/providers/directus.ts`
- Modify: `src/lib/cms/providers/mock.ts`
- Modify: `src/lib/cms/providers/supabase.ts`
- Modify: `src/services/cms.ts`
- Modify: `src/app/api/revalidate/route.ts`
- Modify: `scripts/seed-directus.mjs`
- Modify: `deploy/scripts/seed-directus.mjs`
- Create: `src/app/[locale]/insights/page.tsx`
- Create: `src/app/[locale]/careers/page.tsx`
- Test: `src/lib/cms/listings.test.ts`
- Test: `src/app/api/revalidate/route.test.ts` (one added case)

**Interfaces:**
- Consumes: `emptyIfMissing`, `cmsFetch`, `Locale`
- Produces:

```ts
export type Career = {
  id: string;
  title: string;
  summary: string;
  location: string;
};

export function mapDirectusInsight(row: {
  id: string | number;
  slug: string;
  published_at?: string | null;
  translations?: { title?: string | null; summary?: string | null }[] | { title?: string | null; summary?: string | null } | null;
}): Insight;

export function mapDirectusCareer(row: {
  id: string | number;
  translations?: { title?: string | null; summary?: string | null; location?: string | null }[] | { title?: string | null; summary?: string | null; location?: string | null } | null;
}): Career;

export async function fetchCareers(locale?: Locale): Promise<Career[]>;
```

`fetchInsights` keeps its current signature and starts returning mapped Directus rows instead of the unmapped `/items/insights` payload. Mock and Supabase `fetchCareers` return `[]`.

- [ ] **Step 1: Write the failing tests**

```ts
import { describe, expect, it } from "vitest";
import { mapDirectusCareer, mapDirectusInsight } from "@/lib/cms/directus-map";

describe("listing mappers", () => {
  it("maps an insight translation", () => {
    expect(
      mapDirectusInsight({
        id: 4,
        slug: "note",
        published_at: "2026-10-17",
        translations: [{ title: "Note", summary: "Short" }],
      }),
    ).toEqual({
      id: "4",
      slug: "note",
      title: "Note",
      summary: "Short",
      publishedAt: "2026-10-17",
    });
  });

  it("maps a career translation", () => {
    expect(
      mapDirectusCareer({
        id: 2,
        translations: [{ title: "Advisor", summary: "Counsel", location: "Cairo" }],
      }),
    ).toEqual({
      id: "2",
      title: "Advisor",
      summary: "Counsel",
      location: "Cairo",
    });
  });
});
```

Add this case to `route.test.ts`:

```ts
it("expands a bare careers tag", async () => {
  const res = await POST(request({ tags: ["careers"] }, "test-secret"));
  expect(res.status).toBe(200);
  expect(await res.json()).toEqual({
    revalidated: ["careers:en", "careers:ar"],
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/lib/cms/listings.test.ts src/app/api/revalidate/route.test.ts`

Expected: FAIL because `mapDirectusCareer` is missing and `careers` is an unknown tag.

- [ ] **Step 3: Map, fetch, seed, and render**

Add `Career` to `src/types/cms.ts`. Add the two mappers beside `mapDirectusEsg`, using the same `firstTranslation` helper. Missing translation strings become `""`. Missing `published_at` becomes `""`.

`directusFetchInsights` calls `emptyIfMissing` with fields `id,slug,published_at,translations.title,translations.summary`, deep filter `languages_code` equals the locale, and tags `["insights", "insights:${locale}"]`, then maps rows.

`directusFetchCareers` does the same for `/items/careers` with fields `id,translations.title,translations.summary,translations.location` and tags `["careers", "careers:${locale}"]`.

`fetchCareers` in `src/services/cms.ts` switches on `getCmsProvider()` like `fetchInsights`. Mock and Supabase return `[]`.

Add `"careers"` to `BARE_TAGS` and to the locale-scoped regex in `route.ts`.

In both seed scripts, after the ESG public-read loop, create `insights` and `careers` if missing. Each parent has `slug` (string, required, unique) and `status` (string, default `published`). Insights also has `published_at` (timestamp, nullable). Each translations collection has `title`, `summary`, `languages_code`, and the parent id field. Insights translations also has `body` (text). Careers translations also has `location` (string). Create the `translations` alias and both relations the same way services does, including `ensureLanguageLink` and `ensureTranslationsInterface`. Grant public read. Do not insert items.

Pages `/insights` and `/careers` fetch their lists. If `length === 0`, render `t("empty")`. Otherwise list title and summary. Insights also shows `publishedAt`. Careers also shows `location`.

English: insights `title` “<g>Insights</g>”, `empty` “Articles will be added in Directus.” Careers `title` “<g>Careers</g>”, `empty` “Openings will be added in Directus.”

Arabic: insights `title` “<g>الرؤى</g>”, `empty` “ستُضاف المقالات في Directus.” Careers `title` “<g>الوظائف</g>”, `empty` “ستُضاف الوظائف في Directus.”

Both pages render `title` with `t.rich` and a `text-accent` span.

- [ ] **Step 4: Run tests**

Run: `npx vitest run src/lib/cms/listings.test.ts src/app/api/revalidate/route.test.ts src/services/cms.test.ts src/i18n/messages.parity.test.ts`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/types/cms.ts src/lib/cms/directus-map.ts src/lib/cms/providers/directus.ts src/lib/cms/providers/mock.ts src/lib/cms/providers/supabase.ts src/services/cms.ts src/app/api/revalidate/route.ts src/app/api/revalidate/route.test.ts src/lib/cms/listings.test.ts src/app/[locale]/insights/page.tsx src/app/[locale]/careers/page.tsx scripts/seed-directus.mjs deploy/scripts/seed-directus.mjs messages/en.json messages/ar.json
git commit -m "feat: add empty insight and career listings"
```

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
