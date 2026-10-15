### Task 7: Site URL helper, sitemap, robots (Amendment B)

**Files:**
- Create: `src/lib/site.ts`
- Create: `src/lib/site.test.ts`
- Create: `src/app/sitemap.ts`
- Create: `src/app/robots.ts`
- Modify: `src/app/layout.tsx` (use the helper)

**Interfaces:**
- Consumes: `fetchServices()`
- Produces: `getSiteUrl()`, `/sitemap.xml`, `/robots.txt`

- [ ] **Step 1: Write failing test**

Create `src/lib/site.test.ts`:

```ts
import { afterEach, describe, expect, it } from "vitest";
import { getSiteUrl } from "@/lib/site";

describe("getSiteUrl", () => {
  const original = process.env.NEXT_PUBLIC_SITE_URL;

  afterEach(() => {
    if (original === undefined) delete process.env.NEXT_PUBLIC_SITE_URL;
    else process.env.NEXT_PUBLIC_SITE_URL = original;
  });

  it("defaults to localhost", () => {
    delete process.env.NEXT_PUBLIC_SITE_URL;
    expect(getSiteUrl()).toBe("http://localhost:3000");
  });

  it("strips trailing slashes", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://example.com//";
    expect(getSiteUrl()).toBe("https://example.com");
  });
});
```

- [ ] **Step 2: Run — expect FAIL**

```powershell
npm test
```

Expected: FAIL (`@/lib/site` not found).

- [ ] **Step 3: Implement helper**

Create `src/lib/site.ts`:

```ts
export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return raw.replace(/\/+$/, "");
}
```

In `src/app/layout.tsx`, replace the inline `siteUrl` constant:

```tsx
import { getSiteUrl } from "@/lib/site";

const siteUrl = getSiteUrl();
```

- [ ] **Step 4: Sitemap**

Create `src/app/sitemap.ts`:

```ts
import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";
import { fetchServices } from "@/services/cms";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const services = await fetchServices();

  return [
    {
      url: base,
      changeFrequency: "monthly" as const,
      priority: 1,
    },
    ...services.map((service) => ({
      url: `${base}/services/${service.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
```

`revalidate` must stay a literal number here; Next analyzes it statically.

- [ ] **Step 5: Robots**

Create `src/app/robots.ts`:

```ts
import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  const base = getSiteUrl();
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: "/api/" }],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
```

- [ ] **Step 6: Run tests and build**

```powershell
npm test
npm run build
```

Expected: tests PASS; build output lists `/sitemap.xml` and `/robots.txt`.

- [ ] **Step 7: Commit**

```powershell
git add src/lib/site.ts src/lib/site.test.ts src/app/sitemap.ts src/app/robots.ts src/app/layout.tsx
git commit -m "feat: add sitemap, robots, and site URL helper"
```

---

