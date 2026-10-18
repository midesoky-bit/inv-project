import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ContactForm } from "@/components/contact/ContactForm";
import { routing, type Locale } from "@/i18n/routing";
import { PAGE_GUTTER } from "@/lib/layout";
import { MARKETS } from "@/lib/markets";
import { buildPageMetadata } from "@/lib/metadata";
import { fetchServices } from "@/services/cms";

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
  const [tContact, tFooter] = await Promise.all([
    getTranslations("contact"),
    getTranslations("footer"),
  ]);

  return buildPageMetadata({
    locale: locale as Locale,
    pathSuffix: "/contact",
    title: tContact("heading"),
    description: tFooter("tagline"),
    openGraphTitle: tContact("title"),
  });
}

export default async function ContactPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [tContact, tFooter, tPresence, services] = await Promise.all([
    getTranslations("contact"),
    getTranslations("footer"),
    getTranslations("presence"),
    fetchServices(locale as Locale),
  ]);

  return (
    <section
      aria-labelledby="contact-heading"
      className={`${PAGE_GUTTER} pt-28 pb-16`}
    >
      <p className="mb-3 text-xs font-medium tracking-[0.2em] text-accent uppercase">
        {tContact("heading")}
      </p>
      <h1
        id="contact-heading"
        className="max-w-3xl font-serif text-4xl tracking-tight text-balance md:text-5xl"
      >
        {tContact("title")}
      </h1>
      <p className="mt-6 max-w-3xl text-base leading-relaxed text-muted">
        {tContact("intro")}
      </p>
      <div className="mt-10 grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <h2 className="font-serif text-2xl text-foreground">
            {tContact("formTitle")}
          </h2>
          <ContactForm
            email={tFooter("email")}
            services={services.map((service) => ({
              slug: service.slug,
              title: service.title,
            }))}
          />
        </div>
        <aside className="lg:col-span-5">
          <p className="text-sm">
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
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {MARKETS.map((market) => (
              <li key={market} className="font-serif text-xl text-foreground">
                {tPresence(market)}
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </section>
  );
}
