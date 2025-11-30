#!/usr/bin/env tsx

/**
 * Gallery Page Settings Setup Script
 *
 * Creates the gallery_page_settings metaobject type and default entry.
 * This allows business users to edit the gallery page heading and description
 * via Shopify Admin without code changes.
 *
 * Usage:
 *   pnpm setup:gallery:page          # Run setup
 *   pnpm setup:gallery:page --dry-run # Test without making changes
 */

import { validateConnection, shopifyAdminRequest } from './lib/shopify-admin.js';

const DRY_RUN = process.argv.includes('--dry-run');

interface MetaobjectDefinitionResponse {
  metaobjectDefinitionCreate: {
    metaobjectDefinition?: {
      id: string;
      type: string;
      name: string;
    };
    userErrors: Array<{ field?: string[]; message: string; code?: string }>;
  };
}

interface MetaobjectCreateResponse {
  metaobjectCreate: {
    metaobject?: {
      id: string;
      handle: string;
      displayName: string;
    };
    userErrors: Array<{ field?: string[]; message: string; code?: string }>;
  };
}

/**
 * Create the gallery_page_settings metaobject definition
 */
async function createPageSettingsDefinition(): Promise<string> {
  const mutation = `
    mutation metaobjectDefinitionCreate($definition: MetaobjectDefinitionCreateInput!) {
      metaobjectDefinitionCreate(definition: $definition) {
        metaobjectDefinition {
          id
          type
          name
        }
        userErrors {
          field
          message
          code
        }
      }
    }
  `;

  const variables = {
    definition: {
      name: 'Gallery Page Settings',
      type: 'gallery_page_settings',
      fieldDefinitions: [
        {
          key: 'heading',
          name: 'Page Heading',
          type: 'single_line_text_field',
          required: true,
          description: 'Main heading displayed at top of gallery page',
        },
        {
          key: 'description',
          name: 'Page Description',
          type: 'multi_line_text_field',
          required: true,
          description: 'Introductory paragraph below heading',
        },
      ],
      displayNameKey: 'heading',
    },
  };

  const result = await shopifyAdminRequest<MetaobjectDefinitionResponse>(mutation, variables);

  // Check for "already exists" error
  const alreadyExistsError = result.metaobjectDefinitionCreate.userErrors.find(
    (err) => err.code === 'TAKEN' || err.message.includes('already exists')
  );

  if (alreadyExistsError) {
    console.log('   ℹ️  Gallery page settings definition already exists, skipping creation');
    return await getExistingDefinitionId();
  }

  if (result.metaobjectDefinitionCreate.userErrors.length > 0) {
    const errors = result.metaobjectDefinitionCreate.userErrors.map((e) => e.message).join(', ');
    throw new Error(`Failed to create page settings definition: ${errors}`);
  }

  const definition = result.metaobjectDefinitionCreate.metaobjectDefinition;
  if (!definition) {
    throw new Error('No metaobject definition returned');
  }

  return definition.id;
}

/**
 * Get existing page settings definition ID
 */
async function getExistingDefinitionId(): Promise<string> {
  const query = `
    query {
      metaobjectDefinitionByType(type: "gallery_page_settings") {
        id
        type
        name
      }
    }
  `;

  const result = await shopifyAdminRequest<{
    metaobjectDefinitionByType: { id: string };
  }>(query);

  if (!result.metaobjectDefinitionByType) {
    throw new Error('Page settings definition not found');
  }

  return result.metaobjectDefinitionByType.id;
}

/**
 * Check if page settings entry already exists
 */
async function checkExistingEntry(): Promise<boolean> {
  const query = `
    query {
      metaobjectByHandle(handle: { type: "gallery_page_settings", handle: "main" }) {
        id
      }
    }
  `;

  const result = await shopifyAdminRequest<{
    metaobjectByHandle: { id: string } | null;
  }>(query);

  return result.metaobjectByHandle !== null;
}

/**
 * Create the default page settings entry
 */
async function createPageSettingsEntry(): Promise<string> {
  const mutation = `
    mutation metaobjectCreate($metaobject: MetaobjectCreateInput!) {
      metaobjectCreate(metaobject: $metaobject) {
        metaobject {
          id
          handle
          displayName
        }
        userErrors {
          field
          message
          code
        }
      }
    }
  `;

  const variables = {
    metaobject: {
      type: 'gallery_page_settings',
      handle: 'main',
      fields: [
        {
          key: 'heading',
          value: 'Gallery of Past Work',
        },
        {
          key: 'description',
          value:
            'A collection of treasures that have found their homes. Each piece represents a moment in time, a story preserved in natural materials.',
        },
      ],
    },
  };

  const result = await shopifyAdminRequest<MetaobjectCreateResponse>(mutation, variables);

  if (result.metaobjectCreate.userErrors.length > 0) {
    const errors = result.metaobjectCreate.userErrors.map((e) => e.message).join(', ');
    throw new Error(`Failed to create page settings entry: ${errors}`);
  }

  const metaobject = result.metaobjectCreate.metaobject;
  if (!metaobject) {
    throw new Error('No metaobject returned from mutation');
  }

  return metaobject.id;
}

/**
 * Main setup function
 */
async function setup() {
  const startTime = Date.now();

  console.log('\n🚀 Gallery Page Settings Setup Script');
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
  console.log('✓ Connected to Shopify Admin API\n');

  try {
    // Step 1: Create metaobject definition
    console.log('📋 Step 1/2: Creating gallery_page_settings metaobject definition...');
    if (!DRY_RUN) {
      await createPageSettingsDefinition();
      console.log('✓ Page settings definition created\n');
    } else {
      console.log('✓ Would create page settings definition\n');
    }

    // Step 2: Create default entry
    console.log('📄 Step 2/2: Creating default page settings entry...');
    if (!DRY_RUN) {
      const exists = await checkExistingEntry();
      if (exists) {
        console.log('   ℹ️  Page settings entry already exists, skipping creation');
      } else {
        await createPageSettingsEntry();
        console.log('✓ Default page settings entry created');
      }
    } else {
      console.log('✓ Would create default page settings entry\n');
    }

    const duration = Date.now() - startTime;
    const durationSeconds = (duration / 1000).toFixed(1);

    // Print summary
    console.log('\n' + '━'.repeat(50));
    if (DRY_RUN) {
      console.log('✅ Dry Run Complete!\n');
      console.log(`Duration: ${durationSeconds}s\n`);
      console.log('Run without --dry-run flag to perform actual setup.');
    } else {
      console.log('✅ Setup Complete!\n');
      console.log(`Execution time: ${durationSeconds}s\n`);
      console.log('Customize at: Shopify Admin → Content → Metaobjects → Gallery Page Settings');
    }

    console.log('\n💡 Tip: Run `pnpm setup:all` to set up all page content at once\n');

    process.exit(0);
  } catch (error) {
    console.error('\n✗ Fatal error during setup:', error);
    process.exit(1);
  }
}

// Run setup
setup().catch((error) => {
  console.error('\n✗ Fatal error during setup:', error);
  process.exit(1);
});
