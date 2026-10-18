export type CmsRemotePattern = {
  protocol: "http" | "https";
  hostname: string;
  port?: string;
  pathname: `${string}/assets/**`;
};

function originOf(value?: string) {
  if (!value) return null;
  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
}

function isLoopbackOrPrivateHost(hostname: string) {
  const host = hostname.replace(/^\[|\]$/g, "").toLowerCase();
  if (
    host === "localhost" ||
    host === "127.0.0.1" ||
    host === "0.0.0.0" ||
    host === "::1"
  ) {
    return true;
  }
  if (/^10(?:\.\d{1,3}){3}$/.test(host)) return true;
  if (/^127(?:\.\d{1,3}){3}$/.test(host)) return true;
  if (/^192\.168(?:\.\d{1,3}){2}$/.test(host)) return true;
  if (/^172\.(1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2}$/.test(host)) return true;
  return false;
}

export function isRemoteAsset(src: string) {
  if (!/^https?:\/\//.test(src)) return false;
  try {
    const url = new URL(src);
    const publicOrigin = originOf(process.env.DIRECTUS_PUBLIC_URL);
    const cmsOrigin = originOf(process.env.CMS_URL);
    if (cmsOrigin && url.origin === cmsOrigin && url.origin !== publicOrigin) {
      return false;
    }
    if (publicOrigin && url.origin === publicOrigin) {
      return isLoopbackOrPrivateHost(url.hostname);
    }
    return isLoopbackOrPrivateHost(url.hostname);
  } catch {
    return false;
  }
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
