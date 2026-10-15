import type { Metadata } from "next";
import { routing, type Locale } from "@/i18n/routing";
import { getSiteUrl } from "@/lib/site";

export const OPEN_GRAPH_LOCALE: Record<Locale, string> = {
  en: "en_US",
  ar: "ar_AR",
};

function normalizePathSuffix(pathSuffix: string): string {
  if (!pathSuffix || pathSuffix === "/") {
    return "";
  }
  return pathSuffix.startsWith("/") ? pathSuffix : `/${pathSuffix}`;
}

export function localePath(locale: Locale, pathSuffix = ""): string {
  return `/${locale}${normalizePathSuffix(pathSuffix)}`;
}

export function languageAlternates(pathSuffix: string) {
  const base = getSiteUrl();
  const suffix = normalizePathSuffix(pathSuffix);
  return {
    en: `${base}/en${suffix}`,
    ar: `${base}/ar${suffix}`,
    "x-default": `${base}/en${suffix}`,
  };
}

export function buildLocaleAlternates(locale: Locale, pathSuffix: string) {
  return {
    canonical: localePath(locale, pathSuffix),
    languages: languageAlternates(pathSuffix),
  } satisfies Metadata["alternates"];
}

export function buildOpenGraphLocales(locale: Locale) {
  const alternateLocale = routing.locales
    .filter((entry) => entry !== locale)
    .map((entry) => OPEN_GRAPH_LOCALE[entry]);

  return {
    locale: OPEN_GRAPH_LOCALE[locale],
    alternateLocale,
  };
}

export type PageMetadataInput = {
  locale: Locale;
  pathSuffix: string;
  title: string;
  description: string;
  openGraphTitle?: string;
};

export function buildPageMetadata({
  locale,
  pathSuffix,
  title,
  description,
  openGraphTitle,
}: PageMetadataInput): Metadata {
  const canonical = localePath(locale, pathSuffix);
  const ogLocales = buildOpenGraphLocales(locale);
  const ogTitle = openGraphTitle ?? title;

  return {
    title,
    description,
    alternates: buildLocaleAlternates(locale, pathSuffix),
    openGraph: {
      type: "website",
      siteName: "Inventure Communications",
      url: canonical,
      title: ogTitle,
      description,
      ...ogLocales,
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
    },
  };
}
