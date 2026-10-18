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
  const t = await getTranslations("legal");

  return buildPageMetadata({
    locale: locale as Locale,
    pathSuffix: "/terms",
    title: t("termsTitle"),
    description: t("termsBody"),
  });
}

export default async function TermsPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("legal");

  return (
    <section className={`${PAGE_GUTTER} pt-28 pb-16`} aria-labelledby="terms-heading">
      <h1 id="terms-heading" className="font-serif text-4xl tracking-tight md:text-5xl">
        {t("termsTitle")}
      </h1>
      <p className="mt-8 max-w-3xl text-base leading-relaxed text-muted">
        {t("termsBody")}
      </p>
    </section>
  );
}
