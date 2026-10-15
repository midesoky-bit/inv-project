import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { languageAlternates, localePath } from "@/lib/metadata";
import { getSiteUrl } from "@/lib/site";
import { fetchServices } from "@/services/cms";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const services = await fetchServices("en");

  const homeEntries: MetadataRoute.Sitemap = routing.locales.map((locale) => ({
    url: `${getSiteUrl()}${localePath(locale)}`,
    changeFrequency: "monthly" as const,
    priority: 1,
    alternates: {
      languages: languageAlternates(""),
    },
  }));

  const serviceEntries: MetadataRoute.Sitemap = routing.locales.flatMap(
    (locale) =>
      services.map((service) => ({
        url: `${getSiteUrl()}${localePath(locale, `/services/${service.slug}`)}`,
        changeFrequency: "monthly" as const,
        priority: 0.7,
        alternates: {
          languages: languageAlternates(`/services/${service.slug}`),
        },
      })),
  );

  return [...homeEntries, ...serviceEntries];
}
