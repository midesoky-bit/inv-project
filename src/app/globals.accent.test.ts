import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const css = readFileSync("src/app/globals.css", "utf8");

function block(selector: string) {
  const start = css.indexOf(selector);
  const end = css.indexOf("}", start);
  return css.slice(start, end);
}

describe("accent token", () => {
  it("uses the same green in light and dark", () => {
    for (const selector of [":root", ".dark"]) {
      const body = block(selector);
      expect(body).toContain("--accent: #1fa971;");
      expect(body).toContain("--accent-foreground: #ffffff;");
      expect(body).toContain("--ring: #1fa971;");
      expect(body).toContain("--inv-accent: #1fa971;");
    }
    expect(css).toContain('[data-theme="desert"]');
    expect(block("[data-theme=\"desert\"]")).toContain("--accent: #8b6914;");
  });
});
