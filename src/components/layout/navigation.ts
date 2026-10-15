/** Display labels resolve via `nav.{messageKey}` in message catalogs. */
export const NAV_LINKS = [
  { href: "/#about", messageKey: "about" },
  { href: "/#services", messageKey: "services" },
  { href: "/#impact", messageKey: "approach" },
  { href: "/#esg", messageKey: "esg" },
  { href: "/#contact", messageKey: "contact" },
] as const;

export type NavMessageKey = (typeof NAV_LINKS)[number]["messageKey"];
