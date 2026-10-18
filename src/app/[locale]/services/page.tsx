import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ServiceGrid } from "@/components/home/ServiceGrid";
import { ServicesHero } from "@/components/services/ServicesHero";
import { Button } from "@/components/ui/Button";
import { PAGE_GUTTER } from "@/lib/layout";
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

  const t = await getTranslations("services");

  return (
    <div className="bg-background">
      <ServicesHero />
      <ServiceGrid services={visible} />
      <section className={`border-t border-border bg-brand ${PAGE_GUTTER} py-14 text-brand-foreground md:py-16`}>
        <h2 className="font-serif text-3xl tracking-tight md:text-4xl">
          {t("multiTitle")}
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-brand-foreground/80">
          {t("multiBody")}
        </p>
        <div className="mt-8">
          <Button href="/contact">{t("multiCta")}</Button>
        </div>
      </section>
    </div>
  );
}
