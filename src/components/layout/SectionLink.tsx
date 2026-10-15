"use client";

import { useReducedMotion } from "framer-motion";
import type { MouseEvent, ReactNode } from "react";
import { Link, usePathname } from "@/i18n/navigation";

type SectionLinkProps = {
  href: string;
  className?: string;
  children: ReactNode;
  onNavigate?: () => void;
};

function scrollToId(id: string, smooth: boolean) {
  const target = document.getElementById(id);
  if (!target) return false;
  target.scrollIntoView({
    behavior: smooth ? "smooth" : "auto",
    block: "start",
  });
  const nextHash = `#${id}`;
  if (window.location.hash !== nextHash) {
    window.history.pushState(null, "", nextHash);
  }
  return true;
}

export function SectionLink({
  href,
  className,
  children,
  onNavigate,
}: SectionLinkProps) {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();

  function onClick(event: MouseEvent<HTMLAnchorElement>) {
    const hashAt = href.indexOf("#");
    if (hashAt === -1) {
      onNavigate?.();
      return;
    }

    const id = href.slice(hashAt + 1);
    const path = href.slice(0, hashAt) || "/";
    const onThisPage = pathname === path || (path === "/" && pathname === "/");

    if (onThisPage && scrollToId(id, !reduceMotion)) {
      event.preventDefault();
    }

    onNavigate?.();
  }

  return (
    <Link href={href} scroll={false} className={className} onClick={onClick}>
      {children}
    </Link>
  );
}
