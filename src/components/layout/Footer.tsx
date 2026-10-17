import { getLocale, getTranslations } from "next-intl/server";
import { BrandLogo } from "@/components/layout/BrandLogo";
import { NAV_LINKS } from "@/components/layout/navigation";
import { SOCIAL_NETWORKS } from "@/components/layout/social";
import { Link } from "@/i18n/navigation";
import { type Locale } from "@/i18n/routing";
import { fetchServices } from "@/services/cms";

const MARKETS = ["egypt", "saudi", "uae", "qatar"] as const;
const COMPANY_LINKS = NAV_LINKS.filter((item) => item.href !== "/services");

export async function Footer() {
  const locale = (await getLocale()) as Locale;
  const [tNav, tBrand, tFooter, tHeader, tPresence, services] = await Promise.all([
    getTranslations("nav"),
    getTranslations("brand"),
    getTranslations("footer"),
    getTranslations("header"),
    getTranslations("presence"),
    fetchServices(locale),
  ]);

  return (
    <footer className="border-t border-border bg-surface-muted text-foreground">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-x-8 gap-y-12 px-6 pt-14 pb-12 lg:grid-cols-12">
        <div className="col-span-2 max-w-sm space-y-4 lg:col-span-4">
          <BrandLogo name={tBrand("name")} size="footer" />
          <p className="text-sm leading-relaxed text-muted">{tFooter("tagline")}</p>
          <ul aria-label={tHeader("social")} className="-ms-2 flex items-center">
            {SOCIAL_NETWORKS.map(({ label, url, Icon }) => (
              <li key={label}>
                <a
                  href={tHeader(url)}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={tHeader(label)}
                  className="inline-flex size-9 items-center justify-center rounded-full text-foreground transition-colors hover:bg-foreground/10 hover:text-accent"
                >
                  <Icon />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <nav aria-labelledby="footer-explore-heading" className="lg:col-span-2">
          <h2
            id="footer-explore-heading"
            className="text-xs font-medium tracking-[0.16em] text-muted uppercase"
          >
            {tFooter("explore")}
          </h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {COMPANY_LINKS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-foreground/80 transition-colors hover:text-accent"
                >
                  {tNav(item.messageKey)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-labelledby="footer-services-heading" className="lg:col-span-3">
          <h2
            id="footer-services-heading"
            className="text-xs font-medium tracking-[0.16em] text-muted uppercase"
          >
            <Link href="/services" className="transition-colors hover:text-accent">
              {tNav("services")}
            </Link>
          </h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {services.map((service) => (
              <li key={service.id}>
                <Link
                  href={`/services/${service.slug}`}
                  className="text-foreground/80 transition-colors hover:text-accent"
                >
                  {service.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="lg:col-span-3">
          <h2 className="text-xs font-medium tracking-[0.16em] text-muted uppercase">
            {tNav("contact")}
          </h2>
          <dl className="mt-4 space-y-4 text-sm">
            <div>
              <dt className="text-xs tracking-wide text-muted uppercase">
                {tFooter("emailLabel")}
              </dt>
              <dd className="mt-1">
                <a
                  href={`mailto:${tFooter("email")}`}
                  className="text-foreground/80 transition-colors hover:text-accent"
                >
                  {tFooter("email")}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-xs tracking-wide text-muted uppercase">
                {tFooter("webLabel")}
              </dt>
              <dd className="mt-1">
                <a
                  href={`https://${tFooter("web")}`}
                  className="text-foreground/80 transition-colors hover:text-accent"
                >
                  {tFooter("web")}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-xs tracking-wide text-muted uppercase">
                {tFooter("markets")}
              </dt>
              <dd>
                <ul className="mt-1 space-y-1 text-foreground/80">
                  {MARKETS.map((market) => (
                    <li key={market}>{tPresence(market)}</li>
                  ))}
                </ul>
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="border-t border-border">
        <p className="mx-auto max-w-6xl px-6 py-5 text-xs text-muted">
          © {new Date().getFullYear()} {tBrand("name")}. {tFooter("rights")}
        </p>
      </div>
    </footer>
  );
}
