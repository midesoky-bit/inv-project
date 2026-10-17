import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { PAGE_GUTTER } from "@/lib/layout";

export async function WorkHero() {
  const t = await getTranslations("work");
  const tImages = await getTranslations("images");
  const values = t.raw("values") as string[];

  return (
    <section className="relative mt-20 overflow-hidden bg-brand text-brand-foreground">
      <Image
        src="/images/forum.webp"
        alt={tImages("forum")}
        fill
        priority
        sizes="100vw"
        className="object-cover object-[72%_center] rtl:object-[28%_center]"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-r from-brand from-[18%] via-brand/88 via-[46%] to-brand/28 to-[78%] lg:hidden rtl:bg-gradient-to-l"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 hidden lg:grid lg:grid-cols-2"
      >
        <div className="bg-gradient-to-r from-brand from-30% via-brand/88 via-70% to-transparent rtl:bg-gradient-to-l" />
        <div className="bg-gradient-to-l from-brand/25 to-transparent rtl:bg-gradient-to-r" />
      </div>
      <div className={`relative ${PAGE_GUTTER}`}>
        <div className="grid min-h-[28rem] items-center gap-10 py-12 md:min-h-[32rem] lg:grid-cols-2 lg:py-16">
          <div className="max-w-xl">
            <div className="flex items-center gap-3">
              <span aria-hidden className="h-0.5 w-10 bg-accent" />
              <p className="text-xs font-medium tracking-[0.16em] text-accent uppercase">
                {t("heroEyebrow")}
              </p>
            </div>
            <h1
              id="work-heading"
              className="mt-4 font-serif text-4xl leading-[1.08] tracking-tight text-balance md:text-5xl lg:text-[3.35rem]"
            >
              {t.rich("heroTitle", {
                g: (chunks) => <span className="text-accent">{chunks}</span>,
                br: () => <br />,
              })}
            </h1>
            <p className="mt-6 text-base leading-relaxed text-brand-foreground/80">
              {t("intro")}
            </p>
            <div className="mt-8">
              <Button href="#gallery">{t("explore")}</Button>
            </div>
          </div>
          <ul className="hidden flex-col items-end gap-1.5 self-end text-end font-serif text-2xl tracking-[0.06em] text-white lg:flex lg:text-[1.65rem]">
            {values.map((value, index) => (
              <li key={value}>
                {value}
                {index === values.length - 1 ? (
                  <span aria-hidden className="mt-4 block h-0.5 w-10 bg-accent ms-auto" />
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
