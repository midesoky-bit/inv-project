import { getTranslations } from "next-intl/server";
import { ServiceCardMotion } from "@/components/home/ServiceCardMotion";
import { serviceVisual } from "@/lib/service-visuals";
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
      className="relative z-10 mx-auto -mt-28 max-w-6xl scroll-mt-24 px-4 pb-10 sm:px-6 md:pb-16 lg:px-8"
      aria-labelledby="services-page-heading"
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {services.map((service, index) => {
          const visual = serviceVisual(service.slug);
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
