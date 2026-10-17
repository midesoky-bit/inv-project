import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";
import { buildPageMetadata } from "@/lib/metadata";

export const revalidate = 3600;

const MARKETS = ["egypt", "saudi", "uae", "qatar"] as const;

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
  const [tContact, tFooter] = await Promise.all([
    getTranslations("contact"),
    getTranslations("footer"),
  ]);

  return buildPageMetadata({
    locale: cmsLocale,
    pathSuffix: "/contact",
    title: tContact("heading"),
    description: tFooter("tagline"),
    openGraphTitle: tContact("heading"),
  });
}

export default async function ContactPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [tContact, tFooter, tPresence] = await Promise.all([
    getTranslations("contact"),
    getTranslations("footer"),
    getTranslations("presence"),
  ]);

  return (
    <section
      aria-labelledby="contact-heading"
      className="mx-auto w-full max-w-6xl px-6 pt-28 pb-16"
    >
      <h1
        id="contact-heading"
        className="font-serif text-4xl tracking-tight text-balance md:text-5xl"
      >
        <span className="text-accent">{tContact("heading")}</span>
      </h1>
      <p className="mt-8 text-sm">
        <a
          href={`mailto:${tFooter("email")}`}
          className="text-foreground/80 hover:text-foreground"
        >
          {tFooter("email")}
        </a>
      </p>
      <p className="mt-2 text-sm">
        <a
          href={`https://${tFooter("web")}`}
          className="text-foreground/80 hover:text-foreground"
        >
          {tFooter("web")}
        </a>
      </p>
      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {MARKETS.map((market) => (
          <li key={market} className="font-serif text-2xl text-foreground">
            {tPresence(market)}
          </li>
        ))}
      </ul>
    </section>
  );
}
