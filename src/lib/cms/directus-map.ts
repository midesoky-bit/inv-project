import type { EsgCommitment, Service } from "@/types/cms";

export type DirectusTranslation = {
  languages_code?: string;
  title?: string | null;
  summary?: string | null;
  description?: string | null;
  highlights?: string[] | null;
};

export type DirectusServiceRow = {
  id: string | number;
  slug: string;
  order?: number | null;
  icon?: string | null;
  translations?: DirectusTranslation[] | DirectusTranslation | null;
};

export type DirectusEsgRow = {
  id: string | number;
  order?: number | null;
  translations?: DirectusTranslation[] | DirectusTranslation | null;
};

function firstTranslation(
  translations: DirectusTranslation[] | DirectusTranslation | null | undefined,
): DirectusTranslation | undefined {
  if (!translations) return undefined;
  return Array.isArray(translations) ? translations[0] : translations;
}

export function mapDirectusService(row: DirectusServiceRow): Service {
  const translation = firstTranslation(row.translations);
  return {
    id: String(row.id),
    slug: row.slug,
    order: row.order ?? 0,
    icon: row.icon ?? undefined,
    title: translation?.title ?? "",
    summary: translation?.summary ?? "",
    description: translation?.description ?? "",
    highlights: translation?.highlights ?? [],
  };
}

export function mapDirectusEsg(row: DirectusEsgRow): EsgCommitment {
  const translation = firstTranslation(row.translations);
  return {
    id: String(row.id),
    order: row.order ?? 0,
    title: translation?.title ?? "",
    summary: translation?.summary ?? "",
  };
}

export function directusServicesQuery(locale: string): string {
  const params = new URLSearchParams({
    fields: "id,slug,order,icon,translations.title,translations.summary,translations.description,translations.highlights",
    sort: "order",
    "filter[status][_eq]": "published",
  });
  params.set("deep[translations][_filter][languages_code][_eq]", locale);
  return `/items/services?${params.toString()}`;
}

export function directusServiceBySlugQuery(slug: string, locale: string): string {
  const params = new URLSearchParams({
    fields: "id,slug,order,icon,translations.title,translations.summary,translations.description,translations.highlights",
    limit: "1",
    "filter[slug][_eq]": slug,
    "filter[status][_eq]": "published",
  });
  params.set("deep[translations][_filter][languages_code][_eq]", locale);
  return `/items/services?${params.toString()}`;
}
