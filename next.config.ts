import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { cmsImageRemotePatterns } from "./src/lib/cms/image-hosts";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  output: "standalone",
  async redirects() {
    return [
      {
        source: "/insights",
        destination: "/news",
        permanent: true,
      },
      {
        source: "/:locale/insights",
        destination: "/:locale/news",
        permanent: true,
      },
      {
        source: "/services/media-production",
        destination: "/services/media-production-content-creation",
        permanent: true,
      },
      {
        source: "/:locale/services/media-production",
        destination: "/:locale/services/media-production-content-creation",
        permanent: true,
      },
      {
        source: "/:locale/services/media-content-management",
        destination: "/:locale/services/media-production-content-creation",
        permanent: true,
      },
      {
        source: "/:locale/services/digital-media-platforms",
        destination: "/:locale/services/media-production-content-creation",
        permanent: true,
      },
      {
        source: "/:locale/services/public-relations-partnerships",
        destination: "/:locale/services/business-networking-strategic-partnerships",
        permanent: true,
      },
      {
        source: "/:locale/services/events-exhibitions",
        destination: "/:locale/services/events-event-management",
        permanent: true,
      },
      {
        source: "/:locale/services/public-affairs-government-relations",
        destination: "/:locale/services/government-relations",
        permanent: true,
      },
      {
        source: "/:locale/services/capital-markets-financial-communications",
        destination: "/:locale/services",
        permanent: true,
      },
    ];
  },
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
