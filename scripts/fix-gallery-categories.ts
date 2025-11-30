#!/usr/bin/env tsx

/**
 * Emergency Gallery Category Fix Script
 *
 * This script fixes gallery items that lost their category references during
 * the failed migration. It uses the original data/gallery.ts file to map
 * items to the correct categories.
 *
 * Usage:
 *   pnpm fix:gallery:categories
 */

import { validateConnection, shopifyAdminRequest } from './lib/shopify-admin.js';
import { galleryItems } from '../data/gallery.js';

interface MetaobjectUpdateResponse {
  metaobjectUpdate: {
    metaobject?: {
      id: string;
    };
    userErrors: Array<{ field?: string[]; message: string }>;
  };
}

interface GalleryItemsQueryResponse {
  metaobjects: {
    nodes: Array<{
      id: string;
      handle: string;
    }>;
  };
}

/**
 * Valid category slugs for gallery items
 */
const VALID_CATEGORIES = ['earrings', 'resin', 'driftwood', 'wall-hangings'] as const;

/**
 * Get all gallery items from Shopify
 */
async function getGalleryItems(): Promise<Array<{ id: string; handle: string }>> {
  const query = `
    query {
      metaobjects(type: "gallery_item", first: 100) {
        nodes {
          id
          handle
        }
      }
    }
  `;

  const result = await shopifyAdminRequest<GalleryItemsQueryResponse>(query);
  return result.metaobjects.nodes;
}

/**
 * Update gallery item with category value (as text, not reference)
 */
async function updateGalleryItemCategory(itemId: string, categorySlug: string): Promise<void> {
  const mutation = `
    mutation metaobjectUpdate($id: ID!, $metaobject: MetaobjectUpdateInput!) {
      metaobjectUpdate(id: $id, metaobject: $metaobject) {
        metaobject {
          id
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const variables = {
    id: itemId,
    metaobject: {
      fields: [{ key: 'category', value: categorySlug }],
    },
  };

  const result = await shopifyAdminRequest<MetaobjectUpdateResponse>(mutation, variables);

  if (result.metaobjectUpdate.userErrors.length > 0) {
    const errors = result.metaobjectUpdate.userErrors.map((e) => e.message).join(', ');
    throw new Error(`Failed to update gallery item: ${errors}`);
  }
}

/**
 * Generate handle from title (same logic as migration script)
 */
function generateHandle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Main fix function
 */
async function fix() {
  const startTime = Date.now();

  console.log('\n🔧 Emergency Gallery Category Fix');
  console.log('━'.repeat(50));

  // Validate connection
  console.log('📡 Validating Shopify connection...');
  const connected = await validateConnection();
  if (!connected) {
    console.error('\n✗ Failed to connect to Shopify. Please check your credentials.');
    process.exit(1);
  }
  console.log('✓ Connected to Shopify Admin API\n');

  // Build category map from original data
  console.log('📋 Building category mapping from original data...');
  const categoryMap = new Map<string, string>();

  for (const item of galleryItems) {
    const handle = generateHandle(item.title);
    categoryMap.set(handle, item.category);
  }
  console.log(`✓ Mapped ${categoryMap.size} items\n`);

  // Validate categories exist in our allowed list
  console.log('🔍 Validating category slugs...');
  console.log(`✓ Using ${VALID_CATEGORIES.length} valid categories: ${VALID_CATEGORIES.join(', ')}\n`);

  // Get gallery items from Shopify
  console.log('📊 Fetching gallery items from Shopify...');
  const shopifyItems = await getGalleryItems();
  console.log(`✓ Found ${shopifyItems.length} gallery items\n`);

  // Update each item
  console.log('🔗 Updating gallery items with category references...\n');
  let successful = 0;
  let failed = 0;

  for (const shopifyItem of shopifyItems) {
    try {
      // Look up original category from handle
      const originalCategory = categoryMap.get(shopifyItem.handle);

      if (!originalCategory) {
        console.warn(`   ⚠️  No original data found for ${shopifyItem.handle}, skipping`);
        failed++;
        continue;
      }

      if (!VALID_CATEGORIES.includes(originalCategory as typeof VALID_CATEGORIES[number])) {
        console.warn(`   ⚠️  Unknown category "${originalCategory}" for ${shopifyItem.handle}, skipping`);
        failed++;
        continue;
      }

      await updateGalleryItemCategory(shopifyItem.id, originalCategory);
      console.log(`   ✓ Updated: ${shopifyItem.handle} → ${originalCategory}`);
      successful++;
    } catch (error) {
      console.error(`   ✗ Failed to update ${shopifyItem.handle}:`, error);
      failed++;
    }
  }

  const duration = Date.now() - startTime;
  const durationSeconds = (duration / 1000).toFixed(1);

  // Print summary
  console.log('\n' + '━'.repeat(50));
  console.log('✅ Fix Complete!\n');
  console.log('Summary:');
  console.log(`  • Total items: ${shopifyItems.length}`);
  console.log(`  • Successful: ${successful}`);
  console.log(`  • Failed: ${failed}`);
  console.log(`  • Execution time: ${durationSeconds}s\n`);

  if (failed === 0) {
    console.log('Your gallery should now be displaying all items with categories!\n');
  } else {
    console.log('⚠️  Some items failed to update. Check errors above.\n');
  }

  process.exit(failed > 0 ? 1 : 0);
}

// Run fix
fix().catch((error) => {
  console.error('\n✗ Fatal error during fix:', error);
  process.exit(1);
});
