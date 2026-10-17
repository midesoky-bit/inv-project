import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ScrollReveal } from "@/components/home/ScrollReveal";
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
import { routing, type Locale } from "@/i18n/routing";
import { buildPageMetadata } from "@/lib/metadata";
import { fetchEsgCommitments } from "@/services/cms";

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
  const tAbout = await getTranslations("about");
  const aboutTitle = tAbout.markup("title", {
    g: (chunks) => chunks,
  });
  const paragraphs = tAbout.raw("paragraphs") as string[];

  return buildPageMetadata({
    locale: cmsLocale,
    pathSuffix: "/about",
    title: aboutTitle,
    description: paragraphs[0] ?? "",
  });
}

export default async function AboutPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const cmsLocale = locale as Locale;
  const esgCommitments = await fetchEsgCommitments(cmsLocale);

  return (
    <div>
      <ScrollReveal>
        <AboutSection />
      </ScrollReveal>
      <ScrollReveal delay={0.05}>
        <PositioningSection />
      </ScrollReveal>
      <ScrollReveal>
        <ImpactSection />
      </ScrollReveal>
      <ScrollReveal>
        <CapabilitySection />
      </ScrollReveal>
      <ScrollReveal>
        <AdvantageSection />
      </ScrollReveal>
      <ScrollReveal>
        <ClientsSection />
      </ScrollReveal>
      <ScrollReveal>
        <PrinciplesSection />
      </ScrollReveal>
      <ScrollReveal>
        <EsgSection commitments={esgCommitments} />
      </ScrollReveal>
    </div>
  );
}
