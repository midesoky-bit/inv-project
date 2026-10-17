import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Image from "next/image";
import { WorkGallery } from "@/components/work/WorkGallery";
import { WORK_ITEMS, type WorkItem } from "@/components/work/work-items";
import { routing, type Locale } from "@/i18n/routing";
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
  const cmsLocale = locale as Locale;
  const t = await getTranslations("work");
  const title = t.markup("title", {
    g: (chunks) => chunks,
  });

  return buildPageMetadata({
    locale: cmsLocale,
    pathSuffix: "/work",
    title,
    description: t("intro"),
    openGraphTitle: title,
  });
}

export default async function WorkPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const cmsLocale = locale as Locale;
  const [services, t, tImages] = await Promise.all([
    fetchServices(cmsLocale),
    getTranslations("work"),
    getTranslations("images"),
  ]);
  const captions = Object.fromEntries(
    services.map((service) => [service.slug, service.title]),
  );
  const labels: Record<WorkItem["filter"] | "all", string> = {
    all: t("all"),
    events: t("events"),
    digital: t("digital"),
    affairs: t("affairs"),
    capital: t("capital"),
    partnerships: t("partnerships"),
  };
  const imageAlt = tImages.has("forum") ? tImages("forum") : tImages("hero");

  return (
    <div>
      <section className="relative mt-16 min-h-72 overflow-hidden bg-brand text-brand-foreground sm:min-h-80 md:min-h-96">
        <Image
          src="/images/forum.webp"
          alt={imageAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div aria-hidden className="absolute inset-0 bg-brand/55" />
        <div className="relative mx-auto flex min-h-72 w-full max-w-6xl flex-col justify-end ps-6 pe-6 pt-16 pb-12 sm:min-h-80 md:min-h-96 md:pb-16">
          <div className="max-w-2xl">
            <h1
              id="work-heading"
              className="font-serif text-4xl tracking-tight text-balance md:text-5xl"
            >
              {t.rich("title", {
                g: (chunks) => <span className="text-accent">{chunks}</span>,
              })}
            </h1>
            <p className="mt-4 text-base text-brand-foreground/80">{t("intro")}</p>
          </div>
        </div>
      </section>
      <WorkGallery items={[...WORK_ITEMS]} labels={labels} captions={captions} />
    </div>
  );
}
