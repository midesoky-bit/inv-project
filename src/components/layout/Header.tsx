import { getTranslations } from "next-intl/server";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { MobileNav } from "@/components/layout/MobileNav";
import { ThemeSwitcher } from "@/components/layout/ThemeSwitcher";
import { NAV_LINKS } from "@/components/layout/navigation";
import { SectionLink } from "@/components/layout/SectionLink";
import { Link } from "@/i18n/navigation";

export async function Header() {
  const t = await getTranslations("nav");
  const tBrand = await getTranslations("brand");

  return (
    <header className="fixed inset-x-0 top-0 z-30 border-b border-brand-foreground/10 bg-brand text-brand-foreground">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          className="font-serif text-lg tracking-tight text-brand-foreground"
        >
          {tBrand("name")}
        </Link>
        <div className="flex items-center gap-4 md:gap-6">
          <nav aria-label={t("primary")} className="hidden gap-8 md:flex">
            {NAV_LINKS.map((item) => (
              <SectionLink
                key={item.href}
                href={item.href}
                className="text-sm text-brand-foreground/80 transition-colors hover:text-brand-foreground"
              >
                {t(item.messageKey)}
              </SectionLink>
            ))}
          </nav>
          <ThemeSwitcher className="hidden md:block" />
          <LanguageSwitcher className="hidden md:block" />
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
