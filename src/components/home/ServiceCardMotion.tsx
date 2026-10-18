"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ServiceMark } from "@/components/home/ServiceIconRow";
import { Link } from "@/i18n/navigation";
import { isRemoteAsset } from "@/lib/cms/image-hosts";

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
  const ref = useRef<HTMLElement>(null);
  const [phase, setPhase] = useState<"hidden" | "visible">(
    reduceMotion ? "visible" : "hidden",
  );

  useEffect(() => {
    if (reduceMotion) {
      setPhase("visible");
      return;
    }

    const node = ref.current;
    if (!node) return;

    let frame = 0;
    const reveal = () => {
      frame = requestAnimationFrame(() => setPhase("visible"));
    };

    const rect = node.getBoundingClientRect();
    const alreadyVisible = rect.top < window.innerHeight - 40 && rect.bottom > 40;
    if (alreadyVisible) {
      reveal();
      return () => cancelAnimationFrame(frame);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          reveal();
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );
    observer.observe(node);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [reduceMotion]);

  return (
    <motion.article
      ref={ref}
      initial={false}
      animate={phase === "hidden" ? { opacity: 0, y: 16 } : { opacity: 1, y: 0 }}
      transition={{
        duration: reduceMotion ? 0 : 0.45,
        delay: phase === "visible" && !reduceMotion ? (index % 4) * 0.08 : 0,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group overflow-hidden rounded-2xl border border-border bg-surface shadow-[0_12px_32px_rgb(11_29_54_/_0.08)] transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgb(11_29_54_/_0.12)] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
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
            unoptimized={isRemoteAsset(imageSrc)}
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
        </div>
        <div className="space-y-3 p-5">
          <ServiceMark icon={icon} className="text-foreground" />
          <h3 className="font-sans text-lg font-semibold tracking-tight text-foreground">
            {title}
          </h3>
          <p className="text-sm leading-relaxed text-muted">{summary}</p>
          <span className="inline-flex items-center gap-2 pt-1 text-sm font-medium text-foreground transition-transform group-hover:translate-x-1 group-focus-within:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0 motion-reduce:group-focus-within:translate-x-0 rtl:group-hover:-translate-x-1 rtl:group-focus-within:-translate-x-1 rtl:motion-reduce:group-hover:translate-x-0 rtl:motion-reduce:group-focus-within:translate-x-0">
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
