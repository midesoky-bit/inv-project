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
    <section className="px-6 pt-28 pb-6 text-brand-foreground">
      <div className="mx-auto w-full max-w-6xl">
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
          className="max-w-4xl font-serif text-4xl leading-[1.05] tracking-tight text-balance sm:text-6xl"
        >
          {t("title")}
        </motion.h1>
        <motion.p
          initial={animate ? { opacity: 0, y: 16 } : false}
          animate={animate ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.55, delay: 0.12, ease: "easeOut" }}
          className="mt-6 max-w-xl text-base leading-relaxed text-brand-foreground/75 sm:text-lg"
        >
          {t("subtitle")}
        </motion.p>
        <motion.div
          initial={animate ? { opacity: 0, y: 16 } : false}
          animate={animate ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.55, delay: 0.18, ease: "easeOut" }}
          className="mt-10 flex flex-wrap items-center gap-6"
        >
          <Button href="/#services">{t("ctaServices")}</Button>
          <Button href="/#contact" variant="ghost">
            {t("ctaContact")}
          </Button>
        </motion.div>
        <div className="relative mt-10 h-72 overflow-hidden rounded-2xl border border-brand-foreground/15 sm:h-96">
          <Image
            src="/images/hero.webp"
            alt={tImages("hero")}
            fill
            priority
            sizes="(min-width: 1152px) 72rem, 100vw"
            className="object-cover object-[center_40%]"
          />
        </div>
      </div>
    </section>
  );
}
