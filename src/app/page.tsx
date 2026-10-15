import type { Metadata } from "next";
import { HeroSection } from "@/components/home/HeroSection";
import { ServiceGrid } from "@/components/home/ServiceGrid";
import { fetchServices } from "@/services/cms";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const services = await fetchServices();

  return (
    <>
      <HeroSection />
      <ServiceGrid services={services} />
    </>
  );
}
