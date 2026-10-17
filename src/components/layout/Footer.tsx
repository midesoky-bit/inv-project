import { getTranslations } from "next-intl/server";
import { NAV_LINKS } from "@/components/layout/navigation";
import { Link } from "@/i18n/navigation";

export async function Footer() {
  const tNav = await getTranslations("nav");
  const tBrand = await getTranslations("brand");
  const tFooter = await getTranslations("footer");

  return (
    <footer className="border-t border-border bg-surface-muted text-foreground">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-14 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm space-y-3">
          <p className="font-serif text-xl tracking-tight">{tBrand("name")}</p>
          <p className="text-sm text-muted">{tFooter("tagline")}</p>
          <p className="text-sm">
            <a
              href={`mailto:${tFooter("email")}`}
              className="text-foreground/80 hover:text-foreground"
            >
              {tFooter("email")}
            </a>
          </p>
          <p className="text-sm">
            <a
              href={`https://${tFooter("web")}`}
              className="text-foreground/80 hover:text-foreground"
            >
              {tFooter("web")}
            </a>
          </p>
        </div>
        <div className="space-y-2 text-sm text-muted">
          {NAV_LINKS.map((item) => (
            <p key={item.href}>
              <Link href={item.href} className="hover:text-foreground">
                {tNav(item.messageKey)}
              </Link>
            </p>
          ))}
          <p className="pt-4 text-xs text-muted">
            © {new Date().getFullYear()} {tBrand("name")}. {tFooter("rights")}
          </p>
        </div>
      </div>
    </footer>
  );
}
