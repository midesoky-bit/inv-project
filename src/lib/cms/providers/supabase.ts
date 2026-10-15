import type { Locale } from "@/i18n/routing";
import { cmsFetch } from "@/lib/cms/client";
import type {
  CaseStudy,
  EsgCommitment,
  Insight,
  Service,
} from "@/types/cms";

export async function supabaseFetchServices(_locale: Locale): Promise<Service[]> {
  return cmsFetch<Service[]>(
    "/rest/v1/services?select=*&order=order.asc",
    {
      tags: ["services"],
      headers: {
        apikey: process.env.CMS_TOKEN ?? "",
      },
    },
  );
}

export async function supabaseFetchServiceBySlug(
  slug: string,
  _locale: Locale,
): Promise<Service | null> {
  const rows = await cmsFetch<Service[]>(
    `/rest/v1/services?select=*&slug=eq.${encodeURIComponent(slug)}&limit=1`,
    {
      tags: ["services", `service:${slug}`],
      headers: {
        apikey: process.env.CMS_TOKEN ?? "",
      },
    },
  );
  return rows[0] ?? null;
}

export async function supabaseFetchInsights(_locale: Locale): Promise<Insight[]> {
  return cmsFetch<Insight[]>("/rest/v1/insights?select=*", {
    tags: ["insights"],
    headers: { apikey: process.env.CMS_TOKEN ?? "" },
  });
}

export async function supabaseFetchEsgCommitments(
  _locale: Locale,
): Promise<EsgCommitment[]> {
  return cmsFetch<EsgCommitment[]>(
    "/rest/v1/esg_commitments?select=*&order=order.asc",
    {
      tags: ["esg"],
      headers: { apikey: process.env.CMS_TOKEN ?? "" },
    },
  );
}

export async function supabaseFetchCaseStudies(
  _locale: Locale,
): Promise<CaseStudy[]> {
  return cmsFetch<CaseStudy[]>("/rest/v1/case_studies?select=*", {
    tags: ["case-studies"],
    headers: { apikey: process.env.CMS_TOKEN ?? "" },
  });
}
