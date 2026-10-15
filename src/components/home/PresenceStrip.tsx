"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useSyncExternalStore } from "react";

function useHydrated() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

const MARKETS = ["egypt", "saudi", "uae", "qatar"] as const;

export function PresenceStrip() {
  const t = useTranslations("presence");
  const reduceMotion = useReducedMotion();
  const hydrated = useHydrated();
  const animate = hydrated && !reduceMotion;

  return (
    <section
      aria-labelledby="presence-heading"
      className="border-y border-border bg-background px-6 py-10"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <h2
          id="presence-heading"
          className="text-xs font-medium tracking-[0.18em] text-accent uppercase"
        >
          {t("label")}
        </h2>
        <ul className="flex flex-wrap gap-x-8 gap-y-3">
          {MARKETS.map((market, index) => (
            <motion.li
              key={market}
              initial={animate ? { opacity: 0, y: 8 } : false}
              animate={animate ? { opacity: 1, y: 0 } : undefined}
              transition={{
                duration: 0.4,
                delay: 0.08 * index,
                ease: "easeOut",
              }}
              className="font-serif text-lg text-foreground"
            >
              {t(market)}
            </motion.li>
          ))}
        </ul>
        </div>
        <p className="max-w-3xl text-sm leading-relaxed text-muted">{t("body")}</p>
      </div>
    </section>
  );
}
