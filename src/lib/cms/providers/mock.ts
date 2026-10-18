import type { Locale } from "@/i18n/routing";
import seedData from "../../../../scripts/seed-data.json";
import { toEsgCommitment, toService } from "@/lib/cms/localize";
import type {
  Career,
  CaseStudy,
  EsgCommitment,
  EsgCommitmentRecord,
  Insight,
  Service,
  ServiceRecord,
} from "@/types/cms";

export const SERVICE_RECORDS = seedData.services as ServiceRecord[];
export const ESG_COMMITMENT_RECORDS =
  seedData.esg as EsgCommitmentRecord[];

export async function mockFetchServices(locale: Locale): Promise<Service[]> {
  return [...SERVICE_RECORDS]
    .sort((a, b) => a.order - b.order)
    .map((record) => toService(record, locale));
}

export async function mockFetchServiceBySlug(
  slug: string,
  locale: Locale,
): Promise<Service | null> {
  const record = SERVICE_RECORDS.find((s) => s.slug === slug);
  if (!record) return null;
  return toService(record, locale);
}

export async function mockFetchInsights(locale: Locale): Promise<Insight[]> {
  void locale;
  return [];
}

export async function mockFetchCareers(locale: Locale): Promise<Career[]> {
  void locale;
  return [];
}

export async function mockFetchEsgCommitments(
  locale: Locale,
): Promise<EsgCommitment[]> {
  return [...ESG_COMMITMENT_RECORDS]
    .sort((a, b) => a.order - b.order)
    .map((record) => toEsgCommitment(record, locale));
}

export async function mockFetchCaseStudies(locale: Locale): Promise<CaseStudy[]> {
  void locale;
  return [];
}
