#!/usr/bin/env tsx
/**
 * Homepage Sections Setup Script
 *
 * Creates metaobject definitions and instances for:
 * - homepage_category (4 categories for CategorySection)
 * - homepage_feature (3 features for FeaturedSectionOne)
 *
 * Usage:
 *   pnpm setup:homepage-sections        # Execute migration
 *   pnpm setup:homepage-sections:dry    # Dry-run mode (preview changes)
 */

import { validateConnection, shopifyAdminRequest } from './lib/shopify-admin.js';
import { uploadImage } from './lib/upload-image.js';

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

// Data to migrate

const CATEGORIES = [
  {
    handle: 'earrings',
    name: 'Sea Glass Earrings',
    slug: 'earrings',
    description: 'Found along rocky shores, tumbled by the sea.',
    imagePath: 'public/stock-assets/categories/earrings.jpg',
    sortOrder: 1
  },
  {
    handle: 'resin',
    name: 'Pressed Flower Resin',
    slug: 'resin',
    description: 'Tiny botanicals preserved in crystal-clear resin.',
    imagePath: 'public/stock-assets/categories/resin.jpg',
    sortOrder: 2
  },
  {
    handle: 'driftwood',
    name: 'Driftwood Magnets',
    slug: 'driftwood',
    description: 'Sun-bleached, sea-worn, and one-of-a-kind.',
    imagePath: 'public/stock-assets/categories/driftwood.jpg',
    sortOrder: 3
  },
  {
    handle: 'wall-hangings',
    name: 'Wall Hangings',
    slug: 'wall-hangings',
    description: 'Natural textures for cozy, story-filled spaces.',
    imagePath: 'public/stock-assets/categories/wall-hangings.jpg',
    sortOrder: 4
  }
];

const FEATURES = [
  {
    handle: 'gathered',
    name: 'Gathered',
    description:
      'Each material is mindfully collected from Pacific Northwest shores and forests, respecting the natural world.',
    iconType: 'gathered',
    sortOrder: 1
  },
  {
    handle: 'crafted',
    name: 'Crafted',
    description:
      'Handmade with care and attention to detail, every piece is shaped by skilled hands and creative intention.',
    iconType: 'crafted',
    sortOrder: 2
  },
  {
    handle: 'treasured',
    name: 'Treasured',
    description:
      'Designed to become heirlooms, these one-of-a-kind pieces carry stories that grow with time.',
    iconType: 'treasured',
    sortOrder: 3
  }
];

/**
 * Create the homepage_category metaobject definition
 */
async function createCategoryDefinition(): Promise<string> {
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
      name: 'Homepage Category',
      type: 'homepage_category',
      fieldDefinitions: [
        {
          key: 'name',
          name: 'Category Name',
          type: 'single_line_text_field',
          required: true,
          description: 'Display name for the category'
        },
        {
          key: 'slug',
          name: 'URL Slug',
          type: 'single_line_text_field',
          required: true,
          description: 'URL-friendly identifier (e.g., "earrings")'
        },
        {
          key: 'description',
          name: 'Description',
          type: 'multi_line_text_field',
          required: true,
          description: 'Short description for the category card'
        },
        {
          key: 'image',
          name: 'Category Image',
          type: 'file_reference',
          required: true,
          description: 'Image for the category card',
          validations: [
            {
              name: 'file_type_options',
              value: '["Image"]'
            }
          ]
        },
        {
          key: 'sort_order',
          name: 'Sort Order',
          type: 'number_integer',
          required: true,
          description: 'Display order (1 = first)'
        }
      ],
      access: {
        storefront: 'PUBLIC_READ'
      },
      displayNameKey: 'name'
    }
  };

  console.log('\n📝 Creating homepage_category metaobject definition...');

  if (DRY_RUN) {
    console.log('[DRY RUN] Would create definition with fields:');
    variables.definition.fieldDefinitions.forEach((field) => {
      console.log(
        `  - ${field.name} (${field.key}): ${field.type}${field.required ? ' [required]' : ''}`
      );
    });
    return 'dry-run-definition-id';
  }

  const response = await shopifyAdminRequest<MetaobjectDefinitionResponse>(
    mutation,
    variables
  );

  if (response.metaobjectDefinitionCreate.userErrors.length > 0) {
    const errors = response.metaobjectDefinitionCreate.userErrors;
    const alreadyExists = errors.some(
      (err) =>
        err.message.toLowerCase().includes('already exists') || err.code === 'TAKEN'
    );

    if (alreadyExists) {
      console.log('✓ Definition already exists, skipping...');
      return 'existing-definition';
    }

    console.error('❌ Failed to create homepage_category definition:');
    errors.forEach((err) => console.error(`  - ${err.message}`));
    throw new Error('Metaobject definition creation failed');
  }

  const definitionId =
    response.metaobjectDefinitionCreate.metaobjectDefinition!.id;
  console.log(`✓ Created homepage_category definition: ${definitionId}`);

  return definitionId;
}

/**
 * Create the homepage_feature metaobject definition
 */
async function createFeatureDefinition(): Promise<string> {
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
      name: 'Homepage Feature',
      type: 'homepage_feature',
      fieldDefinitions: [
        {
          key: 'name',
          name: 'Feature Name',
          type: 'single_line_text_field',
          required: true,
          description: 'Feature title (e.g., "Gathered")'
        },
        {
          key: 'description',
          name: 'Description',
          type: 'multi_line_text_field',
          required: true,
          description: 'Feature description text'
        },
        {
          key: 'icon_type',
          name: 'Icon Type',
          type: 'single_line_text_field',
          required: true,
          description: 'Icon identifier: gathered, crafted, or treasured'
        },
        {
          key: 'sort_order',
          name: 'Sort Order',
          type: 'number_integer',
          required: true,
          description: 'Display order (1 = first)'
        }
      ],
      access: {
        storefront: 'PUBLIC_READ'
      },
      displayNameKey: 'name'
    }
  };

  console.log('\n📝 Creating homepage_feature metaobject definition...');

  if (DRY_RUN) {
    console.log('[DRY RUN] Would create definition with fields:');
    variables.definition.fieldDefinitions.forEach((field) => {
      console.log(
        `  - ${field.name} (${field.key}): ${field.type}${field.required ? ' [required]' : ''}`
      );
    });
    return 'dry-run-definition-id';
  }

  const response = await shopifyAdminRequest<MetaobjectDefinitionResponse>(
    mutation,
    variables
  );

  if (response.metaobjectDefinitionCreate.userErrors.length > 0) {
    const errors = response.metaobjectDefinitionCreate.userErrors;
    const alreadyExists = errors.some(
      (err) =>
        err.message.toLowerCase().includes('already exists') || err.code === 'TAKEN'
    );

    if (alreadyExists) {
      console.log('✓ Definition already exists, skipping...');
      return 'existing-definition';
    }

    console.error('❌ Failed to create homepage_feature definition:');
    errors.forEach((err) => console.error(`  - ${err.message}`));
    throw new Error('Metaobject definition creation failed');
  }

  const definitionId =
    response.metaobjectDefinitionCreate.metaobjectDefinition!.id;
  console.log(`✓ Created homepage_feature definition: ${definitionId}`);

  return definitionId;
}

/**
 * Create category metaobject instances with image uploads
 */
async function createCategoryInstances(): Promise<void> {
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

  console.log('\n📦 Creating homepage categories...');

  for (const category of CATEGORIES) {
    console.log(`\n  📄 Creating category: ${category.name}`);

    if (DRY_RUN) {
      console.log(`    [DRY RUN] Would upload image: ${category.imagePath}`);
      console.log(`    [DRY RUN] Would create metaobject:`);
      console.log(`      Handle: ${category.handle}`);
      console.log(`      Name: ${category.name}`);
      console.log(`      Slug: ${category.slug}`);
      console.log(`      Description: ${category.description}`);
      console.log(`      Sort Order: ${category.sortOrder}`);
      continue;
    }

    try {
      // Upload image to Shopify
      console.log(`    📷 Uploading image...`);
      const imageId = await uploadImage(
        category.imagePath,
        `${category.name} category image`
      );
      console.log(`    ✓ Image uploaded: ${imageId}`);

      // Create metaobject
      const metaobject = {
        type: 'homepage_category',
        handle: category.handle,
        fields: [
          { key: 'name', value: category.name },
          { key: 'slug', value: category.slug },
          { key: 'description', value: category.description },
          { key: 'image', value: imageId },
          { key: 'sort_order', value: String(category.sortOrder) }
        ]
      };

      const response = await shopifyAdminRequest<MetaobjectCreateResponse>(
        mutation,
        { metaobject }
      );

      if (response.metaobjectCreate.userErrors.length > 0) {
        const errors = response.metaobjectCreate.userErrors;
        const alreadyExists = errors.some(
          (err) =>
            err.message.toLowerCase().includes('already exists') ||
            err.message.toLowerCase().includes('handle has already been taken')
        );

        if (alreadyExists) {
          console.log(`    ⚠️  Category already exists, skipping...`);
          continue;
        }

        console.error(`    ❌ Failed to create category:`);
        errors.forEach((err) => console.error(`      - ${err.message}`));
        continue;
      }

      const created = response.metaobjectCreate.metaobject!;
      console.log(`    ✓ Created: ${created.handle} (${created.id})`);
    } catch (error) {
      console.error(
        `    ❌ Error creating category ${category.handle}:`,
        error instanceof Error ? error.message : error
      );
    }
  }
}

/**
 * Create feature metaobject instances
 */
async function createFeatureInstances(): Promise<void> {
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

  console.log('\n📦 Creating homepage features...');

  for (const feature of FEATURES) {
    console.log(`\n  📄 Creating feature: ${feature.name}`);

    if (DRY_RUN) {
      console.log(`    [DRY RUN] Would create metaobject:`);
      console.log(`      Handle: ${feature.handle}`);
      console.log(`      Name: ${feature.name}`);
      console.log(`      Icon Type: ${feature.iconType}`);
      console.log(`      Sort Order: ${feature.sortOrder}`);
      continue;
    }

    try {
      const metaobject = {
        type: 'homepage_feature',
        handle: feature.handle,
        fields: [
          { key: 'name', value: feature.name },
          { key: 'description', value: feature.description },
          { key: 'icon_type', value: feature.iconType },
          { key: 'sort_order', value: String(feature.sortOrder) }
        ]
      };

      const response = await shopifyAdminRequest<MetaobjectCreateResponse>(
        mutation,
        { metaobject }
      );

      if (response.metaobjectCreate.userErrors.length > 0) {
        const errors = response.metaobjectCreate.userErrors;
        const alreadyExists = errors.some(
          (err) =>
            err.message.toLowerCase().includes('already exists') ||
            err.message.toLowerCase().includes('handle has already been taken')
        );

        if (alreadyExists) {
          console.log(`    ⚠️  Feature already exists, skipping...`);
          continue;
        }

        console.error(`    ❌ Failed to create feature:`);
        errors.forEach((err) => console.error(`      - ${err.message}`));
        continue;
      }

      const created = response.metaobjectCreate.metaobject!;
      console.log(`    ✓ Created: ${created.handle} (${created.id})`);
    } catch (error) {
      console.error(
        `    ❌ Error creating feature ${feature.handle}:`,
        error instanceof Error ? error.message : error
      );
    }
  }
}

/**
 * Main execution
 */
async function main() {
  console.log('╔═══════════════════════════════════════════════════════╗');
  console.log('║   Homepage Sections Setup Script                      ║');
  console.log('╚═══════════════════════════════════════════════════════╝');

  if (DRY_RUN) {
    console.log('\n🔍 DRY RUN MODE - No changes will be made\n');
  }

  try {
    // Validate Shopify connection
    await validateConnection();

    // Create metaobject definitions
    await createCategoryDefinition();
    await createFeatureDefinition();

    // Create metaobject instances
    await createCategoryInstances();
    await createFeatureInstances();

    console.log('\n✅ Homepage sections setup complete!');
    console.log('\nCustomize at: Shopify Admin → Content → Metaobjects');
    console.log('  - Homepage Category: Edit category cards');
    console.log('  - Homepage Feature: Edit Gathered/Crafted/Treasured section');

    if (DRY_RUN) {
      console.log('\n💡 Run without --dry-run to execute setup');
    }
  } catch (error) {
    console.error('\n❌ Setup failed:', error);
    process.exit(1);
  }
}

main();
