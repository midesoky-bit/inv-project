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
      <div className="relative flex h-20 items-center justify-between gap-6 ps-3 pe-3 sm:ps-4 sm:pe-5">
        <BrandLogo name={tBrand("name")} />
        <div className="flex shrink-0 items-center gap-2 xl:gap-4">
          <DesktopNav />
          <HeaderTools />
          <ThemeSwitcher />
          <LanguageSwitcher />
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
