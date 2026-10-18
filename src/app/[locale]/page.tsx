import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { HeroSection } from "@/components/home/HeroSection";
import {
  ContactModel,
  HomeCta,
  HomeServices,
  HomeTeasers,
  HowWeWork,
  WhySection,
} from "@/components/home/HomeContent";
import { ScrollReveal } from "@/components/home/ScrollReveal";
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

  return buildPageMetadata({
    locale: cmsLocale,
    pathSuffix: "",
    title: `${tBrand("name")} — ${tHero("title")}`,
    description: tHero("subtitle"),
    openGraphTitle: `${tBrand("name")} — ${tHero("title")}`,
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
        <HomeServices services={services} />
      </ScrollReveal>
      <ScrollReveal>
        <ContactModel />
      </ScrollReveal>
      <ScrollReveal>
        <HowWeWork />
      </ScrollReveal>
      <ScrollReveal>
        <WhySection />
      </ScrollReveal>
      <HomeTeasers />
      <HomeCta />
    </div>
  );
}
