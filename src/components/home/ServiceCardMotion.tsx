"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useSyncExternalStore } from "react";
import { ServiceMark } from "@/components/home/ServiceIconRow";
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
  imageSrc: string;
  imageAlt: string;
  icon?: string;
};

export function ServiceCardMotion({
  href,
  title,
  summary,
  index,
  learnMoreLabel,
  imageSrc,
  imageAlt,
  icon,
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
      className="group overflow-hidden rounded-2xl border border-border bg-surface shadow-[0_12px_32px_rgb(11_29_54_/_0.08)] transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgb(11_29_54_/_0.12)]"
    >
      <Link
        href={href}
        className="block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
      >
        <div className="relative aspect-[16/10] overflow-hidden bg-brand">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        </div>
        <div className="space-y-3 p-5">
          <ServiceMark icon={icon} className="text-foreground" />
          <h3 className="font-sans text-lg font-semibold tracking-tight text-foreground">
            {title}
          </h3>
          <p className="text-sm leading-relaxed text-muted">{summary}</p>
          <span className="inline-flex items-center gap-2 pt-1 text-sm font-medium text-foreground transition-transform group-hover:translate-x-1 group-focus-within:translate-x-1 rtl:group-hover:-translate-x-1 rtl:group-focus-within:-translate-x-1">
            {learnMoreLabel}
            <span aria-hidden className="rtl:-scale-x-100">
              →
            </span>
          </span>
        </div>
      </Link>
    </motion.article>
  );
}
