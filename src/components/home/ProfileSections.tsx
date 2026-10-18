import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { PAGE_GUTTER } from "@/lib/layout";
import { cn } from "@/lib/utils";

type TitledItem = { title: string; body?: string };

function SectionIntro({
  eyebrow,
  title,
  id,
  lead,
  tone = "default",
  className,
}: {
  eyebrow?: string;
  title: string;
  id?: string;
  lead?: string;
  tone?: "default" | "brand";
  className?: string;
}) {
  const onBrand = tone === "brand";

  return (
    <div className={cn("max-w-2xl", className)}>
      {eyebrow ? (
        <p className="mb-3 text-xs font-medium tracking-[0.18em] text-accent uppercase">
          {eyebrow}
        </p>
      ) : null}
      <h2
        id={id}
        className={`font-serif text-2xl tracking-tight text-balance md:text-3xl ${
          onBrand ? "text-brand-foreground" : "text-foreground"
        }`}
      >
        {title}
      </h2>
      {lead ? (
        <p
          className={`mt-4 text-sm leading-relaxed md:text-base ${
            onBrand ? "text-brand-foreground/75" : "text-muted"
          }`}
        >
          {lead}
        </p>
      ) : null}
    </div>
  );
}

function TopicList({
  items,
  columnsClassName = "md:grid-cols-2 lg:grid-cols-3",
  tone = "default",
  className,
  dense = false,
}: {
  items: TitledItem[];
  columnsClassName?: string;
  tone?: "default" | "brand";
  className?: string;
  dense?: boolean;
}) {
  const onBrand = tone === "brand";

  return (
    <ul
      className={cn(
        dense
          ? "mt-6 grid gap-x-6 gap-y-4"
          : "mt-10 grid gap-x-12 gap-y-8",
        columnsClassName,
        className,
      )}
    >
      {items.map((item) => (
        <li
          key={item.title}
          className={`border-t ${dense ? "pt-3" : "pt-5"} ${
            onBrand ? "border-brand-foreground/20" : "border-border"
          }`}
        >
          <h3
            className={`text-sm font-medium tracking-tight ${
              onBrand ? "text-brand-foreground" : "text-foreground"
            }`}
          >
            {item.title}
          </h3>
          {item.body ? (
            <p
              className={`${dense ? "mt-1.5" : "mt-2"} text-sm leading-relaxed ${
                onBrand ? "text-brand-foreground/75" : "text-muted"
              }`}
            >
              {item.body}
            </p>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

function FramedImage({
  src,
  alt,
  sizes,
}: {
  src: string;
  alt: string;
  sizes: string;
}) {
  return (
    <figure className="w-full overflow-hidden border border-border bg-surface">
      <div className="relative aspect-[4/3]">
        <Image src={src} alt="" fill sizes={sizes} className="object-cover" />
      </div>
      <figcaption className="border-t border-border px-4 py-2 text-xs leading-relaxed text-muted">
        {alt}
      </figcaption>
    </figure>
  );
}

export async function AboutSection() {
  const t = await getTranslations("about");
  const tImages = await getTranslations("images");
  const paragraphs = t.raw("paragraphs") as string[];
  const [lead, ...rest] = paragraphs;
  const principle = rest.at(-1);
  const body = rest.slice(0, -1);

  return (
    <section
      id="about"
      className={`scroll-mt-24 bg-background ${PAGE_GUTTER} py-14 md:py-20`}
      aria-labelledby="about-heading"
    >
      <div>
        <div className="max-w-2xl">
          <p className="mb-3 text-xs font-medium tracking-[0.18em] text-accent uppercase">
            {t("eyebrow")}
          </p>
          <h2
            id="about-heading"
            className="font-serif text-3xl tracking-tight text-balance text-foreground md:text-4xl"
          >
            {t.rich("title", {
              g: (chunks) => <span className="text-accent">{chunks}</span>,
            })}
          </h2>
        </div>
        <div className="mt-8 grid items-start gap-8 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <FramedImage
              src="/images/about.webp"
              alt={tImages("about")}
              sizes="(min-width: 1024px) 28rem, 100vw"
            />
          </div>
          <div className="space-y-5 lg:col-span-7">
            {lead ? (
              <p className="font-serif text-2xl leading-snug text-foreground">
                {lead}
              </p>
            ) : null}
            {body.map((paragraph) => (
              <p key={paragraph} className="text-base leading-relaxed text-muted">
                {paragraph}
              </p>
            ))}
            {principle ? (
              <blockquote className="border-s-2 border-accent ps-5 text-base leading-relaxed text-foreground">
                {principle}
              </blockquote>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

export async function PositioningSection() {
  const t = await getTranslations("positioning");
  const tAbout = await getTranslations("about");
  const tImages = await getTranslations("images");
  const story = (tAbout.raw("paragraphs") as string[]).slice(1);
  const principle = story.at(-1);
  const body = story.slice(0, -1);

  return (
    <section
      id="story"
      className={`scroll-mt-24 border-t border-border bg-surface-muted ${PAGE_GUTTER} py-14 md:py-20 dark:border-t-0`}
      aria-labelledby="story-heading"
    >
      <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
        <div className="min-w-0 lg:col-span-7">
          <p className="mb-3 text-xs font-medium tracking-[0.2em] text-accent uppercase">
            {t("eyebrow")}
          </p>
          <h2
            id="story-heading"
            className="font-serif text-3xl leading-[1.3] tracking-tight text-foreground md:text-4xl lg:text-[2.75rem] lg:leading-[1.25]"
          >
            {t("title")}
          </h2>
          <figure className="relative mt-8 aspect-[4/3] overflow-hidden rounded-2xl shadow-xl lg:hidden">
            <Image
              src="/images/briefing.webp"
              alt={tImages("briefing")}
              fill
              sizes="100vw"
              className="h-full object-cover"
            />
          </figure>
          <div className="mt-6 flex flex-col gap-6">
            <p className="text-base leading-relaxed text-muted">{t("body")}</p>
            {body.map((paragraph) => (
              <p
                key={paragraph}
                className="text-base leading-relaxed text-muted"
              >
                {paragraph}
              </p>
            ))}
            {principle ? (
              <blockquote className="border-s-4 border-accent bg-brand/5 p-6 text-sm leading-relaxed text-foreground md:text-base">
                {principle}
              </blockquote>
            ) : null}
          </div>
        </div>
        <aside className="relative hidden min-h-0 lg:col-span-5 lg:block">
          <figure className="sticky top-32 h-full max-h-[calc(100vh-8rem)] min-h-[22rem] overflow-hidden rounded-2xl shadow-xl">
            <Image
              src="/images/briefing.webp"
              alt={tImages("briefing")}
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="h-full object-cover"
            />
          </figure>
        </aside>
      </div>
    </section>
  );
}

const IMPACT_ICON_ATTRS = {
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

const IMPACT_ICONS = [
  <>
    <path d="M12 3.5 20 8v8l-8 4.5L4 16V8z" />
    <path d="M12 12 20 8M12 12v8.5M12 12 4 8" />
  </>,
  <>
    <path d="M4 20h16" />
    <path d="M6 20V10M10 20V10M14 20V10M18 20V10" />
    <path d="M3 10h18L12 4.5z" />
  </>,
  <>
    <circle cx="8" cy="8" r="2.75" />
    <circle cx="16" cy="16" r="2.75" />
    <path d="M10.2 9.8 13.8 14.2" />
  </>,
  <>
    <path d="M12 4.5A5.5 5.5 0 0 1 17.5 10c0 2.4-1.4 3.8-2.7 5.2-.7.8-1.3 1.6-1.3 2.8h-2.9c0-1.2-.6-2-1.3-2.8C8 13.8 6.5 12.4 6.5 10A5.5 5.5 0 0 1 12 4.5Z" />
    <path d="M10 21h4" />
  </>,
  <>
    <circle cx="12" cy="12" r="8.5" />
    <path d="m8.4 12.3 2.6 2.5 4.8-5.3" />
  </>,
  <>
    <rect x="4.5" y="4.5" width="7" height="7" rx="1" />
    <rect x="12.5" y="12.5" width="7" height="7" rx="1" />
    <path d="M8 11.5v3h4" />
  </>,
] as const;

function ImpactFeatureIcon({ index }: { index: number }) {
  return (
    <svg {...IMPACT_ICON_ATTRS} className="text-accent">
      {IMPACT_ICONS[index] ?? IMPACT_ICONS[0]}
    </svg>
  );
}

export async function ImpactSection() {
  const t = await getTranslations("impact");
  const tImages = await getTranslations("images");
  const items = t.raw("items") as TitledItem[];

  return (
    <section
      id="impact"
      className={`scroll-mt-24 border-t border-border bg-background ${PAGE_GUTTER} py-14 md:py-16`}
      aria-labelledby="impact-heading"
    >
      <div className="grid gap-8 lg:grid-cols-5 lg:gap-10">
        <div className="min-w-0 lg:col-span-3">
          <p className="mb-3 text-xs font-medium tracking-[0.2em] text-accent uppercase">
            {t("eyebrow")}
          </p>
          <h2
            id="impact-heading"
            className="font-serif text-3xl leading-[1.3] tracking-tight text-foreground md:text-4xl lg:text-[2.75rem] lg:leading-[1.25]"
          >
            {t("title")}
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted md:text-base">
            {t("strengthBody")}
          </p>
          <figure className="relative mt-8 aspect-[4/3] overflow-hidden rounded-2xl border border-border lg:hidden">
            <Image
              src="/images/forum.webp"
              alt={tImages("forum")}
              fill
              sizes="100vw"
              className="h-full object-cover object-[center_65%]"
            />
          </figure>
          <blockquote className="mt-6 border-s-4 border-accent bg-brand/[0.03] py-4 ps-6 pe-4 text-sm leading-relaxed text-foreground italic md:text-base">
            {t("thinkBody")}
          </blockquote>
          <ul className="mt-10 grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2">
            {items.map((item, index) => (
              <li key={item.title} className="flex gap-4">
                <span className="mt-0.5 inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-accent/10">
                  <ImpactFeatureIcon index={index} />
                </span>
                <div className="min-w-0">
                  <h3 className="font-bold tracking-tight text-foreground">
                    {item.title}
                  </h3>
                  {item.body ? (
                    <p className="mt-1.5 text-sm leading-relaxed text-muted">
                      {item.body}
                    </p>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        </div>
        <aside className="relative hidden min-h-0 lg:col-span-2 lg:block">
          <figure className="sticky top-32 h-full max-h-[calc(100vh-8rem)] min-h-[22rem] overflow-hidden rounded-2xl border border-border">
            <Image
              src="/images/forum.webp"
              alt={tImages("forum")}
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="h-full object-cover object-[center_65%]"
            />
          </figure>
        </aside>
      </div>
    </section>
  );
}

const CAPABILITY_ICONS = [
  <>
    <rect x="3" y="7" width="13.5" height="11" rx="2" />
    <circle cx="9.75" cy="12.5" r="2.4" />
    <path d="M16.5 10.2 21 7.8v9.4l-4.5-2.4z" />
  </>,
  <>
    <circle cx="12" cy="15" r="2.4" />
    <path d="M8.2 11.8a5.2 5.2 0 0 1 7.6 0M6 9.4a8 8 0 0 1 12 0" />
    <path d="M12 17.4V20" />
  </>,
  <>
    <circle cx="6.5" cy="12" r="2.4" />
    <circle cx="17.5" cy="7.5" r="2.4" />
    <circle cx="17.5" cy="16.5" r="2.4" />
    <path d="M8.7 11.1 15.2 8.4M8.7 12.9 15.2 15.6" />
  </>,
] as const;

function CapabilityCardIcon({ index }: { index: number }) {
  return (
    <svg {...IMPACT_ICON_ATTRS} className="text-accent">
      {CAPABILITY_ICONS[index] ?? CAPABILITY_ICONS[0]}
    </svg>
  );
}

export async function CapabilitySection() {
  const t = await getTranslations("capability");
  const tImages = await getTranslations("images");
  const paragraphs = t.raw("paragraphs") as string[];
  const items = t.raw("items") as TitledItem[];

  return (
    <section
      className={`border-t border-border bg-surface-muted ${PAGE_GUTTER} py-14 md:py-20`}
      aria-labelledby="capability-heading"
    >
      <div className="grid items-start gap-8 lg:grid-cols-12 lg:items-stretch lg:gap-10">
        <div className="min-w-0 lg:col-span-7">
          <h2
            id="capability-heading"
            className="font-serif text-3xl leading-[1.3] tracking-tight text-foreground md:text-4xl lg:text-[2.75rem] lg:leading-[1.25]"
          >
            {t("title")}
          </h2>
          <div className="mt-6 space-y-5">
            {paragraphs.map((paragraph) => (
              <p
                key={paragraph}
                className="text-base leading-relaxed text-muted"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
        <figure className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl shadow-xl lg:col-span-5 lg:aspect-auto lg:h-full lg:min-h-[18rem]">
          <Image
            src="/images/analytics.webp"
            alt={tImages("analytics")}
            fill
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="h-full object-cover"
          />
        </figure>
      </div>
      <ul className="mt-10 grid gap-6 md:grid-cols-3">
        {items.map((item, index) => (
          <li
            key={item.title}
            className="rounded-xl bg-background p-8 shadow-sm transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            <span className="mb-5 inline-flex size-11 items-center justify-center rounded-full bg-accent/10">
              <CapabilityCardIcon index={index} />
            </span>
            <h3 className="font-bold tracking-tight text-foreground">
              {item.title}
            </h3>
            {item.body ? (
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {item.body}
              </p>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}

export async function AdvantageSection() {
  const t = await getTranslations("advantage");
  const items = (t.raw("items") as string[]).map((title) => ({ title }));

  return (
    <section className={`border-t border-border bg-brand ${PAGE_GUTTER} py-14 text-brand-foreground md:py-16`}>
      <div className="grid items-start gap-10 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <SectionIntro
            eyebrow={t("eyebrow")}
            title={t("title")}
            tone="brand"
          />
        </div>
        <div className="lg:col-span-7">
          <TopicList
            items={items}
            columnsClassName="sm:grid-cols-2"
            tone="brand"
            className="mt-0"
          />
        </div>
      </div>
    </section>
  );
}

export async function ClientsSection() {
  const t = await getTranslations("clients");
  const items = t.raw("items") as string[];

  return (
    <section className={`border-t border-border bg-background ${PAGE_GUTTER} py-14 md:py-20`}>
      <div>
        <h2 className="font-serif text-3xl tracking-tight text-foreground md:text-4xl">
          {t("title")}
        </h2>
        <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <li key={item} className="border-t border-border pt-4">
              <p className="text-sm leading-relaxed text-foreground">
                {item}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export async function PrinciplesSection() {
  const t = await getTranslations("principles");
  const items = t.raw("items") as TitledItem[];

  return (
    <section className={`border-t border-border bg-surface-muted ${PAGE_GUTTER} py-14 md:py-16`}>
      <div>
        <SectionIntro eyebrow={t("eyebrow")} title={t("title")} />
        <TopicList items={items} />
      </div>
    </section>
  );
}

export async function EsgSection({
  commitments,
}: {
  commitments: { id: string; title: string; summary: string }[];
}) {
  const t = await getTranslations("esg");
  const practice = t.raw("practice") as string[];

  return (
    <section
      id="esg"
      className={`scroll-mt-24 border-t border-border bg-background ${PAGE_GUTTER} py-14 md:py-20`}
      aria-labelledby="esg-heading"
    >
      <div>
        <SectionIntro title={t("title")} id="esg-heading" />
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted">
          {t("subtitle")}
        </p>
        {commitments.length > 0 ? (
          <ol className="mt-8 grid gap-4 md:grid-cols-3">
            {commitments.map((item) => (
              <li key={item.id} className="border border-border bg-surface p-6">
                <h3 className="font-serif text-xl text-foreground">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {item.summary}
                </p>
              </li>
            ))}
          </ol>
        ) : (
          <p className="mt-8 max-w-2xl text-base text-muted">{t("comingSoon")}</p>
        )}
        <div className="mt-8 grid gap-8 border-t border-border pt-8 lg:grid-cols-12">
          <ul className="space-y-4 lg:col-span-7">
            {practice.map((item) => (
              <li key={item} className="text-sm leading-relaxed text-foreground">
                {item}
              </li>
            ))}
          </ul>
          <p className="border-s-2 border-accent ps-5 text-base leading-relaxed text-foreground lg:col-span-5">
            {t("closing")}
          </p>
        </div>
      </div>
    </section>
  );
}
