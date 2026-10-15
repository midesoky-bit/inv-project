import { CmsError } from "@/lib/cms/errors";

export const REVALIDATE_SECONDS = 3600;

export function getCmsProvider(): "mock" | "directus" | "supabase" {
  const value = (process.env.CMS_PROVIDER ?? "mock").toLowerCase();
  if (value === "directus" || value === "supabase" || value === "mock") {
    return value;
  }
  return "mock";
}

type CmsFetchOptions = {
  tags?: string[];
  revalidate?: number | false;
  headers?: HeadersInit;
};

export async function cmsFetch<T>(
  path: string,
  options: CmsFetchOptions = {},
): Promise<T> {
  const baseUrl = process.env.CMS_URL;
  if (!baseUrl) {
    throw new CmsError("CMS_URL is not configured", "CONFIG");
  }

  const token = process.env.CMS_TOKEN;
  const url = `${baseUrl.replace(/\/$/, "")}${path.startsWith("/") ? path : `/${path}`}`;

  let response: Response;
  try {
    response = await fetch(url, {
      headers: {
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
      next: {
        tags: options.tags,
        revalidate: options.revalidate ?? REVALIDATE_SECONDS,
      },
    });
  } catch (cause) {
    throw new CmsError(`CMS request failed for ${path}`, "NETWORK", cause);
  }

  if (!response.ok) {
    throw new CmsError(
      `CMS responded ${response.status} for ${path}`,
      response.status === 404 ? "NOT_FOUND" : "NETWORK",
    );
  }

  try {
    return (await response.json()) as T;
  } catch (cause) {
    throw new CmsError(`Failed to parse CMS response for ${path}`, "PARSE", cause);
  }
}
