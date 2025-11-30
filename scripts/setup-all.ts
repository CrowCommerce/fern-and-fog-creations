#!/usr/bin/env tsx

/**
 * Setup All Content Script
 *
 * Runs all setup scripts in the correct order to configure page content in Shopify.
 * This is a convenience script that orchestrates individual setup scripts.
 *
 * Order:
 * 1. Page Metadata (SEO)
 * 2. Homepage Hero
 * 3. About Page
 * 4. Contact Page
 * 5. Gallery Page Settings
 *
 * Usage:
 *   pnpm setup:all          # Run all setup scripts
 *   pnpm setup:all --dry-run # Test without making changes
 */

import { spawn } from 'child_process';
import { validateConnection } from './lib/shopify-admin.js';

const DRY_RUN = process.argv.includes('--dry-run');

interface SetupScript {
  name: string;
  script: string;
  description: string;
}

const SETUP_SCRIPTS: SetupScript[] = [
  {
    name: 'Page Metadata',
    script: 'setup:metadata',
    description: 'SEO metadata for all pages',
  },
  {
    name: 'Homepage',
    script: 'setup:homepage',
    description: 'Homepage hero section',
  },
  {
    name: 'About Page',
    script: 'setup:about',
    description: 'About page content and values',
  },
  {
    name: 'Contact Page',
    script: 'setup:contact',
    description: 'Contact page information',
  },
  {
    name: 'Gallery Page',
    script: 'setup:gallery:page',
    description: 'Gallery page settings',
  },
];

/**
 * Run a single setup script
 */
function runScript(scriptName: string, dryRun: boolean): Promise<{ success: boolean; output: string }> {
  return new Promise((resolve) => {
    const args = dryRun ? [scriptName + ':dry'] : [scriptName];
    const child = spawn('pnpm', args, {
      cwd: process.cwd(),
      stdio: ['inherit', 'pipe', 'pipe'],
    });

    let output = '';

    child.stdout?.on('data', (data) => {
      output += data.toString();
    });

    child.stderr?.on('data', (data) => {
      output += data.toString();
    });

    child.on('close', (code) => {
      resolve({
        success: code === 0,
        output,
      });
    });

    child.on('error', (error) => {
      resolve({
        success: false,
        output: error.message,
      });
    });
  });
}

/**
 * Main function
 */
async function main() {
  const startTime = Date.now();

  console.log('\n🚀 Setup All Content');
  console.log('━'.repeat(50));

  if (DRY_RUN) {
    console.log('🔍 DRY RUN MODE - No changes will be made\n');
  }

  // Validate connection first
  console.log('📡 Validating Shopify connection...');
  const connected = await validateConnection();
  if (!connected) {
    console.error('\n✗ Failed to connect to Shopify. Please check your credentials.');
    process.exit(1);
  }
  console.log('✓ Connected to Shopify Admin API\n');

  console.log(`Running ${SETUP_SCRIPTS.length} setup scripts...\n`);

  let successful = 0;
  let failed = 0;

  for (let i = 0; i < SETUP_SCRIPTS.length; i++) {
    const script = SETUP_SCRIPTS[i]!;
    console.log(`[${i + 1}/${SETUP_SCRIPTS.length}] ${script.name}...`);
    console.log(`   ${script.description}`);

    const result = await runScript(script.script, DRY_RUN);

    if (result.success) {
      console.log(`   ✓ ${script.name} complete\n`);
      successful++;
    } else {
      console.error(`   ✗ ${script.name} failed`);
      if (result.output) {
        // Show last few lines of output for debugging
        const lines = result.output.trim().split('\n').slice(-3);
        lines.forEach((line) => console.error(`      ${line}`));
      }
      console.log('');
      failed++;
    }
  }

  const duration = ((Date.now() - startTime) / 1000).toFixed(1);

  // Print summary
  console.log('━'.repeat(50));

  if (DRY_RUN) {
    console.log('✅ Dry Run Complete!\n');
    console.log('Summary:');
    console.log(`  • Scripts run: ${SETUP_SCRIPTS.length}`);
    console.log(`  • Successful: ${successful}`);
    console.log(`  • Failed: ${failed}`);
    console.log(`  • Duration: ${duration}s\n`);
    console.log('Run without --dry-run flag to perform actual setup.\n');
  } else {
    console.log('✅ Setup Complete!\n');
    console.log('Summary:');
    console.log(`  • Scripts run: ${SETUP_SCRIPTS.length}`);
    console.log(`  • Successful: ${successful}`);
    console.log(`  • Failed: ${failed}`);
    console.log(`  • Duration: ${duration}s\n`);

    if (failed > 0) {
      console.log('⚠️  Some scripts failed. You can run them individually to debug.\n');
    }

    // Final message
    console.log('━'.repeat(50));
    console.log('🎉 All done!\n');
    console.log('Your Shopify store content is ready. You can customize it at:');
    console.log('   Shopify Admin → Content → Metaobjects\n');
  }

  process.exit(failed > 0 ? 1 : 0);
}

// Run
main().catch((error) => {
  console.error('\n✗ Fatal error:', error);
  process.exit(1);
});
