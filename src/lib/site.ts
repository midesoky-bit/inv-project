const LOCALHOST_SITE_URL =
  /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])(:\d+)?(\/|$)/i;

export function getSiteUrl(): string {
  const envValue = process.env.NEXT_PUBLIC_SITE_URL;
  const raw = envValue ?? "http://localhost:3000";
  const url = raw.replace(/\/+$/, "");

  if (process.env.NODE_ENV === "production") {
    const missing = !envValue?.trim();
    const isLocalhost = LOCALHOST_SITE_URL.test(url);
    if (missing || isLocalhost) {
      console.warn(
        "[getSiteUrl] NEXT_PUBLIC_SITE_URL is missing or points at localhost in a production build. " +
          "Set NEXT_PUBLIC_SITE_URL to your public origin before `npm run build` so canonical URLs, " +
          "sitemap, and robots.txt reference the live domain.",
      );
    }
  }

  return url;
}
