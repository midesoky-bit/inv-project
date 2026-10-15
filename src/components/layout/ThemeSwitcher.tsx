"use client";

import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

const OPTIONS = ["light", "dark", "system"] as const;
type ThemeOption = (typeof OPTIONS)[number];

type ThemeSwitcherProps = {
  className?: string;
};

export function ThemeSwitcher({ className }: ThemeSwitcherProps) {
  const t = useTranslations("theme");
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const active = (theme ?? "system") as ThemeOption;

  if (!mounted) {
    return (
      <div
        className={className}
        aria-hidden
        data-theme-switcher-placeholder
      >
        <div className="flex min-h-10 items-center gap-1 rounded-md border border-brand-foreground/20 p-1">
          {OPTIONS.map((option) => (
            <span
              key={option}
              className="rounded px-2.5 py-1.5 text-xs font-medium opacity-0"
            >
              {t(option)}
            </span>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      role="radiogroup"
      aria-label={t("label")}
      className={className}
    >
      <div className="flex items-center gap-1 rounded-md border border-brand-foreground/20 p-1">
        {OPTIONS.map((option) => {
          const checked = active === option;
          return (
            <button
              key={option}
              type="button"
              role="radio"
              aria-checked={checked}
              onClick={() => setTheme(option)}
              className={
                checked
                  ? "rounded bg-brand-foreground/15 px-2.5 py-1.5 text-xs font-medium text-brand-foreground"
                  : "rounded px-2.5 py-1.5 text-xs font-medium text-brand-foreground/70 transition-colors hover:text-brand-foreground"
              }
            >
              {t(option)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
