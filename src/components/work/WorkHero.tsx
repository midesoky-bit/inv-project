import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { Button } from "@/components/ui/Button";

export async function WorkHero() {
  const t = await getTranslations("work");
  const tImages = await getTranslations("images");
  const values = t.raw("values") as string[];

  return (
    <section className="bg-background px-4 pt-24 pb-2 sm:px-6 lg:px-8">
      <div className="relative mx-auto min-h-[32rem] overflow-hidden rounded-[1.75rem] bg-[#0B1D36] text-white md:min-h-[36rem]">
        <Image
          src="/images/forum.webp"
          alt={tImages("forum")}
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_42%]"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(90deg,#0B1D36_0%,rgba(11,29,54,0.92)_28%,rgba(11,29,54,0.55)_48%,rgba(11,29,54,0.18)_64%,transparent_80%)] rtl:bg-[linear-gradient(270deg,#0B1D36_0%,rgba(11,29,54,0.92)_28%,rgba(11,29,54,0.55)_48%,rgba(11,29,54,0.18)_64%,transparent_80%)]"
        />
        <div className="relative mx-auto grid min-h-[32rem] max-w-6xl items-center gap-10 px-6 py-12 md:min-h-[36rem] lg:grid-cols-2 lg:px-10 lg:py-16">
          <div>
            <div className="flex items-center gap-3">
              <span aria-hidden className="h-0.5 w-10 bg-accent" />
              <p className="text-xs font-medium tracking-[0.18em] text-white uppercase">
                {t("heroEyebrow")}
              </p>
            </div>
            <h1
              id="work-heading"
              className="mt-5 max-w-md font-sans text-5xl font-bold leading-[1.05] tracking-tight text-white md:text-6xl"
            >
              {t.rich("heroTitle", {
                g: (chunks) => <span className="text-accent">{chunks}</span>,
                br: () => <br />,
              })}
            </h1>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-white/85">
              {t("intro")}
            </p>
            <div className="mt-8">
              <Button href="#gallery">{t("explore")}</Button>
            </div>
          </div>
          <ul className="hidden flex-col items-end gap-1 pe-8 text-end text-3xl font-light tracking-[0.12em] text-white md:text-4xl lg:flex">
            {values.map((value, index) => (
              <li key={value}>
                {index === 0 ? (
                  <span aria-hidden className="mb-4 block h-0.5 w-10 bg-accent ms-auto" />
                ) : null}
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
