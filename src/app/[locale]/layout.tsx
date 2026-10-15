import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { hasLocale } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Footer } from "@/components/layout/Footer";
import { HashScroll } from "@/components/layout/HashScroll";
import { Header } from "@/components/layout/Header";
import { SkipLink } from "@/components/layout/SkipLink";
import { ThemeColorMeta } from "@/components/layout/ThemeColorMeta";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { OrganizationJsonLd } from "@/components/seo/OrganizationJsonLd";
import { routing, type Locale } from "@/i18n/routing";
import { fontVariableClasses } from "@/lib/fonts";
import {
  buildLocaleAlternates,
  buildOpenGraphLocales,
  localePath,
} from "@/lib/metadata";
import { getSiteUrl } from "@/lib/site";
import "../globals.css";

const siteKeywords = [
  "Strategic Communications",
  "Public Affairs",
  "Middle East",
  "Media Production",
  "Corporate Communications",
  "ESG Communications",
];

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: LayoutProps): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const cmsLocale = locale as Locale;
  const t = await getTranslations("seo");
  const tBrand = await getTranslations("brand");
  const ogLocales = buildOpenGraphLocales(cmsLocale);
  const siteUrl = getSiteUrl();

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: t("titleDefault"),
      template: t("titleTemplate"),
    },
    description: t("description"),
    keywords: siteKeywords,
    authors: [{ name: tBrand("name") }],
    alternates: buildLocaleAlternates(cmsLocale, ""),
    openGraph: {
      type: "website",
      url: `${siteUrl}${localePath(cmsLocale)}`,
      siteName: tBrand("name"),
      title: t("ogTitle"),
      description: t("description"),
      ...ogLocales,
    },
    twitter: {
      card: "summary_large_image",
      title: t("twitterTitle"),
      description: t("twitterDescription"),
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <html
      lang={locale}
      dir={dir}
      data-theme="default"
      className={fontVariableClasses}
      suppressHydrationWarning
    >
      <head>
        <meta name="theme-color" content="#0b1d36" />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <OrganizationJsonLd locale={locale as Locale} />
        <ThemeProvider>
          <ThemeColorMeta />
          <NextIntlClientProvider locale={locale as Locale} messages={messages}>
            <HashScroll />
            <SkipLink />
            <Header />
            <main id="main-content">{children}</main>
            <Footer />
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
