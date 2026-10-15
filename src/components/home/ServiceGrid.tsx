import { getTranslations } from "next-intl/server";
import { ServiceCardMotion } from "@/components/home/ServiceCardMotion";
import type { Service } from "@/types/cms";

type ServiceGridProps = {
  services: Service[];
};

export async function ServiceGrid({ services }: ServiceGridProps) {
  const t = await getTranslations("services");

  return (
    <section
      id="services"
      className="scroll-mt-24 bg-surface-muted px-6 py-14 md:py-20"
      aria-labelledby="services-heading"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 max-w-2xl">
          <p className="mb-3 text-xs font-medium tracking-[0.18em] text-accent uppercase">
            {t("eyebrow")}
          </p>
          <h2
            id="services-heading"
            className="font-serif text-3xl tracking-tight text-foreground md:text-4xl"
          >
            {t("title")}
          </h2>
          <p className="mt-4 text-base text-muted">{t("subtitle")}</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {services.map((service, index) => (
            <ServiceCardMotion
              key={service.id}
              href={`/services/${service.slug}`}
              title={service.title}
              summary={service.summary}
              index={index}
              learnMoreLabel={t("learnMore")}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
