#!/usr/bin/env tsx

/**
 * Product Migration Script for Shopify
 *
 * Migrates stock product data from data/products.ts to Shopify store.
 *
 * Features:
 * - Auto-creates collections (earrings, resin, driftwood, wall-hangings)
 * - Migrates all 16 products with variants
 * - Uploads images to Shopify CDN via staged upload API
 * - Sets inventory tracking with configurable quantities
 * - Updates existing products (upsert pattern)
 * - Supports dry-run mode for safe testing
 *
 * Usage:
 *   pnpm migrate:products          # Run migration
 *   pnpm migrate:products:dry      # Dry-run mode
 */

import * as fs from 'fs';
import * as path from 'path';
import {
  validateConnection,
  shopifyAdminRequest,
  getLocationId,
  createStagedUpload,
  uploadFileToStaged,
  attachImagesToProduct,
} from './lib/shopify-admin.js';
import { products, categories } from '../data/products.js';
import type { Product } from '../data/products.js';

// ============================================================================
// Configuration
// ============================================================================

const DRY_RUN = process.argv.includes('--dry-run');
const DEFAULT_INVENTORY_QUANTITY = 10;

// ============================================================================
// Type Definitions
// ============================================================================

interface UserError {
  field?: string[];
  message: string;
}

interface CollectionResult {
  id: string;
  handle: string;
  title: string;
}

interface ProductResult {
  id: string;
  handle: string;
  title: string;
}

// ============================================================================
// Collection Management
// ============================================================================

/**
 * Check if a collection exists by handle
 */
async function getCollectionByHandle(handle: string): Promise<CollectionResult | null> {
  const query = `
    query getCollection($handle: String!) {
      collectionByHandle(handle: $handle) {
        id
        handle
        title
      }
    }
  `;

  const result = await shopifyAdminRequest<{
    collectionByHandle: CollectionResult | null;
  }>(query, { handle });

  return result.collectionByHandle;
}

/**
 * Create a collection
 */
async function createCollection(handle: string, title: string, description: string): Promise<CollectionResult> {
  const query = `
    mutation collectionCreate($input: CollectionInput!) {
      collectionCreate(input: $input) {
        collection {
          id
          handle
          title
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const result = await shopifyAdminRequest<{
    collectionCreate: {
      collection: CollectionResult;
      userErrors: UserError[];
    };
  }>(query, {
    input: {
      handle,
      title,
      descriptionHtml: description,
    },
  });

  if (result.collectionCreate.userErrors.length > 0) {
    throw new Error(
      `Failed to create collection: ${result.collectionCreate.userErrors.map((e) => e.message).join(', ')}`
    );
  }

  return result.collectionCreate.collection;
}

/**
 * Ensure collection exists (create if not exists)
 */
async function ensureCollection(handle: string, title: string, description: string): Promise<CollectionResult> {
  console.log(`\n📦 Collection: ${title} (${handle})`);

  if (DRY_RUN) {
    console.log(`   📝 [DRY RUN] Would check/create collection`);
    return { id: `dry-run-collection-${handle}`, handle, title };
  }

  // Check if collection exists
  const existing = await getCollectionByHandle(handle);

  if (existing) {
    console.log(`   ✓ Collection already exists: ${existing.id}`);
    return existing;
  }

  // Create collection
  console.log(`   Creating new collection...`);
  const collection = await createCollection(handle, title, description);
  console.log(`   ✅ Created collection: ${collection.id}`);

  return collection;
}

// ============================================================================
// Product Management
// ============================================================================

/**
 * Get MIME type from file path
 */
function getMimeType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  const mimeTypes: Record<string, string> = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
  };
  return mimeTypes[ext] || 'image/jpeg';
}

/**
 * Upload product images to Shopify CDN
 */
async function uploadProductImages(product: Product): Promise<Array<{ url: string; altText: string }>> {
  const uploadedImages: Array<{ url: string; altText: string }> = [];

  for (const imagePath of product.images) {
    // Convert public URL path to filesystem path
    const fsPath = path.join(process.cwd(), 'public', imagePath.replace('/stock-assets/', 'stock-assets/'));

    // Check if file exists
    if (!fs.existsSync(fsPath)) {
      console.log(`   ⚠️  Image not found: ${fsPath} - skipping`);
      continue;
    }

    const filename = path.basename(imagePath);
    const fileBuffer = fs.readFileSync(fsPath);
    const fileSize = fileBuffer.length;
    const mimeType = getMimeType(fsPath);

    console.log(`   📸 Uploading: ${filename}`);

    // Create staged upload
    const stagedTarget = await createStagedUpload(filename, mimeType, fileSize);

    // Upload to CDN
    const resourceUrl = await uploadFileToStaged(stagedTarget, fileBuffer, filename);

    uploadedImages.push({
      url: resourceUrl,
      altText: `${product.name} - ${filename}`,
    });

    console.log(`   ✓ Uploaded: ${filename}`);
  }

  return uploadedImages;
}

/**
 * Check if product exists by handle
 */
async function getProductByHandle(handle: string): Promise<ProductResult | null> {
  const query = `
    query getProduct($handle: String!) {
      productByHandle(handle: $handle) {
        id
        handle
        title
      }
    }
  `;

  const result = await shopifyAdminRequest<{
    productByHandle: ProductResult | null;
  }>(query, { handle });

  return result.productByHandle;
}

/**
 * Create or update a product
 * Returns product result and variant data for separate variant creation
 */
async function upsertProduct(
  product: Product,
  collectionId: string,
  locationId: string
): Promise<{
  product: ProductResult;
  variantData: Array<{
    price: string;
    sku?: string;
    inventoryQuantities: Array<{ availableQuantity: number; locationId: string }>;
    inventoryPolicy: string;
    selectedOptions: Array<{ name: string; value: string }>;
  }> | null;
}> {
  // Check if product exists
  const existing = await getProductByHandle(product.slug);
  const isUpdate = !!existing;

  console.log(`   ${isUpdate ? 'Updating' : 'Creating'} product...`);

  // Build tags from materials and metadata
  const tags = [
    ...product.materials.map((m) => `material:${m}`),
    product.featured ? 'featured' : null,
    `category:${product.category}`,
  ].filter(Boolean) as string[];

  // Build variants
  const variants = product.variants
    ? product.variants.map((variant) => ({
        price: variant.price.toString(),
        sku: variant.sku || undefined,
        inventoryQuantities: [
          {
            availableQuantity: variant.quantityAvailable || DEFAULT_INVENTORY_QUANTITY,
            locationId,
          },
        ],
        inventoryPolicy: 'DENY', // Don't allow overselling
        // Keep full selectedOptions for variant creation (includes name + value)
        selectedOptions: variant.selectedOptions,
      }))
    : [
        {
          price: product.price.toString(),
          inventoryQuantities: [
            {
              availableQuantity: DEFAULT_INVENTORY_QUANTITY,
              locationId,
            },
          ],
          inventoryPolicy: 'DENY',
        },
      ];

  // Build product options
  const options = product.options
    ? product.options.map((opt) => ({
        name: opt.name,
        values: opt.values.map((val) => ({ name: val })),
      }))
    : undefined;

  // Build product input (NOTE: variants are created separately in API 2024-10)
  const productInput: Record<string, unknown> = {
    title: product.name,
    descriptionHtml: `<p>${product.description}</p>${product.story ? `<p><em>${product.story}</em></p>` : ''}`,
    productType: product.category,
    tags,
    status: product.forSale ? 'ACTIVE' : 'DRAFT',
    ...(isUpdate ? { id: existing.id } : { handle: product.slug }),
    // Note: 'variants' field removed - not supported in ProductInput for API 2024-10
    // Variants will be created separately using productVariantsBulkCreate
    // Note: productOptions can only be set during CREATE, not UPDATE
    ...(!isUpdate && options ? { productOptions: options } : {}),
    collectionsToJoin: [collectionId],
  };

  const mutation = isUpdate
    ? `
        mutation productUpdate($input: ProductInput!) {
          productUpdate(input: $input) {
            product {
              id
              handle
              title
            }
            userErrors {
              field
              message
            }
          }
        }
      `
    : `
        mutation productCreate($input: ProductInput!) {
          productCreate(input: $input) {
            product {
              id
              handle
              title
            }
            userErrors {
              field
              message
            }
          }
        }
      `;

  const result = await shopifyAdminRequest<{
    productCreate?: { product: ProductResult; userErrors: UserError[] };
    productUpdate?: { product: ProductResult; userErrors: UserError[] };
  }>(mutation, { input: productInput });

  const response = isUpdate ? result.productUpdate : result.productCreate;

  if (!response) {
    throw new Error('No response from product mutation');
  }

  if (response.userErrors.length > 0) {
    throw new Error(`Failed to ${isUpdate ? 'update' : 'create'} product: ${response.userErrors.map((e) => e.message).join(', ')}`);
  }

  console.log(`   ✅ ${isUpdate ? 'Updated' : 'Created'} product: ${response.product.id}`);

  // Return product and variant data for separate variant creation
  return {
    product: response.product,
    variantData: product.variants && product.variants.length > 0 ? variants : null,
  };
}

/**
 * Get product's default variant ID (created automatically by Shopify)
 */
async function getDefaultVariantId(productId: string): Promise<string | null> {
  const query = `
    query getProduct($id: ID!) {
      product(id: $id) {
        variants(first: 1) {
          edges {
            node {
              id
            }
          }
        }
      }
    }
  `;

  const result = await shopifyAdminRequest<{
    product: {
      variants: {
        edges: Array<{ node: { id: string } }>;
      };
    };
  }>(query, { id: productId });

  return result.product.variants.edges[0]?.node.id || null;
}

/**
 * Delete the default variant created by Shopify
 */
async function deleteDefaultVariant(productId: string, variantId: string): Promise<void> {
  const mutation = `
    mutation productVariantsBulkDelete($productId: ID!, $variantsIds: [ID!]!) {
      productVariantsBulkDelete(productId: $productId, variantsIds: $variantsIds) {
        product {
          id
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const result = await shopifyAdminRequest<{
    productVariantsBulkDelete: {
      product?: { id: string };
      userErrors: UserError[];
    };
  }>(mutation, { productId, variantsIds: [variantId] });

  if (result.productVariantsBulkDelete.userErrors.length > 0) {
    throw new Error(
      `Failed to delete default variant: ${result.productVariantsBulkDelete.userErrors
        .map((e) => e.message)
        .join(', ')}`
    );
  }
}

/**
 * Create product variants using productVariantsBulkCreate
 * (Required for API 2024-10 - variants cannot be created with product)
 */
async function createProductVariants(
  productId: string,
  variantData: Array<{
    price: string;
    sku?: string;
    inventoryQuantities: Array<{ availableQuantity: number; locationId: string }>;
    inventoryPolicy: string;
    selectedOptions: Array<{ name: string; value: string }>;
  }>
): Promise<void> {
  // Step 1: Delete the default variant created by Shopify
  // (When a product is created with options, Shopify auto-creates a default variant)
  const defaultVariantId = await getDefaultVariantId(productId);
  if (defaultVariantId) {
    console.log(`   Deleting default variant...`);
    await deleteDefaultVariant(productId, defaultVariantId);
  }

  // Step 2: Create all custom variants
  const mutation = `
    mutation productVariantsBulkCreate($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
      productVariantsBulkCreate(productId: $productId, variants: $variants) {
        productVariants {
          id
          title
          price
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  // Transform variant data to match ProductVariantsBulkInput
  const variants = variantData.map((variant) => ({
    price: variant.price,
    // Note: sku is nested inside inventoryItem, not at root level
    inventoryItem: {
      tracked: true,
      sku: variant.sku || undefined,
    },
    inventoryQuantities: variant.inventoryQuantities,
    // Map selectedOptions to optionValues with proper name/value structure
    optionValues: variant.selectedOptions.map((opt) => ({
      optionName: opt.name, // e.g., "Color", "Size"
      name: opt.value,      // e.g., "Seafoam", "Small"
    })),
  }));

  const result = await shopifyAdminRequest<{
    productVariantsBulkCreate: {
      productVariants: Array<{ id: string; title: string; price: string }>;
      userErrors: UserError[];
    };
  }>(mutation, {
    productId,
    variants,
  });

  if (result.productVariantsBulkCreate.userErrors.length > 0) {
    throw new Error(
      `Failed to create variants: ${result.productVariantsBulkCreate.userErrors
        .map((e) => e.message)
        .join(', ')}`
    );
  }

  console.log(`   ✅ Created ${result.productVariantsBulkCreate.productVariants.length} variants`);
}

/**
 * Migrate a single product
 */
async function migrateProduct(
  product: Product,
  collectionId: string,
  locationId: string,
  stats: { created: number; updated: number; errors: number; imagesUploaded: number }
): Promise<void> {
  console.log(`\n📦 Product: ${product.name} (${product.slug})`);

  if (DRY_RUN) {
    console.log(`   📝 [DRY RUN] Would migrate product with ${product.images.length} images`);
    if (product.variants) {
      console.log(`   📝 [DRY RUN] Product has ${product.variants.length} variants`);
    }
    stats.created++;
    return;
  }

  try {
    // Check if product exists
    const existing = await getProductByHandle(product.slug);
    const isUpdate = !!existing;

    // Create/update product (returns product + variant data)
    const { product: createdProduct, variantData } = await upsertProduct(
      product,
      collectionId,
      locationId
    );

    if (isUpdate) {
      stats.updated++;
    } else {
      stats.created++;
    }

    // Create variants separately (required for API 2024-10)
    if (variantData && variantData.length > 0) {
      console.log(`   Creating ${variantData.length} variants...`);
      await createProductVariants(createdProduct.id, variantData);
    }

    // Upload images to Shopify CDN
    if (product.images.length > 0) {
      console.log(`   Uploading ${product.images.length} images...`);
      const uploadedImages = await uploadProductImages(product);

      if (uploadedImages.length > 0) {
        // Attach images to product
        await attachImagesToProduct(createdProduct.id, uploadedImages);
        console.log(`   ✅ Attached ${uploadedImages.length} images`);
        stats.imagesUploaded += uploadedImages.length;
      }
    }

    console.log(`   ✅ Migration complete for ${product.name}`);
  } catch (error) {
    console.error(`   ❌ Failed to migrate ${product.name}:`, error);
    stats.errors++;
  }
}

// ============================================================================
// Main Migration Flow
// ============================================================================

async function main() {
  console.log('🚀 Shopify Product Migration\n');
  console.log('='.repeat(60));

  if (DRY_RUN) {
    console.log('📝 DRY RUN MODE - No changes will be made to Shopify');
    console.log('='.repeat(60));
  }

  const stats = {
    collectionsCreated: 0,
    created: 0,
    updated: 0,
    errors: 0,
    imagesUploaded: 0,
  };

  try {
    // Step 1: Validate connection
    console.log('\n🔍 Step 1: Validating Shopify connection...');
    if (!DRY_RUN) {
      const connected = await validateConnection();
      if (!connected) {
        throw new Error('Failed to connect to Shopify');
      }
    } else {
      console.log('   📝 [DRY RUN] Skipping connection validation');
    }

    // Step 2: Get location ID for inventory
    console.log('\n🔍 Step 2: Fetching store location...');
    const locationId = DRY_RUN ? 'dry-run-location-id' : await getLocationId();
    console.log(`   ✓ Location ID: ${locationId}`);

    // Step 3: Create/verify collections
    console.log('\n🔍 Step 3: Setting up collections...');
    const collectionMap: Record<string, CollectionResult> = {};

    for (const category of categories) {
      const collection = await ensureCollection(
        category.slug,
        category.name,
        category.description
      );
      collectionMap[category.slug] = collection;

      if (!DRY_RUN) {
        const existing = await getCollectionByHandle(category.slug);
        if (!existing) {
          stats.collectionsCreated++;
        }
      }
    }

    // Step 4: Migrate products
    console.log('\n🔍 Step 4: Migrating products...');
    console.log(`   Total products to migrate: ${products.length}`);

    for (const product of products) {
      const collectionId = collectionMap[product.category]?.id;

      if (!collectionId) {
        console.error(`   ❌ No collection found for category: ${product.category}`);
        stats.errors++;
        continue;
      }

      await migrateProduct(product, collectionId, locationId, stats);
    }

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 Migration Summary:');
    console.log('='.repeat(60));
    console.log(`   Collections: ${categories.length} processed`);
    console.log(`   Products Created: ${stats.created}`);
    console.log(`   Products Updated: ${stats.updated}`);
    console.log(`   Images Uploaded: ${stats.imagesUploaded}`);
    console.log(`   Errors: ${stats.errors}`);
    console.log('='.repeat(60));

    if (DRY_RUN) {
      console.log('\n📝 DRY RUN complete - Run without --dry-run to apply changes');
    } else {
      console.log('\n✅ Migration complete!');
    }
  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run migration
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('\n❌ Unexpected error:', error);
    process.exit(1);
  });
