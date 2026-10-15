import type { Locale } from "@/i18n/routing";
import { cmsFetch } from "@/lib/cms/client";
import { CmsError } from "@/lib/cms/errors";
import type {
  CaseStudy,
  EsgCommitment,
  Insight,
  Service,
} from "@/types/cms";

type DirectusList<T> = { data: T[] };
type DirectusItem<T> = { data: T };

export async function directusFetchServices(locale: Locale): Promise<Service[]> {
  const result = await cmsFetch<DirectusList<Service>>(
    "/items/services?sort=order",
    { tags: [`services:${locale}`] },
  );
  return result.data;
}

export async function directusFetchServiceBySlug(
  slug: string,
  locale: Locale,
): Promise<Service | null> {
  try {
    const result = await cmsFetch<DirectusList<Service>>(
      `/items/services?filter[slug][_eq]=${encodeURIComponent(slug)}&limit=1`,
      { tags: [`services:${locale}`, `service:${locale}:${slug}`] },
    );
    return result.data[0] ?? null;
  } catch (error) {
    if (error instanceof CmsError && error.code === "NOT_FOUND") return null;
    throw error;
  }
}

export async function directusFetchInsights(locale: Locale): Promise<Insight[]> {
  const result = await cmsFetch<DirectusList<Insight>>("/items/insights", {
    tags: [`insights:${locale}`],
  });
  return result.data;
}

export async function directusFetchEsgCommitments(
  locale: Locale,
): Promise<EsgCommitment[]> {
  const result = await cmsFetch<DirectusList<EsgCommitment>>(
    "/items/esg_commitments?sort=order",
    { tags: [`esg:${locale}`] },
  );
  return result.data;
}

export async function directusFetchCaseStudies(
  locale: Locale,
): Promise<CaseStudy[]> {
  const result = await cmsFetch<DirectusList<CaseStudy>>("/items/case_studies", {
    tags: [`case-studies:${locale}`],
  });
  return result.data;
}

// Reserved for single-item patterns
export type { DirectusItem };
