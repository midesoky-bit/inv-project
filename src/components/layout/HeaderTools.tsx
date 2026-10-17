"use client";

import { useTranslations } from "next-intl";
import { FormEvent, useState } from "react";
import { useRouter } from "@/i18n/navigation";

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="size-5" fill="none" stroke="currentColor" strokeWidth="1.75">
      <circle cx="11" cy="11" r="6.5" />
      <path d="M16 16.5 20 20.5" strokeLinecap="round" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="size-4" fill="currentColor">
      <path d="M4.7 3.5A1.8 1.8 0 1 0 4.7 7a1.8 1.8 0 0 0 0-3.5ZM3.2 8.7h3v12h-3v-12Zm5.1 0h2.9v1.6h.1c.4-.8 1.4-1.7 2.9-1.7 3.1 0 3.7 2 3.7 4.7v7.4h-3v-6.6c0-1.6 0-3.6-2.2-3.6s-2.5 1.7-2.5 3.5v6.7h-3v-12Z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="size-4" fill="currentColor">
      <path d="M14.7 10.3 21.4 3h-1.6l-5.8 6.4L9.2 3H3.5l7 9.9L3.5 21h1.6l6.1-6.8L15.3 21h5.7l-6.3-10.7Zm-2.2 2.4-.7-1-5.6-7.8h2.4l4.5 6.3.7 1 5.9 8.2h-2.4l-4.8-6.7Z" />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="size-4" fill="currentColor">
      <path d="M22 12.2s0-3.2-.4-4.6c-.2-.9-.9-1.6-1.8-1.8C18.3 5.4 12 5.4 12 5.4s-6.3 0-7.8.4c-.9.2-1.6.9-1.8 1.8C2 9 2 12.2 2 12.2s0 3.2.4 4.6c.2.9.9 1.6 1.8 1.8 1.5.4 7.8.4 7.8.4s6.3 0 7.8-.4c.9-.2 1.6-.9 1.8-1.8.4-1.4.4-4.6.4-4.6ZM10 15.5v-6.6l5.2 3.3-5.2 3.3Z" />
    </svg>
  );
}

const SOCIAL = [
  { label: "linkedin", url: "linkedinUrl", Icon: LinkedInIcon },
  { label: "x", url: "xUrl", Icon: XIcon },
  { label: "youtube", url: "youtubeUrl", Icon: YouTubeIcon },
] as const;

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
        {SOCIAL.map(({ label, url, Icon }) => (
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
