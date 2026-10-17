import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/Button";

export async function AboutTeaser() {
  const t = await getTranslations("about");
  const tImages = await getTranslations("images");
  const paragraphs = t.raw("paragraphs") as string[];

  return (
    <section
      aria-labelledby="about-teaser-heading"
      className="scroll-mt-24 bg-background px-6 py-10 md:py-14"
    >
      <div className="mx-auto grid max-w-6xl items-center gap-6 sm:grid-cols-2 sm:gap-10">
        <div>
          <p className="mb-2 text-xs font-medium tracking-[0.18em] text-accent uppercase">
            {t("eyebrow")}
          </p>
          <h2
            id="about-teaser-heading"
            className="font-serif text-2xl tracking-tight text-balance text-foreground md:text-3xl"
          >
            {t.rich("title", {
              g: (chunks) => <span className="text-accent">{chunks}</span>,
            })}
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted md:text-base">
            {paragraphs[0]}
          </p>
          <div className="mt-6">
            <Button href="/about">{t("readMore")}</Button>
          </div>
        </div>
        <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-border bg-surface">
          <Image
            src="/images/about.webp"
            alt={tImages("about")}
            fill
            sizes="(min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
