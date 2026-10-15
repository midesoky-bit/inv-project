import { afterEach, describe, expect, it, vi } from "vitest";
import { getSiteUrl } from "@/lib/site";

describe("getSiteUrl", () => {
  const original = process.env.NEXT_PUBLIC_SITE_URL;

  afterEach(() => {
    if (original === undefined) delete process.env.NEXT_PUBLIC_SITE_URL;
    else process.env.NEXT_PUBLIC_SITE_URL = original;
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("defaults to localhost", () => {
    delete process.env.NEXT_PUBLIC_SITE_URL;
    expect(getSiteUrl()).toBe("http://localhost:3000");
  });

  it("strips trailing slashes", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://example.com//";
    expect(getSiteUrl()).toBe("https://example.com");
  });

  it("warns in production when the site URL is missing or localhost", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.stubEnv("NODE_ENV", "production");
    delete process.env.NEXT_PUBLIC_SITE_URL;

    getSiteUrl();

    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining("NEXT_PUBLIC_SITE_URL"),
    );

    warn.mockClear();
    process.env.NEXT_PUBLIC_SITE_URL = "http://localhost:3000";
    getSiteUrl();
    expect(warn).toHaveBeenCalled();
  });
});
