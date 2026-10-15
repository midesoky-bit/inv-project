"use client";

import { motion } from "framer-motion";
import Link from "next/link";

type ServiceCardMotionProps = {
  href: string;
  title: string;
  summary: string;
  index: number;
};

export function ServiceCardMotion({
  href,
  title,
  summary,
  index,
}: ServiceCardMotionProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: "easeOut" }}
      className="group border border-inv-navy/10 bg-inv-white p-8 transition-colors hover:border-inv-accent/40"
    >
      <Link href={href} className="block space-y-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-inv-accent">
        <h3 className="font-serif text-2xl tracking-tight text-inv-navy">
          {title}
        </h3>
        <p className="text-sm leading-relaxed text-inv-slate">{summary}</p>
        <span className="inline-flex items-center gap-2 text-sm font-medium text-inv-accent transition-transform group-hover:translate-x-1">
          Learn more
          <span aria-hidden>→</span>
        </span>
      </Link>
    </motion.article>
  );
}
