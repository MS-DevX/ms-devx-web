import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  cacheComponents: true,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
        ],
      },
    ];
  },

  // Note: route groups (e.g. `(tools)`) are not part of the URL path,
  // so rewrites cannot target them as a destination.
};

export default nextConfig;
