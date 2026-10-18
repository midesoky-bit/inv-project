import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = readFileSync("src/components/seo/OrganizationJsonLd.tsx", "utf8");

describe("OrganizationJsonLd", () => {
  it("renders JSON-LD in the server HTML", () => {
    expect(source).toContain('type="application/ld+json"');
    expect(source).toContain("dangerouslySetInnerHTML");
    expect(source).not.toContain("useEffect");
    expect(source).not.toContain('"use client"');
  });
});
