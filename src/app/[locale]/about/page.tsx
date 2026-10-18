import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { AboutHero } from "@/components/home/AboutHero";
import { Button } from "@/components/ui/Button";
import { PresenceStrip } from "@/components/home/PresenceStrip";
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
  const cmsLocale = locale as Locale;
  const tAbout = await getTranslations("about");
  const paragraphs = tAbout.raw("paragraphs") as string[];

  return buildPageMetadata({
    locale: cmsLocale,
    pathSuffix: "/about",
    title: tAbout("title"),
    description: paragraphs[0] ?? "",
  });
}

export default async function AboutPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");
  const paragraphs = t.raw("paragraphs") as string[];
  const story = t.raw("story") as string[];
  const approach = t.raw("approach") as string[];

  return (
    <div>
      <AboutHero />
      <section
        id="story"
        className={`scroll-mt-24 border-t border-border bg-background ${PAGE_GUTTER} py-14 md:py-20`}
      >
        <div className="max-w-3xl">
          <div className="flex flex-col gap-5">
            {paragraphs.slice(1).map((paragraph) => (
              <p key={paragraph} className="text-base leading-relaxed text-muted">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>
      <section
        className={`border-t border-border bg-surface-muted ${PAGE_GUTTER} py-14 md:py-20`}
      >
        <p className="mb-3 text-xs font-medium tracking-[0.2em] text-accent uppercase">
          {t("storyEyebrow")}
        </p>
        <h2 className="max-w-3xl font-serif text-3xl tracking-tight text-foreground md:text-4xl">
          {t("storyTitle")}
        </h2>
        <div className="mt-6 max-w-3xl flex flex-col gap-5">
          {story.map((paragraph) => (
            <p key={paragraph} className="text-base leading-relaxed text-muted">
              {paragraph}
            </p>
          ))}
        </div>
      </section>
      <section
        className={`border-t border-border bg-background ${PAGE_GUTTER} py-14 md:py-20`}
      >
        <h2 className="font-serif text-3xl tracking-tight text-foreground md:text-4xl">
          {t("experienceTitle")}
        </h2>
        <p className="mt-6 max-w-3xl text-base leading-relaxed text-muted">
          {t("experience")}
        </p>
      </section>
      <PresenceStrip />
      <section
        id="approach"
        className={`scroll-mt-24 border-t border-border bg-background ${PAGE_GUTTER} py-14 md:py-20`}
      >
        <h2 className="font-serif text-3xl tracking-tight text-foreground md:text-4xl">
          {t("approachTitle")}
        </h2>
        <div className="mt-6 max-w-3xl flex flex-col gap-5">
          {approach.map((paragraph) => (
            <p key={paragraph} className="text-base leading-relaxed text-muted">
              {paragraph}
            </p>
          ))}
        </div>
        <div className="mt-10">
          <Button href="/contact">{t("cta")}</Button>
        </div>
      </section>
    </div>
  );
}
