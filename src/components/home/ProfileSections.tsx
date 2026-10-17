import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { cn } from "@/lib/utils";

type TitledItem = { title: string; body?: string };

function SectionIntro({
  eyebrow,
  title,
  id,
  lead,
  tone = "default",
}: {
  eyebrow?: string;
  title: string;
  id?: string;
  lead?: string;
  tone?: "default" | "brand";
}) {
  const onBrand = tone === "brand";

  return (
    <div className="max-w-2xl">
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
          className={`mt-4 max-w-xl text-sm leading-relaxed md:text-base ${
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
}: {
  items: TitledItem[];
  columnsClassName?: string;
  tone?: "default" | "brand";
  className?: string;
}) {
  const onBrand = tone === "brand";

  return (
    <ul className={cn("mt-10 grid gap-x-12 gap-y-8", columnsClassName, className)}>
      {items.map((item) => (
        <li
          key={item.title}
          className={`border-t pt-5 ${
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
              className={`mt-2 text-sm leading-relaxed ${
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
    <figure className="overflow-hidden border border-border bg-surface">
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
      className="scroll-mt-24 bg-background px-6 py-14 md:py-20"
      aria-labelledby="about-heading"
    >
      <div className="mx-auto max-w-6xl">
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
      className="scroll-mt-24 border-t border-border bg-surface-muted px-6 py-14 md:py-20"
    >
      <div className="mx-auto grid max-w-6xl items-start gap-10 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <SectionIntro eyebrow={t("eyebrow")} title={t("title")} />
          <div className="mt-6 max-w-xl space-y-5">
            <p className="text-base leading-relaxed text-foreground">{t("body")}</p>
            {body.map((paragraph) => (
              <p key={paragraph} className="text-sm leading-relaxed text-muted md:text-base">
                {paragraph}
              </p>
            ))}
            {principle ? (
              <blockquote className="border-s-2 border-accent ps-5 text-sm leading-relaxed text-foreground md:text-base">
                {principle}
              </blockquote>
            ) : null}
          </div>
        </div>
        <div className="lg:col-span-5">
          <FramedImage
            src="/images/briefing.webp"
            alt={tImages("briefing")}
            sizes="(min-width: 1024px) 28rem, 100vw"
          />
        </div>
      </div>
    </section>
  );
}

export async function ImpactSection() {
  const t = await getTranslations("impact");
  const tImages = await getTranslations("images");
  const items = t.raw("items") as TitledItem[];

  return (
    <section
      id="impact"
      className="scroll-mt-24 border-t border-border bg-background px-6 py-14 md:py-16"
      aria-labelledby="impact-heading"
    >
      <div className="mx-auto max-w-6xl">
        <div className="grid items-end gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <SectionIntro
              eyebrow={t("eyebrow")}
              title={t("title")}
              id="impact-heading"
              lead={t("strengthBody")}
            />
          </div>
          <figure className="relative hidden aspect-[16/10] overflow-hidden border border-border lg:col-span-5 lg:block">
            <Image
              src="/images/forum.webp"
              alt={tImages("forum")}
              fill
              sizes="(min-width: 1024px) 28rem, 100vw"
              className="object-cover"
              style={{ objectPosition: "center 65%" }}
            />
          </figure>
        </div>
        <TopicList items={items} />
        <p className="mt-12 max-w-3xl border-s-2 border-accent ps-5 text-sm leading-relaxed text-foreground md:text-base">
          {t("thinkBody")}
        </p>
      </div>
    </section>
  );
}

export async function CapabilitySection() {
  const t = await getTranslations("capability");
  const tImages = await getTranslations("images");
  const paragraphs = t.raw("paragraphs") as string[];
  const items = t.raw("items") as string[];
  const [lead, ...supporting] = paragraphs;

  return (
    <section className="border-t border-border bg-surface-muted px-6 py-14 md:py-20">
      <div className="mx-auto max-w-6xl">
        <SectionIntro title={t("title")} />
        <div className="mt-8 grid items-start gap-8 lg:grid-cols-12">
          <div className="space-y-5 lg:col-span-7">
            {lead ? (
              <p className="text-base leading-relaxed text-foreground">{lead}</p>
            ) : null}
            {supporting.map((paragraph) => (
              <p key={paragraph} className="text-base leading-relaxed text-muted">
                {paragraph}
              </p>
            ))}
          </div>
          <div className="lg:col-span-5">
            <FramedImage
              src="/images/analytics.webp"
              alt={tImages("analytics")}
              sizes="(min-width: 1024px) 28rem, 100vw"
            />
          </div>
        </div>
        <ol className="mt-10 grid gap-4 md:grid-cols-3">
          {items.map((item) => (
            <li key={item} className="border border-border bg-surface p-6">
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

export async function AdvantageSection() {
  const t = await getTranslations("advantage");
  const items = (t.raw("items") as string[]).map((title) => ({ title }));

  return (
    <section className="border-t border-border bg-brand px-6 py-14 text-brand-foreground md:py-16">
      <div className="mx-auto grid max-w-6xl items-start gap-10 lg:grid-cols-12">
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
    <section className="border-t border-border bg-background px-6 py-14 md:py-20">
      <div className="mx-auto max-w-6xl">
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
    <section className="border-t border-border bg-surface-muted px-6 py-14 md:py-16">
      <div className="mx-auto max-w-6xl">
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
      className="scroll-mt-24 border-t border-border bg-background px-6 py-14 md:py-20"
      aria-labelledby="esg-heading"
    >
      <div className="mx-auto max-w-6xl">
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
