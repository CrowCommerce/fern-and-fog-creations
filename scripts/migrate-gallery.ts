#!/usr/bin/env tsx

/**
 * Gallery Migration Script
 *
 * Migrates gallery items from data/gallery.ts to Shopify Metaobjects.
 * This script handles the complete migration including:
 * 1. Creating gallery_category metaobject definition
 * 2. Creating category metaobjects (earrings, resin, driftwood, wall-hangings)
 * 3. Creating gallery_item metaobject definition (with category reference)
 * 4. Uploading images and creating gallery items
 *
 * Usage:
 *   pnpm migrate:gallery          # Run migration
 *   pnpm migrate:gallery --dry-run # Test without making changes
 */

import * as fs from 'fs';
import * as path from 'path';
import { validateConnection } from './lib/shopify-admin.js';
import { uploadImage } from './lib/upload-image.js';
import {
  createGalleryCategoryDefinition,
  createCategory,
  getExistingCategoryId,
  createGalleryItemDefinition,
  createGalleryItem,
  generateHandle,
  DEFAULT_CATEGORIES,
  type GalleryItemFields,
} from './lib/metaobject-operations.js';

// Import gallery data
import { galleryItems } from '../data/gallery.js';

interface MigrationLog {
  timestamp: string;
  totalItems: number;
  successful: number;
  failed: number;
  duration: number;
  categories: Array<{
    slug: string;
    id?: string;
    error?: string;
  }>;
  items: Array<{
    legacyId: string;
    title: string;
    handle: string;
    metaobjectId?: string;
    imageId?: string;
    error?: string;
  }>;
}

const DRY_RUN = process.argv.includes('--dry-run');

/**
 * Format elapsed time in a human-readable format
 */
function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`;
  }
  return `${seconds}s`;
}

/**
 * Main migration function
 */
async function migrate() {
  const startTime = Date.now();

  console.log('\n🚀 Gallery Migration Script');
  console.log('━'.repeat(50));

  if (DRY_RUN) {
    console.log('🔍 DRY RUN MODE - No changes will be made\n');
  }

  // Validate connection
  console.log('📡 Validating Shopify connection...');
  const connected = await validateConnection();
  if (!connected) {
    console.error('\n✗ Failed to connect to Shopify. Please check your credentials.');
    process.exit(1);
  }

  console.log(`\n✓ Loaded ${galleryItems.length} gallery items from data/gallery.ts`);

  // Prepare migration log
  const migrationLog: MigrationLog = {
    timestamp: new Date().toISOString(),
    totalItems: galleryItems.length,
    successful: 0,
    failed: 0,
    duration: 0,
    categories: [],
    items: [],
  };

  // Build category ID map
  const categoryIdMap = new Map<string, string>();

  // Step 1: Create category definition
  console.log('\n📋 Step 1/4: Creating gallery_category definition...');
  let categoryDefinitionId: string;

  if (!DRY_RUN) {
    try {
      categoryDefinitionId = await createGalleryCategoryDefinition();
      console.log('   ✓ Category definition ready');
    } catch (error) {
      console.error('\n✗ Failed to create category definition:', error);
      process.exit(1);
    }
  } else {
    categoryDefinitionId = 'gid://shopify/MetaobjectDefinition/mock-category';
    console.log('   ✓ Would create category definition');
  }

  // Step 2: Create categories
  console.log('\n📂 Step 2/4: Creating category metaobjects...');

  for (const category of DEFAULT_CATEGORIES) {
    try {
      if (!DRY_RUN) {
        // Check if category already exists
        const existingId = await getExistingCategoryId(category.slug);
        if (existingId) {
          console.log(`   ℹ️  Category "${category.name}" already exists, using existing`);
          categoryIdMap.set(category.slug, existingId);
          migrationLog.categories.push({ slug: category.slug, id: existingId });
        } else {
          const categoryId = await createCategory(category);
          categoryIdMap.set(category.slug, categoryId);
          migrationLog.categories.push({ slug: category.slug, id: categoryId });
          console.log(`   ✓ Created: ${category.name}`);
        }
      } else {
        const mockId = `gid://shopify/Metaobject/mock-${category.slug}`;
        categoryIdMap.set(category.slug, mockId);
        migrationLog.categories.push({ slug: category.slug, id: mockId });
        console.log(`   ✓ Would create: ${category.name}`);
      }
    } catch (error) {
      migrationLog.categories.push({
        slug: category.slug,
        error: error instanceof Error ? error.message : String(error),
      });
      console.error(`   ✗ Failed to create category ${category.name}:`, error);
    }
  }

  // Step 3: Create gallery_item definition
  console.log('\n📋 Step 3/4: Creating gallery_item definition...');

  if (!DRY_RUN) {
    try {
      await createGalleryItemDefinition(categoryDefinitionId);
      console.log('   ✓ Gallery item definition ready (with category reference)');
    } catch (error) {
      console.error('\n✗ Failed to create gallery item definition:', error);
      process.exit(1);
    }
  } else {
    console.log('   ✓ Would create gallery item definition');
  }

  // Step 4: Migrate gallery items
  console.log('\n📤 Step 4/4: Uploading images and creating gallery items...\n');

  for (let i = 0; i < galleryItems.length; i++) {
    const item = galleryItems[i]!;
    const itemStartTime = Date.now();

    try {
      const handle = generateHandle(item.title);

      console.log(`   [${i + 1}/${galleryItems.length}] ${item.title}...`);

      // Get category ID
      const categoryId = categoryIdMap.get(item.category);
      if (!categoryId) {
        throw new Error(`Unknown category "${item.category}" - category must be created first`);
      }

      if (DRY_RUN) {
        // Validate file exists
        const imagePath = path.join(process.cwd(), 'public', item.image);
        if (!fs.existsSync(imagePath)) {
          throw new Error(`Image file not found: ${imagePath}`);
        }

        migrationLog.items.push({
          legacyId: item.id,
          title: item.title,
          handle,
        });

        migrationLog.successful++;
        const itemDuration = ((Date.now() - itemStartTime) / 1000).toFixed(1);
        console.log(
          `   ✓ [${i + 1}/${galleryItems.length}] ${item.title} (validated in ${itemDuration}s)\n`
        );
      } else {
        // Upload image
        const imageId = await uploadImage(`public${item.image}`, item.title);

        // Create metaobject with category reference
        const fields: GalleryItemFields = {
          title: item.title,
          categoryId, // Now using metaobject GID instead of text
          imageId,
          materials: item.materials,
          story: item.story,
          forSale: item.forSale,
          createdDate: item.createdDate,
          legacyId: item.id,
        };

        const metaobjectId = await createGalleryItem(handle, fields);

        migrationLog.items.push({
          legacyId: item.id,
          title: item.title,
          handle,
          metaobjectId,
          imageId,
        });

        migrationLog.successful++;
        const itemDuration = ((Date.now() - itemStartTime) / 1000).toFixed(1);
        console.log(`   ✓ [${i + 1}/${galleryItems.length}] ${item.title} (${itemDuration}s)\n`);
      }
    } catch (error) {
      migrationLog.failed++;
      migrationLog.items.push({
        legacyId: item.id,
        title: item.title,
        handle: generateHandle(item.title),
        error: error instanceof Error ? error.message : String(error),
      });

      console.error(`   ✗ [${i + 1}/${galleryItems.length}] ${item.title}`);
      console.error(`      Error: ${error instanceof Error ? error.message : String(error)}\n`);
    }
  }

  // Calculate total duration
  migrationLog.duration = Date.now() - startTime;

  // Save migration log
  if (!DRY_RUN) {
    const logFilename = `migration-${new Date().toISOString().replace(/[:.]/g, '-').split('T')[0]}-${Date.now()}.json`;
    const logPath = path.join(process.cwd(), 'logs', logFilename);
    fs.writeFileSync(logPath, JSON.stringify(migrationLog, null, 2));
  }

  // Print summary
  console.log('━'.repeat(50));
  if (DRY_RUN) {
    console.log('✅ Dry Run Complete!\n');
    console.log('Summary:');
    console.log(`  • Categories: ${DEFAULT_CATEGORIES.length}`);
    console.log(`  • Items validated: ${migrationLog.totalItems}`);
    console.log(`  • Successful: ${migrationLog.successful}`);
    console.log(`  • Failed: ${migrationLog.failed}`);
    console.log(`  • Duration: ${formatDuration(migrationLog.duration)}\n`);
    console.log('Run without --dry-run flag to perform actual migration.\n');
  } else {
    console.log('✅ Migration Complete!\n');
    console.log('Summary:');
    console.log(`  • Categories created: ${migrationLog.categories.filter((c) => c.id).length}`);
    console.log(`  • Items migrated: ${migrationLog.totalItems}`);
    console.log(`  • Successful: ${migrationLog.successful}`);
    console.log(`  • Failed: ${migrationLog.failed}`);
    console.log(`  • Execution time: ${formatDuration(migrationLog.duration)}\n`);

    const logFilename = `migration-${new Date().toISOString().replace(/[:.]/g, '-').split('T')[0]}-${Date.now()}.json`;
    console.log(`Migration log saved to: logs/${logFilename}\n`);

    if (migrationLog.failed > 0) {
      console.log('⚠️  Some items failed to migrate. Check the log file for details.\n');
    }

    // Next steps
    console.log('━'.repeat(50));
    console.log('📋 Next step:');
    console.log('   Run `pnpm setup:all` to set up page content\n');
  }

  process.exit(migrationLog.failed > 0 ? 1 : 0);
}

// Run migration
migrate().catch((error) => {
  console.error('\n✗ Fatal error during migration:', error);
  process.exit(1);
});
