import { afterEach, describe, expect, it } from "vitest";
import {
  buildOpenGraphLocales,
  languageAlternates,
  localePath,
} from "@/lib/metadata";

describe("metadata helpers", () => {
  const original = process.env.NEXT_PUBLIC_SITE_URL;

  afterEach(() => {
    if (original === undefined) {
      delete process.env.NEXT_PUBLIC_SITE_URL;
    } else {
      process.env.NEXT_PUBLIC_SITE_URL = original;
    }
  });

  it("builds locale paths", () => {
    expect(localePath("en")).toBe("/en");
    expect(localePath("ar", "/services/foo")).toBe("/ar/services/foo");
  });

  it("builds hreflang alternates with x-default", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://example.com";
    expect(languageAlternates("/services/foo")).toEqual({
      en: "https://example.com/en/services/foo",
      ar: "https://example.com/ar/services/foo",
      "x-default": "https://example.com/en/services/foo",
    });
  });

  it("maps Open Graph locale pairs", () => {
    expect(buildOpenGraphLocales("en")).toEqual({
      locale: "en_US",
      alternateLocale: ["ar_AR"],
    });
    expect(buildOpenGraphLocales("ar")).toEqual({
      locale: "ar_AR",
      alternateLocale: ["en_US"],
    });
  });
});
