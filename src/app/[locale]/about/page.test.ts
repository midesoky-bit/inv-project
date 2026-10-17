import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { NAV_LINKS } from "@/components/layout/navigation";

const page = readFileSync("src/app/[locale]/about/page.tsx", "utf8");

describe("about page", () => {
  it("hosts the profile sections and keeps ESG off the menu", () => {
    expect(page).toContain("<EsgSection");
    expect(page).toContain("<ImpactSection");
    expect(page).toContain("<PrinciplesSection");
    expect(
      NAV_LINKS.some((item) => (item.messageKey as string) === "esg"),
    ).toBe(false);
  });
});
