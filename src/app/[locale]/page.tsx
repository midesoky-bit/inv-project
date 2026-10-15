import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { HeroSection } from "@/components/home/HeroSection";
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
  const services = await fetchServices(cmsLocale);
  const esgCommitments = await fetchEsgCommitments(cmsLocale);
  const tInsights = await getTranslations("insights");
  const tEsg = await getTranslations("esg");

  return (
    <>
      <HeroSection />
      <ServiceGrid services={services} />
      <section
        id="insights"
        className="border-t border-border bg-background px-6 py-20 md:py-24"
        aria-labelledby="insights-heading"
      >
        <div className="mx-auto max-w-6xl">
          <h2
            id="insights-heading"
            className="font-serif text-3xl tracking-tight text-foreground md:text-4xl"
          >
            {tInsights("title")}
          </h2>
          <p className="mt-4 max-w-2xl text-base text-muted">
            {tInsights("comingSoon")}
          </p>
        </div>
      </section>
      <section
        id="esg"
        className="border-t border-border bg-surface-muted px-6 py-20 md:py-24"
        aria-labelledby="esg-heading"
      >
        <div className="mx-auto max-w-6xl">
          <h2
            id="esg-heading"
            className="font-serif text-3xl tracking-tight text-foreground md:text-4xl"
          >
            {tEsg("title")}
          </h2>
          {esgCommitments.length > 0 ? (
            <ul className="mt-8 grid gap-6 md:grid-cols-3">
              {esgCommitments.map((item) => (
                <li
                  key={item.id}
                  className="border border-border bg-surface p-6"
                >
                  <h3 className="font-serif text-xl text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">
                    {item.summary}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 max-w-2xl text-base text-muted">
              {tEsg("comingSoon")}
            </p>
          )}
        </div>
      </section>
    </>
  );
}
