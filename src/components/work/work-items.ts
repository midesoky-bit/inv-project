export type WorkFilter =
  | "conferences"
  | "forums"
  | "summits"
  | "exhibitions"
  | "campaigns";

export type WorkItem = {
  src:
    | "/images/forum.webp"
    | "/images/analytics.webp"
    | "/images/briefing.webp"
    | "/images/hero.webp"
    | "/images/about.webp";
  filter: WorkFilter;
  serviceSlug: string;
  altKey: "forum" | "analytics" | "briefing" | "hero" | "about";
};

export const WORK_FILTERS = [
  "all",
  "conferences",
  "forums",
  "summits",
  "exhibitions",
  "campaigns",
] as const satisfies readonly ("all" | WorkFilter)[];

export const WORK_ITEMS = [
  {
    src: "/images/forum.webp",
    filter: "conferences",
    serviceSlug: "events-exhibitions",
    altKey: "forum",
  },
  {
    src: "/images/briefing.webp",
    filter: "forums",
    serviceSlug: "public-affairs-government-relations",
    altKey: "briefing",
  },
  {
    src: "/images/about.webp",
    filter: "summits",
    serviceSlug: "events-exhibitions",
    altKey: "about",
  },
  {
    src: "/images/hero.webp",
    filter: "exhibitions",
    serviceSlug: "events-exhibitions",
    altKey: "hero",
  },
  {
    src: "/images/analytics.webp",
    filter: "campaigns",
    serviceSlug: "digital-media-platforms",
    altKey: "analytics",
  },
] as const satisfies readonly WorkItem[];

export function filterWork(filter: "all" | WorkFilter): WorkItem[] {
  if (filter === "all") return [...WORK_ITEMS];
  return WORK_ITEMS.filter((item) => item.filter === filter);
}
