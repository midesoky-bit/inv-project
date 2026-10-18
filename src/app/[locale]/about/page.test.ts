import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { NAV_LINKS } from "@/components/layout/navigation";

const page = readFileSync("src/app/[locale]/about/page.tsx", "utf8");

describe("about page", () => {
  it("keeps ESG off the menu and uses the brief about flow", () => {
    expect(page).toContain("<AboutHero");
    expect(page).toContain("<PresenceStrip");
    expect(page).not.toContain("<EsgSection");
    expect(
      NAV_LINKS.some((item) => (item.messageKey as string) === "esg"),
    ).toBe(false);
  });
});
