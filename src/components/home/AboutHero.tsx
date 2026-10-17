import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Link } from "@/i18n/navigation";

type Stat = { value: string; label: string };

export async function AboutHero() {
  const tAbout = await getTranslations("about");
  const tNav = await getTranslations("nav");
  const tImages = await getTranslations("images");
  const tStats = await getTranslations("stats");
  const paragraphs = tAbout.raw("paragraphs") as string[];
  const values = tAbout.raw("values") as string[];
  const stats = tStats.raw("items") as Stat[];

  return (
    <section className="relative mt-20 overflow-hidden bg-white text-[#0B1D36]">
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
        className="absolute inset-0 bg-[linear-gradient(90deg,#ffffff_0%,#ffffff_34%,rgba(255,255,255,0.94)_46%,rgba(255,255,255,0.55)_58%,transparent_74%)] rtl:bg-[linear-gradient(270deg,#ffffff_0%,#ffffff_34%,rgba(255,255,255,0.94)_46%,rgba(255,255,255,0.55)_58%,transparent_74%)]"
      />
      <div className="relative mx-auto grid min-h-[24rem] max-w-6xl items-start gap-10 px-6 pt-8 pb-5 lg:grid-cols-2 lg:min-h-[26rem] lg:pt-10 lg:pb-6">
        <div>
          <nav aria-label={tNav("breadcrumb")}>
            <ol className="flex items-center gap-2 text-sm text-[#3e4c5a]">
              <li>
                <Link href="/" className="hover:text-[#0B1D36]">
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
              <li className="text-[#0B1D36]" aria-current="page">
                {tNav("about")}
              </li>
            </ol>
          </nav>
          <div className="mt-8 flex items-center gap-3">
            <span aria-hidden className="h-0.5 w-10 bg-accent" />
            <p className="text-xs font-medium tracking-[0.18em] text-[#0B1D36] uppercase">
              {tAbout("heroEyebrow")}
            </p>
          </div>
          <h1 className="mt-4 max-w-xl font-serif text-5xl leading-[1.05] tracking-tight text-balance text-[#0B1D36] md:text-6xl">
            {tAbout.rich("heroTitle", {
              g: (chunks) => <span className="text-accent">{chunks}</span>,
            })}
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-[#0B1D36]">
            {paragraphs[0]}
          </p>
          <div className="mt-6">
            <Button
              href="#story"
              className="bg-[#0B1D36] text-white hover:bg-[#132a4a]"
            >
              {tAbout("readMore")}
            </Button>
          </div>
        </div>
        <ul className="hidden flex-col items-end gap-2 pe-4 text-end font-serif text-2xl tracking-[0.18em] text-white uppercase lg:flex">
          {values.map((value, index) => (
            <li key={value}>
              {value}
              {index === values.length - 1 ? (
                <span aria-hidden className="mt-3 block h-0.5 w-10 bg-accent ms-auto" />
              ) : null}
            </li>
          ))}
        </ul>
      </div>
      <div className="relative z-10 bg-[#0B1D36] text-white md:[clip-path:polygon(0_1.75rem,22%_1.75rem,calc(22%+1.75rem)_0,100%_0,100%_100%,0_100%)] md:rtl:[clip-path:polygon(100%_1.75rem,78%_1.75rem,calc(78%-1.75rem)_0,0_0,0_100%,100%_100%)]">
        <div className="flex items-center px-6 py-5 md:min-h-[6.5rem] md:px-0 md:py-4">
          <span aria-hidden className="hidden w-[calc(22%+3rem)] shrink-0 md:block" />
          <span aria-hidden className="hidden h-12 w-0.5 shrink-0 bg-accent md:block" />
          <ul className="grid flex-1 grid-cols-2 gap-x-6 gap-y-5 md:grid-cols-4 md:gap-x-4 md:pe-8">
            {stats.map((item) => (
              <li key={item.label} className="text-center">
                <p className="font-sans text-2xl font-semibold tracking-tight text-white md:text-3xl">
                  {item.value}
                </p>
                <p className="mx-auto mt-1 max-w-[10rem] text-xs leading-snug text-white/90">
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
