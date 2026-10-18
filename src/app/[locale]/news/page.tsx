import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";
import { PAGE_GUTTER } from "@/lib/layout";
import { buildPageMetadata } from "@/lib/metadata";
import { fetchInsights } from "@/services/cms";

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
  const t = await getTranslations("news");

  return buildPageMetadata({
    locale: locale as Locale,
    pathSuffix: "/news",
    title: t("title"),
    description: t("description"),
  });
}

export default async function NewsPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [insights, t] = await Promise.all([
    fetchInsights(locale as Locale),
    getTranslations("news"),
  ]);
  const categories = [
    { title: t("press"), body: t("pressBody") },
    { title: t("events"), body: t("eventsBody") },
    { title: t("gallery"), body: t("galleryBody") },
    { title: t("video"), body: t("videoBody") },
  ];

  return (
    <section className={`${PAGE_GUTTER} pt-28 pb-16`} aria-labelledby="news-heading">
      <h1
        id="news-heading"
        className="font-serif text-4xl tracking-tight text-balance md:text-5xl"
      >
        {t("title")}
      </h1>
      <p className="mt-6 max-w-3xl text-base leading-relaxed text-muted">
        {t("description")}
      </p>
      <ul className="mt-12 grid gap-6 md:grid-cols-2">
        {categories.map((item) => (
          <li key={item.title} className="rounded-xl border border-border bg-surface p-8">
            <h2 className="font-serif text-2xl text-foreground">{item.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">{item.body}</p>
          </li>
        ))}
      </ul>
      <h2 className="mt-16 font-serif text-3xl text-foreground">{t("latest")}</h2>
      {insights.length === 0 ? (
        <p className="mt-6 max-w-3xl text-base text-muted">{t("empty")}</p>
      ) : (
        <ul className="mt-8 grid gap-4">
          {insights.map((item) => (
            <li key={item.id} className="border border-border bg-surface p-6">
              <h3 className="font-serif text-xl text-foreground">{item.title}</h3>
              <p className="mt-2 text-sm text-muted">
                <time dateTime={item.publishedAt}>{item.publishedAt}</time>
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted">{item.summary}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
