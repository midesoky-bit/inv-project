import { getTranslations } from "next-intl/server";
import { BrandLogo } from "@/components/layout/BrandLogo";
import { DesktopNav } from "@/components/layout/DesktopNav";
import { HeaderTools } from "@/components/layout/HeaderTools";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { MobileNav } from "@/components/layout/MobileNav";
import { ThemeSwitcher } from "@/components/layout/ThemeSwitcher";

export async function Header() {
  const tBrand = await getTranslations("brand");

  return (
    <header className="fixed inset-x-0 top-0 z-30 border-b border-border bg-background text-foreground">
      <div className="relative mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <BrandLogo name={tBrand("name")} />
        <div className="flex items-center gap-4 md:gap-6">
          <DesktopNav />
          <HeaderTools />
          <ThemeSwitcher />
          <LanguageSwitcher className="hidden xl:block" />
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
