/**
 * Shopify Admin API GraphQL Client
 *
 * Provides a robust client for making GraphQL requests to the Shopify Admin API
 * with automatic retry logic, rate limiting, and error handling.
 */

import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const SHOPIFY_STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
const SHOPIFY_ADMIN_ACCESS_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;

if (!SHOPIFY_STORE_DOMAIN || !SHOPIFY_ADMIN_ACCESS_TOKEN) {
  throw new Error(
    'Missing required environment variables:\n' +
    '  - SHOPIFY_STORE_DOMAIN\n' +
    '  - SHOPIFY_ADMIN_ACCESS_TOKEN\n\n' +
    'Please ensure these are set in your .env.local file.'
  );
}

const ADMIN_API_VERSION = '2024-10';
const ADMIN_API_URL = `https://${SHOPIFY_STORE_DOMAIN}/admin/api/${ADMIN_API_VERSION}/graphql.json`;

interface ShopifyGraphQLResponse<T = unknown> {
  data?: T;
  errors?: Array<{
    message: string;
    locations?: Array<{ line: number; column: number }>;
    path?: string[];
    extensions?: Record<string, unknown>;
  }>;
  extensions?: {
    cost?: {
      requestedQueryCost: number;
      actualQueryCost: number;
      throttleStatus: {
        maximumAvailable: number;
        currentlyAvailable: number;
        restoreRate: number;
      };
    };
  };
}

interface UserError {
  field?: string[];
  message: string;
}

export interface ShopifyMutationResponse<T> {
  data: T;
  userErrors: UserError[];
}

/**
 * Delay execution for specified milliseconds
 */
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Make a GraphQL request to the Shopify Admin API
 *
 * @param query - GraphQL query or mutation string
 * @param variables - Variables for the GraphQL operation
 * @param retries - Number of retry attempts remaining (default: 3)
 * @returns Parsed response data
 */
export async function shopifyAdminRequest<T = unknown>(
  query: string,
  variables?: Record<string, unknown>,
  retries = 3
): Promise<T> {
  try {
    const response = await fetch(ADMIN_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': SHOPIFY_ADMIN_ACCESS_TOKEN!,
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    // Handle rate limiting (429)
    if (response.status === 429) {
      if (retries > 0) {
        const retryAfter = response.headers.get('Retry-After');
        const waitTime = retryAfter ? parseInt(retryAfter) * 1000 : 2000;

        console.warn(`⚠️  Rate limited. Retrying after ${waitTime}ms...`);
        await delay(waitTime);

        return shopifyAdminRequest<T>(query, variables, retries - 1);
      }
      throw new Error('Rate limit exceeded. Maximum retries reached.');
    }

    // Handle other HTTP errors
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `HTTP ${response.status}: ${response.statusText}\n${errorText}`
      );
    }

    const json = (await response.json()) as ShopifyGraphQLResponse<T>;

    // Handle GraphQL errors
    if (json.errors && json.errors.length > 0) {
      const errorMessages = json.errors.map(e => e.message).join('\n');
      throw new Error(`GraphQL Errors:\n${errorMessages}`);
    }

    // Add delay between requests to avoid rate limiting
    await delay(500);

    return json.data as T;
  } catch (error) {
    // Retry on network errors
    if (retries > 0 && error instanceof TypeError) {
      console.warn(`⚠️  Network error. Retrying... (${retries} attempts left)`);
      await delay(1000);
      return shopifyAdminRequest<T>(query, variables, retries - 1);
    }

    throw error;
  }
}

/**
 * Validate that we can connect to the Shopify Admin API
 */
export async function validateConnection(): Promise<boolean> {
  try {
    const query = `
      query {
        shop {
          name
          myshopifyDomain
        }
      }
    `;

    const result = await shopifyAdminRequest<{
      shop: { name: string; myshopifyDomain: string };
    }>(query);

    console.log(`✓ Connected to Shopify store: ${result.shop.name}`);
    return true;
  } catch (error) {
    console.error('✗ Failed to connect to Shopify Admin API:', error);
    return false;
  }
}

/**
 * Get the primary location ID for the store (for inventory tracking)
 */
export async function getLocationId(): Promise<string> {
  const query = `
    query {
      locations(first: 1) {
        edges {
          node {
            id
            name
          }
        }
      }
    }
  `;

  const result = await shopifyAdminRequest<{
    locations: {
      edges: Array<{
        node: { id: string; name: string };
      }>;
    };
  }>(query);

  const locationId = result.locations.edges[0]?.node.id;
  if (!locationId) {
    throw new Error('No location found for store');
  }

  return locationId;
}

/**
 * Create a staged upload target for image upload
 */
export async function createStagedUpload(
  filename: string,
  mimeType: string,
  fileSize: number
): Promise<{
  url: string;
  resourceUrl: string;
  parameters: Array<{ name: string; value: string }>;
}> {
  const query = `
    mutation stagedUploadsCreate($input: [StagedUploadInput!]!) {
      stagedUploadsCreate(input: $input) {
        stagedTargets {
          url
          resourceUrl
          parameters {
            name
            value
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const result = await shopifyAdminRequest<{
    stagedUploadsCreate: {
      stagedTargets: Array<{
        url: string;
        resourceUrl: string;
        parameters: Array<{ name: string; value: string }>;
      }>;
      userErrors: UserError[];
    };
  }>(query, {
    input: [
      {
        filename,
        mimeType,
        resource: 'IMAGE',
        fileSize: fileSize.toString(),
      },
    ],
  });

  if (result.stagedUploadsCreate.userErrors.length > 0) {
    throw new Error(
      `Staged upload failed: ${result.stagedUploadsCreate.userErrors
        .map((e) => e.message)
        .join(', ')}`
    );
  }

  return result.stagedUploadsCreate.stagedTargets[0];
}

/**
 * Upload file to staged upload target
 */
export async function uploadFileToStaged(
  stagedTarget: {
    url: string;
    resourceUrl: string;
    parameters: Array<{ name: string; value: string }>;
  },
  fileBuffer: Buffer,
  filename: string
): Promise<string> {
  const formData = new FormData();

  // Add parameters from staged target
  stagedTarget.parameters.forEach((param) => {
    formData.append(param.name, param.value);
  });

  // Add file
  const blob = new Blob([new Uint8Array(fileBuffer)]);
  formData.append('file', blob, filename);

  const response = await fetch(stagedTarget.url, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Failed to upload file: ${response.statusText}`);
  }

  return stagedTarget.resourceUrl;
}

/**
 * Attach uploaded images to a product
 */
export async function attachImagesToProduct(
  productId: string,
  imageUrls: Array<{ url: string; altText: string }>
): Promise<void> {
  const query = `
    mutation productCreateMedia($media: [CreateMediaInput!]!, $productId: ID!) {
      productCreateMedia(media: $media, productId: $productId) {
        media {
          alt
          mediaContentType
          status
        }
        mediaUserErrors {
          field
          message
        }
      }
    }
  `;

  const result = await shopifyAdminRequest<{
    productCreateMedia: {
      media: unknown[];
      mediaUserErrors: UserError[];
    };
  }>(query, {
    productId,
    media: imageUrls.map((img) => ({
      originalSource: img.url,
      alt: img.altText,
      mediaContentType: 'IMAGE',
    })),
  });

  if (result.productCreateMedia.mediaUserErrors.length > 0) {
    throw new Error(
      `Failed to attach images: ${result.productCreateMedia.mediaUserErrors
        .map((e) => e.message)
        .join(', ')}`
    );
  }
}
