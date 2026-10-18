import type { ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import { PAGE_GUTTER } from "@/lib/layout";

type Item = { slug: string; title: string; icon?: string };

const iconAttrs = {
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export function ServiceMark({
  icon,
  className = "text-accent",
}: {
  icon?: string;
  className?: string;
}) {
  const marks: Record<string, ReactNode> = {
    media: (
      <>
        <rect x="2.5" y="6" width="13" height="12" rx="2" />
        <path d="M15.5 10.2 21.5 7.2v9.6l-6-3" />
      </>
    ),
    content: (
      <>
        <path d="M7 3.5h7.5L19 8v12.5H7z" />
        <path d="M14.5 3.5V8H19" />
        <path d="M9.5 12.5h5M9.5 16h3.5" />
      </>
    ),
    digital: (
      <>
        <rect x="3" y="4" width="18" height="12" rx="2" />
        <path d="M8 20h8M12 16v4" />
      </>
    ),
    pr: (
      <>
        <path d="M5 9.5v5h2.2L16 18.5v-13L7.2 9.5H5z" />
        <path d="M16 9.2a3.2 3.2 0 0 1 0 5.6" />
      </>
    ),
    events: (
      <>
        <rect x="4" y="5" width="16" height="15" rx="2" />
        <path d="M8 3.5v3M16 3.5v3M4 10h16" />
      </>
    ),
    affairs: (
      <>
        <path d="M4 20h16" />
        <path d="M6 20V10M10 20V10M14 20V10M18 20V10" />
        <path d="M3 10h18L12 4.5z" />
      </>
    ),
    capital: (
      <>
        <path d="M4 19V5M4 19h16" />
        <path d="M7.5 14.5 11 11l3 2.5 5-5.5" />
      </>
    ),
    sustainability: (
      <>
        <path d="M12 20V9" />
        <path d="M12 9c4-6 8-4 8 1-4 1-8 2.5-8 7" />
        <path d="M12 11C8 6 4 7.5 4 12c4 .8 8 2 8 6" />
      </>
    ),
    supplies: (
      <>
        <path d="M4 8.5 12 4.5 20 8.5v7L12 19.5 4 15.5z" />
        <path d="M12 4.5v15M4 8.5 12 12.5 20 8.5" />
      </>
    ),
  };

  return (
    <svg {...iconAttrs} className={className}>
      {icon && marks[icon] ? (
        marks[icon]
      ) : (
        <circle cx="12" cy="12" r="2.25" fill="currentColor" stroke="none" />
      )}
    </svg>
  );
}

export function ServiceIconRow({ services }: { services: Item[] }) {
  return (
    <ul className={`grid grid-cols-2 gap-4 ${PAGE_GUTTER} py-10 sm:grid-cols-3 lg:grid-cols-4`}>
      {services.map((service) => (
        <li key={service.slug}>
          <Link
            href={`/services/${service.slug}`}
            className="flex h-full flex-col gap-3 rounded-2xl border border-border bg-surface p-5 text-foreground transition-transform hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
          >
            <ServiceMark icon={service.icon} />
            <span className="font-serif text-lg">{service.title}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
