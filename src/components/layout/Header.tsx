import { getTranslations } from "next-intl/server";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { MobileNav } from "@/components/layout/MobileNav";
import { NAV_LINKS } from "@/components/layout/navigation";
import { Link } from "@/i18n/navigation";

export async function Header() {
  const t = await getTranslations("nav");
  const tBrand = await getTranslations("brand");

  return (
    <header className="absolute inset-x-0 top-0 z-20 border-b border-white/10 bg-inv-navy">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          className="font-serif text-lg tracking-tight text-inv-white"
        >
          {tBrand("name")}
        </Link>
        <div className="flex items-center gap-4 md:gap-6">
          <nav aria-label={t("primary")} className="hidden gap-8 md:flex">
            {NAV_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-white/80 transition-colors hover:text-inv-white"
              >
                {t(item.messageKey)}
              </Link>
            ))}
          </nav>
          <LanguageSwitcher className="hidden md:block" />
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
