import type { NextConfig } from "next";

import { HOSTS } from "./src/lib/hosts";

/**
 * Allowed production and local hostnames.
 * Used by middleware for msdevx.com vs tools.marth.systems routing.
 */
export { HOSTS };

const nextConfig: NextConfig = {
  reactStrictMode: true,

  cacheComponents: true,

  env: {
    MS_DEVX_ALLOWED_HOSTS: HOSTS.join(","),
  },

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
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
      {
        source: "/:path*\\.(jpg|jpeg|png|gif|webp|avif|svg|ico)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/:path*\\.(woff|woff2|ttf|otf|eot)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },

  // Note: route groups (e.g. `(tools)`) are not part of the URL path,
  // so rewrites cannot target them as a destination in `rewrites` alone.
  // Multi-domain routing is handled in `src/middleware.ts` via hostname detection.
};

export default nextConfig;
