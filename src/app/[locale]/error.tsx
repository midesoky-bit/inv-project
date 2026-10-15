"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ reset }: ErrorProps) {
  const t = useTranslations("errors");

  return (
    <div className="mx-auto flex min-h-[50vh] max-w-lg flex-col justify-center px-6 py-24 text-center">
      <h1 className="font-serif text-3xl text-foreground">{t("errorTitle")}</h1>
      <p className="mt-4 text-muted">{t("errorBody")}</p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center justify-center border border-border px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-surface-muted"
        >
          {t("retry")}
        </button>
        <Link
          href="/"
          className="text-sm font-medium text-accent hover:underline"
        >
          Inventure Communications
        </Link>
      </div>
    </div>
  );
}
