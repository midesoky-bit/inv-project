import { ServiceCardMotion } from "@/components/home/ServiceCardMotion";
import type { Service } from "@/types/cms";

type ServiceGridProps = {
  services: Service[];
};

export function ServiceGrid({ services }: ServiceGridProps) {
  return (
    <section
      id="services"
      className="bg-inv-mist px-6 py-20 md:py-28"
      aria-labelledby="services-heading"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 max-w-2xl">
          <p className="mb-3 text-xs font-medium tracking-[0.18em] text-inv-accent uppercase">
            Capabilities
          </p>
          <h2
            id="services-heading"
            className="font-serif text-3xl tracking-tight text-inv-navy md:text-4xl"
          >
            Core offerings
          </h2>
          <p className="mt-4 text-base text-inv-slate">
            Integrated communications disciplines for institutional clients.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {services.map((service, index) => (
            <ServiceCardMotion
              key={service.id}
              href={`/services/${service.slug}`}
              title={service.title}
              summary={service.summary}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
