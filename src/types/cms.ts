export type Service = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  description: string;
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
