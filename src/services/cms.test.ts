import { beforeEach, describe, expect, it } from "vitest";
import {
  ESG_COMMITMENT_RECORDS,
  SERVICE_RECORDS,
} from "@/lib/cms/providers/mock";
import type { LocalizedString } from "@/types/cms";
import {
  mapDirectusEsg,
  mapDirectusService,
  directusServiceBySlugQuery,
  directusServicesQuery,
} from "@/lib/cms/directus-map";
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
      expect(record.highlights.en.length).toBeGreaterThan(0);
      expect(record.highlights.ar.length).toBe(record.highlights.en.length);
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

  it("defaults locale to English", async () => {
    const services = await fetchServices();
    expect(services[0]?.title).toBe("Media Production");
  });
});

describe("Directus response mapper", () => {
  it("flattens the requested locale translation onto Service", () => {
    const service = mapDirectusService({
      id: 7,
      slug: "digital-media-platforms",
      order: 3,
      icon: "digital",
      translations: [
        {
          languages_code: "en",
          title: "Digital Media & Platforms",
          summary: "Digital presence",
          description: "We manage digital presence.",
          highlights: ["Campaign design and execution"],
        },
      ],
    });

    expect(service).toEqual({
      id: "7",
      slug: "digital-media-platforms",
      order: 3,
      icon: "digital",
      image: undefined,
      title: "Digital Media & Platforms",
      summary: "Digital presence",
      description: "We manage digital presence.",
      highlights: ["Campaign design and execution"],
    });
  });

  it("maps a Directus file id to an asset URL", () => {
    delete process.env.DIRECTUS_PUBLIC_URL;
    process.env.CMS_URL = "http://cms.example:8055";
    expect(
      mapDirectusService({
        id: 7,
        slug: "digital-media-platforms",
        image: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        translations: [{ title: "Digital" }],
      }).image,
    ).toBe(
      "http://cms.example:8055/assets/a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    );
  });

  it("maps a nested Directus file object to an asset URL", () => {
    delete process.env.DIRECTUS_PUBLIC_URL;
    process.env.CMS_URL = "http://cms.example:8055";
    expect(
      mapDirectusService({
        id: 7,
        slug: "digital-media-platforms",
        image: { id: "file-99" },
        translations: [{ title: "Digital" }],
      }).image,
    ).toBe("http://cms.example:8055/assets/file-99");
  });

  it("uses empty strings when the locale translation is missing", () => {
    const service = mapDirectusService({
      id: "1",
      slug: "media-production",
      translations: [],
    });
    expect(service.title).toBe("");
    expect(service.highlights).toEqual([]);
  });

  it("maps ESG translations", () => {
    expect(
      mapDirectusEsg({
        id: "esg-1",
        order: 1,
        translations: { title: "عمليات مسؤولة", summary: "نموذج رقمي" },
      }),
    ).toMatchObject({
      id: "esg-1",
      title: "عمليات مسؤولة",
      order: 1,
    });
  });

  it("asks Directus for one locale via a deep translation filter", () => {
    const query = decodeURIComponent(directusServicesQuery("ar"));
    expect(query).toContain("deep[translations][_filter][languages_code][_eq]=ar");
    expect(query).toContain("fields=id,slug,order,icon,image,translations.title");
    expect(query).toContain("filter[status][_eq]=published");
    expect(decodeURIComponent(directusServiceBySlugQuery("media-production", "ar"))).toContain(
      "fields=id,slug,order,icon,image,translations.title",
    );
  });
});
