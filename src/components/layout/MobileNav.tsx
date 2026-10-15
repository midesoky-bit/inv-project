"use client";

import { useTranslations } from "next-intl";
import { useEffect, useId, useState } from "react";
import { NAV_LINKS } from "@/components/layout/navigation";
import { Link } from "@/i18n/navigation";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const t = useTranslations("nav");

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
        className="inline-flex h-10 w-10 items-center justify-center text-inv-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inv-accent md:hidden"
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

      {open ? (
        <nav
          id={panelId}
          aria-label={t("mobile")}
          className="absolute inset-x-0 top-full border-b border-white/10 bg-inv-navy md:hidden"
        >
          <ul className="mx-auto flex max-w-6xl flex-col px-6 py-4">
            {NAV_LINKS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block py-3 text-base text-white/85 transition-colors hover:text-inv-white"
                >
                  {t(item.messageKey)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </>
  );
}
