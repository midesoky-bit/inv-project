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
