import { revalidateTag } from 'next/cache';
import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { TAGS } from '@/lib/constants';

/**
 * Shopify Webhook Handler for Cache Revalidation
 *
 * This endpoint receives webhooks from Shopify when content is updated
 * and automatically revalidates the appropriate cache tags.
 *
 * Webhook URL format: https://your-domain.com/api/revalidate?secret=YOUR_SECRET
 *
 * Supported webhook topics:
 * - products/create, products/update, products/delete
 * - collections/create, collections/update, collections/delete
 * - Add more topics as needed for menus, metaobjects, etc.
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  const headersList = await headers();
  const topic = headersList.get('x-shopify-topic') || 'unknown';
  const secret = req.nextUrl.searchParams.get('secret');

  // Validate secret
  if (!secret || secret !== process.env.SHOPIFY_REVALIDATION_SECRET) {
    console.error('[Webhook] Invalid revalidation secret');
    return NextResponse.json(
      { status: 401, message: 'Unauthorized' },
      { status: 401 }
    );
  }

  console.log(`[Webhook] Received: ${topic}`);

  // Map webhook topics to cache tags
  const topicMap: Record<string, string[]> = {
    // Product webhooks
    'products/create': [TAGS.products],
    'products/update': [TAGS.products],
    'products/delete': [TAGS.products],

    // Collection webhooks
    'collections/create': [TAGS.collections],
    'collections/update': [TAGS.collections],
    'collections/delete': [TAGS.collections],

    // Menu webhooks (for navigation updates)
    'menus/create': [TAGS.menus],
    'menus/update': [TAGS.menus],
    'menus/delete': [TAGS.menus],

    // Metaobject webhooks (for CMS content)
    'metaobjects/create': [TAGS.gallery, TAGS.metadata],
    'metaobjects/update': [TAGS.gallery, TAGS.metadata],
    'metaobjects/delete': [TAGS.gallery, TAGS.metadata],
  };

  const tagsToRevalidate = topicMap[topic];

  if (tagsToRevalidate) {
    tagsToRevalidate.forEach((tag) => {
      console.log(`[Webhook] Revalidating tag: ${tag}`);
      revalidateTag(tag, 'max');
    });

    return NextResponse.json({
      status: 200,
      revalidated: true,
      topic,
      tags: tagsToRevalidate,
      now: Date.now(),
    });
  }

  // Unknown topic - log but don't error
  console.warn(`[Webhook] Unknown topic: ${topic}`);
  return NextResponse.json({
    status: 200,
    revalidated: false,
    topic,
    message: 'Topic not configured for revalidation',
    now: Date.now(),
  });
}
