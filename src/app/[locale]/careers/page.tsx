import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";
import { buildPageMetadata } from "@/lib/metadata";
import { fetchCareers } from "@/services/cms";

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
  const t = await getTranslations("careers");
  const title = t.markup("title", {
    g: (chunks) => chunks,
  });

  return buildPageMetadata({
    locale: cmsLocale,
    pathSuffix: "/careers",
    title,
    description: t("description"),
    openGraphTitle: title,
  });
}

export default async function CareersPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const cmsLocale = locale as Locale;
  const [careers, t] = await Promise.all([
    fetchCareers(cmsLocale),
    getTranslations("careers"),
  ]);

  return (
    <section
      aria-labelledby="careers-heading"
      className="mx-auto w-full max-w-6xl px-6 pt-28 pb-16"
    >
      <h1
        id="careers-heading"
        className="font-serif text-4xl tracking-tight text-balance md:text-5xl"
      >
        {t.rich("title", {
          g: (chunks) => <span className="text-accent">{chunks}</span>,
        })}
      </h1>
      {careers.length === 0 ? (
        <p className="mt-8 max-w-2xl text-base text-muted">{t("empty")}</p>
      ) : (
        <ul className="mt-8 grid gap-4">
          {careers.map((item) => (
            <li key={item.id} className="border border-border bg-surface p-6">
              <h2 className="font-serif text-xl text-foreground">{item.title}</h2>
              <p className="mt-2 text-sm text-muted">{item.location}</p>
              <p className="mt-3 text-sm leading-relaxed text-muted">{item.summary}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
