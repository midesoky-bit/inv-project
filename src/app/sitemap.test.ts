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
