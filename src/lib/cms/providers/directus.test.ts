import { beforeEach, describe, expect, it, vi } from "vitest";
import { CmsError } from "@/lib/cms/errors";

const { cmsFetch } = vi.hoisted(() => ({
  cmsFetch: vi.fn(),
}));

vi.mock("@/lib/cms/client", () => ({ cmsFetch }));

import {
  directusFetchServiceBySlug,
  directusFetchServices,
} from "@/lib/cms/providers/directus";

const forbidden = new CmsError("CMS responded 403 for /items/services", "NETWORK");
const row = {
  id: 1,
  slug: "media-production",
  order: 1,
  translations: [{ title: "Media Production", summary: "Story", description: "Body", highlights: [] }],
};

describe("directus service fetches", () => {
  beforeEach(() => {
    cmsFetch.mockReset();
  });

  it("retries without image when Directus forbids the image field", async () => {
    cmsFetch.mockRejectedValueOnce(forbidden).mockResolvedValueOnce({ data: [row] });

    const services = await directusFetchServices("en");

    expect(services).toHaveLength(1);
    expect(services[0]?.slug).toBe("media-production");
    expect(String(cmsFetch.mock.calls[0]?.[0])).toContain("image");
    expect(String(cmsFetch.mock.calls[1]?.[0])).not.toContain("image");
  });

  it("returns an empty list instead of throwing when services are forbidden", async () => {
    cmsFetch.mockRejectedValue(forbidden);
    await expect(directusFetchServices("en")).resolves.toEqual([]);
  });

  it("returns null for a slug when Directus forbids the image field and the fallback is empty", async () => {
    cmsFetch.mockRejectedValue(forbidden);
    await expect(directusFetchServiceBySlug("media-production", "en")).resolves.toBeNull();
  });
});
