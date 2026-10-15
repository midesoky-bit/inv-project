import { beforeEach, describe, expect, it } from "vitest";
import {
  fetchServiceBySlug,
  fetchServices,
  fetchInsights,
  fetchEsgCommitments,
  fetchCaseStudies,
} from "@/services/cms";

describe("cms service (mock provider)", () => {
  beforeEach(() => {
    process.env.CMS_PROVIDER = "mock";
  });

  it("returns ordered services including public affairs", async () => {
    const services = await fetchServices();
    expect(services.length).toBeGreaterThanOrEqual(4);
    expect(services.map((s) => s.slug)).toContain("public-affairs");
    const orders = services.map((s) => s.order);
    expect(orders).toEqual([...orders].sort((a, b) => a - b));
  });

  it("fetches a service by slug", async () => {
    const service = await fetchServiceBySlug("media-production");
    expect(service).not.toBeNull();
    expect(service?.title).toMatch(/media production/i);
  });

  it("returns null for unknown slug", async () => {
    expect(await fetchServiceBySlug("does-not-exist")).toBeNull();
  });

  it("exposes future content helpers", async () => {
    await expect(fetchInsights()).resolves.toEqual([]);
    await expect(fetchEsgCommitments()).resolves.toEqual([]);
    await expect(fetchCaseStudies()).resolves.toEqual([]);
  });
});
