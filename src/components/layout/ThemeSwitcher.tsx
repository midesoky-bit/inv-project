"use client";

import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

type ThemeSwitcherProps = {
  className?: string;
};

function SunIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className="size-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
    >
      <circle cx="12" cy="12" r="4" />
      <path
        strokeLinecap="round"
        d="M12 3v2M12 19v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M3 12h2M19 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"
      />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className="size-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20.5 14.5A8.2 8.2 0 1 1 9.5 3.5a6.6 6.6 0 0 0 11 11z"
      />
    </svg>
  );
}

export function ThemeSwitcher({ className }: ThemeSwitcherProps) {
  const t = useTranslations("theme");
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  if (!mounted) {
    return (
      <span
        className={`inline-flex size-10 ${className ?? ""}`}
        aria-hidden
        data-theme-switcher-placeholder
      />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? t("switchToLight") : t("switchToDark")}
      className={`inline-flex size-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-foreground/10 ${className ?? ""}`}
    >
      {isDark ? <MoonIcon /> : <SunIcon />}
    </button>
  );
}
