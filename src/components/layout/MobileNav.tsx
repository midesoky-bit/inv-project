"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useEffect, useId, useState } from "react";
import { SectionLink } from "@/components/layout/SectionLink";
import { usePathname } from "@/i18n/navigation";
import { isNavActive, NAV_LINKS, navLinkClass } from "@/components/layout/navigation";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const t = useTranslations("nav");
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onResize = () => {
      if (window.matchMedia("(min-width: 80rem)").matches) setOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        aria-label={open ? t("closeMenu") : t("openMenu")}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
        className="inline-flex h-10 w-10 items-center justify-center rounded-full text-foreground transition-colors duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-foreground/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-reduce:transition-none xl:hidden"
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
          <motion.button
            key="mobile-backdrop"
            type="button"
            aria-label={t("closeMenu")}
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.2 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 top-20 z-20 bg-foreground/25 xl:hidden"
          />
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {open ? (
          <motion.nav
            key="mobile-panel"
            id={panelId}
            aria-label={t("mobile")}
            initial={reduceMotion ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: reduceMotion ? 0 : 0.22, ease: "easeOut" }}
            className="absolute inset-x-0 top-full z-30 border-b border-border bg-background text-foreground xl:hidden"
          >
            <ul className="mx-auto flex max-w-6xl flex-col px-6 py-4">
              {NAV_LINKS.map((item, index) => {
                const active = isNavActive(pathname, item.href);
                return (
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
                    aria-current={active ? "page" : undefined}
                    className="group flex w-full items-center py-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
                  >
                    <span className={navLinkClass({ active, size: "base" })}>
                      {t(item.messageKey)}
                    </span>
                  </SectionLink>
                </motion.li>
                );
              })}
            </ul>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </>
  );
}
