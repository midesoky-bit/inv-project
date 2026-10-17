import { getTranslations } from "next-intl/server";
import { PAGE_GUTTER } from "@/lib/layout";

type Stat = { value: string; label: string };

export async function StatsBar() {
  const t = await getTranslations("stats");
  const items = t.raw("items") as Stat[];

  return (
    <section aria-label={items.map((item) => item.label).join(", ")} className="bg-brand text-brand-foreground">
      <div className={`flex items-stretch gap-6 ${PAGE_GUTTER} py-8`}>
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
    </section>
  );
}
