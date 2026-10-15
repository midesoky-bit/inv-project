import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const { revalidateTag } = vi.hoisted(() => ({
  revalidateTag: vi.fn(),
}));
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

  it("400s on legacy service tags without locale", async () => {
    const res = await POST(request({ tags: ["service:events"] }, "test-secret"));
    expect(res.status).toBe(400);
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it("expands bare tags to both locales", async () => {
    const res = await POST(request({ tags: ["services"] }, "test-secret"));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.revalidated).toEqual(["services:en", "services:ar"]);
    expect(revalidateTag).toHaveBeenCalledTimes(2);
    expect(revalidateTag).toHaveBeenCalledWith("services:en", "max");
    expect(revalidateTag).toHaveBeenCalledWith("services:ar", "max");
  });

  it("revalidates locale-scoped tags", async () => {
    const res = await POST(
      request(
        {
          tags: [
            "services:en",
            "service:ar:events-exhibitions",
            "esg:ar",
          ],
        },
        "test-secret",
      ),
    );
    expect(res.status).toBe(200);
    expect(revalidateTag).toHaveBeenCalledTimes(3);
  });
});
