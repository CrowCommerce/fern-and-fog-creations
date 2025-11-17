#!/usr/bin/env tsx

/**
 * Gallery Migration Script
 *
 * Migrates gallery items from data/gallery.ts to Shopify Metaobjects.
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
  createGalleryItemDefinition,
  createGalleryItem,
  generateHandle,
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

  // Create metaobject definition
  if (!DRY_RUN) {
    console.log('\n📋 Creating metaobject definition...');
    try {
      await createGalleryItemDefinition();
      console.log('✓ Metaobject definition ready: gallery_item');
    } catch (error) {
      console.error('\n✗ Failed to create metaobject definition:', error);
      process.exit(1);
    }
  }

  // Prepare migration log
  const migrationLog: MigrationLog = {
    timestamp: new Date().toISOString(),
    totalItems: galleryItems.length,
    successful: 0,
    failed: 0,
    duration: 0,
    items: [],
  };

  console.log('\n📤 Uploading images and creating metaobjects...\n');

  // Migrate each gallery item
  for (let i = 0; i < galleryItems.length; i++) {
    const item = galleryItems[i]!;
    const itemStartTime = Date.now();

    try {
      const handle = generateHandle(item.title);

      console.log(`   [${i + 1}/${galleryItems.length}] ${item.title}...`);

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
        console.log(`   ✓ [${i + 1}/${galleryItems.length}] ${item.title} (validated in ${itemDuration}s)\n`);
      } else {
        // Upload image
        const imageId = await uploadImage(`public${item.image}`, item.title);

        // Create metaobject
        const fields: GalleryItemFields = {
          title: item.title,
          category: item.category,
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
    console.log(`  • Total items validated: ${migrationLog.totalItems}`);
    console.log(`  • Successful: ${migrationLog.successful}`);
    console.log(`  • Failed: ${migrationLog.failed}`);
    console.log(`  • Duration: ${formatDuration(migrationLog.duration)}\n`);
    console.log('Run without --dry-run flag to perform actual migration.');
  } else {
    console.log('✅ Migration Complete!\n');
    console.log('Summary:');
    console.log(`  • Total items: ${migrationLog.totalItems}`);
    console.log(`  • Successful: ${migrationLog.successful}`);
    console.log(`  • Failed: ${migrationLog.failed}`);
    console.log(`  • Execution time: ${formatDuration(migrationLog.duration)}\n`);

    const logFilename = `migration-${new Date().toISOString().replace(/[:.]/g, '-').split('T')[0]}-${Date.now()}.json`;
    console.log(`Migration log saved to: logs/${logFilename}\n`);

    if (migrationLog.failed > 0) {
      console.log('⚠️  Some items failed to migrate. Check the log file for details.\n');
    } else {
      console.log('Next steps:');
      console.log('  1. Verify gallery items in Shopify Admin → Content → Metaobjects');
      console.log('  2. Update gallery page to fetch from Shopify metaobjects');
      console.log('  3. Keep data/gallery.ts as backup until fully tested\n');
    }
  }

  process.exit(migrationLog.failed > 0 ? 1 : 0);
}

// Run migration
migrate().catch(error => {
  console.error('\n✗ Fatal error during migration:', error);
  process.exit(1);
});
