import type { MetadataRoute } from 'next';
import { baseUrl } from '@/lib/utils';

/**
 * Define robots directives and sitemap URL for the site.
 *
 * @returns The robots configuration containing rules that allow `/`, disallow internal and user-specific routes (including `/api/`, `/admin/`, `/_next/`, `/cart`, `/checkout`, `/account`) and search result pages with query parameters, and the sitemap URL.
 */
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