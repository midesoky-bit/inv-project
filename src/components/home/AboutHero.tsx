import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Link } from "@/i18n/navigation";

type Stat = { value: string; label: string };

const GUTTER = "px-4 sm:px-5 lg:px-8 xl:px-10";

export async function AboutHero() {
  const tAbout = await getTranslations("about");
  const tNav = await getTranslations("nav");
  const tImages = await getTranslations("images");
  const tStats = await getTranslations("stats");
  const paragraphs = tAbout.raw("paragraphs") as string[];
  const values = tAbout.raw("values") as string[];
  const stats = tStats.raw("items") as Stat[];

  return (
    <section className="relative mt-20 overflow-hidden bg-white text-brand after:absolute after:inset-x-0 after:bottom-0 after:z-[11] after:h-px after:bg-brand after:content-['']">
      <Image
        src="/images/about-skyline.jpg"
        alt={tImages("aboutSkyline")}
        fill
        priority
        sizes="100vw"
        className="object-cover object-[72%_center] rtl:object-[28%_center]"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-r from-white from-[18%] via-white/92 via-[42%] to-transparent to-[78%] lg:hidden rtl:bg-gradient-to-l"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 hidden lg:grid lg:grid-cols-2"
      >
        <div className="bg-gradient-to-r from-white from-25% via-white/90 via-70% to-transparent rtl:bg-gradient-to-l" />
        <div className="bg-gradient-to-l from-brand/30 to-transparent rtl:bg-gradient-to-r" />
      </div>

      <div className={`relative ${GUTTER}`}>
        <div className="grid min-h-[24rem] items-start gap-10 pt-8 pb-6 lg:grid-cols-2 lg:min-h-[26rem] lg:pt-10 lg:pb-8">
          <div className="max-w-xl">
            <nav aria-label={tNav("breadcrumb")}>
              <ol className="flex items-center gap-2 text-sm text-brand/55">
                <li>
                  <Link href="/" className="transition-colors hover:text-brand">
                    {tNav("home")}
                  </Link>
                </li>
                <li aria-hidden="true">
                  <svg
                    viewBox="0 0 12 12"
                    className="size-3 rtl:-scale-x-100"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M4 2.5 7.5 6 4 9.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </li>
                <li className="text-brand" aria-current="page">
                  {tNav("about")}
                </li>
              </ol>
            </nav>
            <div className="mt-8 flex items-center gap-3">
              <span aria-hidden className="h-0.5 w-10 bg-accent" />
              <p className="text-xs font-medium tracking-[0.16em] text-accent uppercase">
                {tAbout("heroEyebrow")}
              </p>
            </div>
            <h1 className="mt-4 font-serif text-4xl leading-[1.08] tracking-tight text-balance text-brand md:text-5xl lg:text-[3.35rem]">
              {tAbout.rich("heroTitle", {
                g: (chunks) => <span className="text-accent">{chunks}</span>,
              })}
            </h1>
            <p className="mt-6 text-base leading-relaxed text-brand/75">
              {paragraphs[0]}
            </p>
            <div className="mt-8">
              <Button
                href="#story"
                className="bg-brand text-brand-foreground hover:bg-brand-mid"
              >
                {tAbout("readMore")}
              </Button>
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

      <div className="relative z-10 bg-brand text-brand-foreground md:-mb-px md:[clip-path:polygon(0_1.75rem,14rem_1.75rem,calc(14rem+1.75rem)_0,100%_0,100%_100%,0_100%)] md:rtl:[clip-path:polygon(100%_1.75rem,calc(100%-14rem)_1.75rem,calc(100%-14rem-1.75rem)_0,0_0,0_100%,100%_100%)]">
        <div className="flex items-center gap-6 px-4 py-5 sm:px-5 lg:min-h-[6.5rem] lg:px-0 lg:py-6">
          <span aria-hidden className="hidden w-56 shrink-0 lg:block" />
          <span aria-hidden className="hidden h-12 w-0.5 shrink-0 bg-accent lg:block" />
          <ul className="grid flex-1 grid-cols-2 gap-x-5 gap-y-5 sm:grid-cols-4 sm:gap-x-8 lg:max-w-3xl lg:pe-10">
            {stats.map((item) => (
              <li key={item.label}>
                <p className="font-sans text-2xl font-medium tracking-tight text-brand-foreground md:text-[1.75rem]">
                  {item.value}
                </p>
                <p className="mt-1 max-w-[9.5rem] text-xs leading-snug text-brand-foreground/70">
                  {item.label}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
