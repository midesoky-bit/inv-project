import { beforeEach, describe, expect, it } from "vitest";
import {
  ESG_COMMITMENT_RECORDS,
  SERVICE_RECORDS,
} from "@/lib/cms/providers/mock";
import type { LocalizedString } from "@/types/cms";
import {
  fetchServiceBySlug,
  fetchServices,
  fetchInsights,
  fetchEsgCommitments,
  fetchCaseStudies,
} from "@/services/cms";

const ARABIC = /[\u0600-\u06FF]/;

function localizedFieldsComplete(value: LocalizedString): boolean {
  return Boolean(value.en.trim() && value.ar.trim());
}

describe("cms service (mock provider)", () => {
  beforeEach(() => {
    process.env.CMS_PROVIDER = "mock";
  });

  it("returns seven ordered services in English", async () => {
    const services = await fetchServices("en");
    expect(services).toHaveLength(7);
    const orders = services.map((s) => s.order);
    expect(orders).toEqual([...orders].sort((a, b) => a - b));
    expect(services.map((s) => s.slug)).toEqual([
      "media-production",
      "media-content-management",
      "digital-media-platforms",
      "public-relations-partnerships",
      "events-exhibitions",
      "public-affairs-government-relations",
      "capital-markets-financial-communications",
    ]);
  });

  it("returns three ESG commitments in English", async () => {
    const commitments = await fetchEsgCommitments("en");
    expect(commitments).toHaveLength(3);
  });

  it("returns Arabic titles for Arabic locale", async () => {
    const services = await fetchServices("ar");
    expect(services[0]?.title).toMatch(ARABIC);
    const esg = await fetchEsgCommitments("ar");
    expect(esg[0]?.title).toMatch(ARABIC);
  });

  it("fetches a service by slug", async () => {
    const service = await fetchServiceBySlug("media-production", "en");
    expect(service).not.toBeNull();
    expect(service?.title).toMatch(/media production/i);
  });

  it("returns null for unknown slug", async () => {
    expect(await fetchServiceBySlug("does-not-exist", "en")).toBeNull();
  });

  it("keeps every underlying record fully localized", () => {
    for (const record of SERVICE_RECORDS) {
      expect(localizedFieldsComplete(record.title)).toBe(true);
      expect(localizedFieldsComplete(record.summary)).toBe(true);
      expect(localizedFieldsComplete(record.description)).toBe(true);
    }
    for (const record of ESG_COMMITMENT_RECORDS) {
      expect(localizedFieldsComplete(record.title)).toBe(true);
      expect(localizedFieldsComplete(record.summary)).toBe(true);
    }
  });

  it("exposes empty insights and case studies helpers", async () => {
    await expect(fetchInsights("en")).resolves.toEqual([]);
    await expect(fetchCaseStudies("en")).resolves.toEqual([]);
  });
});
