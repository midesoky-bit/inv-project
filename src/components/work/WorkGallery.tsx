"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import {
  WORK_FILTERS,
  filterWork,
  type WorkFilter,
  type WorkItem,
} from "@/components/work/work-items";

type WorkGalleryProps = {
  items: WorkItem[];
  labels: Record<"all" | WorkFilter, string>;
  alts: Record<WorkItem["src"], string>;
};

export function WorkGallery({ items, labels, alts }: WorkGalleryProps) {
  const reduceMotion = useReducedMotion();
  const [filter, setFilter] = useState<"all" | WorkFilter>("all");
  const visible = filterWork(filter).flatMap((catalogItem) => {
    const match = items.find(
      (item) =>
        item.src === catalogItem.src &&
        item.filter === catalogItem.filter &&
        item.serviceSlug === catalogItem.serviceSlug,
    );
    return match ? [match] : [];
  });

  return (
    <section
      id="gallery"
      aria-labelledby="work-heading"
      className="scroll-mt-24 bg-background px-4 py-8 sm:px-6 md:py-12 lg:px-8"
    >
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap gap-2">
          {WORK_FILTERS.map((key) => {
            const selected = filter === key;
            return (
              <button
                key={key}
                type="button"
                aria-pressed={selected}
                onClick={() => setFilter(key)}
                className={`rounded-full px-5 py-2 text-sm font-medium transition-colors motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${
                  selected
                    ? "bg-accent text-accent-foreground"
                    : "border border-border bg-background text-foreground hover:border-accent"
                }`}
              >
                {labels[key]}
              </button>
            );
          })}
        </div>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <AnimatePresence mode="popLayout" initial={false}>
          {visible.map((item) => (
            <motion.li
              key={item.src}
              layout={!reduceMotion}
              initial={reduceMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: 8 }}
              transition={{ duration: reduceMotion ? 0 : 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link
                href={`/services/${item.serviceSlug}`}
                className="group block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                <figure>
                  <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-brand">
                    <Image
                      src={item.src}
                      alt={alts[item.src]}
                      fill
                      sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                    />
                  </div>
                </figure>
              </Link>
            </motion.li>
          ))}
          </AnimatePresence>
        </ul>
      </div>
    </section>
  );
}
