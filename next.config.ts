import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noai, noimageai",
          },
          {
            key: "Permissions-Policy",
            value:
              "browsing-topics=(), user-interaction=(), client-hints=(), interest-cohort=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
