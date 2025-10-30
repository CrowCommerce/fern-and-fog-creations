import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Temporarily disabled cacheComponents due to Next.js 16 + React 19 Suspense boundary issues
    // See: https://nextjs.org/docs/messages/blocking-route
    // cacheComponents: true,
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
