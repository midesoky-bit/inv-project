import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
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

type Role = { title: string; body: string };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("team");

  return buildPageMetadata({
    locale: locale as Locale,
    pathSuffix: "/team",
    title: t("title"),
    description: t("intro"),
  });
}

export default async function TeamPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("team");
  const roles = t.raw("roles") as Role[];

  return (
    <section className={`${PAGE_GUTTER} pt-28 pb-16`} aria-labelledby="team-heading">
      <p className="mb-3 text-xs font-medium tracking-[0.2em] text-accent uppercase">
        {t("eyebrow")}
      </p>
      <h1
        id="team-heading"
        className="font-serif text-4xl tracking-tight text-balance md:text-5xl"
      >
        {t("title")}
      </h1>
      <p className="mt-6 max-w-3xl text-base leading-relaxed text-muted">{t("intro")}</p>
      <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted">{t("lead")}</p>
      <p className="mt-6 max-w-3xl text-sm leading-relaxed text-muted">{t("pending")}</p>
      <ul className="mt-12 grid gap-6 md:grid-cols-2">
        {roles.map((role) => (
          <li key={role.title} className="rounded-xl border border-border bg-surface p-8">
            <div className="aspect-[4/3] rounded-2xl bg-surface-muted" aria-hidden />
            <h2 className="mt-6 font-serif text-2xl text-foreground">{role.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">{role.body}</p>
          </li>
        ))}
      </ul>
      <p className="mt-12 max-w-3xl text-base leading-relaxed text-muted">{t("closing")}</p>
    </section>
  );
}
