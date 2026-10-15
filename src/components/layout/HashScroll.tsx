"use client";

import { useEffect } from "react";
import { usePathname } from "@/i18n/navigation";
import { smoothScrollToId } from "@/components/layout/smoothScroll";

export function HashScroll() {
  const pathname = usePathname();

  useEffect(() => {
    const id = window.location.hash.replace(/^#/, "");
    if (!id) return;

    const frame = window.requestAnimationFrame(() => {
      smoothScrollToId(id);
    });

    return () => window.cancelAnimationFrame(frame);
  }, [pathname]);

  return null;
}
