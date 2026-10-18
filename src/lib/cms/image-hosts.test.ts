import { describe, expect, it } from "vitest";
import {
  cmsAssetRemotePattern,
  cmsImageRemotePatterns,
  isRemoteAsset,
} from "@/lib/cms/image-hosts";

describe("cms image hosts", () => {
  it("keeps /assets/** when the CMS URL has no path prefix", () => {
    expect(cmsAssetRemotePattern("http://localhost:8055")).toEqual({
      protocol: "http",
      hostname: "localhost",
      port: "8055",
      pathname: "/assets/**",
    });
  });

  it("includes the CMS URL path prefix before /assets/**", () => {
    expect(cmsAssetRemotePattern("https://cms.example.com/directus/")).toEqual({
      protocol: "https",
      hostname: "cms.example.com",
      pathname: "/directus/assets/**",
    });
  });

  it("dedupes env URLs and skips invalid values", () => {
    expect(
      cmsImageRemotePatterns([
        "http://localhost:8055",
        "http://localhost:8055/",
        undefined,
        "not-a-url",
        "https://cms.example.com",
      ]),
    ).toEqual([
      {
        protocol: "http",
        hostname: "localhost",
        port: "8055",
        pathname: "/assets/**",
      },
      {
        protocol: "https",
        hostname: "cms.example.com",
        pathname: "/assets/**",
      },
    ]);
  });

  it("treats http(s) CMS assets as remote", () => {
    expect(isRemoteAsset("http://localhost:8055/assets/file-1")).toBe(true);
    expect(isRemoteAsset("/images/forum.webp")).toBe(false);
  });
});
