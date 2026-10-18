import type { ReactNode } from "react";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/Button";
import { PAGE_GUTTER } from "@/lib/layout";
import type { Service } from "@/types/cms";
import { ServiceGrid } from "@/components/home/ServiceGrid";

type Role = { id: string; title: string; lead?: boolean };
type Step = { title: string; body: string };
type WhyItem = { title: string; body: string };

function RoleIcon({ id }: { id: string }) {
  const common = {
    width: 22,
    height: 22,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  const paths: Record<string, ReactNode> = {
    pm: (
      <>
        <circle cx="12" cy="8" r="3" />
        <path d="M5.5 19a6.5 6.5 0 0 1 13 0" />
        <path d="M19 8.5 21 10l-2 1.5" />
      </>
    ),
    events: (
      <>
        <rect x="4" y="5" width="16" height="15" rx="2" />
        <path d="M8 3.5v3M16 3.5v3M4 10h16" />
      </>
    ),
    design: (
      <>
        <path d="M12 3.5 20 8v8l-8 4.5L4 16V8z" />
        <path d="M12 12 20 8M12 12v8.5M12 12 4 8" />
      </>
    ),
    pr: (
      <>
        <path d="M5 9.5v5h2.2L16 18.5v-13L7.2 9.5H5z" />
        <path d="M16 9.2a3.2 3.2 0 0 1 0 5.6" />
      </>
    ),
    media: (
      <>
        <rect x="2.5" y="6" width="13" height="12" rx="2" />
        <path d="M15.5 10.2 21.5 7.2v9.6l-6-3" />
      </>
    ),
    bd: (
      <>
        <circle cx="8" cy="8" r="2.5" />
        <circle cx="16" cy="16" r="2.5" />
        <path d="M10.2 9.8 13.8 14.2" />
      </>
    ),
    esg: (
      <>
        <path d="M12 20V9" />
        <path d="M12 9c4-6 8-4 8 1-4 1-8 2.5-8 7" />
      </>
    ),
  };

  return <svg {...common}>{paths[id] ?? paths.pm}</svg>;
}

export async function HomeServices({ services }: { services: Service[] }) {
  const t = await getTranslations("home");

  return (
    <div>
      <div className={`${PAGE_GUTTER} pt-14 md:pt-20`}>
        <h2 className="font-serif text-3xl tracking-tight text-foreground md:text-4xl">
          {t("servicesTitle")}
        </h2>
      </div>
      <ServiceGrid services={services} />
      <div className={`${PAGE_GUTTER} -mt-6 pb-14 md:pb-16`}>
        <Button href="/services">{t("servicesCta")}</Button>
      </div>
    </div>
  );
}

export async function ContactModel() {
  const t = await getTranslations("home");
  const paragraphs = t.raw("modelBody") as string[];
  const roles = t.raw("roles") as Role[];
  const lead = roles.find((role) => role.lead) ?? roles[0];
  const specialists = roles.filter((role) => role.id !== lead?.id);

  return (
    <section
      aria-labelledby="model-heading"
      className={`border-t border-border bg-surface-muted ${PAGE_GUTTER} py-14 md:py-20`}
    >
      <div className="grid items-start gap-10 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <h2
            id="model-heading"
            className="font-serif text-3xl leading-[1.25] tracking-tight text-foreground md:text-4xl"
          >
            {t("modelTitle")}
          </h2>
          <div className="mt-6 flex flex-col gap-5">
            {paragraphs.map((paragraph) => (
              <p key={paragraph} className="text-base leading-relaxed text-muted">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
        <div className="lg:col-span-7">
          <div className="rounded-2xl bg-background p-6 shadow-xl md:p-8">
            <p className="text-center text-xs font-medium tracking-[0.18em] text-accent uppercase">
              {t("client")}
            </p>
            <div className="mx-auto mt-4 flex size-24 items-center justify-center rounded-full bg-brand text-sm font-semibold text-brand-foreground">
              {t("client")}
            </div>
            {lead ? (
              <div className="mx-auto mt-6 max-w-xs rounded-xl border border-accent/30 bg-accent/10 p-4 text-center">
                <span className="inline-flex size-10 items-center justify-center rounded-full bg-accent/15 text-accent">
                  <RoleIcon id={lead.id} />
                </span>
                <p className="mt-2 text-sm font-bold text-foreground">{lead.title}</p>
                <p className="mt-1 text-xs text-muted">
                  {(t.raw("why") as WhyItem[])[0]?.title}
                </p>
              </div>
            ) : null}
            <ul className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
              {specialists.map((role) => (
                <li
                  key={role.id}
                  className="flex flex-col items-center rounded-xl border border-border bg-surface-muted p-4 text-center"
                >
                  <span className="inline-flex size-10 items-center justify-center rounded-full bg-accent/10 text-accent">
                    <RoleIcon id={role.id} />
                  </span>
                  <p className="mt-3 text-xs font-semibold leading-snug text-foreground">
                    {role.title}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export async function HowWeWork() {
  const t = await getTranslations("home");
  const steps = t.raw("how") as Step[];

  return (
    <section
      aria-labelledby="how-heading"
      className={`border-t border-border bg-background ${PAGE_GUTTER} py-14 md:py-20`}
    >
      <h2
        id="how-heading"
        className="font-serif text-3xl tracking-tight text-foreground md:text-4xl"
      >
        {t("howTitle")}
      </h2>
      <ol className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {steps.map((step) => (
          <li key={step.title} className="rounded-xl border border-border bg-surface p-6">
            <h3 className="font-serif text-xl text-foreground">{step.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted">{step.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

export async function WhySection() {
  const t = await getTranslations("home");
  const items = t.raw("why") as WhyItem[];

  return (
    <section
      aria-labelledby="why-heading"
      className={`border-t border-border bg-surface-muted ${PAGE_GUTTER} py-14 md:py-20`}
    >
      <h2
        id="why-heading"
        className="font-serif text-3xl tracking-tight text-foreground md:text-4xl"
      >
        {t("whyTitle")}
      </h2>
      <ul className="mt-10 grid gap-6 md:grid-cols-2">
        {items.map((item) => (
          <li
            key={item.title}
            className="rounded-xl bg-background p-8 shadow-sm transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            <h3 className="font-bold text-foreground">{item.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{item.body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

export async function HomeTeasers() {
  const t = await getTranslations("home");
  const teasers = [
    { title: t("workTitle"), body: t("workBody"), href: "/work", cta: t("workCta") },
    { title: t("teamTitle"), body: t("teamBody"), href: "/team", cta: t("teamCta") },
    { title: t("newsTitle"), body: t("newsBody"), href: "/news", cta: t("newsCta") },
  ];

  return (
    <section className={`border-t border-border bg-background ${PAGE_GUTTER} py-14 md:py-20`}>
      <ul className="grid gap-8 lg:grid-cols-3">
        {teasers.map((item) => (
          <li key={item.href} className="flex flex-col border-t border-border pt-6">
            <h2 className="font-serif text-2xl text-foreground">{item.title}</h2>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{item.body}</p>
            <div className="mt-6">
              <Button href={item.href} variant="ghost">
                {item.cta}
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export async function HomeCta() {
  const t = await getTranslations("home");

  return (
    <section className={`border-t border-border bg-brand ${PAGE_GUTTER} py-14 text-brand-foreground md:py-16`}>
      <h2 className="font-serif text-3xl tracking-tight md:text-4xl">{t("ctaTitle")}</h2>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-brand-foreground/80">
        {t("ctaBody")}
      </p>
      <div className="mt-8">
        <Button href="/contact">{t("ctaButton")}</Button>
      </div>
    </section>
  );
}
