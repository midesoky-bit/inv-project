import type { Service } from "@/types/cms";

export const SERVICE_VISUALS = {
  forum: { src: "/images/forum.webp", altKey: "forum" },
  analytics: { src: "/images/analytics.webp", altKey: "analytics" },
  towers: { src: "/images/hero.webp", altKey: "hero" },
  briefing: { src: "/images/briefing.webp", altKey: "briefing" },
  office: { src: "/images/about.webp", altKey: "about" },
} as const;

export type ServiceVisual = (typeof SERVICE_VISUALS)[keyof typeof SERVICE_VISUALS];

export function serviceVisual(slug: string): ServiceVisual {
  if (slug === "events-event-management") {
    return SERVICE_VISUALS.forum;
  }
  if (slug === "media-production-content-creation") {
    return SERVICE_VISUALS.analytics;
  }
  if (slug === "government-relations") {
    return SERVICE_VISUALS.briefing;
  }
  if (slug === "sustainability-advisory") {
    return SERVICE_VISUALS.office;
  }
  if (slug === "business-networking-strategic-partnerships") {
    return SERVICE_VISUALS.towers;
  }
  return SERVICE_VISUALS.briefing;
}

export function serviceCardVisual(
  service: Pick<Service, "slug" | "image">,
): { src: string; altKey: ServiceVisual["altKey"] } {
  const fallback = serviceVisual(service.slug);
  if (service.image?.trim()) {
    return { src: service.image, altKey: fallback.altKey };
  }
  return fallback;
}
