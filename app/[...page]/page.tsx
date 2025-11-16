import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import { resolveBuilderContent } from '@/lib/builder/resolve-content';
import { builderConfig } from '@/lib/builder/config';
import { BuilderComponentClient } from '@/components/builder/BuilderComponentClient';

interface PageProps {
  params: Promise<{
    page: string[];
  }>;
}

/**
 * Generate metadata for Builder.io pages
 * Falls back to generic metadata if Builder.io content doesn't exist
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  // Access headers to mark as dynamic - required for Builder.io SDK compatibility
  await headers();

  const { page: pageSegments } = await params;
  const urlPath = `/${pageSegments.join('/')}`;

  // Check if this is a reserved path
  if (builderConfig.isReservedPath(urlPath)) {
    return notFound();
  }

  // Try to fetch Builder.io content
  const builderContent = await resolveBuilderContent('page', {
    userAttributes: { urlPath },
  });

  // If no Builder.io content exists, return 404
  if (!builderContent) {
    return notFound();
  }

  // Extract metadata from Builder.io content
  const title = builderContent.data?.title || 'Fern & Fog Creations';
  const description =
    builderContent.data?.description ||
    'Handmade coastal crafts including sea glass earrings, pressed flower resin, and driftwood décor.';
  const image = builderContent.data?.image;

  return {
    title: `${title} | Fern & Fog Creations`,
    description,
    openGraph: {
      title,
      description,
      images: image ? [{ url: image }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: image ? [image] : [],
    },
  };
}

/**
 * Builder.io Catch-All Route Handler
 *
 * This route handles all pages that are:
 * - NOT reserved for e-commerce (products, cart, checkout, etc.)
 * - Created in Builder.io visual editor as "page" content type
 *
 * Examples of pages this handles:
 * - /about-us
 * - /our-story
 * - /blog/post-title
 * - /landing/summer-sale
 * - /custom-orders
 *
 * Protected routes (will return 404):
 * - /products/* - Product listing
 * - /product/* - Product details
 * - /cart - Shopping cart
 * - /checkout - Checkout flow
 * - /account - User accounts
 * - /api/* - API routes
 */
export default async function BuilderPage({ params }: PageProps) {
  // Access headers to mark as dynamic - required for Builder.io SDK compatibility
  await headers();

  const { page: pageSegments } = await params;
  const urlPath = `/${pageSegments.join('/')}`;

  // Protect reserved paths - these should never be handled by Builder.io
  if (builderConfig.isReservedPath(urlPath)) {
    console.warn(
      `[Builder.io] Attempted to access reserved path via catch-all: ${urlPath}. Returning 404.`
    );
    return notFound();
  }

  // Fetch Builder.io content for this path
  const builderContent = await resolveBuilderContent('page', {
    userAttributes: { urlPath },
  });

  // If no Builder.io content exists for this path, return 404
  if (!builderContent) {
    console.log(
      `[Builder.io] No content found for path: ${urlPath}. ` +
        `Create this page in Builder.io dashboard at https://builder.io/content`
    );
    return notFound();
  }

  // Render the Builder.io content
  return (
    <div className="bg-parchment min-h-screen">
      <BuilderComponentClient model="page" content={builderContent} />
    </div>
  );
}
