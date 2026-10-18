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
  const t = await getTranslations("clientsPage");

  return buildPageMetadata({
    locale: locale as Locale,
    pathSuffix: "/clients",
    title: t("title"),
    description: t("intro"),
  });
}

export default async function ClientsPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("clientsPage");
  const items = t.raw("items") as string[];

  return (
    <section className={`${PAGE_GUTTER} pt-28 pb-16`} aria-labelledby="clients-heading">
      <h1
        id="clients-heading"
        className="font-serif text-4xl tracking-tight text-balance md:text-5xl"
      >
        {t("title")}
      </h1>
      <p className="mt-6 max-w-3xl text-base leading-relaxed text-muted">{t("intro")}</p>
      <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted">{t("body")}</p>
      <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted">{t("showcase")}</p>
      <ul className="mt-12 grid gap-4 sm:grid-cols-2">
        {items.map((item) => (
          <li
            key={item}
            className="flex min-h-32 items-center justify-center rounded-xl border border-border bg-surface p-8 text-center font-serif text-xl text-foreground"
          >
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
