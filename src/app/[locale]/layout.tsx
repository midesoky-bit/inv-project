import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { SkipLink } from "@/components/layout/SkipLink";
import { routing, type Locale } from "@/i18n/routing";
import { fontVariableClasses } from "@/lib/fonts";
import { getSiteUrl } from "@/lib/site";
import "../globals.css";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Inventure Communications",
    template: "%s | Inventure Communications",
  },
  description:
    "Inventure Communications is a Strategic Communications & Public Affairs firm advising institutions across the Middle East on reputation, media, and stakeholder engagement.",
  keywords: [
    "Strategic Communications",
    "Public Affairs",
    "Middle East",
    "Media Production",
    "Corporate Communications",
    "ESG Communications",
  ],
  authors: [{ name: "Inventure Communications" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Inventure Communications",
    title: "Inventure Communications — Strategic Communications & Public Affairs",
    description:
      "Institutional communications counsel for decision-makers across the Middle East.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Inventure Communications",
    description:
      "Strategic Communications & Public Affairs for institutional audiences in the Middle East.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

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
      className={fontVariableClasses}
      suppressHydrationWarning
    >
      <body className="min-h-screen antialiased">
        <NextIntlClientProvider locale={locale as Locale} messages={messages}>
          <SkipLink />
          <Header />
          <main id="main-content">{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
