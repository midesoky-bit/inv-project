import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const page = readFileSync("src/app/[locale]/page.tsx", "utf8");

describe("home composition", () => {
  it("uses the brief homepage blocks", () => {
    expect(page).toContain("<HeroSection services={services} />");
    expect(page).toContain("<HomeServices");
    expect(page).toContain("<ContactModel");
    expect(page).toContain("<HowWeWork");
    expect(page).toContain("<WhySection");
    expect(page).not.toContain("<StatsBar");
    expect(page).not.toContain("<EsgSection");
  });
});
