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
      <ul className="flex items-center gap-3 2xl:gap-4">
        {NAV_LINKS.filter((item) => item.href !== "/").map((item) => {
          const active = isNavActive(pathname, item.href);
          return (
            <li key={item.href}>
              <SectionLink
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={navLinkClass({
                  active,
                  className: "text-xs 2xl:text-sm",
                })}
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
