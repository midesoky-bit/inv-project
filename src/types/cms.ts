export type LocalizedString = { en: string; ar: string };

export type ServiceRecord = {
  id: string;
  slug: string;
  order: number;
  icon?: string;
  title: LocalizedString;
  summary: LocalizedString;
  description: LocalizedString;
  highlights: { en: string[]; ar: string[] };
};

export type EsgCommitmentRecord = {
  id: string;
  order: number;
  title: LocalizedString;
  summary: LocalizedString;
};

export type Service = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  description: string;
  highlights: string[];
  order: number;
  icon?: string;
};

export type Insight = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  publishedAt: string;
};

export type Career = {
  id: string;
  title: string;
  summary: string;
  location: string;
};

export type EsgCommitment = {
  id: string;
  title: string;
  summary: string;
  order: number;
};

export type CaseStudy = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  serviceSlug?: string;
};

export type CmsProviderName = "mock" | "directus" | "supabase";
