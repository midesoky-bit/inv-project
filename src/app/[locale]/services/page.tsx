import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ServiceGrid } from "@/components/home/ServiceGrid";
import { ServicesHero } from "@/components/services/ServicesHero";
import { routing, type Locale } from "@/i18n/routing";
import { buildPageMetadata } from "@/lib/metadata";
import { fetchServices } from "@/services/cms";

export const revalidate = 3600;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

type PageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const cmsLocale = locale as Locale;
  const tServices = await getTranslations("services");
  const title = tServices.markup("heroTitle", {
    g: (chunks) => chunks,
    br: () => " ",
  });

  return buildPageMetadata({
    locale: cmsLocale,
    pathSuffix: "/services",
    title,
    description: tServices("intro"),
    openGraphTitle: title,
  });
}

export default async function ServicesPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  const { q } = await searchParams;
  setRequestLocale(locale);

  const cmsLocale = locale as Locale;
  const services = await fetchServices(cmsLocale);
  const query = q?.trim().toLowerCase() ?? "";
  const visible = query
    ? services.filter((service) =>
        `${service.title} ${service.summary}`.toLowerCase().includes(query),
      )
    : services;

  return (
    <div className="bg-background">
      <ServicesHero />
      <ServiceGrid services={visible} />
    </div>
  );
}
