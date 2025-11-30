#!/usr/bin/env tsx
/**
 * Homepage Setup Script
 *
 * Creates homepage_hero metaobject definition and default hero content.
 *
 * Usage:
 *   pnpm setup:homepage        # Execute migration
 *   pnpm setup:homepage:dry    # Dry-run mode (preview changes)
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
 * Create the homepage_hero metaobject definition
 */
async function createHomepageHeroDefinition(): Promise<string> {
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
      name: 'Homepage Hero',
      type: 'homepage_hero',
      fieldDefinitions: [
        {
          key: 'heading',
          name: 'Hero Heading',
          type: 'single_line_text_field',
          required: true,
          description: 'Main H1 heading for homepage',
        },
        {
          key: 'description',
          name: 'Hero Description',
          type: 'multi_line_text_field',
          required: true,
          description: 'Subtitle/intro text',
        },
        {
          key: 'background_image_url',
          name: 'Background Image URL',
          type: 'single_line_text_field',
          required: true,
          description: 'Full URL to hero background image',
        },
        {
          key: 'cta_primary_text',
          name: 'Primary CTA Text',
          type: 'single_line_text_field',
          required: true,
          description: 'Primary button text',
        },
        {
          key: 'cta_primary_url',
          name: 'Primary CTA URL',
          type: 'single_line_text_field',
          required: true,
          description: 'Primary button URL',
        },
        {
          key: 'cta_secondary_text',
          name: 'Secondary CTA Text',
          type: 'single_line_text_field',
          required: false,
          description: 'Secondary button text (optional)',
        },
        {
          key: 'cta_secondary_url',
          name: 'Secondary CTA URL',
          type: 'single_line_text_field',
          required: false,
          description: 'Secondary button URL (optional)',
        },
      ],
      access: {
        storefront: 'PUBLIC_READ',
      },
    },
  };

  console.log('\n📝 Creating homepage_hero metaobject definition...');

  if (DRY_RUN) {
    console.log('[DRY RUN] Would create definition with fields:');
    variables.definition.fieldDefinitions.forEach((field) => {
      console.log(`  - ${field.name} (${field.key}): ${field.type}${field.required ? ' [required]' : ''}`);
    });
    return 'dry-run-definition-id';
  }

  const response = await shopifyAdminRequest<MetaobjectDefinitionResponse>(
    mutation,
    variables
  );

  if (response.metaobjectDefinitionCreate.userErrors.length > 0) {
    const errors = response.metaobjectDefinitionCreate.userErrors;
    const alreadyExists = errors.some((err) =>
      err.message.toLowerCase().includes('already exists') || err.code === 'TAKEN'
    );

    if (alreadyExists) {
      console.log('✓ Definition already exists, skipping...');
      return 'existing-definition';
    }

    console.error('❌ Failed to create homepage_hero definition:');
    errors.forEach((err) => console.error(`  - ${err.message}`));
    throw new Error('Metaobject definition creation failed');
  }

  const definitionId = response.metaobjectDefinitionCreate.metaobjectDefinition!.id;
  console.log(`✓ Created homepage_hero definition: ${definitionId}`);

  return definitionId;
}

/**
 * Create default homepage hero metaobject
 */
async function createHomepageHeroMetaobject(): Promise<void> {
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

  const homepageHero = {
    type: 'homepage_hero',
    handle: 'main',
    fields: [
      { key: 'heading', value: 'Handmade Coastal & Woodland Treasures' },
      {
        key: 'description',
        value: 'Sea glass earrings, pressed flower resin, driftwood décor—crafted in small batches with materials gathered from the Pacific Northwest shores.',
      },
      { key: 'background_image_url', value: '/stock-assets/hero/coastal-shells.jpg' },
      { key: 'cta_primary_text', value: 'View Gallery' },
      { key: 'cta_primary_url', value: '/gallery' },
      { key: 'cta_secondary_text', value: 'Shop New Arrivals' },
      { key: 'cta_secondary_url', value: '/products' },
    ],
  };

  console.log(`\n📄 Creating homepage hero: ${homepageHero.handle}`);

  if (DRY_RUN) {
    console.log('[DRY RUN] Would create metaobject:');
    console.log(`  Handle: ${homepageHero.handle}`);
    console.log(`  Fields:`);
    homepageHero.fields.forEach((field) => {
      const preview =
        field.value.length > 60 ? field.value.substring(0, 60) + '...' : field.value;
      console.log(`    - ${field.key}: "${preview}"`);
    });
    return;
  }

  const response = await shopifyAdminRequest<MetaobjectCreateResponse>(mutation, {
    metaobject: homepageHero,
  });

  if (response.metaobjectCreate.userErrors.length > 0) {
    const errors = response.metaobjectCreate.userErrors;
    const alreadyExists = errors.some((err) =>
      err.message.toLowerCase().includes('already exists') ||
      err.message.toLowerCase().includes('handle has already been taken')
    );

    if (alreadyExists) {
      console.log(`  ⚠️  Homepage hero already exists, skipping...`);
      return;
    }

    console.error(`  ❌ Failed to create homepage hero:`);
    errors.forEach((err) => console.error(`    - ${err.message}`));
    return;
  }

  const metaobject = response.metaobjectCreate.metaobject!;
  console.log(`  ✓ Created: ${metaobject.handle} (${metaobject.id})`);
}

/**
 * Main execution
 */
async function main() {
  console.log('╔═══════════════════════════════════════════════════════╗');
  console.log('║   Homepage Setup Script                              ║');
  console.log('╚═══════════════════════════════════════════════════════╝');

  if (DRY_RUN) {
    console.log('\n🔍 DRY RUN MODE - No changes will be made\n');
  }

  try {
    // Validate Shopify connection
    await validateConnection();

    // Create metaobject definition
    await createHomepageHeroDefinition();

    // Create default homepage hero
    await createHomepageHeroMetaobject();

    console.log('\n✅ Homepage setup complete!');
    console.log('\nCustomize at: Shopify Admin → Content → Metaobjects → Homepage Hero');

    if (DRY_RUN) {
      console.log('\n💡 Run without --dry-run to execute setup');
    }

    console.log('\n💡 Tip: Run `pnpm setup:all` to set up all page content at once\n');
  } catch (error) {
    console.error('\n❌ Setup failed:', error);
    process.exit(1);
  }
}

main();
