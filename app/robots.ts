import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://fernandfogcreations.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/_next/',
          '/cart',
          '/checkout',
          '/account',
          '/search?*', // Don't index search result pages with query params
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
