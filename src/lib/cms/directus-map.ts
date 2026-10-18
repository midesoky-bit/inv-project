import type { Career, EsgCommitment, Insight, Service } from "@/types/cms";

export type DirectusTranslation = {
  languages_code?: string;
  title?: string | null;
  summary?: string | null;
  description?: string | null;
  highlights?: string[] | null;
  location?: string | null;
};

export type DirectusFileRef = string | { id?: string | null } | null;

export type DirectusServiceRow = {
  id: string | number;
  slug: string;
  order?: number | null;
  icon?: string | null;
  image?: DirectusFileRef;
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

function cmsAssetBase(): string {
  return (process.env.CMS_URL ?? process.env.DIRECTUS_PUBLIC_URL ?? "").replace(
    /\/$/,
    "",
  );
}

export function directusAssetUrl(file: DirectusFileRef | undefined): string | undefined {
  if (!file) return undefined;
  const id = typeof file === "string" ? file : file.id;
  if (!id) return undefined;
  if (/^https?:\/\//.test(id)) return id;
  const base = cmsAssetBase();
  if (!base) return undefined;
  return `${base}/assets/${id}`;
}

export function mapDirectusService(row: DirectusServiceRow): Service {
  const translation = firstTranslation(row.translations);
  return {
    id: String(row.id),
    slug: row.slug,
    order: row.order ?? 0,
    icon: row.icon ?? undefined,
    image: directusAssetUrl(row.image),
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

export type DirectusInsightRow = {
  id: string | number;
  slug: string;
  published_at?: string | null;
  translations?:
    | { title?: string | null; summary?: string | null }[]
    | { title?: string | null; summary?: string | null }
    | null;
};

export type DirectusCareerRow = {
  id: string | number;
  translations?:
    | { title?: string | null; summary?: string | null; location?: string | null }[]
    | { title?: string | null; summary?: string | null; location?: string | null }
    | null;
};

export function mapDirectusInsight(row: DirectusInsightRow): Insight {
  const translation = firstTranslation(row.translations);
  return {
    id: String(row.id),
    slug: row.slug,
    title: translation?.title ?? "",
    summary: translation?.summary ?? "",
    publishedAt: row.published_at ?? "",
  };
}

export function mapDirectusCareer(row: DirectusCareerRow): Career {
  const translation = firstTranslation(row.translations);
  return {
    id: String(row.id),
    title: translation?.title ?? "",
    summary: translation?.summary ?? "",
    location: translation?.location ?? "",
  };
}

function serviceFields(includeImage: boolean) {
  return includeImage
    ? "id,slug,order,icon,image,translations.title,translations.summary,translations.description,translations.highlights"
    : "id,slug,order,icon,translations.title,translations.summary,translations.description,translations.highlights";
}

export function directusServicesQuery(locale: string, includeImage = true): string {
  const params = new URLSearchParams({
    fields: serviceFields(includeImage),
    sort: "order",
    "filter[status][_eq]": "published",
  });
  params.set("deep[translations][_filter][languages_code][_eq]", locale);
  return `/items/services?${params.toString()}`;
}

export function directusServiceBySlugQuery(
  slug: string,
  locale: string,
  includeImage = true,
): string {
  const params = new URLSearchParams({
    fields: serviceFields(includeImage),
    limit: "1",
    "filter[slug][_eq]": slug,
    "filter[status][_eq]": "published",
  });
  params.set("deep[translations][_filter][languages_code][_eq]", locale);
  return `/items/services?${params.toString()}`;
}
