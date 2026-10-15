"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useSyncExternalStore } from "react";
import { Link } from "@/i18n/navigation";

function useHydrated() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

type ServiceCardMotionProps = {
  href: string;
  title: string;
  summary: string;
  index: number;
  learnMoreLabel: string;
};

export function ServiceCardMotion({
  href,
  title,
  summary,
  index,
  learnMoreLabel,
}: ServiceCardMotionProps) {
  const reduceMotion = useReducedMotion();
  const hydrated = useHydrated();
  const animate = hydrated && !reduceMotion;

  return (
    <motion.article
      initial={animate ? { opacity: 0, y: 16 } : false}
      whileInView={animate ? { opacity: 1, y: 0 } : undefined}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: "easeOut" }}
      className="group border border-border bg-surface p-8 transition-colors hover:border-accent/40"
    >
      <Link
        href={href}
        className="block space-y-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
      >
        <h3 className="font-serif text-2xl tracking-tight text-foreground">
          {title}
        </h3>
        <p className="text-sm leading-relaxed text-muted">{summary}</p>
        <span className="inline-flex items-center gap-2 text-sm font-medium text-accent transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1">
          {learnMoreLabel}
          <span aria-hidden className="rtl:-scale-x-100">
            →
          </span>
        </span>
      </Link>
    </motion.article>
  );
}
