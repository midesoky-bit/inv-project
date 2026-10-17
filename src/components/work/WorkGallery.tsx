"use client";

import { useState } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import {
  filterWork,
  type WorkItem,
} from "@/components/work/work-items";

const FILTERS = [
  "all",
  "events",
  "digital",
  "affairs",
  "capital",
  "partnerships",
] as const satisfies readonly ("all" | WorkItem["filter"])[];

type WorkGalleryProps = {
  items: WorkItem[];
  labels: Record<WorkItem["filter"] | "all", string>;
  captions: Record<string, string>;
};

export function WorkGallery({ items, labels, captions }: WorkGalleryProps) {
  const [filter, setFilter] = useState<"all" | WorkItem["filter"]>("all");
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
      aria-labelledby="work-heading"
      className="bg-surface-muted px-6 py-14 md:py-20"
    >
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((key) => {
            const selected = filter === key;
            return (
              <button
                key={key}
                type="button"
                aria-pressed={selected}
                onClick={() => setFilter(key)}
                className={`rounded-full px-4 py-2 text-sm font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${
                  selected
                    ? "bg-accent text-accent-foreground"
                    : "border border-border bg-transparent text-foreground"
                }`}
              >
                {labels[key]}
              </button>
            );
          })}
        </div>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((item) => (
            <li key={item.src}>
              <Link
                href={`/services/${item.serviceSlug}`}
                className="group block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                <figure>
                  <div className="relative aspect-[4/3] overflow-hidden bg-brand">
                    <Image
                      src={item.src}
                      alt={captions[item.serviceSlug] ?? ""}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                  <figcaption className="mt-3 text-start text-sm font-medium text-foreground">
                    {captions[item.serviceSlug] ?? ""}
                  </figcaption>
                </figure>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
