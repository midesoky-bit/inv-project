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
