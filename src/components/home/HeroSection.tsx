"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useState } from "react";
import { ServiceMark } from "@/components/home/ServiceIconRow";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";
import { PAGE_GUTTER } from "@/lib/layout";

const SLIDES = [
  { src: "/images/hero.webp", key: "hero" },
  { src: "/images/forum.webp", key: "forum" },
  { src: "/images/briefing.webp", key: "briefing" },
] as const;

type HeroService = { slug: string; title: string; icon?: string };

export function HeroSection({ services = [] }: { services?: HeroService[] }) {
  const reduceMotion = useReducedMotion();
  const t = useTranslations("hero");
  const tImages = useTranslations("images");
  const [slide, setSlide] = useState(0);
  const barServices = services.slice(0, 4);

  return (
    <section className="relative mt-20 flex min-h-[calc(88vh-5rem)] items-center overflow-hidden bg-brand text-brand-foreground">
      {SLIDES.map((item, index) => (
        <motion.div
          key={item.src}
          className="pointer-events-none absolute inset-0"
          initial={false}
          animate={{ opacity: slide === index ? 1 : 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.8, ease: "easeInOut" }}
          aria-hidden={slide !== index}
        >
          <Image
            src={item.src}
            alt={slide === index ? tImages(item.key) : ""}
            fill
            priority={index === 0}
            sizes="100vw"
            className="object-cover object-[72%_center] rtl:object-[28%_center]"
          />
        </motion.div>
      ))}
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
      <div
        aria-hidden
        className="inv-hero-glow pointer-events-none absolute -inset-[12%] bg-[radial-gradient(ellipse_at_top,_rgba(58,107,140,0.38),_transparent_58%)]"
      />
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1] h-full w-full text-white/75 rtl:-scale-x-100"
        viewBox="0 0 1200 700"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
      >
        <path
          className="inv-hero-line"
          d="M80 560 C220 420, 280 180, 460 220 S760 480, 1120 140"
          stroke="currentColor"
          strokeWidth="1.25"
          pathLength={1}
        />
        <path
          className="inv-hero-line text-accent"
          d="M40 180 H520"
          stroke="currentColor"
          strokeWidth="1.5"
          pathLength={1}
          style={{ animationDelay: "0.15s" }}
        />
        <path
          className="inv-hero-line"
          d="M860 520 H1160"
          stroke="currentColor"
          strokeWidth="1"
          pathLength={1}
          style={{ animationDelay: "0.3s" }}
        />
      </svg>

      <div className={`relative z-[1] ${PAGE_GUTTER} w-full pb-28 pt-10 lg:pb-32 lg:pt-12`}>
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div className="max-w-xl">
            <div className="flex items-center gap-3">
              <span aria-hidden className="h-0.5 w-10 bg-accent" />
              <p className="text-xs font-medium tracking-[0.16em] text-accent uppercase">
                {t.rich("eyebrow", {
                  bdi: (chunks) => <bdi>{chunks}</bdi>,
                })}
              </p>
            </div>
            <h1 className="mt-4 font-serif text-4xl leading-[1.08] tracking-tight text-balance sm:text-5xl lg:text-[3.35rem]">
              {t.rich("title", {
                g: (chunks) => <span className="text-accent">{chunks}</span>,
              })}
            </h1>
            <p className="mt-6 text-base leading-relaxed text-brand-foreground/80">
              {t("subtitle")}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-6">
              <Button href="/services">{t("ctaServices")}</Button>
              <Button
                href="/contact"
                variant="ghost"
                className="text-brand-foreground hover:text-brand-foreground"
              >
                {t("ctaContact")}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-10 bg-brand text-brand-foreground">
        <div className={`flex flex-col gap-2 ${PAGE_GUTTER} sm:flex-row sm:items-stretch sm:gap-0`}>
          <div className="flex items-center gap-3 py-4 text-sm tracking-[0.14em] sm:pe-6">
            {SLIDES.map((item, index) => (
              <span key={item.src} className="flex items-center gap-3">
                {index > 0 ? (
                  <span aria-hidden className="text-brand-foreground/35">
                    —
                  </span>
                ) : null}
                <button
                  type="button"
                  onClick={() => setSlide(index)}
                  aria-current={slide === index ? "true" : undefined}
                  className={
                    slide === index
                      ? "text-brand-foreground"
                      : "text-brand-foreground/45 transition-colors hover:text-brand-foreground motion-reduce:transition-none"
                  }
                >
                  {String(index + 1).padStart(2, "0")}
                </button>
              </span>
            ))}
          </div>
          <ul className="flex flex-1 items-stretch overflow-x-auto">
            {barServices.map((service) => (
              <li
                key={service.slug}
                className="flex min-w-44 flex-1 items-center border-s border-white/15"
              >
                <Link
                  href={`/services/${service.slug}`}
                  className="relative flex h-full w-full items-center gap-3 px-4 py-4 text-sm text-brand-foreground/90 transition-colors duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:text-brand-foreground motion-reduce:transition-none after:pointer-events-none after:absolute after:inset-x-0 after:top-0 after:h-0.5 after:origin-top after:scale-y-0 after:bg-accent after:transition-transform after:duration-300 after:ease-[cubic-bezier(0.22,1,0.36,1)] hover:after:scale-y-100 focus-visible:after:scale-y-100 motion-reduce:after:transition-none"
                >
                  <ServiceMark icon={service.icon} />
                  <span>{service.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
