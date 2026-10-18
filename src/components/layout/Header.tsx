import { getTranslations } from "next-intl/server";
import { BrandLogo } from "@/components/layout/BrandLogo";
import { DesktopNav } from "@/components/layout/DesktopNav";
import { HeaderTools } from "@/components/layout/HeaderTools";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { MobileNav } from "@/components/layout/MobileNav";
import { ThemeSwitcher } from "@/components/layout/ThemeSwitcher";
import { PAGE_GUTTER } from "@/lib/layout";

export async function Header() {
  const tBrand = await getTranslations("brand");

  return (
    <header className="fixed inset-x-0 top-0 z-30 border-b border-border bg-background text-foreground">
      <div className={`relative flex h-20 items-center gap-3 ${PAGE_GUTTER}`}>
        <BrandLogo name={tBrand("name")} />
        <div className="ms-auto flex items-center justify-end gap-1 sm:gap-2 xl:gap-4">
          <DesktopNav />
          <HeaderTools />
          <ThemeSwitcher className="shrink-0" />
          <LanguageSwitcher className="shrink-0" />
        </div>
        <MobileNav />
      </div>
    </header>
  );
}
