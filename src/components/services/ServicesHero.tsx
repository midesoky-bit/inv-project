import { getTranslations } from "next-intl/server";
import Image from "next/image";

export async function ServicesHero() {
  const t = await getTranslations("services");
  const tImages = await getTranslations("images");

  return (
    <section className="bg-background px-4 pt-24 sm:px-6 lg:px-8">
      <div className="relative mx-auto min-h-[22rem] overflow-hidden rounded-[1.75rem] bg-[#0B1D36] text-white md:min-h-[26rem]">
        <Image
          src="/images/briefing.webp"
          alt={tImages("briefing")}
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_35%]"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(90deg,#0B1D36_0%,rgba(11,29,54,0.94)_30%,rgba(11,29,54,0.58)_50%,rgba(11,29,54,0.2)_68%,transparent_84%)] rtl:bg-[linear-gradient(270deg,#0B1D36_0%,rgba(11,29,54,0.94)_30%,rgba(11,29,54,0.58)_50%,rgba(11,29,54,0.2)_68%,transparent_84%)]"
        />
        <div className="relative mx-auto flex min-h-[22rem] max-w-6xl items-center px-6 py-12 pb-36 md:min-h-[26rem] lg:px-10">
          <div className="max-w-xl">
            <div className="flex items-center gap-3">
              <span aria-hidden className="h-0.5 w-10 bg-accent" />
              <p className="text-xs font-medium tracking-[0.18em] text-white uppercase">
                {t("heroEyebrow")}
              </p>
            </div>
            <h1
              id="services-page-heading"
              className="mt-5 font-sans text-4xl font-bold leading-[1.08] tracking-tight text-white md:text-5xl"
            >
              {t.rich("heroTitle", {
                g: (chunks) => <span className="text-accent">{chunks}</span>,
                br: () => <br />,
              })}
            </h1>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-white/85">
              {t("intro")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
