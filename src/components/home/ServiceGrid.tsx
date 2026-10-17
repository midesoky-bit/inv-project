import { getTranslations } from "next-intl/server";
import { ServiceCardMotion } from "@/components/home/ServiceCardMotion";
import type { Service } from "@/types/cms";

type ServicesHeadingProps = {
  id: string;
  level?: "h1" | "h2";
  titleClassName: string;
  subtitleClassName: string;
};

export async function ServicesHeading({
  id,
  level = "h2",
  titleClassName,
  subtitleClassName,
}: ServicesHeadingProps) {
  const t = await getTranslations("services");
  const Heading = level;

  return (
    <div className="max-w-2xl">
      <p className="mb-3 text-xs font-medium tracking-[0.18em] text-accent uppercase">
        {t("eyebrow")}
      </p>
      <Heading id={id} className={titleClassName}>
        {t.rich("title", {
          g: (chunks) => <span className="text-accent">{chunks}</span>,
        })}
      </Heading>
      <p className={subtitleClassName}>{t("subtitle")}</p>
    </div>
  );
}

type ServiceGridProps = {
  services: Service[];
};

export async function ServiceGrid({ services }: ServiceGridProps) {
  const t = await getTranslations("services");

  return (
    <section
      id="services"
      className="scroll-mt-24 bg-surface-muted px-6 py-14 md:py-20"
      aria-labelledby="services-page-heading"
    >
      <div className="mx-auto max-w-6xl">
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
