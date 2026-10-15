import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { getSiteUrl } from "@/lib/site";
import { fetchServiceBySlug, fetchServices } from "@/services/cms";

export const revalidate = 3600;
export const dynamicParams = true;

type PageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateStaticParams() {
  const services = await fetchServices("en");
  return routing.locales.flatMap((locale) =>
    services.map((service) => ({ locale, slug: service.slug })),
  );
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const cmsLocale = locale as Locale;
  const service = await fetchServiceBySlug(slug, cmsLocale);
  if (!service) {
    return { title: "Service not found", robots: { index: false } };
  }

  const base = getSiteUrl();
  const path = `/${locale}/services/${service.slug}`;

  return {
    title: service.title,
    description: service.summary,
    alternates: {
      canonical: path,
      languages: {
        en: `${base}/en/services/${service.slug}`,
        ar: `${base}/ar/services/${service.slug}`,
        "x-default": `${base}/en/services/${service.slug}`,
      },
    },
    openGraph: {
      type: "website",
      locale: locale === "ar" ? "ar_AR" : "en_US",
      siteName: "Inventure Communications",
      url: path,
      title: `${service.title} | Inventure Communications`,
      description: service.summary,
    },
  };
}

export default async function ServicePage({ params }: PageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const cmsLocale = locale as Locale;
  const service = await fetchServiceBySlug(slug, cmsLocale);
  const t = await getTranslations("services");

  if (!service) {
    notFound();
  }

  return (
    <article className="bg-inv-white">
      <div className="bg-inv-navy px-6 pt-28 pb-16 text-inv-white">
        <div className="mx-auto max-w-3xl">
          <p className="mb-4 text-xs tracking-[0.18em] text-white/60 uppercase">
            {t("label")}
          </p>
          <h1 className="font-serif text-4xl tracking-tight md:text-5xl">
            {service.title}
          </h1>
          <p className="mt-6 text-lg text-white/75">{service.summary}</p>
        </div>
      </div>
      <div className="mx-auto max-w-3xl px-6 py-16">
        <p className="text-base leading-relaxed text-inv-slate">
          {service.description}
        </p>
        <Link
          href="/#services"
          className="mt-10 inline-flex items-center gap-2 text-sm font-medium text-inv-accent hover:underline"
        >
          <span aria-hidden className="rtl:-scale-x-100">
            ←
          </span>
          {t("all")}
        </Link>
      </div>
    </article>
  );
}
