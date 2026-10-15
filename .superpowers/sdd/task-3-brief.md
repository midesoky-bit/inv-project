### Task 3: Design tokens, utilities, Button, Header, Footer, layout SEO

**Files:**
- Create: `src/lib/utils.ts`
- Create: `src/components/ui/Button.tsx`
- Create: `src/components/layout/navigation.ts`
- Create: `src/components/layout/MobileNav.tsx`
- Create: `src/components/layout/Header.tsx`
- Create: `src/components/layout/Footer.tsx`
- Modify: `src/app/globals.css`
- Modify: `src/app/layout.tsx`
- Delete or replace: default `src/app/page.tsx` starter chrome as needed (homepage filled in Task 4)

**Interfaces:**
- Consumes: design tokens from spec
- Produces: `cn()`, `Button`, `NAV_ITEMS`, `MobileNav`, `Header`, `Footer`, global metadata + fonts (no root canonical — homepage sets its own in Task 4)

- [ ] **Step 1: Add `cn` utility**

Create `src/lib/utils.ts`:

```ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

Install helpers:

```powershell
npm install clsx tailwind-merge
```

- [ ] **Step 2: Write globals with tokens**

Replace `src/app/globals.css` with:

```css
@import "tailwindcss";

:root {
  --inv-navy: #0b1d36;
  --inv-navy-mid: #132a4a;
  --inv-slate: #5c6b7a;
  --inv-mist: #f3f5f7;
  --inv-white: #ffffff;
  --inv-accent: #3a6b8c;
  --background: var(--inv-white);
  --foreground: var(--inv-navy);
}

@theme inline {
  --color-inv-navy: var(--inv-navy);
  --color-inv-navy-mid: var(--inv-navy-mid);
  --color-inv-slate: var(--inv-slate);
  --color-inv-mist: var(--inv-mist);
  --color-inv-white: var(--inv-white);
  --color-inv-accent: var(--inv-accent);
  --font-sans: var(--font-ibm-plex-sans);
  --font-serif: var(--font-ibm-plex-serif);
}

body {
  background: var(--background);
  color: var(--foreground);
  font-family: var(--font-ibm-plex-sans), system-ui, sans-serif;
}

::selection {
  background: color-mix(in srgb, var(--inv-accent) 35%, white);
}
```

- [ ] **Step 3: Implement Button**

Create `src/components/ui/Button.tsx`:

```tsx
import Link from "next/link";
import { cn } from "@/lib/utils";

type ButtonProps = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "ghost";
  className?: string;
};

export function Button({
  href,
  children,
  variant = "primary",
  className,
}: ButtonProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center justify-center px-6 py-3 text-sm font-medium tracking-wide transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inv-accent",
        variant === "primary" &&
          "bg-inv-white text-inv-navy hover:bg-inv-mist",
        variant === "ghost" &&
          "bg-transparent text-inv-white underline-offset-4 hover:underline",
        className,
      )}
    >
      {children}
    </Link>
  );
}
```

- [ ] **Step 4a: Shared nav items** (Amendment A)

Create `src/components/layout/navigation.ts`:

```ts
export const NAV_ITEMS = [
  { href: "/#services", label: "Services" },
  { href: "/#insights", label: "Insights" },
  { href: "/#esg", label: "ESG" },
  { href: "/#contact", label: "Contact" },
] as const;
```

- [ ] **Step 4b: Mobile nav (client leaf)** (Amendment A)

Create `src/components/layout/MobileNav.tsx`:

```tsx
"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";
import { NAV_ITEMS } from "@/components/layout/navigation";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <>
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
        className="inline-flex h-10 w-10 items-center justify-center text-inv-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inv-accent md:hidden"
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 22 22"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden
        >
          {open ? (
            <path d="M4 4l14 14M18 4L4 18" />
          ) : (
            <path d="M3 6h16M3 11h16M3 16h16" />
          )}
        </svg>
      </button>

      {open ? (
        <nav
          id={panelId}
          aria-label="Mobile"
          className="absolute inset-x-0 top-full border-b border-white/10 bg-inv-navy md:hidden"
        >
          <ul className="mx-auto flex max-w-6xl flex-col px-6 py-4">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block py-3 text-base text-white/85 transition-colors hover:text-inv-white"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </>
  );
}
```

- [ ] **Step 4c: Header** (Amendment A)

Replace `src/components/layout/Header.tsx`:

```tsx
import Link from "next/link";
import { MobileNav } from "@/components/layout/MobileNav";
import { NAV_ITEMS } from "@/components/layout/navigation";

export function Header() {
  return (
    <header className="absolute inset-x-0 top-0 z-20 border-b border-white/10">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          className="font-serif text-lg tracking-tight text-inv-white"
        >
          Inventure Communications
        </Link>
        <nav aria-label="Primary" className="hidden gap-8 md:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-white/80 transition-colors hover:text-inv-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <MobileNav />
      </div>
    </header>
  );
}
```

- [ ] **Step 4d: Footer** (Amendment A)

Replace `src/components/layout/Footer.tsx`:

```tsx
import Link from "next/link";
import { NAV_ITEMS } from "@/components/layout/navigation";

export function Footer() {
  return (
    <footer
      id="contact"
      className="border-t border-inv-navy/10 bg-inv-navy text-inv-white"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-14 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm space-y-3">
          <p className="font-serif text-xl tracking-tight">
            Inventure Communications
          </p>
          <p className="text-sm text-white/70">
            Strategic Communications & Public Affairs — Middle East.
          </p>
        </div>
        <div className="space-y-2 text-sm text-white/70">
          {NAV_ITEMS.filter((item) => item.label !== "Contact").map((item) => (
            <p key={item.href}>
              <Link href={item.href} className="hover:text-inv-white">
                {item.label}
              </Link>
            </p>
          ))}
          <p className="pt-4 text-xs text-white/50">
            © {new Date().getFullYear()} Inventure Communications. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 4e: Verify nav** (Amendment A)

```powershell
npx tsc --noEmit
```

Expected: no errors. Manual check at ≤767px: menu toggles, Escape closes, link tap closes.

- [ ] **Step 5: Implement global layout with Metadata API** (Amendment C1: no root canonical)

Replace `src/app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import { IBM_Plex_Sans, IBM_Plex_Serif } from "next/font/google";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import "./globals.css";

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-ibm-plex-sans",
  display: "swap",
});

const ibmPlexSerif = IBM_Plex_Serif({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-ibm-plex-serif",
  display: "swap",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Inventure Communications",
    template: "%s | Inventure Communications",
  },
  description:
    "Inventure Communications is a Strategic Communications & Public Affairs firm advising institutions across the Middle East on reputation, media, and stakeholder engagement.",
  keywords: [
    "Strategic Communications",
    "Public Affairs",
    "Middle East",
    "Media Production",
    "Corporate Communications",
    "ESG Communications",
  ],
  authors: [{ name: "Inventure Communications" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Inventure Communications",
    title: "Inventure Communications — Strategic Communications & Public Affairs",
    description:
      "Institutional communications counsel for decision-makers across the Middle East.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Inventure Communications",
    description:
      "Strategic Communications & Public Affairs for institutional audiences in the Middle East.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${ibmPlexSans.variable} ${ibmPlexSerif.variable} min-h-screen antialiased`}
      >
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
```

Note: Task 7 later swaps the inline `siteUrl` for `getSiteUrl()`.

- [ ] **Step 6: Verify typecheck**

```powershell
npx tsc --noEmit
```

Expected: no errors (homepage may still be starter until Task 4).

- [ ] **Step 7: Commit**

```powershell
git add src/lib/utils.ts src/components src/app/globals.css src/app/layout.tsx package.json package-lock.json
git commit -m "feat: add institutional layout, tokens, mobile nav, and SEO metadata"
```

---

