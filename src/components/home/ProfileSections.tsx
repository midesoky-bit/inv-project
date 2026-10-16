import { getTranslations } from "next-intl/server";
import Image from "next/image";

type IndexedItem = { index: string; title: string; body: string };
type TitledItem = { title: string; body: string };

function SectionIntro({
  eyebrow,
  title,
  id,
}: {
  eyebrow?: string;
  title: string;
  id?: string;
}) {
  return (
    <div className="max-w-2xl">
      {eyebrow ? (
        <p className="mb-3 text-xs font-medium tracking-[0.18em] text-accent uppercase">
          {eyebrow}
        </p>
      ) : null}
      <h2
        id={id}
        className="font-serif text-3xl tracking-tight text-balance text-foreground md:text-4xl"
      >
        {title}
      </h2>
    </div>
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
        <SectionIntro eyebrow={t("eyebrow")} title={t("title")} id="about-heading" />
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
  const tImages = await getTranslations("images");

  return (
    <section className="border-t border-border bg-surface-muted px-6 py-14 md:py-20">
      <div className="mx-auto grid max-w-6xl items-center gap-8 lg:grid-cols-2">
        <div>
          <SectionIntro eyebrow={t("eyebrow")} title={t("title")} />
          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted">
            {t("body")}
          </p>
        </div>
        <FramedImage
          src="/images/briefing.webp"
          alt={tImages("briefing")}
          sizes="(min-width: 1024px) 36rem, 100vw"
        />
      </div>
    </section>
  );
}

export async function ImpactSection() {
  const t = await getTranslations("impact");
  const tImages = await getTranslations("images");
  const items = t.raw("items") as IndexedItem[];

  return (
    <section
      id="impact"
      className="scroll-mt-24 border-t border-border bg-background px-6 py-14 md:py-20"
      aria-labelledby="impact-heading"
    >
      <div className="mx-auto max-w-6xl">
        <SectionIntro
          eyebrow={t("eyebrow")}
          title={t("title")}
          id="impact-heading"
        />
        <div className="mt-8 grid items-start gap-4 lg:grid-cols-5">
          <div className="relative h-56 overflow-hidden rounded-2xl border border-border sm:h-72 lg:col-span-2">
            <Image
              src="/images/forum.webp"
              alt={tImages("forum")}
              fill
              sizes="(min-width: 1024px) 24rem, 100vw"
              className="object-cover object-[center_68%]"
            />
          </div>
          <ol className="grid gap-4 sm:grid-cols-2 lg:col-span-3">
          {items.map((item) => (
            <li key={item.index} className="border border-border bg-surface p-6">
              <h3 className="font-serif text-xl text-foreground">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                {item.body}
              </p>
            </li>
          ))}
          </ol>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-border bg-surface p-6">
            <h3 className="font-serif text-2xl text-foreground">
              {t("strengthTitle")}
            </h3>
            <p className="mt-4 text-base leading-relaxed text-muted">
              {t("strengthBody")}
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-surface p-6">
            <h3 className="font-serif text-2xl text-foreground">
              {t("thinkTitle")}
            </h3>
            <p className="mt-4 text-base leading-relaxed text-muted">
              {t("thinkBody")}
            </p>
          </div>
        </div>
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
  const items = t.raw("items") as string[];

  return (
    <section className="border-t border-border bg-brand px-6 py-16 text-brand-foreground md:py-24">
      <div className="mx-auto max-w-6xl">
        <h2 className="font-serif text-3xl tracking-tight text-balance md:text-4xl">
          {t("title")}
        </h2>
        <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <li key={item} className="border border-brand-foreground/15 p-5">
              <p className="text-sm leading-relaxed text-brand-foreground/85">
                {item}
              </p>
            </li>
          ))}
        </ol>
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
    <section className="border-t border-border bg-surface-muted px-6 py-14 md:py-20">
      <div className="mx-auto max-w-6xl">
        <SectionIntro eyebrow={t("eyebrow")} title={t("title")} />
        <ol className="mt-8 grid gap-4 md:grid-cols-3">
          {items.map((item) => (
            <li key={item.title} className="border border-border bg-surface p-6">
              <h3 className="font-serif text-xl text-foreground">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                {item.body}
              </p>
            </li>
          ))}
        </ol>
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
