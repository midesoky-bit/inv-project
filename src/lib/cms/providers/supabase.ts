import type { Locale } from "@/i18n/routing";
import { cmsFetch } from "@/lib/cms/client";
import type {
  Career,
  CaseStudy,
  EsgCommitment,
  Insight,
  Service,
} from "@/types/cms";

export async function supabaseFetchServices(locale: Locale): Promise<Service[]> {
  return cmsFetch<Service[]>(
    "/rest/v1/services?select=*&order=order.asc",
    {
      tags: [`services:${locale}`],
      headers: {
        apikey: process.env.CMS_TOKEN ?? "",
      },
    },
  );
}

export async function supabaseFetchServiceBySlug(
  slug: string,
  locale: Locale,
): Promise<Service | null> {
  const rows = await cmsFetch<Service[]>(
    `/rest/v1/services?select=*&slug=eq.${encodeURIComponent(slug)}&limit=1`,
    {
      tags: [`services:${locale}`, `service:${locale}:${slug}`],
      headers: {
        apikey: process.env.CMS_TOKEN ?? "",
      },
    },
  );
  return rows[0] ?? null;
}

export async function supabaseFetchInsights(locale: Locale): Promise<Insight[]> {
  return cmsFetch<Insight[]>("/rest/v1/insights?select=*", {
    tags: [`insights:${locale}`],
    headers: { apikey: process.env.CMS_TOKEN ?? "" },
  });
}

export async function supabaseFetchCareers(locale: Locale): Promise<Career[]> {
  void locale;
  return [];
}

export async function supabaseFetchEsgCommitments(
  locale: Locale,
): Promise<EsgCommitment[]> {
  return cmsFetch<EsgCommitment[]>(
    "/rest/v1/esg_commitments?select=*&order=order.asc",
    {
      tags: [`esg:${locale}`],
      headers: { apikey: process.env.CMS_TOKEN ?? "" },
    },
  );
}

export async function supabaseFetchCaseStudies(
  locale: Locale,
): Promise<CaseStudy[]> {
  return cmsFetch<CaseStudy[]>("/rest/v1/case_studies?select=*", {
    tags: [`case-studies:${locale}`],
    headers: { apikey: process.env.CMS_TOKEN ?? "" },
  });
}
