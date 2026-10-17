import { describe, expect, it } from "vitest";
import { WORK_ITEMS, filterWork } from "@/components/work/work-items";

describe("work gallery", () => {
  it("has the five existing photos", () => {
    expect(WORK_ITEMS.map((item) => item.src)).toEqual([
      "/images/forum.webp",
      "/images/briefing.webp",
      "/images/about.webp",
      "/images/hero.webp",
      "/images/analytics.webp",
    ]);
  });

  it("filters to media campaigns", () => {
    expect(filterWork("campaigns").map((item) => item.src)).toEqual([
      "/images/analytics.webp",
    ]);
  });
});
