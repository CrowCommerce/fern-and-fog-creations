import {
  HIDDEN_PRODUCT_TAG,
  SHOPIFY_GRAPHQL_API_ENDPOINT,
  TAGS
} from '@/lib/constants';
import { isShopifyError } from '@/lib/type-guards';
import { ensureStartsWith } from '@/lib/utils';
import {
  revalidateTag,
  cacheTag,
  cacheLife
} from 'next/cache';
import { cookies, headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import {
  addToCartMutation,
  createCartMutation,
  editCartItemsMutation,
  removeFromCartMutation
} from './mutations/cart';
import { getCartQuery } from './queries/cart';
import {
  getCollectionProductsQuery,
  getCollectionQuery,
  getCollectionsQuery
} from './queries/collection';
import { getGalleryItemsQuery, getGalleryPageSettingsQuery } from './queries/gallery';
import { getMenuQuery } from './queries/menu';
import { getPageQuery, getPagesQuery } from './queries/page';
import { getContactPageQuery } from './queries/contact';
import { getPageMetadataQuery } from './queries/page-metadata';
import { getPoliciesQuery } from './queries/policies';
import {
  getProductQuery,
  getProductRecommendationsQuery,
  getProductsQuery
} from './queries/product';
import {
  Cart,
  Collection,
  Connection,
  Image,
  Menu,
  Page,
  Policies,
  Product,
  ShopPolicy,
  ShopifyAddToCartOperation,
  ShopifyCart,
  ShopifyCartOperation,
  ShopifyCollection,
  ShopifyCollectionOperation,
  ShopifyCollectionProductsOperation,
  ShopifyCollectionsOperation,
  ShopifyContactPageOperation,
  ShopifyCreateCartOperation,
  ShopifyGalleryItemsOperation,
  ShopifyMenuOperation,
  ShopifyMetaobject,
  ShopifyPageOperation,
  ShopifyPagesOperation,
  ShopifyPageMetadataOperation,
  ShopifyPoliciesOperation,
  ShopifyProduct,
  ShopifyProductOperation,
  ShopifyProductRecommendationsOperation,
  ShopifyProductsOperation,
  ShopifyRemoveFromCartOperation,
  ShopifyUpdateCartOperation,
  ShopifyGalleryPageSettingsOperation
} from './types';
import type { GalleryItem, GalleryCategory, GalleryPageSettings } from '@/types/gallery';
import type { PageMetadata } from '@/types/metadata';
import type { ContactPage } from '@/types/contact';
import { extractField, extractOptionalField } from './utils';

const domain = process.env.SHOPIFY_STORE_DOMAIN
  ? ensureStartsWith(process.env.SHOPIFY_STORE_DOMAIN, 'https://')
  : '';
const endpoint = `${domain}${SHOPIFY_GRAPHQL_API_ENDPOINT}`;
const key = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN!;

type ExtractVariables<T> = T extends { variables: object }
  ? T['variables']
  : never;

export async function shopifyFetch<T>({
  headers,
  query,
  variables
}: {
  headers?: HeadersInit;
  query: string;
  variables?: ExtractVariables<T>;
}): Promise<{ status: number; body: T } | never> {
  try {
    const result = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': key,
        ...headers
      },
      body: JSON.stringify({
        ...(query && { query }),
        ...(variables && { variables })
      })
    });

    const body = await result.json();

    if (body.errors) {
      throw body.errors[0];
    }

    return {
      status: result.status,
      body
    };
  } catch (e) {
    if (isShopifyError(e)) {
      throw {
        cause: e.cause?.toString() || 'unknown',
        status: e.status || 500,
        message: e.message,
        query
      };
    }

    throw {
      error: e,
      query
    };
  }
}

const removeEdgesAndNodes = <T>(array: Connection<T>): T[] => {
  return array.edges.map((edge) => edge?.node);
};

const reshapeCart = (cart: ShopifyCart): Cart => {
  if (!cart.cost?.totalTaxAmount) {
    cart.cost.totalTaxAmount = {
      amount: '0.0',
      currencyCode: cart.cost.totalAmount.currencyCode
    };
  }

  return {
    ...cart,
    lines: removeEdgesAndNodes(cart.lines)
  };
};

const reshapeCollection = (
  collection: ShopifyCollection
): Collection | undefined => {
  if (!collection) {
    return undefined;
  }

  return {
    ...collection,
    path: `/search/${collection.handle}`
  };
};

const reshapeCollections = (collections: ShopifyCollection[]) => {
  const reshapedCollections = [];

  for (const collection of collections) {
    if (collection) {
      const reshapedCollection = reshapeCollection(collection);

      if (reshapedCollection) {
        reshapedCollections.push(reshapedCollection);
      }
    }
  }

  return reshapedCollections;
};

const reshapeImages = (images: Connection<Image>, productTitle: string) => {
  const flattened = removeEdgesAndNodes(images);

  return flattened.map((image) => {
    const filename = image.url.match(/.*\/(.*)\..*/)?.[1];
    return {
      ...image,
      altText: image.altText || `${productTitle} - ${filename}`
    };
  });
};

const reshapeProduct = (
  product: ShopifyProduct,
  filterHiddenProducts: boolean = true
) => {
  if (
    !product ||
    (filterHiddenProducts && product.tags.includes(HIDDEN_PRODUCT_TAG))
  ) {
    return undefined;
  }

  const { images, variants, ...rest } = product;

  return {
    ...rest,
    images: reshapeImages(images, product.title),
    variants: removeEdgesAndNodes(variants)
  };
};

const reshapeProducts = (products: ShopifyProduct[]) => {
  const reshapedProducts = [];

  for (const product of products) {
    if (product) {
      const reshapedProduct = reshapeProduct(product);

      if (reshapedProduct) {
        reshapedProducts.push(reshapedProduct);
      }
    }
  }

  return reshapedProducts;
};

export async function createCart(): Promise<Cart> {
  const res = await shopifyFetch<ShopifyCreateCartOperation>({
    query: createCartMutation
  });

  return reshapeCart(res.body.data.cartCreate.cart);
}

export async function addToCart(
  lines: { merchandiseId: string; quantity: number }[]
): Promise<Cart> {
  const cartId = (await cookies()).get('cartId')?.value;
  if (!cartId) {
    throw new Error('No cart ID found');
  }
  const res = await shopifyFetch<ShopifyAddToCartOperation>({
    query: addToCartMutation,
    variables: {
      cartId,
      lines
    }
  });
  return reshapeCart(res.body.data.cartLinesAdd.cart);
}

export async function removeFromCart(lineIds: string[]): Promise<Cart> {
  const cartId = (await cookies()).get('cartId')?.value;
  if (!cartId) {
    throw new Error('No cart ID found');
  }
  const res = await shopifyFetch<ShopifyRemoveFromCartOperation>({
    query: removeFromCartMutation,
    variables: {
      cartId,
      lineIds
    }
  });

  return reshapeCart(res.body.data.cartLinesRemove.cart);
}

export async function updateCart(
  lines: { id: string; merchandiseId: string; quantity: number }[]
): Promise<Cart> {
  const cartId = (await cookies()).get('cartId')?.value;
  if (!cartId) {
    throw new Error('No cart ID found');
  }
  const res = await shopifyFetch<ShopifyUpdateCartOperation>({
    query: editCartItemsMutation,
    variables: {
      cartId,
      lines
    }
  });

  return reshapeCart(res.body.data.cartLinesUpdate.cart);
}

export async function getCart(): Promise<Cart | undefined> {
  const cartId = (await cookies()).get('cartId')?.value;

  if (!cartId) {
    return undefined;
  }

  const res = await shopifyFetch<ShopifyCartOperation>({
    query: getCartQuery,
    variables: { cartId }
  });

  // Old carts becomes `null` when you checkout.
  if (!res.body.data.cart) {
    return undefined;
  }

  return reshapeCart(res.body.data.cart);
}

export async function getCollection(
  handle: string
): Promise<Collection | undefined> {
  'use cache';
  cacheTag(TAGS.collections);
  cacheLife('days');

  const res = await shopifyFetch<ShopifyCollectionOperation>({
    query: getCollectionQuery,
    variables: {
      handle
    }
  });

  return reshapeCollection(res.body.data.collection);
}

export async function getCollectionProducts({
  collection,
  reverse,
  sortKey
}: {
  collection: string;
  reverse?: boolean;
  sortKey?: string;
}): Promise<Product[]> {
  'use cache';
  cacheTag(TAGS.collections, TAGS.products);
  cacheLife('days');

  const res = await shopifyFetch<ShopifyCollectionProductsOperation>({
    query: getCollectionProductsQuery,
    variables: {
      handle: collection,
      reverse,
      sortKey: sortKey === 'CREATED_AT' ? 'CREATED' : sortKey
    }
  });

  if (!res.body.data.collection) {
    console.log(`No collection found for \`${collection}\``);
    return [];
  }

  return reshapeProducts(
    removeEdgesAndNodes(res.body.data.collection.products)
  );
}

export async function getCollections(): Promise<Collection[]> {
  'use cache';
  cacheTag(TAGS.collections);
  cacheLife('days');

  const res = await shopifyFetch<ShopifyCollectionsOperation>({
    query: getCollectionsQuery
  });
  const shopifyCollections = removeEdgesAndNodes(res.body?.data?.collections);
  const collections = [
    {
      handle: '',
      title: 'All',
      description: 'All products',
      seo: {
        title: 'All',
        description: 'All products'
      },
      path: '/products',
      updatedAt: new Date().toISOString()
    },
    // Filter out the `hidden` collections.
    // Collections that start with `hidden-*` need to be hidden on the search page.
    ...reshapeCollections(shopifyCollections).filter(
      (collection) => !collection.handle.startsWith('hidden')
    )
  ];

  return collections;
}

export async function getMenu(handle: string): Promise<Menu[]> {
  'use cache';
  cacheTag(TAGS.menus);
  cacheLife('days');

  const res = await shopifyFetch<ShopifyMenuOperation>({
    query: getMenuQuery,
    variables: {
      handle
    }
  });

  if (!res.body?.data?.menu) {
    console.warn(`Menu not found for handle: ${handle}`);
    return [];
  }

  const items = res.body.data.menu.items || [];

  return items.map((item: { title: string; url: string }) => {
    try {
      // Parse the URL to extract pathname
      const url = new URL(item.url);
      let path = url.pathname;

      // Apply path transformations for Next.js routing
      path = path.replace('/collections', '/search');
      path = path.replace('/pages', '');

      return {
        title: item.title,
        path
      };
    } catch (e) {
      // If URL parsing fails (relative URL), use as-is
      return {
        title: item.title,
        path: item.url
      };
    }
  });
}

export async function getPage(handle: string): Promise<Page> {
  const res = await shopifyFetch<ShopifyPageOperation>({
    query: getPageQuery,
    variables: { handle }
  });

  return res.body.data.pageByHandle;
}

export async function getPages(): Promise<Page[]> {
  const res = await shopifyFetch<ShopifyPagesOperation>({
    query: getPagesQuery
  });

  return removeEdgesAndNodes(res.body.data.pages);
}

export async function getPageMetadata(slug: string): Promise<PageMetadata> {
  'use cache';
  cacheTag(TAGS.metadata);
  cacheLife('days');

  const res = await shopifyFetch<ShopifyPageMetadataOperation>({
    query: getPageMetadataQuery,
    variables: {
      type: 'page_metadata',
      first: 250 // Fetch all metadata entries
    }
  });

  // Find the metadata entry for this specific page slug
  const allMetadata = res.body.data?.metaobjects?.nodes || [];
  const metaobject = allMetadata.find((node) => {
    const slugField = node.fields.find((f) => f.key === 'page_slug');
    return slugField?.value === slug;
  });

  // Fallback to defaults if not found
  if (!metaobject) {
    console.warn(`Page metadata not found for: ${slug}, using defaults`);
    return {
      title: 'Fern & Fog Creations',
      description: 'Handmade coastal crafts with love',
      robotsIndex: true,
      robotsFollow: true,
    };
  }

  // Helper to get field value by key
  const getField = (key: string): string => {
    const field = metaobject.fields.find((f) => f.key === key);
    return field?.value || '';
  };

  return {
    title: getField('title'),
    description: getField('description'),
    ogImageUrl: getField('og_image_url') || undefined,
    keywords: getField('keywords') || undefined,
    robotsIndex: getField('robots_index') !== 'false',
    robotsFollow: getField('robots_follow') !== 'false',
  };
}

export async function getContactPage(): Promise<ContactPage> {
  'use cache';
  cacheTag(TAGS.contactPage);
  cacheLife('days');

  const res = await shopifyFetch<ShopifyContactPageOperation>({
    query: getContactPageQuery,
  });

  const metaobject = res.body.data?.metaobjects?.nodes?.[0];

  // Fallback to defaults if not found
  if (!metaobject) {
    console.warn('Contact page metaobject not found, using defaults');
    return {
      heading: 'Get in Touch',
      description: "I'd love to hear from you. Whether you have a question about a piece, want to commission something custom, or just want to say hello.",
      responseTime: 'I typically respond within 1-2 business days. Thank you for your patience!',
    };
  }

  return {
    heading: extractField(metaobject, 'heading'),
    description: extractField(metaobject, 'description'),
    emailDisplay: extractOptionalField(metaobject, 'email_display'),
    phoneDisplay: extractOptionalField(metaobject, 'phone_display'),
    businessHours: extractOptionalField(metaobject, 'business_hours'),
    responseTime: extractOptionalField(metaobject, 'response_time'),
  };
}

export async function getPolicies(): Promise<Policies> {
  'use cache';
  cacheTag(TAGS.collections);
  cacheLife('days');

  const res = await shopifyFetch<ShopifyPoliciesOperation>({
    query: getPoliciesQuery
  });

  return res.body.data.shop;
}

export async function getPolicy(
  type: 'privacy' | 'refund' | 'shipping' | 'terms'
): Promise<ShopPolicy | null> {
  'use cache';
  cacheTag(TAGS.collections);
  cacheLife('days');

  const policies = await getPolicies();

  const policyMap: Record<string, ShopPolicy | null> = {
    privacy: policies.privacyPolicy,
    refund: policies.refundPolicy,
    shipping: policies.shippingPolicy,
    terms: policies.termsOfService
  };

  return policyMap[type] || null;
}

export async function getProduct(handle: string): Promise<Product | undefined> {
  'use cache';
  cacheTag(TAGS.products);
  cacheLife('days');

  const res = await shopifyFetch<ShopifyProductOperation>({
    query: getProductQuery,
    variables: {
      handle
    }
  });

  return reshapeProduct(res.body.data.product, false);
}

export async function getProductRecommendations(
  productId: string
): Promise<Product[]> {
  'use cache';
  cacheTag(TAGS.products);
  cacheLife('days');

  const res = await shopifyFetch<ShopifyProductRecommendationsOperation>({
    query: getProductRecommendationsQuery,
    variables: {
      productId
    }
  });

  return reshapeProducts(res.body.data.productRecommendations);
}

export async function getProducts({
  query,
  reverse,
  sortKey
}: {
  query?: string;
  reverse?: boolean;
  sortKey?: string;
}): Promise<Product[]> {
  'use cache';
  cacheTag(TAGS.products);
  cacheLife('days');

  const res = await shopifyFetch<ShopifyProductsOperation>({
    query: getProductsQuery,
    variables: {
      query,
      reverse,
      sortKey
    }
  });

  return reshapeProducts(removeEdgesAndNodes(res.body.data.products));
}

// ----- Gallery Items Functions -----

const reshapeGalleryItem = (metaobject: ShopifyMetaobject): GalleryItem | null => {
  // Helper to get field value by key
  const getField = (key: string): string => {
    const field = metaobject.fields.find((f) => f.key === key);
    return field?.value || '';
  };

  // Helper to get image URL from reference field
  const getImageField = (key: string): string => {
    const field = metaobject.fields.find((f) => f.key === key);
    return field?.reference?.image?.url || '';
  };

  // Helper to get metaobject reference field
  const getMetaobjectReference = (key: string) => {
    const field = metaobject.fields.find((f) => f.key === key);
    if (!field?.reference?.id || !field?.reference?.fields) {
      return null;
    }
    return field.reference;
  };

  // Parse materials from JSON string or comma-separated string
  const materialsString = getField('materials');
  let materials: string[] = [];

  if (materialsString) {
    try {
      // Try parsing as JSON array first (e.g., '["Sea glass","Copper wire"]')
      materials = JSON.parse(materialsString);
    } catch {
      // Fallback to comma-separated (e.g., 'Sea glass, Copper wire')
      materials = materialsString.split(',').map((m) => m.trim()).filter(Boolean);
    }
  }

  // Extract category metaobject reference (required)
  const categoryRef = getMetaobjectReference('category');
  if (!categoryRef || !categoryRef.fields) {
    console.warn(`No category reference found for gallery item ${metaobject.id}`);
    return null;
  }

  // Helper to get value from metaobject reference fields
  const getCategoryField = (key: string): string => {
    const field = categoryRef.fields?.find((f) => f.key === key);
    return field?.value || '';
  };

  // Build category object from metaobject reference
  const category: GalleryCategory = {
    id: categoryRef.id || '',
    name: getCategoryField('name'),
    slug: getCategoryField('slug'),
    description: getCategoryField('description'),
    sortOrder: getCategoryField('sort_order') ? parseInt(getCategoryField('sort_order')) : undefined,
  };

  // Validate category has required fields
  if (!category.name || !category.slug) {
    console.warn(`Invalid category reference for gallery item ${metaobject.id}`);
    return null;
  }

  const image = getImageField('image');
  if (!image) {
    console.warn(`No image found for gallery item ${metaobject.id}`);
    return null;
  }

  return {
    id: metaobject.id,
    title: getField('title'),
    category,
    image,
    materials,
    story: getField('story'),
    forSale: false,
    createdDate: getField('created_date'),
  };
};

const reshapeGalleryItems = (metaobjects: ShopifyMetaobject[]): GalleryItem[] => {
  return metaobjects
    .map(reshapeGalleryItem)
    .filter((item): item is GalleryItem => item !== null);
};

export async function getGalleryItems(): Promise<GalleryItem[]> {
  // TEMP: Disable cache for debugging
  // 'use cache';
  // cacheTag(TAGS.gallery);
  // cacheLife('days');

  const res = await shopifyFetch<ShopifyGalleryItemsOperation>({
    query: getGalleryItemsQuery,
    variables: {
      first: 100 // Fetch up to 100 gallery items
    }
  });

  // Add null safety to prevent crashes if Shopify returns unexpected data
  if (!res.body.data?.metaobjects?.nodes) {
    console.error('Gallery items query returned invalid data structure:', res.body);
    return [];
  }

  return reshapeGalleryItems(res.body.data.metaobjects.nodes);
}

export async function getGalleryPageSettings(): Promise<GalleryPageSettings> {
  // TEMP: Disable cache for debugging
  // 'use cache';
  // cacheTag(TAGS.gallery);
  // cacheLife('days');

  const res = await shopifyFetch<ShopifyGalleryPageSettingsOperation>({
    query: getGalleryPageSettingsQuery,
  });

  // Add null safety to prevent crashes if Shopify returns unexpected data
  // Note: Query returns array of nodes, we take the first one (should only be one entry)
  const metaobject = res.body.data?.metaobjects?.nodes?.[0];

  // Fallback to defaults if not configured
  if (!metaobject) {
    console.warn('Gallery page settings not found, using defaults');
    return {
      heading: 'Gallery of Past Work',
      description:
        'A collection of treasures that have found their homes. Each piece represents a moment in time, a story preserved in natural materials.',
    };
  }

  // Helper to get field value by key
  const getField = (key: string): string => {
    const field = metaobject.fields.find((f) => f.key === key);
    return field?.value || '';
  };

  return {
    heading: getField('heading') || 'Gallery of Past Work',
    description:
      getField('description') ||
      'A collection of treasures that have found their homes.',
  };
}

// This is called from `app/api/revalidate.ts` so providers can control revalidation logic.
export async function revalidate(req: NextRequest): Promise<NextResponse> {
  // We always need to respond with a 200 status code to Shopify,
  // otherwise it will continue to retry the request.
  const collectionWebhooks = [
    'collections/create',
    'collections/delete',
    'collections/update'
  ];
  const productWebhooks = [
    'products/create',
    'products/delete',
    'products/update'
  ];
  const topic = (await headers()).get('x-shopify-topic') || 'unknown';
  const secret = req.nextUrl.searchParams.get('secret');
  const isCollectionUpdate = collectionWebhooks.includes(topic);
  const isProductUpdate = productWebhooks.includes(topic);

  if (!secret || secret !== process.env.SHOPIFY_REVALIDATION_SECRET) {
    console.error('Invalid revalidation secret.');
    return NextResponse.json({ status: 401 });
  }

  if (!isCollectionUpdate && !isProductUpdate) {
    // We don't need to revalidate anything for any other topics.
    return NextResponse.json({ status: 200 });
  }

  if (isCollectionUpdate) {
    revalidateTag(TAGS.collections, 'max');
  }

  if (isProductUpdate) {
    revalidateTag(TAGS.products, 'max');
  }

  return NextResponse.json({ status: 200, revalidated: true, now: Date.now() });
}
