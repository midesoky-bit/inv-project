import { getTranslations } from "next-intl/server";

type IndexedItem = { index: string; title: string; body: string };
type TitledItem = { title: string; body: string };

export async function AboutSection() {
  const t = await getTranslations("about");
  const paragraphs = t.raw("paragraphs") as string[];

  return (
    <section
      id="about"
      className="bg-background px-6 py-20 md:py-28"
      aria-labelledby="about-heading"
    >
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-12">
        <div className="md:col-span-4">
          <p className="mb-3 text-xs font-medium tracking-[0.18em] text-accent uppercase">
            {t("eyebrow")}
          </p>
          <h2
            id="about-heading"
            className="font-serif text-3xl tracking-tight text-foreground md:text-4xl"
          >
            {t("title")}
          </h2>
        </div>
        <div className="space-y-5 md:col-span-8">
          {paragraphs.map((paragraph) => (
            <p key={paragraph} className="text-base leading-relaxed text-muted">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}

export async function PositioningSection() {
  const t = await getTranslations("positioning");

  return (
    <section className="border-t border-border bg-surface-muted px-6 py-16 md:py-20">
      <div className="mx-auto max-w-3xl">
        <p className="mb-3 text-xs font-medium tracking-[0.18em] text-accent uppercase">
          {t("eyebrow")}
        </p>
        <h2 className="font-serif text-3xl tracking-tight text-foreground md:text-4xl">
          {t("title")}
        </h2>
        <p className="mt-6 text-base leading-relaxed text-muted">{t("body")}</p>
      </div>
    </section>
  );
}

export async function ImpactSection() {
  const t = await getTranslations("impact");
  const items = t.raw("items") as IndexedItem[];

  return (
    <section
      id="impact"
      className="border-t border-border bg-background px-6 py-20 md:py-28"
      aria-labelledby="impact-heading"
    >
      <div className="mx-auto max-w-6xl">
        <p className="mb-3 text-xs font-medium tracking-[0.18em] text-accent uppercase">
          {t("eyebrow")}
        </p>
        <h2
          id="impact-heading"
          className="max-w-2xl font-serif text-3xl tracking-tight text-foreground md:text-4xl"
        >
          {t("title")}
        </h2>
        <ol className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <li key={item.index} className="border-t border-border pt-6">
              <p className="text-xs font-medium text-accent">{item.index}</p>
              <h3 className="mt-3 font-serif text-xl text-foreground">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                {item.body}
              </p>
            </li>
          ))}
        </ol>
        <div className="mt-16 grid gap-10 border-t border-border pt-12 md:grid-cols-2">
          <div>
            <h3 className="font-serif text-2xl text-foreground">
              {t("strengthTitle")}
            </h3>
            <p className="mt-4 text-base leading-relaxed text-muted">
              {t("strengthBody")}
            </p>
          </div>
          <div>
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
  const paragraphs = t.raw("paragraphs") as string[];
  const items = t.raw("items") as string[];

  return (
    <section className="border-t border-border bg-surface-muted px-6 py-20 md:py-24">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-12">
        <h2 className="font-serif text-3xl tracking-tight text-foreground md:col-span-4 md:text-4xl">
          {t("title")}
        </h2>
        <div className="space-y-5 md:col-span-8">
          {paragraphs.map((paragraph) => (
            <p key={paragraph} className="text-base leading-relaxed text-muted">
              {paragraph}
            </p>
          ))}
          <ul className="space-y-3 pt-2">
            {items.map((item) => (
              <li key={item} className="text-sm leading-relaxed text-foreground">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export async function AdvantageSection() {
  const t = await getTranslations("advantage");
  const items = t.raw("items") as string[];

  return (
    <section className="border-t border-border bg-brand px-6 py-16 text-brand-foreground md:py-20">
      <div className="mx-auto max-w-6xl">
        <h2 className="font-serif text-3xl tracking-tight">{t("title")}</h2>
        <ul className="mt-8 grid gap-4 md:grid-cols-2">
          {items.map((item) => (
            <li
              key={item}
              className="border border-brand-foreground/15 px-5 py-4 text-sm leading-relaxed text-brand-foreground/80"
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export async function ClientsSection() {
  const t = await getTranslations("clients");
  const items = t.raw("items") as string[];

  return (
    <section className="border-t border-border bg-background px-6 py-16 md:py-20">
      <div className="mx-auto max-w-6xl">
        <h2 className="font-serif text-3xl tracking-tight text-foreground">
          {t("title")}
        </h2>
        <ul className="mt-8 flex flex-wrap gap-3">
          {items.map((item) => (
            <li
              key={item}
              className="border border-border bg-surface px-4 py-2 text-sm text-foreground"
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export async function PrinciplesSection() {
  const t = await getTranslations("principles");
  const items = t.raw("items") as TitledItem[];

  return (
    <section className="border-t border-border bg-surface-muted px-6 py-20 md:py-24">
      <div className="mx-auto max-w-6xl">
        <p className="mb-3 text-xs font-medium tracking-[0.18em] text-accent uppercase">
          {t("eyebrow")}
        </p>
        <h2 className="max-w-2xl font-serif text-3xl tracking-tight text-foreground md:text-4xl">
          {t("title")}
        </h2>
        <ul className="mt-10 grid gap-6 md:grid-cols-3">
          {items.map((item) => (
            <li key={item.title} className="border border-border bg-surface p-6">
              <h3 className="font-serif text-xl text-foreground">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                {item.body}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
