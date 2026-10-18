export type CmsRemotePattern = {
  protocol: "http" | "https";
  hostname: string;
  port?: string;
  pathname: `${string}/assets/**`;
};

export function isRemoteAsset(src: string) {
  return /^https?:\/\//.test(src);
}

export function cmsAssetRemotePattern(
  value?: string,
): CmsRemotePattern | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    const prefix = url.pathname.replace(/\/$/, "");
    return {
      protocol: url.protocol.replace(":", "") as "http" | "https",
      hostname: url.hostname,
      ...(url.port ? { port: url.port } : {}),
      pathname: `${prefix}/assets/**`,
    };
  } catch {
    return null;
  }
}

export function cmsImageRemotePatterns(
  urls: Array<string | undefined>,
): CmsRemotePattern[] {
  const seen = new Set<string>();
  const patterns: CmsRemotePattern[] = [];
  for (const value of urls) {
    const pattern = cmsAssetRemotePattern(value);
    if (!pattern) continue;
    const key = `${pattern.protocol}:${pattern.hostname}:${pattern.port ?? ""}:${pattern.pathname}`;
    if (seen.has(key)) continue;
    seen.add(key);
    patterns.push(pattern);
  }
  return patterns;
}
