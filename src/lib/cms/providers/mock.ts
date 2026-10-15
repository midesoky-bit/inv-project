import type {
  CaseStudy,
  EsgCommitment,
  Insight,
  Service,
} from "@/types/cms";

const SERVICES: Service[] = [
  {
    id: "1",
    slug: "media-production",
    title: "Media Production",
    summary:
      "Broadcast-quality storytelling that carries institutional narratives with clarity and restraint.",
    description:
      "From executive films to multi-format campaigns, we produce media that meets the standards of government, enterprise, and multilateral stakeholders across the Middle East.",
    order: 1,
    icon: "media",
  },
  {
    id: "2",
    slug: "digital-media",
    title: "Digital Media",
    summary:
      "Owned and earned digital ecosystems designed for influence, not noise.",
    description:
      "We architect digital presence, content systems, and performance frameworks that advance reputation and policy objectives in complex regional markets.",
    order: 2,
    icon: "digital",
  },
  {
    id: "3",
    slug: "events",
    title: "Events",
    summary:
      "High-stakes convenings staged with diplomatic precision and operational excellence.",
    description:
      "Summits, forums, and private briefings delivered end-to-end — messaging, staging, stakeholder management, and post-event narrative continuity.",
    order: 3,
    icon: "events",
  },
  {
    id: "4",
    slug: "public-affairs",
    title: "Public Affairs",
    summary:
      "Strategic counsel at the intersection of policy, reputation, and public discourse.",
    description:
      "We advise leadership teams on stakeholder mapping, issues management, and communications that withstand scrutiny in the Middle East’s institutional landscape.",
    order: 4,
    icon: "affairs",
  },
];

export async function mockFetchServices(): Promise<Service[]> {
  return [...SERVICES].sort((a, b) => a.order - b.order);
}

export async function mockFetchServiceBySlug(
  slug: string,
): Promise<Service | null> {
  const services = await mockFetchServices();
  return services.find((s) => s.slug === slug) ?? null;
}

export async function mockFetchInsights(): Promise<Insight[]> {
  return [];
}

export async function mockFetchEsgCommitments(): Promise<EsgCommitment[]> {
  return [];
}

export async function mockFetchCaseStudies(): Promise<CaseStudy[]> {
  return [];
}
