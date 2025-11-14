/**
 * Builder.io Catch-All Route
 *
 * This route handles all URLs that aren't matched by other routes,
 * allowing Builder.io to manage landing pages, marketing content, and custom pages.
 *
 * Protected Routes (will NOT be caught):
 * - /products/* - Product listing and collections
 * - /product/* - Individual product pages
 * - /cart - Shopping cart
 * - /checkout - Shopify checkout
 * - /account/* - User account pages
 * - /api/* - API routes
 *
 * Examples of Builder.io pages:
 * - /about-us
 * - /our-story
 * - /shipping-returns
 * - /blog/*
 * - /landing/*
 */

import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { resolveBuilderContent } from '@/lib/builder/resolve-content';
import { builderConfig } from '@/lib/builder/config';
import { BuilderComponentClient } from '@/components/builder/BuilderComponentClient';

interface PageProps {
  params: Promise<{
    page?: string[];
  }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

/**
 * Generate metadata for Builder.io pages
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { page = [] } = await params;
  const urlPath = '/' + page.join('/');

  // Check if path is reserved
  if (builderConfig.isReservedPath(urlPath)) {
    return notFound();
  }

  // Fetch content to get SEO metadata
  const content = await resolveBuilderContent('page', {
    userAttributes: { urlPath },
  });

  if (!content) {
    return {
      title: 'Page Not Found | Fern & Fog Creations',
    };
  }

  // Extract metadata from Builder.io content
  const title = content.data?.title || 'Fern & Fog Creations';
  const description =
    content.data?.description ||
    'Handmade coastal crafts including sea glass earrings, pressed flower resin, and driftwood décor.';

  return {
    title: `${title} | Fern & Fog Creations`,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      ...(content.data?.image && {
        images: [
          {
            url: content.data.image,
            alt: title,
          },
        ],
      }),
    },
  };
}

/**
 * Builder.io Catch-All Page Component
 */
export default async function BuilderPage({ params, searchParams }: PageProps) {
  // Await params (Next.js 15+ async params pattern)
  const { page = [] } = await params;
  const urlPath = '/' + page.join('/');

  // Protect reserved paths - return 404 for e-commerce routes
  if (builderConfig.isReservedPath(urlPath)) {
    return notFound();
  }

  // Fetch Builder.io content for this URL
  const content = await resolveBuilderContent('page', {
    userAttributes: {
      urlPath,
      // Pass search params for targeting/personalization
      ...(await searchParams),
    },
  });

  // If no Builder.io content exists, show 404
  if (!content) {
    return notFound();
  }

  // Render Builder.io content with client component
  return (
    <div className="builder-content">
      <BuilderComponentClient
        model="page"
        content={content}
        data={{
          // Pass global data that Builder.io components can access
          urlPath,
        }}
        context={{
          // Pass context functions/services that Builder.io components can use
          // Example: cartService, navigationService, etc.
        }}
      />
    </div>
  );
}

/**
 * Static generation configuration
 *
 * With Next.js 16's cacheComponents enabled, Builder.io pages
 * will automatically use appropriate caching strategies.
 *
 * Content is fetched server-side and cached according to Next.js
 * cache directives. Builder.io's preview mode will work automatically.
 */
