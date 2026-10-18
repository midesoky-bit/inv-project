import { describe, expect, it } from "vitest";
import { serviceCardVisual, serviceVisual } from "@/lib/service-visuals";
import type { Service } from "@/types/cms";

function service(overrides: Partial<Service> = {}): Service {
  return {
    id: "1",
    slug: "media-production",
    title: "Media Production",
    summary: "Summary",
    description: "Description",
    highlights: [],
    order: 1,
    ...overrides,
  };
}

describe("serviceCardVisual", () => {
  it("uses the local fallback when Directus has no image", () => {
    expect(serviceCardVisual(service()).src).toBe("/images/forum.webp");
  });

  it("prefers the Directus asset URL when present", () => {
    expect(
      serviceCardVisual(
        service({ image: "http://localhost:8055/assets/file-1" }),
      ).src,
    ).toBe("http://localhost:8055/assets/file-1");
  });

  it("keeps the local alt key for both sources", () => {
    expect(serviceCardVisual(service()).altKey).toBe(serviceVisual("media-production").altKey);
  });
});
