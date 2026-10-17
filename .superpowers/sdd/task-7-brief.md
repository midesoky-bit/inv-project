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

