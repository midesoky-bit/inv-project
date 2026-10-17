"use client";

import { useTranslations } from "next-intl";
import { FormEvent, useState } from "react";
import { SOCIAL_NETWORKS } from "@/components/layout/social";
import { useRouter } from "@/i18n/navigation";

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="size-5" fill="none" stroke="currentColor" strokeWidth="1.75">
      <circle cx="11" cy="11" r="6.5" />
      <path d="M16 16.5 20 20.5" strokeLinecap="round" />
    </svg>
  );
}

export function HeaderTools() {
  const t = useTranslations("header");
  const router = useRouter();
  const [open, setOpen] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = new FormData(event.currentTarget).get("q")?.toString().trim() ?? "";
    router.push(query ? `/services?q=${encodeURIComponent(query)}` : "/services");
    setOpen(false);
  }

  return (
    <div className="flex items-center gap-1">
      {open ? (
        <form onSubmit={submit} className="ms-4 hidden sm:block">
          <input
            name="q"
            type="search"
            autoFocus
            aria-label={t("search")}
            placeholder={t("searchPlaceholder")}
            className="h-9 w-40 rounded-full border border-border bg-background px-3 text-sm text-foreground outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          />
        </form>
      ) : null}
      <button
        type="button"
        aria-label={t("search")}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="inline-flex size-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-foreground/10"
      >
        <SearchIcon />
      </button>
      <ul aria-label={t("social")} className="flex items-center">
        {SOCIAL_NETWORKS.map(({ label, url, Icon }) => (
          <li key={label}>
            <a
              href={t(url)}
              target="_blank"
              rel="noreferrer"
              aria-label={t(label)}
              className="inline-flex size-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-foreground/10"
            >
              <Icon />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
