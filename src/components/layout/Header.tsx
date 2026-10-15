import Link from "next/link";
import { MobileNav } from "@/components/layout/MobileNav";
import { NAV_ITEMS } from "@/components/layout/navigation";

export function Header() {
  return (
    <header className="absolute inset-x-0 top-0 z-20 border-b border-white/10 bg-inv-navy">
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
