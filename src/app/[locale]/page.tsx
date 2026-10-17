import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { AboutTeaser } from "@/components/home/AboutTeaser";
import { HeroSection } from "@/components/home/HeroSection";
import { PresenceStrip } from "@/components/home/PresenceStrip";
import { ScrollReveal } from "@/components/home/ScrollReveal";
import { StatsBar } from "@/components/home/StatsBar";
import { routing, type Locale } from "@/i18n/routing";
import { buildPageMetadata } from "@/lib/metadata";
import { fetchServices } from "@/services/cms";

export const revalidate = 3600;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const cmsLocale = locale as Locale;
  const tHero = await getTranslations("hero");
  const tBrand = await getTranslations("brand");
  const heroTitle = tHero.markup("title", {
    g: (chunks) => chunks,
  });

  return buildPageMetadata({
    locale: cmsLocale,
    pathSuffix: "",
    title: `${tBrand("name")} — ${heroTitle}`,
    description: tHero("subtitle"),
    openGraphTitle: `${tBrand("name")} — ${heroTitle}`,
  });
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const cmsLocale = locale as Locale;
  const services = await fetchServices(cmsLocale);

  return (
    <div>
      <HeroSection services={services} />
      <ScrollReveal>
        <AboutTeaser />
      </ScrollReveal>
      <ScrollReveal delay={0.05}>
        <StatsBar />
      </ScrollReveal>
      <ScrollReveal delay={0.08}>
        <PresenceStrip />
      </ScrollReveal>
    </div>
  );
}
