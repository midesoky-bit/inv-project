import { describe, expect, it } from "vitest";
import en from "../../messages/en.json";
import ar from "../../messages/ar.json";

function keys(obj: unknown, prefix = ""): string[] {
  if (obj === null || typeof obj !== "object") return [prefix];
  return Object.entries(obj as Record<string, unknown>).flatMap(([k, v]) =>
    keys(v, prefix ? `${prefix}.${k}` : k),
  );
}

describe("message catalogs", () => {
  it("en and ar share identical key trees", async () => {
    // Will fail until both files exist with matching keys
    expect(keys(en).sort()).toEqual(keys(ar).sort());
  });
});
