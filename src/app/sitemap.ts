import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";
import { fetchServices } from "@/services/cms";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const services = await fetchServices();

  return [
    {
      url: base,
      changeFrequency: "monthly" as const,
      priority: 1,
    },
    ...services.map((service) => ({
      url: `${base}/services/${service.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
