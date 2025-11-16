import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  experimental: {
    inlineCss: true,
    useCache: true,
  },
  // Transpile Sentry and OpenTelemetry packages to avoid externalization warnings
  transpilePackages: [
    '@sentry/nextjs',
    '@sentry/node',
    '@sentry/core',
    '@opentelemetry/instrumentation',
  ],
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75, 90], // Support both default (75) and high quality (90) images
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
        pathname: "/s/files/**",
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com",
      },
      {
        protocol: "https",
        hostname: "tailwindcss.com",
        pathname: "/plus-assets/**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/products",
        has: [
          {
            type: "query",
            key: "category",
            value: "(?<category>.*)",
          },
        ],
        destination: "/products/:category",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
