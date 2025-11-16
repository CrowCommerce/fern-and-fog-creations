import type { MetadataRoute } from 'next';
import { baseUrl } from '@/lib/utils';

export default function robots(): MetadataRoute.Robots {

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
