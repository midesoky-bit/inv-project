import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { WorkGallery } from "@/components/work/WorkGallery";
import { WorkHero } from "@/components/work/WorkHero";
import {
  WORK_FILTERS,
  WORK_ITEMS,
  type WorkFilter,
  type WorkItem,
} from "@/components/work/work-items";
import { routing, type Locale } from "@/i18n/routing";
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
  const cmsLocale = locale as Locale;
  const t = await getTranslations("work");
  const title = t.markup("heroTitle", {
    g: (chunks) => chunks,
    br: () => " ",
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

  const [t, tImages] = await Promise.all([
    getTranslations("work"),
    getTranslations("images"),
  ]);
  const labels = Object.fromEntries(
    WORK_FILTERS.map((key) => [key, t(key)]),
  ) as Record<"all" | WorkFilter, string>;
  const alts = Object.fromEntries(
    WORK_ITEMS.map((item) => [item.src, tImages(item.altKey)]),
  ) as Record<WorkItem["src"], string>;

  return (
    <div>
      <WorkHero />
      <WorkGallery items={[...WORK_ITEMS]} labels={labels} alts={alts} />
    </div>
  );
}
