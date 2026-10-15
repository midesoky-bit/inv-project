export const NAV_LINKS = [
  { href: "/#services", messageKey: "services" },
  { href: "/#insights", messageKey: "insights" },
  { href: "/#esg", messageKey: "esg" },
  { href: "/#contact", messageKey: "contact" },
] as const;

export type NavMessageKey = (typeof NAV_LINKS)[number]["messageKey"];
