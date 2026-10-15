### Task 8: ISR segment config and tag revalidation endpoint (Amendment D)

**Files:**
- Modify: `src/app/page.tsx`, `src/app/services/[slug]/page.tsx`
- Create: `src/app/api/revalidate/route.ts`
- Create: `src/app/api/revalidate/route.test.ts`
- Modify: `.env.example`, `.env.local`

**Interfaces:**
- Consumes: `REVALIDATE_SECRET` env var
- Produces: `POST /api/revalidate` accepting `{ "tags": string[] }` with header `x-revalidate-secret`

- [ ] **Step 1: Page-level ISR window**

Add to `src/app/page.tsx` and `src/app/services/[slug]/page.tsx`:

```ts
export const revalidate = 3600;
```

For the service route, also add:

```ts
export const dynamicParams = true;
```

- [ ] **Step 2: Env vars**

Append to `.env.example` and `.env.local`:

```env
REVALIDATE_SECRET=
```

Generate a value for real environments:

```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

- [ ] **Step 3: Write failing handler test**

Create `src/app/api/revalidate/route.test.ts`:

```ts
import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const revalidateTag = vi.fn();
vi.mock("next/cache", () => ({ revalidateTag }));

import { POST } from "@/app/api/revalidate/route";

function request(body: unknown, secret?: string) {
  return new NextRequest("http://localhost/api/revalidate", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...(secret ? { "x-revalidate-secret": secret } : {}),
    },
    body: JSON.stringify(body),
  });
}

describe("POST /api/revalidate", () => {
  beforeEach(() => {
    revalidateTag.mockReset();
    process.env.REVALIDATE_SECRET = "test-secret";
  });

  it("503s when no secret is configured", async () => {
    delete process.env.REVALIDATE_SECRET;
    const res = await POST(request({ tags: ["services"] }, "x"));
    expect(res.status).toBe(503);
  });

  it("401s on a wrong secret", async () => {
    const res = await POST(request({ tags: ["services"] }, "nope"));
    expect(res.status).toBe(401);
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it("400s on unknown tags", async () => {
    const res = await POST(request({ tags: ["secrets"] }, "test-secret"));
    expect(res.status).toBe(400);
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it("revalidates allowed tags", async () => {
    const res = await POST(
      request({ tags: ["services", "service:events"] }, "test-secret"),
    );
    expect(res.status).toBe(200);
    expect(revalidateTag).toHaveBeenCalledTimes(2);
  });
});
```

- [ ] **Step 4: Run — expect FAIL**

```powershell
npm test
```

Expected: FAIL (route module not found).

- [ ] **Step 5: Implement the route**

Create `src/app/api/revalidate/route.ts`:

```ts
import { timingSafeEqual } from "node:crypto";
import { revalidateTag } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";

const STATIC_TAGS = new Set(["services", "insights", "esg", "case-studies"]);
const SERVICE_TAG = /^service:[a-z0-9-]+$/;

function isAllowedTag(tag: unknown): tag is string {
  return (
    typeof tag === "string" && (STATIC_TAGS.has(tag) || SERVICE_TAG.test(tag))
  );
}

function secretMatches(provided: string, expected: string): boolean {
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function POST(request: NextRequest) {
  const expected = process.env.REVALIDATE_SECRET;
  if (!expected) {
    return NextResponse.json(
      { error: "Revalidation is not configured" },
      { status: 503 },
    );
  }

  const provided = request.headers.get("x-revalidate-secret") ?? "";
  if (!secretMatches(provided, expected)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const tags = (body as { tags?: unknown })?.tags;
  if (!Array.isArray(tags) || tags.length === 0 || !tags.every(isAllowedTag)) {
    return NextResponse.json(
      { error: "Provide a non-empty `tags` array of known tags" },
      { status: 400 },
    );
  }

  for (const tag of tags) {
    revalidateTag(tag, "max");
  }

  return NextResponse.json({ revalidated: tags });
}
```

**Next version note:** `revalidateTag(tag, "max")` is the Next 16 signature. If Task 1 installed Next 15, call `revalidateTag(tag)` with one argument. Check `package.json` and adjust.

- [ ] **Step 6: Run tests — expect PASS**

```powershell
npm test
```

- [ ] **Step 7: Manual smoke**

```powershell
npm run build
npm run start
# in a second terminal (set REVALIDATE_SECRET in .env.local first):
curl.exe -X POST http://localhost:3000/api/revalidate `
  -H "content-type: application/json" `
  -H "x-revalidate-secret: <your secret>" `
  -d "{\"tags\":[\"services\"]}"
```

Expected: `{"revalidated":["services"]}`.

- [ ] **Step 8: Commit**

```powershell
git add src/app/page.tsx "src/app/services/[slug]/page.tsx" src/app/api .env.example
git commit -m "feat: add ISR window and secret-protected tag revalidation"
```

---

