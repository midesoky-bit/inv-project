import { getCmsProvider } from "@/lib/cms/client";
import type { Locale } from "@/i18n/routing";
import * as directus from "@/lib/cms/providers/directus";
import * as mock from "@/lib/cms/providers/mock";
import * as supabase from "@/lib/cms/providers/supabase";
import type {
  CaseStudy,
  EsgCommitment,
  Insight,
  Service,
} from "@/types/cms";

export async function fetchServices(locale: Locale = "en"): Promise<Service[]> {
  switch (getCmsProvider()) {
    case "directus":
      return directus.directusFetchServices(locale);
    case "supabase":
      return supabase.supabaseFetchServices(locale);
    default:
      return mock.mockFetchServices(locale);
  }
}

export async function fetchServiceBySlug(
  slug: string,
  locale: Locale = "en",
): Promise<Service | null> {
  switch (getCmsProvider()) {
    case "directus":
      return directus.directusFetchServiceBySlug(slug, locale);
    case "supabase":
      return supabase.supabaseFetchServiceBySlug(slug, locale);
    default:
      return mock.mockFetchServiceBySlug(slug, locale);
  }
}

export async function fetchInsights(locale: Locale): Promise<Insight[]> {
  switch (getCmsProvider()) {
    case "directus":
      return directus.directusFetchInsights(locale);
    case "supabase":
      return supabase.supabaseFetchInsights(locale);
    default:
      return mock.mockFetchInsights(locale);
  }
}

export async function fetchEsgCommitments(
  locale: Locale,
): Promise<EsgCommitment[]> {
  switch (getCmsProvider()) {
    case "directus":
      return directus.directusFetchEsgCommitments(locale);
    case "supabase":
      return supabase.supabaseFetchEsgCommitments(locale);
    default:
      return mock.mockFetchEsgCommitments(locale);
  }
}

export async function fetchCaseStudies(locale: Locale): Promise<CaseStudy[]> {
  switch (getCmsProvider()) {
    case "directus":
      return directus.directusFetchCaseStudies(locale);
    case "supabase":
      return supabase.supabaseFetchCaseStudies(locale);
    default:
      return mock.mockFetchCaseStudies(locale);
  }
}

export { REVALIDATE_SECONDS } from "@/lib/cms/client";
