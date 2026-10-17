/** Display labels resolve via `nav.{messageKey}` in message catalogs. */
export const NAV_LINKS = [
  { href: "/", messageKey: "home" },
  { href: "/about", messageKey: "about" },
  { href: "/services", messageKey: "services" },
  { href: "/work", messageKey: "work" },
  { href: "/insights", messageKey: "insights" },
  { href: "/careers", messageKey: "careers" },
  { href: "/contact", messageKey: "contact" },
] as const;

export type NavMessageKey = (typeof NAV_LINKS)[number]["messageKey"];

export function isNavActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
