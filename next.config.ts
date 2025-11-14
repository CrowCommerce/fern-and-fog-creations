import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    cacheComponents: true,
    inlineCss: true,
    useCache: true,
  },
  images: {
    formats: ["image/avif", "image/webp"],
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
      {
        protocol: "https",
        hostname: "cdn.builder.io",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: "frame-ancestors 'self' https://*.builder.io https://builder.io http://localhost:1234",
          },
        ],
      },
    ];
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
