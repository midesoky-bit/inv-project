import { getTranslations } from "next-intl/server";
import { ServiceCardMotion } from "@/components/home/ServiceCardMotion";
import { serviceCardVisual } from "@/lib/service-visuals";
import { PAGE_GUTTER } from "@/lib/layout";
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
        {t("heroEyebrow")}
      </p>
      <Heading id={id} className={titleClassName}>
        {t.rich("heroTitle", {
          g: (chunks) => <span className="text-accent">{chunks}</span>,
          br: () => <br />,
        })}
      </Heading>
      <p className={subtitleClassName}>{t("intro")}</p>
    </div>
  );
}

type ServiceGridProps = {
  services: Service[];
};

export async function ServiceGrid({ services }: ServiceGridProps) {
  const [t, tImages] = await Promise.all([
    getTranslations("services"),
    getTranslations("images"),
  ]);

  return (
    <section
      id="services"
      className={`relative z-10 scroll-mt-24 ${PAGE_GUTTER} py-10 md:py-16`}
      aria-labelledby="services-page-heading"
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service, index) => {
          const visual = serviceCardVisual(service);
          return (
            <ServiceCardMotion
              key={service.id}
              href={`/services/${service.slug}`}
              title={service.title}
              summary={service.summary}
              index={index}
              learnMoreLabel={t("learnMore")}
              imageSrc={visual.src}
              imageAlt={tImages(visual.altKey)}
              icon={service.icon}
            />
          );
        })}
      </div>
    </section>
  );
}
