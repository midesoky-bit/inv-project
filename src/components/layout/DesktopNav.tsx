"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { NAV_LINKS } from "@/components/layout/navigation";
import { SectionLink } from "@/components/layout/SectionLink";
import { Link } from "@/i18n/navigation";

export type NavService = {
  slug: string;
  title: string;
  summary: string;
};

type DesktopNavProps = {
  services: NavService[];
};

export function DesktopNav({ services }: DesktopNavProps) {
  const t = useTranslations("nav");
  const reduceMotion = useReducedMotion();
  const [open, setOpen] = useState<(typeof NAV_LINKS)[number]["messageKey"] | null>(
    null,
  );

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(null);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <nav
      aria-label={t("primary")}
      className="hidden md:block"
      onMouseLeave={() => setOpen(null)}
    >
      <ul className="flex items-center gap-8">
        {NAV_LINKS.map((item) => {
          const isOpen = open === item.messageKey;
          return (
            <li
              key={item.href}
              className="relative"
              onMouseEnter={() =>
                setOpen(item.messageKey === "services" ? item.messageKey : null)
              }
              onFocus={() =>
                setOpen(item.messageKey === "services" ? item.messageKey : null)
              }
            >
              <SectionLink
                href={item.href}
                className={
                  isOpen
                    ? "text-sm text-foreground"
                    : "text-sm text-foreground/80 transition-colors hover:text-foreground"
                }
              >
                {t(item.messageKey)}
              </SectionLink>
              <AnimatePresence>
                {isOpen ? (
                  <motion.ul
                    key="services-menu"
                    initial={reduceMotion ? false : { opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduceMotion ? undefined : { opacity: 0, y: -4 }}
                    transition={{ duration: 0.16, ease: "easeOut" }}
                    className="absolute start-0 top-full z-40 mt-3 w-64 border border-border bg-surface py-2 shadow-lg"
                  >
                    {services.map((service) => (
                      <li key={service.slug}>
                        <Link
                          href={`/services/${service.slug}`}
                          onClick={() => setOpen(null)}
                          className="block px-4 py-2 text-sm text-foreground/85 transition-colors hover:bg-foreground/5 hover:text-foreground"
                        >
                          {service.title}
                        </Link>
                      </li>
                    ))}
                  </motion.ul>
                ) : null}
              </AnimatePresence>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
