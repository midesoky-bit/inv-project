import { getTranslations } from "next-intl/server";

type Stat = { value: string; label: string };

export async function StatsBar() {
  const t = await getTranslations("stats");
  const items = t.raw("items") as Stat[];

  return (
    <section aria-label={items.map((item) => item.label).join(", ")} className="bg-background px-6 pb-14">
      <div className="relative mx-auto max-w-6xl bg-brand text-brand-foreground [clip-path:polygon(1.75rem_0,100%_0,100%_100%,0_100%,0_1.35rem)] rtl:[clip-path:polygon(0_0,calc(100%-1.75rem)_0,100%_1.35rem,100%_100%,0_100%)]">
        <div className="flex items-stretch gap-6 px-6 py-8 sm:px-10">
          <span aria-hidden className="w-1 shrink-0 self-stretch bg-accent" />
          <ul className="grid flex-1 grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-4">
            {items.map((item) => (
              <li key={item.label}>
                <p className="font-serif text-3xl tracking-tight text-accent sm:text-4xl">
                  {item.value}
                </p>
                <p className="mt-2 max-w-[12rem] text-sm leading-snug text-brand-foreground/85">
                  {item.label}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
