#!/usr/bin/env tsx
/**
 * Page Metadata Setup Script
 *
 * Creates page_metadata metaobject definition and default metadata entries
 * for all major pages (homepage, about, contact, gallery).
 *
 * Usage:
 *   pnpm setup:metadata        # Execute migration
 *   pnpm setup:metadata:dry    # Dry-run mode (preview changes)
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
    };
    userErrors: Array<{ field?: string[]; message: string }>;
  };
}

/**
 * Create the page_metadata metaobject definition
 */
async function createPageMetadataDefinition(): Promise<string> {
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
      name: 'Page Metadata',
      type: 'page_metadata',
      fieldDefinitions: [
        {
          key: 'page_slug',
          name: 'Page Slug',
          type: 'single_line_text_field',
          required: true,
          description: 'URL path (e.g., "about", "contact", "gallery")',
        },
        {
          key: 'title',
          name: 'Page Title',
          type: 'single_line_text_field',
          required: true,
          description: 'SEO title tag',
        },
        {
          key: 'description',
          name: 'Meta Description',
          type: 'multi_line_text_field',
          required: true,
          description: 'SEO description (150-160 characters)',
        },
        {
          key: 'og_image_url',
          name: 'OpenGraph Image URL',
          type: 'single_line_text_field',
          required: false,
          description: 'Full URL to OpenGraph image',
        },
        {
          key: 'keywords',
          name: 'Meta Keywords',
          type: 'single_line_text_field',
          required: false,
          description: 'Comma-separated keywords',
        },
        {
          key: 'robots_index',
          name: 'Allow Indexing',
          type: 'boolean',
          required: false,
          description: 'Allow search engines to index this page',
        },
        {
          key: 'robots_follow',
          name: 'Allow Following',
          type: 'boolean',
          required: false,
          description: 'Allow search engines to follow links',
        },
      ],
      displayNameKey: 'page_slug',
    },
  };

  if (DRY_RUN) {
    console.log('   [DRY RUN] Would create page_metadata definition');
    return 'dry-run-id';
  }

  const result = await shopifyAdminRequest<MetaobjectDefinitionResponse>(
    mutation,
    variables
  );

  // Check for "already exists" error
  const alreadyExistsError = result.metaobjectDefinitionCreate.userErrors.find(
    (err) => err.code === 'TAKEN' || err.message.includes('already exists')
  );

  if (alreadyExistsError) {
    console.log('   ℹ️  Page metadata definition already exists, skipping creation');
    return 'existing-definition-id';
  }

  if (result.metaobjectDefinitionCreate.userErrors.length > 0) {
    const errors = result.metaobjectDefinitionCreate.userErrors
      .map((e) => e.message)
      .join(', ');
    throw new Error(`Failed to create metaobject definition: ${errors}`);
  }

  const definition = result.metaobjectDefinitionCreate.metaobjectDefinition;
  if (!definition) {
    throw new Error('No metaobject definition returned');
  }

  return definition.id;
}

/**
 * Create default page metadata entries
 */
async function createDefaultMetadata() {
  const pages = [
    {
      handle: 'homepage',
      slug: 'homepage',
      title: 'Handmade Coastal Crafts | Fern & Fog Creations',
      description:
        'Discover unique handmade coastal treasures. Sea glass earrings, pressed flower resin art, and driftwood décor crafted with love.',
      robots_index: true,
      robots_follow: true,
    },
    {
      handle: 'about',
      slug: 'about',
      title: 'About Us | Fern & Fog Creations',
      description:
        'Learn about our journey creating handmade coastal crafts from natural materials found along the shoreline.',
      robots_index: true,
      robots_follow: true,
    },
    {
      handle: 'contact',
      slug: 'contact',
      title: 'Contact Us | Fern & Fog Creations',
      description:
        'Get in touch with questions about custom orders or commissioned pieces. We love to hear from you!',
      robots_index: true,
      robots_follow: true,
    },
    {
      handle: 'gallery',
      slug: 'gallery',
      title: 'Gallery of Past Work | Fern & Fog Creations',
      description:
        'Browse our gallery of past handmade creations including sea glass jewelry, pressed flower art, and coastal home décor.',
      robots_index: true,
      robots_follow: true,
    },
  ];

  const mutation = `
    mutation metaobjectCreate($metaobject: MetaobjectCreateInput!) {
      metaobjectCreate(metaobject: $metaobject) {
        metaobject {
          id
          handle
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  for (const page of pages) {
    if (DRY_RUN) {
      console.log(`   [DRY RUN] Would create metadata for: ${page.slug}`);
      continue;
    }

    const variables = {
      metaobject: {
        type: 'page_metadata',
        handle: page.handle,
        fields: [
          { key: 'page_slug', value: page.slug },
          { key: 'title', value: page.title },
          { key: 'description', value: page.description },
          { key: 'robots_index', value: String(page.robots_index) },
          { key: 'robots_follow', value: String(page.robots_follow) },
        ],
      },
    };

    try {
      const result = await shopifyAdminRequest<MetaobjectCreateResponse>(
        mutation,
        variables
      );

      if (result.metaobjectCreate.userErrors.length > 0) {
        console.error(
          `   ✗ Failed to create ${page.slug}:`,
          result.metaobjectCreate.userErrors.map((e) => e.message).join(', ')
        );
      } else {
        console.log(`   ✓ Created metadata for: ${page.slug}`);
      }
    } catch (error) {
      console.error(`   ✗ Error creating ${page.slug}:`, error);
    }
  }
}

/**
 * Main setup function
 */
async function setup() {
  console.log('\n🔧 Page Metadata Setup');
  console.log('━'.repeat(50));

  if (DRY_RUN) {
    console.log('🔍 DRY RUN MODE - No changes will be made\n');
  }

  const connected = await validateConnection();
  if (!connected) {
    console.error('\n✗ Failed to connect to Shopify');
    process.exit(1);
  }
  console.log('✓ Connected to Shopify Admin API\n');

  console.log('📋 Step 1/2: Creating page_metadata definition...');
  await createPageMetadataDefinition();
  console.log('✓ Definition created\n');

  console.log('📝 Step 2/2: Creating default metadata entries...');
  await createDefaultMetadata();
  console.log('✓ Default metadata created\n');

  console.log('━'.repeat(50));
  console.log('✅ Setup Complete!\n');

  if (!DRY_RUN) {
    console.log('Next steps:');
    console.log('  1. Go to Shopify Admin > Content > Metaobjects');
    console.log('  2. Find "Page Metadata" entries');
    console.log('  3. Edit titles, descriptions, and OpenGraph images\n');
  }
}

// Run the setup
setup().catch((error) => {
  console.error('\n✗ Fatal error:', error);
  process.exit(1);
});
