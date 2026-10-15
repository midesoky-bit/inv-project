"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect } from "react";
import { usePathname } from "@/i18n/navigation";

export function HashScroll() {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const id = window.location.hash.replace(/^#/, "");
    if (!id) return;

    const target = document.getElementById(id);
    if (!target) return;

    const frame = window.requestAnimationFrame(() => {
      target.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "start",
      });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [pathname, reduceMotion]);

  return null;
}
