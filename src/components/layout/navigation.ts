import { cn } from "@/lib/utils";

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

const UNDERLINE =
  "relative inline-flex items-center pb-1 transition-colors duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none after:pointer-events-none after:absolute after:bottom-0 after:start-0 after:h-0.5 after:w-0 after:bg-accent after:transition-[width] after:duration-300 after:ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:after:transition-none hover:after:w-full focus-visible:after:w-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring";

type NavLinkClassOptions = {
  active?: boolean;
  size?: "sm" | "base";
  tone?: "default" | "accent" | "onBrand";
  className?: string;
};

export function navLinkClass({
  active = false,
  size = "sm",
  tone = "default",
  className,
}: NavLinkClassOptions = {}) {
  return cn(
    UNDERLINE,
    size === "sm" ? "text-sm" : "text-base",
    active && "after:w-full",
    tone === "default" &&
      (active
        ? "text-foreground"
        : "text-foreground/80 hover:text-foreground focus-visible:text-foreground"),
    tone === "accent" &&
      (active
        ? "text-accent"
        : "text-foreground/80 hover:text-accent focus-visible:text-accent"),
    tone === "onBrand" &&
      (active
        ? "text-brand-foreground"
        : "text-brand-foreground/80 hover:text-brand-foreground focus-visible:text-brand-foreground"),
    className,
  );
}
