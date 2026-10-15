import { getLocale, getTranslations } from "next-intl/server";
import { DesktopNav } from "@/components/layout/DesktopNav";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { MobileNav } from "@/components/layout/MobileNav";
import { ThemeSwitcher } from "@/components/layout/ThemeSwitcher";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { fetchServices } from "@/services/cms";

export async function Header() {
  const tBrand = await getTranslations("brand");
  const locale = (await getLocale()) as Locale;
  const services = await fetchServices(locale);
  const navServices = services.map((service) => ({
    slug: service.slug,
    title: service.title,
    summary: service.summary,
  }));

  return (
    <header className="fixed inset-x-0 top-0 z-30 border-b border-brand-foreground/10 bg-brand text-brand-foreground">
      <div className="relative mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          className="font-serif text-lg tracking-tight text-brand-foreground"
        >
          {tBrand("name")}
        </Link>
        <div className="flex items-center gap-4 md:gap-6">
          <DesktopNav services={navServices} />
          <ThemeSwitcher className="hidden md:block" />
          <LanguageSwitcher className="hidden md:block" />
          <MobileNav services={navServices} />
        </div>
      </div>
    </header>
  );
}
