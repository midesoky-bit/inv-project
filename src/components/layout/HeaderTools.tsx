"use client";

import { useTranslations } from "next-intl";
import { FormEvent, useEffect, useId, useRef, useState } from "react";
import { SOCIAL_NETWORKS } from "@/components/layout/social";
import { useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="size-5" fill="none" stroke="currentColor" strokeWidth="1.75">
      <circle cx="11" cy="11" r="6.5" />
      <path d="M16 16.5 20 20.5" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="size-5" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
    </svg>
  );
}

export function HeaderTools() {
  const t = useTranslations("header");
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const searchId = useId();

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = new FormData(event.currentTarget).get("q")?.toString().trim() ?? "";
    router.push(query ? `/services?q=${encodeURIComponent(query)}` : "/services");
    setOpen(false);
  }

  return (
    <div ref={rootRef} className="flex shrink-0 items-center gap-1">
      <form
        role="search"
        onSubmit={submit}
        className={cn(
          "flex h-10 items-center overflow-hidden rounded-full border bg-background transition-[width,border-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
          open
            ? "w-[min(15rem,calc(100vw-6.5rem))] border-border focus-within:border-ring"
            : "w-10 border-transparent",
        )}
      >
        <button
          type="button"
          aria-label={open ? t("closeSearch") : t("search")}
          aria-expanded={open}
          aria-controls={searchId}
          onClick={() => setOpen((value) => !value)}
          className="inline-flex size-10 shrink-0 items-center justify-center rounded-full text-foreground transition-colors duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-foreground/10 motion-reduce:transition-none"
        >
          {open ? <CloseIcon /> : <SearchIcon />}
        </button>
        <input
          ref={inputRef}
          id={searchId}
          name="q"
          type="search"
          tabIndex={open ? undefined : -1}
          aria-hidden={!open}
          aria-label={t("search")}
          placeholder={t("searchPlaceholder")}
          className={cn(
            "h-10 min-w-0 flex-1 appearance-none bg-transparent pe-3 text-sm text-foreground outline-none transition-opacity duration-200 ease-out motion-reduce:transition-none",
            open ? "opacity-100" : "pointer-events-none opacity-0",
          )}
        />
      </form>
      <ul
        aria-label={t("social")}
        className={cn(
          "hidden items-center overflow-hidden transition-[max-width,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none xl:flex",
          open
            ? "max-xl:max-w-0 max-xl:opacity-0 max-xl:pointer-events-none"
            : "max-w-[12rem] opacity-100",
        )}
      >
        {SOCIAL_NETWORKS.map(({ label, url, Icon }) => (
          <li key={label}>
            <a
              href={t(url)}
              target="_blank"
              rel="noreferrer"
              aria-label={t(label)}
              className="inline-flex size-10 items-center justify-center rounded-full text-foreground transition-colors duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-foreground/10 motion-reduce:transition-none"
            >
              <Icon />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
