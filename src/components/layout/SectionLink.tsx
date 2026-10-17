"use client";

import type { MouseEvent, ReactNode } from "react";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { smoothScrollToId } from "@/components/layout/smoothScroll";

type SectionLinkProps = {
  href: string;
  className?: string;
  children: ReactNode;
  onNavigate?: () => void;
  "aria-current"?: "page" | undefined;
};

function samePage(path: string, locale: string) {
  const current = window.location.pathname.replace(/\/$/, "") || "/";
  const target =
    (path === "/" ? `/${locale}` : `/${locale}${path}`).replace(/\/$/, "") ||
    "/";
  return current === target;
}

export function SectionLink({
  href,
  className,
  children,
  onNavigate,
  "aria-current": ariaCurrent,
}: SectionLinkProps) {
  const locale = useLocale();
  const hashAt = href.indexOf("#");
  const id = hashAt === -1 ? "" : href.slice(hashAt + 1);
  const path = hashAt === -1 ? href : href.slice(0, hashAt) || "/";

  function handle(event: { preventDefault: () => void }) {
    if (!id) {
      onNavigate?.();
      return;
    }
    if (samePage(path, locale) && smoothScrollToId(id)) {
      event.preventDefault();
    }
    onNavigate?.();
  }

  return (
    <Link
      href={href}
      className={className}
      aria-current={ariaCurrent}
      onClick={(event: MouseEvent<HTMLAnchorElement>) => handle(event)}
      onNavigate={handle}
    >
      {children}
    </Link>
  );
}
