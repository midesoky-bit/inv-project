export type WorkItem = {
  src:
    | "/images/forum.webp"
    | "/images/analytics.webp"
    | "/images/briefing.webp"
    | "/images/hero.webp"
    | "/images/about.webp";
  filter: "events" | "digital" | "affairs" | "capital" | "partnerships";
  serviceSlug: string;
};

export const WORK_ITEMS = [
  {
    src: "/images/forum.webp",
    filter: "events",
    serviceSlug: "events-exhibitions",
  },
  {
    src: "/images/analytics.webp",
    filter: "digital",
    serviceSlug: "digital-media-platforms",
  },
  {
    src: "/images/briefing.webp",
    filter: "affairs",
    serviceSlug: "public-affairs-government-relations",
  },
  {
    src: "/images/hero.webp",
    filter: "capital",
    serviceSlug: "capital-markets-financial-communications",
  },
  {
    src: "/images/about.webp",
    filter: "partnerships",
    serviceSlug: "public-relations-partnerships",
  },
] as const satisfies readonly WorkItem[];

export function filterWork(filter: "all" | WorkItem["filter"]): WorkItem[] {
  if (filter === "all") return [...WORK_ITEMS];
  return WORK_ITEMS.filter((item) => item.filter === filter);
}
