import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const page = readFileSync("src/app/[locale]/services/page.tsx", "utf8");

describe("services index", () => {
  it("renders the Directus grid", () => {
    expect(page).toContain("fetchServices");
    expect(page).toContain("<ServiceGrid");
    expect(page).toContain('src="/images/forum.webp"');
  });
});
