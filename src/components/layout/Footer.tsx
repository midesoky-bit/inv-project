import { getTranslations } from "next-intl/server";
import { NAV_LINKS } from "@/components/layout/navigation";
import { Link } from "@/i18n/navigation";

export async function Footer() {
  const tNav = await getTranslations("nav");
  const tBrand = await getTranslations("brand");
  const tFooter = await getTranslations("footer");

  return (
    <footer
      id="contact"
      className="border-t border-brand-foreground/10 bg-brand text-brand-foreground"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-14 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm space-y-3">
          <p className="font-serif text-xl tracking-tight">{tBrand("name")}</p>
          <p className="text-sm text-brand-foreground/70">{tFooter("tagline")}</p>
          <p className="text-sm">
            <a
              href={`mailto:${tFooter("email")}`}
              className="text-brand-foreground/80 hover:text-brand-foreground"
            >
              {tFooter("email")}
            </a>
          </p>
          <p className="text-sm">
            <a
              href={`https://${tFooter("web")}`}
              className="text-brand-foreground/80 hover:text-brand-foreground"
            >
              {tFooter("web")}
            </a>
          </p>
        </div>
        <div className="space-y-2 text-sm text-brand-foreground/70">
          {NAV_LINKS.filter((item) => item.messageKey !== "contact").map(
            (item) => (
              <p key={item.href}>
                <Link href={item.href} className="hover:text-brand-foreground">
                  {tNav(item.messageKey)}
                </Link>
              </p>
            ),
          )}
          <p className="pt-4 text-xs text-brand-foreground/50">
            © {new Date().getFullYear()} {tBrand("name")}. {tFooter("rights")}
          </p>
        </div>
      </div>
    </footer>
  );
}
