"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useState } from "react";
import { ServiceMark } from "@/components/home/ServiceIconRow";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";

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
    <section className="relative flex min-h-[88vh] items-center overflow-hidden bg-[#0B1D36] px-6 pt-24 pb-36 text-brand-foreground">
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
            className="object-cover object-[center_42%]"
          />
        </motion.div>
      ))}
      <div aria-hidden className="absolute inset-0 bg-[#0B1D36]/62" />
      <div
        aria-hidden
        className="inv-hero-glow pointer-events-none absolute -inset-[12%] bg-[radial-gradient(ellipse_at_top,_rgba(58,107,140,0.38),_transparent_58%)]"
      />
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full text-white/75"
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
      <div className="relative mx-auto w-full max-w-6xl">
        <p className="mb-6 font-serif text-sm tracking-[0.2em] text-brand-foreground/70 uppercase">
          {t.rich("eyebrow", {
            bdi: (chunks) => <bdi>{chunks}</bdi>,
          })}
        </p>
        <span aria-hidden className="mb-5 block h-0.5 w-14 bg-accent" />
        <h1 className="max-w-3xl font-serif text-4xl leading-tight tracking-tight text-balance sm:text-5xl md:text-6xl">
          {t.rich("title", {
            g: (chunks) => <span className="text-accent">{chunks}</span>,
          })}
        </h1>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-brand-foreground/80 sm:text-lg">
          {t("subtitle")}
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-6">
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
      <div className="absolute inset-x-0 bottom-0 z-10 bg-[#0B1D36] text-brand-foreground">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 sm:flex-row sm:items-stretch sm:gap-0">
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
