import { getCmsProvider } from "@/lib/cms/client";
import * as directus from "@/lib/cms/providers/directus";
import * as mock from "@/lib/cms/providers/mock";
import * as supabase from "@/lib/cms/providers/supabase";
import type {
  CaseStudy,
  EsgCommitment,
  Insight,
  Service,
} from "@/types/cms";

export async function fetchServices(): Promise<Service[]> {
  switch (getCmsProvider()) {
    case "directus":
      return directus.directusFetchServices();
    case "supabase":
      return supabase.supabaseFetchServices();
    default:
      return mock.mockFetchServices();
  }
}

export async function fetchServiceBySlug(
  slug: string,
): Promise<Service | null> {
  switch (getCmsProvider()) {
    case "directus":
      return directus.directusFetchServiceBySlug(slug);
    case "supabase":
      return supabase.supabaseFetchServiceBySlug(slug);
    default:
      return mock.mockFetchServiceBySlug(slug);
  }
}

export async function fetchInsights(): Promise<Insight[]> {
  switch (getCmsProvider()) {
    case "directus":
      return directus.directusFetchInsights();
    case "supabase":
      return supabase.supabaseFetchInsights();
    default:
      return mock.mockFetchInsights();
  }
}

export async function fetchEsgCommitments(): Promise<EsgCommitment[]> {
  switch (getCmsProvider()) {
    case "directus":
      return directus.directusFetchEsgCommitments();
    case "supabase":
      return supabase.supabaseFetchEsgCommitments();
    default:
      return mock.mockFetchEsgCommitments();
  }
}

export async function fetchCaseStudies(): Promise<CaseStudy[]> {
  switch (getCmsProvider()) {
    case "directus":
      return directus.directusFetchCaseStudies();
    case "supabase":
      return supabase.supabaseFetchCaseStudies();
    default:
      return mock.mockFetchCaseStudies();
  }
}

export { REVALIDATE_SECONDS } from "@/lib/cms/client";
