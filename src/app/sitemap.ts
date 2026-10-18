import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { languageAlternates, localePath } from "@/lib/metadata";
import { getSiteUrl } from "@/lib/site";
import { fetchServices } from "@/services/cms";

export const revalidate = 3600;

const STATIC_PATHS = [
  "",
  "/about",
  "/services",
  "/team",
  "/work",
  "/news",
  "/clients",
  "/partners",
  "/contact",
  "/privacy",
  "/terms",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const services = await fetchServices("en");

  const staticEntries: MetadataRoute.Sitemap = routing.locales.flatMap((locale) =>
    STATIC_PATHS.map((path) => ({
      url: `${getSiteUrl()}${localePath(locale, path)}`,
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1 : 0.8,
      alternates: {
        languages: languageAlternates(path),
      },
    })),
  );

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

  return [...staticEntries, ...serviceEntries];
}
