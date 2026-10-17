"use client";

import { useTranslations } from "next-intl";
import { NAV_LINKS } from "@/components/layout/navigation";
import { SectionLink } from "@/components/layout/SectionLink";

export function DesktopNav() {
  const t = useTranslations("nav");

  return (
    <nav aria-label={t("primary")} className="hidden xl:block">
      <ul className="flex items-center gap-8">
        {NAV_LINKS.map((item) => (
          <li key={item.href}>
            <SectionLink
              href={item.href}
              className="text-sm text-foreground/80 transition-colors hover:text-foreground"
            >
              {t(item.messageKey)}
            </SectionLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
