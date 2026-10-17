"use client";

import { useTranslations } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import { isNavActive, NAV_LINKS, navLinkClass } from "@/components/layout/navigation";
import { SectionLink } from "@/components/layout/SectionLink";

export function DesktopNav() {
  const t = useTranslations("nav");
  const pathname = usePathname();

  return (
    <nav aria-label={t("primary")} className="hidden xl:block">
      <ul className="flex items-center gap-5">
        {NAV_LINKS.map((item) => {
          const active = isNavActive(pathname, item.href);
          return (
            <li key={item.href}>
              <SectionLink
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={navLinkClass({ active })}
              >
                {t(item.messageKey)}
              </SectionLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
