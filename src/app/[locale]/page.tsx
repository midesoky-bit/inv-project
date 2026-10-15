import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { HeroSection } from "@/components/home/HeroSection";
import { PresenceStrip } from "@/components/home/PresenceStrip";
import {
  AboutSection,
  AdvantageSection,
  CapabilitySection,
  ClientsSection,
  EsgSection,
  ImpactSection,
  PositioningSection,
  PrinciplesSection,
} from "@/components/home/ProfileSections";
import { ServiceGrid } from "@/components/home/ServiceGrid";
import { routing, type Locale } from "@/i18n/routing";
import { buildPageMetadata } from "@/lib/metadata";
import { fetchEsgCommitments, fetchServices } from "@/services/cms";

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
  const [services, esgCommitments] = await Promise.all([
    fetchServices(cmsLocale),
    fetchEsgCommitments(cmsLocale),
  ]);

  return (
    <>
      <HeroSection />
      <AboutSection />
      <PositioningSection />
      <PresenceStrip />
      <ServiceGrid services={services} />
      <ImpactSection />
      <CapabilitySection />
      <AdvantageSection />
      <EsgSection commitments={esgCommitments} />
      <ClientsSection />
      <PrinciplesSection />
    </>
  );
}
