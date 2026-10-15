"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";

type LanguageSwitcherProps = {
  className?: string;
  onLocaleChange?: () => void;
};

export function LanguageSwitcher({
  className,
  onLocaleChange,
}: LanguageSwitcherProps) {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("language");

  const switchLocale = (nextLocale: Locale) => {
    if (nextLocale === locale) return;

    const search = window.location.search;
    const hash = window.location.hash;

    router.replace(`${pathname}${search}`, { locale: nextLocale });

    if (hash) {
      window.location.hash = hash;
    }

    onLocaleChange?.();
  };

  return (
    <div
      role="group"
      aria-label={t("label")}
      className={className}
    >
      <ul className="flex items-center gap-2 text-sm">
        {routing.locales.map((code, index) => {
          const active = locale === code;
          return (
            <li key={code} className="flex items-center gap-2">
              {index > 0 ? (
                <span className="text-brand-foreground/35" aria-hidden>
                  |
                </span>
              ) : null}
              <button
                type="button"
                onClick={() => switchLocale(code)}
                aria-current={active ? "true" : undefined}
                lang={code === "ar" ? "ar" : undefined}
                className={
                  active
                    ? "text-brand-foreground"
                    : "text-brand-foreground/70 transition-colors hover:text-brand-foreground"
                }
              >
                {t(code)}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
