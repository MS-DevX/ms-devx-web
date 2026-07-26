import type { NextConfig } from "next";
import withBundleAnalyzer from "@next/bundle-analyzer";

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  cacheComponents: true,
  productionBrowserSourceMaps: true,
  async redirects() {
    return [
      // Legacy app paths that are 404 — real pages live under /apps
      {
        source: "/muslim-companion",
        destination: "/apps/muslim-companion",
        permanent: true,
      },
      {
        source: "/unit-converter",
        destination: "/apps/unit-converter",
        permanent: true,
      },
      // Deprecated short privacy URL — canonical is now /muslim-companion/privacy
      {
        source: "/mc-privacy",
        destination: "/muslim-companion/privacy",
        permanent: true,
      },
    ];
  },
};

export default bundleAnalyzer(nextConfig);
