import { Link } from "@/i18n/navigation";

type Item = { slug: string; title: string; icon?: string };

export function ServiceIconRow({ services }: { services: Item[] }) {
  return (
    <ul className="mx-auto grid max-w-6xl grid-cols-2 gap-4 px-6 py-10 sm:grid-cols-3 lg:grid-cols-4">
      {services.map((service) => (
        <li key={service.slug}>
          <Link
            href={`/services/${service.slug}`}
            className="flex h-full flex-col gap-3 rounded-2xl border border-border bg-surface p-5 text-foreground transition-transform hover:-translate-y-1"
          >
            <span className="text-sm font-medium tracking-[0.14em] text-accent uppercase">
              {service.icon ?? "•"}
            </span>
            <span className="font-serif text-lg">{service.title}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
