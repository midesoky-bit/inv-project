"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useEffect, useId, useState } from "react";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { SectionLink } from "@/components/layout/SectionLink";
import { NAV_LINKS } from "@/components/layout/navigation";
import type { NavService } from "@/components/layout/DesktopNav";

type MobileNavProps = {
  services: NavService[];
};

export function MobileNav({ services }: MobileNavProps) {
  void services;
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const t = useTranslations("nav");
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <>
      <button
        type="button"
        aria-label={open ? t("closeMenu") : t("openMenu")}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
        className="inline-flex h-10 w-10 items-center justify-center text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring xl:hidden"
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 22 22"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden
        >
          {open ? (
            <path d="M4 4l14 14M18 4L4 18" />
          ) : (
            <path d="M3 6h16M3 11h16M3 16h16" />
          )}
        </svg>
      </button>

      <AnimatePresence>
        {open ? (
          <motion.nav
            key="mobile-panel"
            id={panelId}
            aria-label={t("mobile")}
            initial={reduceMotion ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="absolute inset-x-0 top-full border-b border-border bg-background text-foreground xl:hidden"
          >
            <ul className="mx-auto flex max-w-6xl flex-col px-6 py-4">
              {NAV_LINKS.map((item, index) => (
                <motion.li
                  key={item.href}
                  initial={reduceMotion ? false : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.22,
                    delay: reduceMotion ? 0 : 0.04 * index,
                    ease: "easeOut",
                  }}
                >
                  <SectionLink
                    href={item.href}
                    onNavigate={() => setOpen(false)}
                    className="block py-3 text-base text-foreground/85 transition-colors hover:text-foreground"
                  >
                    {t(item.messageKey)}
                  </SectionLink>
                </motion.li>
              ))}
            </ul>
            <div className="mx-auto flex max-w-6xl flex-col gap-4 border-t border-border px-6 py-4">
              <LanguageSwitcher onLocaleChange={() => setOpen(false)} />
            </div>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </>
  );
}
