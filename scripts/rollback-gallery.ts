#!/usr/bin/env tsx

/**
 * Gallery Migration Rollback Script
 *
 * Deletes gallery metaobjects created by the migration script.
 *
 * Usage:
 *   pnpm rollback:gallery                    # Interactive - prompts for log file
 *   pnpm rollback:gallery <log-file-path>   # Direct - uses specified log file
 */

import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';
import { validateConnection } from './lib/shopify-admin.js';
import { deleteGalleryItem } from './lib/metaobject-operations.js';

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

/**
 * Prompt user for confirmation
 */
async function confirm(question: string): Promise<boolean> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise(resolve => {
    rl.question(`${question} (yes/no): `, answer => {
      rl.close();
      resolve(answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y');
    });
  });
}

/**
 * Find all migration log files
 */
function findMigrationLogs(): string[] {
  const logsDir = path.join(process.cwd(), 'logs');

  if (!fs.existsSync(logsDir)) {
    return [];
  }

  return fs
    .readdirSync(logsDir)
    .filter(file => file.startsWith('migration-') && file.endsWith('.json'))
    .map(file => path.join(logsDir, file))
    .sort()
    .reverse(); // Most recent first
}

/**
 * Select a migration log file
 */
async function selectLogFile(): Promise<string | null> {
  const logFiles = findMigrationLogs();

  if (logFiles.length === 0) {
    console.error('✗ No migration log files found in logs/ directory');
    return null;
  }

  console.log('\nAvailable migration logs:\n');
  logFiles.forEach((file, index) => {
    const filename = path.basename(file);
    const stats = fs.statSync(file);
    const date = stats.mtime.toLocaleString();
    console.log(`  ${index + 1}. ${filename} (${date})`);
  });

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise(resolve => {
    rl.question('\nEnter log file number (or press Enter for most recent): ', answer => {
      rl.close();

      if (!answer.trim()) {
        resolve(logFiles[0] || null);
        return;
      }

      const index = parseInt(answer) - 1;
      if (index >= 0 && index < logFiles.length) {
        resolve(logFiles[index] || null);
      } else {
        console.error('✗ Invalid selection');
        resolve(null);
      }
    });
  });
}

/**
 * Main rollback function
 */
async function rollback() {
  console.log('\n⚠️  Gallery Migration Rollback Script');
  console.log('━'.repeat(50));

  // Get log file path
  let logFilePath: string | null = null;

  if (process.argv[2]) {
    logFilePath = path.resolve(process.argv[2]);
  } else {
    logFilePath = await selectLogFile();
  }

  if (!logFilePath || !fs.existsSync(logFilePath)) {
    console.error('\n✗ Log file not found');
    process.exit(1);
  }

  // Load migration log
  const logContent = fs.readFileSync(logFilePath, 'utf-8');
  const migrationLog: MigrationLog = JSON.parse(logContent);

  // Count items to delete
  const itemsToDelete = migrationLog.items.filter(item => item.metaobjectId);

  console.log(`\nMigration log: ${path.basename(logFilePath)}`);
  console.log(`Migration date: ${new Date(migrationLog.timestamp).toLocaleString()}`);
  console.log(`Total items in log: ${migrationLog.totalItems}`);
  console.log(`Items to delete: ${itemsToDelete.length}\n`);

  if (itemsToDelete.length === 0) {
    console.log('✓ No metaobjects to delete (log may be from a dry run)');
    process.exit(0);
  }

  // Show items that will be deleted
  console.log('The following metaobjects will be DELETED:\n');
  itemsToDelete.forEach((item, index) => {
    console.log(`  ${index + 1}. ${item.title}`);
  });

  console.log('\n⚠️  WARNING: This action cannot be undone!');
  const confirmed = await confirm('\nAre you sure you want to delete these metaobjects?');

  if (!confirmed) {
    console.log('\n✓ Rollback cancelled');
    process.exit(0);
  }

  // Validate connection
  console.log('\n📡 Validating Shopify connection...');
  const connected = await validateConnection();
  if (!connected) {
    console.error('\n✗ Failed to connect to Shopify. Please check your credentials.');
    process.exit(1);
  }

  // Delete metaobjects
  console.log('\n🗑️  Deleting metaobjects...\n');

  let successCount = 0;
  let failureCount = 0;

  for (let i = 0; i < itemsToDelete.length; i++) {
    const item = itemsToDelete[i]!;

    try {
      if (item.metaobjectId) {
        await deleteGalleryItem(item.metaobjectId);
        successCount++;
        console.log(`   ✓ [${i + 1}/${itemsToDelete.length}] Deleted: ${item.title}`);
      }
    } catch (error) {
      failureCount++;
      console.error(`   ✗ [${i + 1}/${itemsToDelete.length}] Failed to delete: ${item.title}`);
      console.error(`      Error: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  // Print summary
  console.log('\n' + '━'.repeat(50));
  console.log('✅ Rollback Complete!\n');
  console.log('Summary:');
  console.log(`  • Items deleted: ${successCount}`);
  console.log(`  • Failed: ${failureCount}\n`);

  if (failureCount > 0) {
    console.log('⚠️  Some items failed to delete. You may need to delete them manually.');
    console.log('   Go to: Shopify Admin → Content → Metaobjects → Gallery Items\n');
  }

  process.exit(failureCount > 0 ? 1 : 0);
}

// Run rollback
rollback().catch(error => {
  console.error('\n✗ Fatal error during rollback:', error);
  process.exit(1);
});
