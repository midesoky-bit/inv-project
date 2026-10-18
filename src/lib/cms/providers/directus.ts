import type { Locale } from "@/i18n/routing";
import { cmsFetch } from "@/lib/cms/client";
import {
  directusServiceBySlugQuery,
  directusServicesQuery,
  mapDirectusCareer,
  mapDirectusEsg,
  mapDirectusInsight,
  mapDirectusService,
  type DirectusCareerRow,
  type DirectusEsgRow,
  type DirectusInsightRow,
  type DirectusServiceRow,
} from "@/lib/cms/directus-map";
import { CmsError } from "@/lib/cms/errors";
import type { Career, CaseStudy, EsgCommitment, Insight, Service } from "@/types/cms";

type DirectusList<T> = { data: T[] };

function serviceTags(locale: Locale, slug?: string): string[] {
  const tags = ["services", `services:${locale}`];
  if (slug) tags.push(`service:${slug}`, `service:${locale}:${slug}`);
  return tags;
}

function isForbidden(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    /responded 403/.test(String((error as { message: unknown }).message))
  );
}

async function emptyIfMissing<T>(path: string, tags: string[]): Promise<T[]> {
  try {
    const result = await cmsFetch<DirectusList<T>>(path, { tags });
    return result.data ?? [];
  } catch (error) {
    if (error instanceof CmsError && (error.code === "NOT_FOUND" || isForbidden(error))) {
      return [];
    }
    throw error;
  }
}

async function fetchServiceRows(
  locale: Locale,
  slug?: string,
): Promise<DirectusServiceRow[]> {
  const tags = serviceTags(locale, slug);
  const primary = slug
    ? directusServiceBySlugQuery(slug, locale)
    : directusServicesQuery(locale);
  try {
    const result = await cmsFetch<DirectusList<DirectusServiceRow>>(primary, { tags });
    return result.data ?? [];
  } catch (error) {
    if (!isForbidden(error)) throw error;
    try {
      const fallback = slug
        ? directusServiceBySlugQuery(slug, locale, false)
        : directusServicesQuery(locale, false);
      const result = await cmsFetch<DirectusList<DirectusServiceRow>>(fallback, { tags });
      return result.data ?? [];
    } catch (retryError) {
      if (isForbidden(retryError) || (retryError instanceof CmsError && retryError.code === "NOT_FOUND")) {
        return [];
      }
      throw retryError;
    }
  }
}

export async function directusFetchServices(locale: Locale): Promise<Service[]> {
  const rows = await fetchServiceRows(locale);
  return rows.map(mapDirectusService).sort((a, b) => a.order - b.order);
}

export async function directusFetchServiceBySlug(
  slug: string,
  locale: Locale,
): Promise<Service | null> {
  try {
    const rows = await fetchServiceRows(locale, slug);
    const row = rows[0];
    return row ? mapDirectusService(row) : null;
  } catch (error) {
    if (error instanceof CmsError && error.code === "NOT_FOUND") return null;
    throw error;
  }
}

export async function directusFetchInsights(locale: Locale): Promise<Insight[]> {
  const params = new URLSearchParams({
    fields: "id,slug,published_at,translations.title,translations.summary",
    sort: "-published_at",
    "filter[status][_eq]": "published",
  });
  params.set("deep[translations][_filter][languages_code][_eq]", locale);
  const rows = await emptyIfMissing<DirectusInsightRow>(
    `/items/insights?${params.toString()}`,
    ["insights", `insights:${locale}`],
  );
  return rows.map(mapDirectusInsight);
}

export async function directusFetchCareers(locale: Locale): Promise<Career[]> {
  const params = new URLSearchParams({
    fields: "id,translations.title,translations.summary,translations.location",
    "filter[status][_eq]": "published",
  });
  params.set("deep[translations][_filter][languages_code][_eq]", locale);
  const rows = await emptyIfMissing<DirectusCareerRow>(
    `/items/careers?${params.toString()}`,
    ["careers", `careers:${locale}`],
  );
  return rows.map(mapDirectusCareer);
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
