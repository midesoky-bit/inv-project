import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { cmsImageRemotePatterns } from "./src/lib/cms/image-hosts";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: cmsImageRemotePatterns([
      process.env.DIRECTUS_PUBLIC_URL,
      process.env.CMS_URL,
    ]),
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
