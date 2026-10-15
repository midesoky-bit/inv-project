import type { Locale } from "@/i18n/routing";
import { cmsFetch } from "@/lib/cms/client";
import {
  directusServiceBySlugQuery,
  directusServicesQuery,
  mapDirectusEsg,
  mapDirectusService,
  type DirectusEsgRow,
  type DirectusServiceRow,
} from "@/lib/cms/directus-map";
import { CmsError } from "@/lib/cms/errors";
import type { CaseStudy, EsgCommitment, Insight, Service } from "@/types/cms";

type DirectusList<T> = { data: T[] };

function serviceTags(locale: Locale, slug?: string): string[] {
  const tags = ["services", `services:${locale}`];
  if (slug) tags.push(`service:${slug}`, `service:${locale}:${slug}`);
  return tags;
}

async function emptyIfMissing<T>(path: string, tags: string[]): Promise<T[]> {
  try {
    const result = await cmsFetch<DirectusList<T>>(path, { tags });
    return result.data ?? [];
  } catch (error) {
    if (
      error instanceof CmsError &&
      (error.code === "NOT_FOUND" || /responded 403/.test(error.message))
    ) {
      return [];
    }
    throw error;
  }
}

export async function directusFetchServices(locale: Locale): Promise<Service[]> {
  const result = await cmsFetch<DirectusList<DirectusServiceRow>>(
    directusServicesQuery(locale),
    { tags: serviceTags(locale) },
  );
  return result.data.map(mapDirectusService).sort((a, b) => a.order - b.order);
}

export async function directusFetchServiceBySlug(
  slug: string,
  locale: Locale,
): Promise<Service | null> {
  try {
    const result = await cmsFetch<DirectusList<DirectusServiceRow>>(
      directusServiceBySlugQuery(slug, locale),
      { tags: serviceTags(locale, slug) },
    );
    const row = result.data[0];
    return row ? mapDirectusService(row) : null;
  } catch (error) {
    if (error instanceof CmsError && error.code === "NOT_FOUND") return null;
    throw error;
  }
}

export async function directusFetchInsights(locale: Locale): Promise<Insight[]> {
  return emptyIfMissing<Insight>("/items/insights", [`insights:${locale}`]);
}

export async function directusFetchEsgCommitments(
  locale: Locale,
): Promise<EsgCommitment[]> {
  const params = new URLSearchParams({
    fields: "id,order,translations.title,translations.summary",
    sort: "order",
  });
  params.set("deep[translations][_filter][languages_code][_eq]", locale);
  const rows = await emptyIfMissing<DirectusEsgRow>(
    `/items/esg_commitments?${params.toString()}`,
    ["esg", `esg:${locale}`],
  );
  return rows.map(mapDirectusEsg).sort((a, b) => a.order - b.order);
}

export async function directusFetchCaseStudies(
  locale: Locale,
): Promise<CaseStudy[]> {
  return emptyIfMissing<CaseStudy>("/items/case_studies", [
    `case-studies:${locale}`,
  ]);
}
