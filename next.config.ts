import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

function assetHost(value?: string) {
  if (!value) return null;
  try {
    const url = new URL(value);
    return {
      protocol: url.protocol.replace(":", "") as "http" | "https",
      hostname: url.hostname,
      ...(url.port ? { port: url.port } : {}),
      pathname: "/assets/**" as const,
    };
  } catch {
    return null;
  }
}

const cmsImageHosts = [
  assetHost("http://localhost:8055"),
  assetHost("http://127.0.0.1:8055"),
  assetHost("http://directus:8055"),
  assetHost(process.env.CMS_URL),
  assetHost(process.env.DIRECTUS_PUBLIC_URL),
].filter((value): value is NonNullable<typeof value> => Boolean(value));

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: cmsImageHosts,
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default withNextIntl(nextConfig);
