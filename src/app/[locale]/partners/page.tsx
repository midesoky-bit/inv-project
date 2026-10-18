import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";
import { PAGE_GUTTER } from "@/lib/layout";
import { buildPageMetadata } from "@/lib/metadata";

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
  const t = await getTranslations("partnersPage");

  return buildPageMetadata({
    locale: locale as Locale,
    pathSuffix: "/partners",
    title: t("title"),
    description: t("intro"),
  });
}

export default async function PartnersPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("partnersPage");
  const items = t.raw("items") as string[];

  return (
    <section className={`${PAGE_GUTTER} pt-28 pb-16`} aria-labelledby="partners-heading">
      <h1
        id="partners-heading"
        className="font-serif text-4xl tracking-tight text-balance md:text-5xl"
      >
        {t("title")}
      </h1>
      <p className="mt-6 max-w-3xl text-base leading-relaxed text-muted">{t("intro")}</p>
      <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted">{t("body")}</p>
      <ul className="mt-12 grid gap-4 sm:grid-cols-3">
        {items.map((item) => (
          <li
            key={item}
            className="flex min-h-32 items-center justify-center rounded-xl border border-border bg-surface p-8 text-center font-serif text-lg text-foreground"
          >
            {item}
          </li>
        ))}
      </ul>
      <blockquote className="mt-12 max-w-3xl border-s-4 border-accent bg-brand/5 p-6">
        <p className="text-xs font-medium tracking-[0.18em] text-accent uppercase">
          {t("allianceTitle")}
        </p>
        <p className="mt-3 text-base leading-relaxed text-foreground">{t("alliance")}</p>
      </blockquote>
    </section>
  );
}
