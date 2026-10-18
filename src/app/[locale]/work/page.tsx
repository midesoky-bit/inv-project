import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { WorkHero } from "@/components/work/WorkHero";
import { Button } from "@/components/ui/Button";
import { routing, type Locale } from "@/i18n/routing";
import { PAGE_GUTTER } from "@/lib/layout";
import { buildPageMetadata } from "@/lib/metadata";
import { fetchCaseStudies } from "@/services/cms";

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
  const t = await getTranslations("work");
  const title = t.markup("heroTitle", {
    g: (chunks) => chunks,
    br: () => " ",
  });

  return buildPageMetadata({
    locale: locale as Locale,
    pathSuffix: "/work",
    title,
    description: t("intro"),
    openGraphTitle: title,
  });
}

export default async function WorkPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [t, projects] = await Promise.all([
    getTranslations("work"),
    fetchCaseStudies(locale as Locale),
  ]);

  return (
    <div>
      <WorkHero />
      <section
        id="gallery"
        className={`${PAGE_GUTTER} scroll-mt-24 py-14 md:py-20`}
      >
        {projects.length === 0 ? (
          <p className="max-w-3xl text-base leading-relaxed text-muted">
            {t("empty")}
          </p>
        ) : (
          <ul className="grid gap-6 md:grid-cols-2">
            {projects.map((project) => (
              <li key={project.id} className="rounded-xl border border-border bg-surface p-8">
                <h2 className="font-serif text-2xl text-foreground">{project.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {project.summary}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
      <section className={`border-t border-border bg-brand ${PAGE_GUTTER} py-14 text-brand-foreground md:py-16`}>
        <h2 className="font-serif text-3xl tracking-tight md:text-4xl">
          {t("ctaTitle")}
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-brand-foreground/80">
          {t("ctaBody")}
        </p>
        <div className="mt-8">
          <Button href="/contact">{t("ctaButton")}</Button>
        </div>
      </section>
    </div>
  );
}
