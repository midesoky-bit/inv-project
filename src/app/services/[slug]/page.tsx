import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchServiceBySlug, fetchServices } from "@/services/cms";

export const revalidate = 3600;
export const dynamicParams = true;

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const services = await fetchServices();
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = await fetchServiceBySlug(slug);
  if (!service) {
    return { title: "Service not found", robots: { index: false } };
  }

  const path = `/services/${service.slug}`;

  return {
    title: service.title,
    description: service.summary,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "en_US",
      siteName: "Inventure Communications",
      url: path,
      title: `${service.title} | Inventure Communications`,
      description: service.summary,
    },
  };
}

export default async function ServicePage({ params }: PageProps) {
  const { slug } = await params;
  const service = await fetchServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  return (
    <article className="bg-inv-white">
      <div className="bg-inv-navy px-6 pt-28 pb-16 text-inv-white">
        <div className="mx-auto max-w-3xl">
          <p className="mb-4 text-xs tracking-[0.18em] text-white/60 uppercase">
            Service
          </p>
          <h1 className="font-serif text-4xl tracking-tight md:text-5xl">
            {service.title}
          </h1>
          <p className="mt-6 text-lg text-white/75">{service.summary}</p>
        </div>
      </div>
      <div className="mx-auto max-w-3xl px-6 py-16">
        <p className="text-base leading-relaxed text-inv-slate">
          {service.description}
        </p>
        <Link
          href="/#services"
          className="mt-10 inline-flex text-sm font-medium text-inv-accent hover:underline"
        >
          ← All services
        </Link>
      </div>
    </article>
  );
}
