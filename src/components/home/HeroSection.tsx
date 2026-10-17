"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useSyncExternalStore } from "react";
import { Button } from "@/components/ui/Button";

function useHydrated() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

export function HeroSection() {
  const reduceMotion = useReducedMotion();
  const hydrated = useHydrated();
  const animate = hydrated && !reduceMotion;
  const t = useTranslations("hero");
  const tImages = useTranslations("images");

  return (
    <section className="relative flex min-h-[88vh] items-center overflow-hidden bg-[#0B1D36] px-6 pt-24 pb-20 text-brand-foreground">
      <Image
        src="/images/hero.webp"
        alt={tImages("hero")}
        fill
        priority
        sizes="100vw"
        className="object-cover object-[center_42%]"
      />
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
          className="inv-hero-line"
          d="M40 180 H520"
          stroke="currentColor"
          strokeWidth="1"
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
        <motion.p
          initial={animate ? { opacity: 0, y: 12 } : false}
          animate={animate ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-6 font-serif text-sm tracking-[0.2em] text-brand-foreground/70 uppercase"
        >
          {t.rich("eyebrow", {
            bdi: (chunks) => <bdi>{chunks}</bdi>,
          })}
        </motion.p>
        <motion.h1
          initial={animate ? { opacity: 0, y: 16 } : false}
          animate={animate ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.55, delay: 0.05, ease: "easeOut" }}
          className="max-w-3xl font-serif text-4xl leading-tight tracking-tight text-balance sm:text-5xl md:text-6xl"
        >
          {t("title")}
        </motion.h1>
        <motion.p
          initial={animate ? { opacity: 0, y: 16 } : false}
          animate={animate ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.55, delay: 0.12, ease: "easeOut" }}
          className="mt-6 max-w-xl text-base leading-relaxed text-brand-foreground/80 sm:text-lg"
        >
          {t("subtitle")}
        </motion.p>
        <motion.div
          initial={animate ? { opacity: 0, y: 16 } : false}
          animate={animate ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.55, delay: 0.18, ease: "easeOut" }}
          className="mt-10 flex flex-wrap items-center gap-6"
        >
          <Button
            href="/#services"
            className="bg-brand-foreground text-brand hover:bg-brand-foreground/90"
          >
            {t("ctaServices")}
          </Button>
          <Button
            href="/#contact"
            variant="ghost"
            className="text-brand-foreground hover:text-brand-foreground"
          >
            {t("ctaContact")}
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
