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
      className="scroll-mt-24 bg-background px-6 py-14 md:py-20"
    >
      <div className="mx-auto grid max-w-6xl items-center gap-8 lg:grid-cols-2">
        <div>
          <p className="mb-3 text-xs font-medium tracking-[0.18em] text-accent uppercase">
            {t("eyebrow")}
          </p>
          <h2
            id="about-teaser-heading"
            className="font-serif text-3xl tracking-tight text-balance text-foreground md:text-4xl"
          >
            {t("title")}
          </h2>
          <p className="mt-6 text-base leading-relaxed text-muted">{paragraphs[0]}</p>
          <div className="mt-8">
            <Button href="/about">{t("readMore")}</Button>
          </div>
        </div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-surface">
          <Image
            src="/images/about.webp"
            alt={tImages("about")}
            fill
            sizes="(min-width: 1024px) 36rem, 100vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
