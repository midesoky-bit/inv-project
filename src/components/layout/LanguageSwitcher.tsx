"use client";

import { useLocale, useTranslations } from "next-intl";
import { getPathname, usePathname } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";

type LanguageSwitcherProps = {
  className?: string;
  onLocaleChange?: () => void;
};

function LanguageIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className="size-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" strokeLinecap="round" />
      <path d="M12 3c2.5 2.8 3.8 5.8 3.8 9S14.5 18.2 12 21c-2.5-2.8-3.8-5.8-3.8-9S9.5 5.8 12 3Z" />
    </svg>
  );
}

export function LanguageSwitcher({
  className,
  onLocaleChange,
}: LanguageSwitcherProps) {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const t = useTranslations("language");
  const nextLocale: Locale = locale === "ar" ? "en" : "ar";

  function switchLocale() {
    const nextPath = getPathname({ href: pathname, locale: nextLocale });
    const nextUrl = `${nextPath}${window.location.search}${window.location.hash}`;
    onLocaleChange?.();
    window.location.assign(nextUrl);
  }

  return (
    <button
      type="button"
      onClick={switchLocale}
      aria-label={nextLocale === "ar" ? t("switchToAr") : t("switchToEn")}
      className={`inline-flex size-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-foreground/10 ${className ?? ""}`}
    >
      <LanguageIcon />
    </button>
  );
}
