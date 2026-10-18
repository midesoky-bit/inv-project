import { afterEach, describe, expect, it } from "vitest";
import {
  cmsAssetRemotePattern,
  cmsImageRemotePatterns,
  isRemoteAsset,
} from "@/lib/cms/image-hosts";

const originalPublicUrl = process.env.DIRECTUS_PUBLIC_URL;
const originalCmsUrl = process.env.CMS_URL;

afterEach(() => {
  if (originalPublicUrl === undefined) delete process.env.DIRECTUS_PUBLIC_URL;
  else process.env.DIRECTUS_PUBLIC_URL = originalPublicUrl;
  if (originalCmsUrl === undefined) delete process.env.CMS_URL;
  else process.env.CMS_URL = originalCmsUrl;
});

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

  it("skips the optimizer for browser-facing loopback Directus URLs", () => {
    process.env.DIRECTUS_PUBLIC_URL = "http://localhost:8055";
    process.env.CMS_URL = "http://directus:8055";
    expect(isRemoteAsset("http://localhost:8055/assets/file-1")).toBe(true);
    expect(isRemoteAsset("/images/forum.webp")).toBe(false);
  });

  it("keeps optimization for internal CMS URLs", () => {
    process.env.DIRECTUS_PUBLIC_URL = "http://localhost:8055";
    process.env.CMS_URL = "http://directus:8055";
    expect(isRemoteAsset("http://directus:8055/assets/file-1")).toBe(false);
  });

  it("keeps optimization for public CMS hosts", () => {
    process.env.DIRECTUS_PUBLIC_URL = "https://cms.example.com";
    process.env.CMS_URL = "https://cms.example.com";
    expect(isRemoteAsset("https://cms.example.com/assets/file-1")).toBe(false);
  });
});
