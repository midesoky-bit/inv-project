import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { PAGE_GUTTER } from "@/lib/layout";
import { buildPageMetadata } from "@/lib/metadata";
import { serviceCardVisual } from "@/lib/service-visuals";
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
  const visual = serviceCardVisual(service);
  const others = services.filter((item) => item.slug !== service.slug);
  const index = String(service.order).padStart(2, "0");

  return (
    <article className="bg-background">
      <header className="relative mt-20 flex min-h-[52vh] items-end overflow-hidden bg-brand text-brand-foreground">
        <Image
          src={visual.src}
          alt={tImages(visual.altKey)}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-r from-brand from-[18%] via-brand/88 via-[46%] to-brand/28 to-[78%] rtl:bg-gradient-to-l"
        />
        <div className={`relative ${PAGE_GUTTER} pt-12 pb-16`}>
          <p className="text-xs font-medium tracking-[0.18em] text-accent uppercase">
            {t("eyebrow")}
          </p>
          <p className="mt-3 text-xs font-medium tracking-[0.18em] text-accent uppercase">
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

      <section className={`grid gap-8 ${PAGE_GUTTER} py-14 md:py-20 lg:grid-cols-12`}>
        <div className="lg:col-span-5">
          <p className="text-base leading-relaxed text-muted">
            {service.description}
          </p>
          <Link
            href="/services"
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
        <aside className={`border-t border-border bg-surface-muted ${PAGE_GUTTER} py-16`}>
          <div>
            <h2 className="font-serif text-2xl tracking-tight text-foreground">
              {t("others")}
            </h2>
            <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {others.map((item) => (
                <li key={item.id}>
                  <Link
                    href={`/services/${item.slug}`}
                    className="group flex h-full flex-col border border-border bg-surface p-6 transition-colors hover:border-accent focus-visible:border-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  >
                    <p className="font-serif text-xl text-foreground transition-colors group-hover:text-accent">
                      {item.title}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-muted">
                      {item.summary}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-accent transition-transform group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0 rtl:group-hover:-translate-x-1 rtl:motion-reduce:group-hover:translate-x-0">
                      {t("learnMore")}
                      <span aria-hidden className="rtl:-scale-x-100">
                        →
                      </span>
                    </span>
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
