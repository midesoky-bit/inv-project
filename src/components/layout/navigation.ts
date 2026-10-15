/** Display labels resolve via `nav.{messageKey}` in message catalogs. */
export const NAV_LINKS = [
  { href: "/#about", messageKey: "about", detailKey: "aboutDetail" },
  { href: "/#services", messageKey: "services", detailKey: "servicesDetail" },
  { href: "/#impact", messageKey: "approach", detailKey: "approachDetail" },
  { href: "/#contact", messageKey: "contact", detailKey: "contactDetail" },
] as const;

export type NavMessageKey = (typeof NAV_LINKS)[number]["messageKey"];
