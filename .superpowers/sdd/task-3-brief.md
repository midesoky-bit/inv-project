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

