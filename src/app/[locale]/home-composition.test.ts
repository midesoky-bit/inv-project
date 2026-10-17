import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const page = readFileSync("src/app/[locale]/page.tsx", "utf8");

describe("home composition", () => {
  it("keeps the intro blocks and drops the long profile", () => {
    expect(page).toContain("<HeroSection />");
    expect(page).toContain("<ServiceIconRow");
    expect(page).toContain("<AboutTeaser />");
    expect(page).toContain("<PresenceStrip />");
    expect(page).not.toContain("<ServiceGrid");
    expect(page).not.toContain("<EsgSection");
    expect(page).not.toContain("<ImpactSection");
    expect(page).not.toContain("200+");
  });
});
