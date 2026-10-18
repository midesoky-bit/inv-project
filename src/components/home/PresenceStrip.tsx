import { getTranslations } from "next-intl/server";
import { PAGE_GUTTER } from "@/lib/layout";
import { MARKETS } from "@/lib/markets";

type PresencePoint = { title: string; body: string };

export async function PresenceStrip() {
  const t = await getTranslations("presence");
  const points = t.raw("points") as PresencePoint[];

  return (
    <section
      aria-labelledby="presence-heading"
      className={`scroll-mt-24 border-y border-border bg-background ${PAGE_GUTTER} py-14 md:py-20`}
    >
      <div>
        <p className="mb-3 text-xs font-medium tracking-[0.18em] text-accent uppercase">
          {t("label")}
        </p>
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <h2
            id="presence-heading"
            className="font-serif text-3xl tracking-tight text-balance text-foreground md:text-4xl lg:col-span-7"
          >
            {t("title")}
          </h2>
          <p className="text-base leading-relaxed text-muted lg:col-span-5">
            {t("lead")}
          </p>
        </div>

        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {MARKETS.map((market) => (
            <li key={market} className="border border-border bg-surface px-5 py-5">
              <p className="text-xs font-medium tracking-[0.14em] text-accent uppercase">
                {t("status")}
              </p>
              <p className="mt-2 font-serif text-2xl text-foreground">{t(market)}</p>
            </li>
          ))}
        </ul>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {points.map((point) => (
            <div key={point.title} className="border border-border bg-surface px-6 py-6">
              <h3 className="font-serif text-xl text-foreground">{point.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{point.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
