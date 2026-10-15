import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { buildPageMetadata } from "@/lib/metadata";
import { fetchServiceBySlug, fetchServices } from "@/services/cms";

const SERVICE_VISUALS = {
  forum: { src: "/images/forum.webp", alt: "forum" },
  analytics: { src: "/images/analytics.webp", alt: "analytics" },
  towers: { src: "/images/hero.webp", alt: "hero" },
  briefing: { src: "/images/briefing.webp", alt: "briefing" },
  office: { src: "/images/about.webp", alt: "about" },
} as const;

function serviceVisual(slug: string) {
  if (slug === "events-exhibitions" || slug === "media-production") {
    return SERVICE_VISUALS.forum;
  }
  if (
    slug === "digital-media-platforms" ||
    slug === "media-content-management"
  ) {
    return SERVICE_VISUALS.analytics;
  }
  if (slug === "capital-markets-financial-communications") {
    return SERVICE_VISUALS.towers;
  }
  if (slug === "public-relations-partnerships") {
    return SERVICE_VISUALS.office;
  }
  return SERVICE_VISUALS.briefing;
}

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
  setRequestLocale(locale);
  const cmsLocale = locale as Locale;
  const service = await fetchServiceBySlug(slug, cmsLocale);
  if (!service) {
    return { title: "Service not found", robots: { index: false } };
  }

  const tBrand = await getTranslations("brand");

  return buildPageMetadata({
    locale: cmsLocale,
    pathSuffix: `/services/${service.slug}`,
    title: service.title,
    description: service.summary,
    openGraphTitle: `${service.title} | ${tBrand("name")}`,
  });
}

export default async function ServicePage({ params }: PageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const cmsLocale = locale as Locale;
  const [service, services] = await Promise.all([
    fetchServiceBySlug(slug, cmsLocale),
    fetchServices(cmsLocale),
  ]);

  if (!service) {
    notFound();
  }

  const t = await getTranslations("services");
  const tImages = await getTranslations("images");
  const visual = serviceVisual(service.slug);
  const others = services.filter((item) => item.slug !== service.slug);
  const index = String(service.order).padStart(2, "0");

  return (
    <article className="bg-background">
      <header className="relative flex min-h-[52vh] items-end overflow-hidden bg-brand text-brand-foreground">
        <Image
          src={visual.src}
          alt={tImages(visual.alt)}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div aria-hidden className="absolute inset-0 bg-brand/72" />
        <div className="relative mx-auto w-full max-w-6xl px-6 pt-32 pb-16">
          <p className="text-xs font-medium tracking-[0.18em] text-brand-foreground/70 uppercase">
            {index} — {t("label")}
          </p>
          <h1 className="mt-4 max-w-3xl font-serif text-4xl tracking-tight text-balance md:text-5xl">
            {service.title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-brand-foreground/80">
            {service.summary}
          </p>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl gap-8 px-6 py-14 md:py-20 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="text-base leading-relaxed text-muted">
            {service.description}
          </p>
          <Link
            href="/#services"
            className="mt-10 inline-flex items-center gap-2 text-sm font-medium text-accent hover:underline"
          >
            <span aria-hidden className="rtl:-scale-x-100">
              ←
            </span>
            {t("all")}
          </Link>
        </div>

        {service.highlights.length > 0 ? (
          <div className="lg:col-span-7">
            <h2 className="text-xs font-medium tracking-[0.18em] text-accent uppercase">
              {t("includes")}
            </h2>
            <ol className="mt-6 grid gap-4 sm:grid-cols-2">
              {service.highlights.map((item) => (
                <li
                  key={item}
                  className="border border-border bg-surface p-6 transition-colors hover:border-accent"
                >
                  <p className="text-base leading-relaxed text-foreground">
                    {item}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        ) : null}
      </section>

      {others.length > 0 ? (
        <aside className="border-t border-border bg-surface-muted px-6 py-16">
          <div className="mx-auto max-w-6xl">
            <h2 className="font-serif text-2xl tracking-tight text-foreground">
              {t("others")}
            </h2>
            <ul className="mt-8 grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
              {others.map((item) => (
                <li key={item.id} className="bg-surface">
                  <Link
                    href={`/services/${item.slug}`}
                    className="block p-6 transition-colors hover:bg-background"
                  >
                    <p className="font-serif text-xl text-foreground">
                      {item.title}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-muted">
                      {item.summary}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      ) : null}
    </article>
  );
}
