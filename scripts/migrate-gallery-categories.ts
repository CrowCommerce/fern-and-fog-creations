#!/usr/bin/env tsx

/**
 * Gallery Category Migration Script
 *
 * Converts gallery categories from text-based validation choices to metaobject references.
 * This enables business users to manage categories via Shopify Admin without developer intervention.
 *
 * What this script does:
 * 1. Creates gallery_category metaobject definition
 * 2. Creates 4 default category metaobjects (earrings, resin, driftwood, wall-hangings)
 * 3. Updates gallery_item definition to use metaobject_reference instead of text field
 * 4. Updates all existing gallery items to reference the new category metaobjects
 *
 * Usage:
 *   pnpm migrate:gallery:categories          # Run migration
 *   pnpm migrate:gallery:categories --dry-run # Test without making changes
 */

import { validateConnection, shopifyAdminRequest } from './lib/shopify-admin.js';

const DRY_RUN = process.argv.includes('--dry-run');

interface CategoryData {
  name: string;
  slug: string;
  description: string;
  sortOrder: number;
}

const DEFAULT_CATEGORIES: CategoryData[] = [
  {
    name: 'Earrings',
    slug: 'earrings',
    description: 'Sea glass earrings, wire-wrapped designs, handmade jewelry for ears',
    sortOrder: 1,
  },
  {
    name: 'Resin',
    slug: 'resin',
    description: 'Pressed flowers preserved in resin, botanical art, pendants, coasters',
    sortOrder: 2,
  },
  {
    name: 'Driftwood',
    slug: 'driftwood',
    description: 'Carved driftwood signs, natural wood art, sculptures',
    sortOrder: 3,
  },
  {
    name: 'Wall Hangings',
    slug: 'wall-hangings',
    description: 'Woven tapestries, macramé, fiber art, textile wall décor',
    sortOrder: 4,
  },
];

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

interface MetaobjectUpdateResponse {
  metaobjectUpdate: {
    metaobject?: {
      id: string;
    };
    userErrors: Array<{ field?: string[]; message: string }>;
  };
}

interface MetaobjectDefinitionUpdateResponse {
  metaobjectDefinitionUpdate: {
    metaobjectDefinition?: {
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
      fields: Array<{
        key: string;
        value: string | null;
      }>;
    }>;
  };
}

/**
 * Create the gallery_category metaobject definition
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
      name: 'Gallery Category',
      type: 'gallery_category',
      fieldDefinitions: [
        {
          key: 'name',
          name: 'Name',
          type: 'single_line_text_field',
          required: true,
          description: 'Display name for the category',
        },
        {
          key: 'slug',
          name: 'Slug',
          type: 'single_line_text_field',
          required: true,
          description: 'URL-friendly identifier (e.g., earrings, resin)',
        },
        {
          key: 'description',
          name: 'Description',
          type: 'multi_line_text_field',
          required: false,
          description: 'Brief description of what this category includes',
        },
        {
          key: 'sort_order',
          name: 'Sort Order',
          type: 'number_integer',
          required: false,
          description: 'Order in which categories appear (1 = first)',
        },
      ],
      displayNameKey: 'name',
    },
  };

  const result = await shopifyAdminRequest<MetaobjectDefinitionResponse>(mutation, variables);

  // Check for "already exists" error
  const alreadyExistsError = result.metaobjectDefinitionCreate.userErrors.find(
    (err) => err.code === 'TAKEN' || err.message.includes('already exists')
  );

  if (alreadyExistsError) {
    console.log('   ℹ️  Category definition already exists, skipping creation');
    return await getExistingCategoryDefinitionId();
  }

  if (result.metaobjectDefinitionCreate.userErrors.length > 0) {
    const errors = result.metaobjectDefinitionCreate.userErrors.map((e) => e.message).join(', ');
    throw new Error(`Failed to create category definition: ${errors}`);
  }

  const definition = result.metaobjectDefinitionCreate.metaobjectDefinition;
  if (!definition) {
    throw new Error('No metaobject definition returned');
  }

  return definition.id;
}

/**
 * Get existing category definition ID
 */
async function getExistingCategoryDefinitionId(): Promise<string> {
  const query = `
    query {
      metaobjectDefinitionByType(type: "gallery_category") {
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
    throw new Error('Category definition not found');
  }

  return result.metaobjectDefinitionByType.id;
}

/**
 * Create a category metaobject
 */
async function createCategory(category: CategoryData): Promise<string> {
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
      type: 'gallery_category',
      handle: category.slug,
      fields: [
        { key: 'name', value: category.name },
        { key: 'slug', value: category.slug },
        { key: 'description', value: category.description },
        { key: 'sort_order', value: String(category.sortOrder) },
      ],
    },
  };

  const result = await shopifyAdminRequest<MetaobjectCreateResponse>(mutation, variables);

  if (result.metaobjectCreate.userErrors.length > 0) {
    const errors = result.metaobjectCreate.userErrors.map((e) => e.message).join(', ');
    throw new Error(`Failed to create category ${category.name}: ${errors}`);
  }

  const metaobject = result.metaobjectCreate.metaobject;
  if (!metaobject) {
    throw new Error('No metaobject returned from mutation');
  }

  return metaobject.id;
}

/**
 * Get existing category metaobject by slug
 */
async function getExistingCategoryId(slug: string): Promise<string | null> {
  const query = `
    query {
      metaobjectByHandle(handle: { type: "gallery_category", handle: "${slug}" }) {
        id
        handle
      }
    }
  `;

  const result = await shopifyAdminRequest<{
    metaobjectByHandle: { id: string } | null;
  }>(query);

  return result.metaobjectByHandle?.id || null;
}

/**
 * Update gallery_item definition to use metaobject_reference for category
 *
 * Note: Shopify doesn't allow changing a field's type or deleting/creating the same
 * field key in one mutation. We must split this into TWO separate mutations:
 * 1. Delete the old text-based category field
 * 2. Create the new metaobject_reference category field
 *
 * This will temporarily null out category values until Step 4 repopulates them.
 */
async function updateGalleryItemDefinition(definitionId: string): Promise<void> {
  const categoryDefinitionId = await getExistingCategoryDefinitionId();

  const mutation = `
    mutation metaobjectDefinitionUpdate($id: ID!, $definition: MetaobjectDefinitionUpdateInput!) {
      metaobjectDefinitionUpdate(id: $id, definition: $definition) {
        metaobjectDefinition {
          id
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  // Mutation 1: Delete the old text-based category field
  console.log('   → Deleting old text-based category field...');
  const deleteVariables = {
    id: definitionId,
    definition: {
      fieldDefinitions: [
        {
          delete: {
            key: 'category',
          },
        },
      ],
    },
  };

  const deleteResult = await shopifyAdminRequest<MetaobjectDefinitionUpdateResponse>(
    mutation,
    deleteVariables
  );

  if (deleteResult.metaobjectDefinitionUpdate.userErrors.length > 0) {
    const errors = deleteResult.metaobjectDefinitionUpdate.userErrors
      .map((e) => e.message)
      .join(', ');
    throw new Error(`Failed to delete category field: ${errors}`);
  }

  console.log('   → Old category field deleted');

  // Mutation 2: Create new metaobject_reference category field
  console.log('   → Creating new metaobject_reference category field...');
  const createVariables = {
    id: definitionId,
    definition: {
      fieldDefinitions: [
        {
          create: {
            key: 'category',
            name: 'Category',
            type: 'metaobject_reference',
            required: true,
            description: 'Gallery category reference',
            validations: [
              {
                name: 'metaobject_definition_id',
                value: categoryDefinitionId,
              },
            ],
          },
        },
      ],
    },
  };

  const createResult = await shopifyAdminRequest<MetaobjectDefinitionUpdateResponse>(
    mutation,
    createVariables
  );

  if (createResult.metaobjectDefinitionUpdate.userErrors.length > 0) {
    const errors = createResult.metaobjectDefinitionUpdate.userErrors
      .map((e) => e.message)
      .join(', ');
    throw new Error(`Failed to create category field: ${errors}`);
  }

  console.log('   → New category field created');
}

/**
 * Get all existing gallery items with their current category text values
 */
async function getGalleryItems(): Promise<
  Array<{ id: string; handle: string; categoryText: string }>
> {
  const query = `
    query {
      metaobjects(type: "gallery_item", first: 100) {
        nodes {
          id
          handle
          fields {
            key
            value
          }
        }
      }
    }
  `;

  const result = await shopifyAdminRequest<GalleryItemsQueryResponse>(query);

  return result.metaobjects.nodes.map((node) => {
    const categoryField = node.fields.find((f) => f.key === 'category');
    return {
      id: node.id,
      handle: node.handle,
      categoryText: categoryField?.value || '',
    };
  });
}

/**
 * Update a gallery item to reference a category metaobject instead of text
 */
async function updateGalleryItemCategory(
  itemId: string,
  categoryId: string
): Promise<void> {
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
      fields: [{ key: 'category', value: categoryId }],
    },
  };

  const result = await shopifyAdminRequest<MetaobjectUpdateResponse>(mutation, variables);

  if (result.metaobjectUpdate.userErrors.length > 0) {
    const errors = result.metaobjectUpdate.userErrors.map((e) => e.message).join(', ');
    throw new Error(`Failed to update gallery item: ${errors}`);
  }
}

/**
 * Get gallery_item definition ID
 */
async function getGalleryItemDefinitionId(): Promise<string> {
  const query = `
    query {
      metaobjectDefinitionByType(type: "gallery_item") {
        id
      }
    }
  `;

  const result = await shopifyAdminRequest<{
    metaobjectDefinitionByType: { id: string };
  }>(query);

  if (!result.metaobjectDefinitionByType) {
    throw new Error('gallery_item definition not found');
  }

  return result.metaobjectDefinitionByType.id;
}

/**
 * Main migration function
 */
async function migrate() {
  const startTime = Date.now();

  console.log('\n🚀 Gallery Category Migration Script');
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

  const categoryIdMap = new Map<string, string>();
  let successful = 0;
  let failed = 0;

  try {
    // Step 1: Create category metaobject definition
    console.log('📋 Step 1/4: Creating gallery_category metaobject definition...');
    if (!DRY_RUN) {
      await createCategoryDefinition();
      console.log('✓ Category definition created\n');
    } else {
      console.log('✓ Would create category definition\n');
    }

    // Step 2: Create category metaobjects
    console.log('📂 Step 2/4: Creating category metaobjects...');
    for (const category of DEFAULT_CATEGORIES) {
      try {
        if (!DRY_RUN) {
          // Check if category already exists
          const existingId = await getExistingCategoryId(category.slug);
          if (existingId) {
            console.log(`   ℹ️  Category "${category.name}" already exists, using existing`);
            categoryIdMap.set(category.slug, existingId);
          } else {
            const categoryId = await createCategory(category);
            categoryIdMap.set(category.slug, categoryId);
            console.log(`   ✓ Created category: ${category.name}`);
          }
        } else {
          console.log(`   ✓ Would create category: ${category.name}`);
          categoryIdMap.set(category.slug, `gid://shopify/Metaobject/mock-${category.slug}`);
        }
        successful++;
      } catch (error) {
        failed++;
        console.error(`   ✗ Failed to create category ${category.name}:`, error);
      }
    }
    console.log('');

    // IMPORTANT: Read gallery items BEFORE deleting the category field
    console.log('📊 Reading existing gallery items...');
    const galleryItems = DRY_RUN ? [] : await getGalleryItems();
    if (!DRY_RUN) {
      console.log(`   Found ${galleryItems.length} gallery items\n`);
    }

    // Step 3: Update gallery_item definition
    console.log('🔄 Step 3/4: Updating gallery_item definition...');
    if (!DRY_RUN) {
      const definitionId = await getGalleryItemDefinitionId();
      await updateGalleryItemDefinition(definitionId);
      console.log('✓ Gallery item definition updated to use category references\n');
    } else {
      console.log('✓ Would update gallery_item definition\n');
    }

    // Step 4: Update existing gallery items
    console.log('🔗 Step 4/4: Updating existing gallery items...');

    if (galleryItems.length === 0 && !DRY_RUN) {
      console.log('   ℹ️  No existing gallery items found to update\n');
    } else {
      console.log(`   Found ${DRY_RUN ? 'N' : galleryItems.length} gallery items to update\n`);

      for (const item of galleryItems) {
        try {
          const categoryId = categoryIdMap.get(item.categoryText);
          if (!categoryId) {
            console.warn(
              `   ⚠️  Unknown category "${item.categoryText}" for item ${item.handle}, skipping`
            );
            failed++;
            continue;
          }

          if (!DRY_RUN) {
            await updateGalleryItemCategory(item.id, categoryId);
            console.log(`   ✓ Updated: ${item.handle} → ${item.categoryText}`);
          } else {
            console.log(`   ✓ Would update: ${item.handle} → ${item.categoryText}`);
          }
          successful++;
        } catch (error) {
          failed++;
          console.error(`   ✗ Failed to update ${item.handle}:`, error);
        }
      }
    }

    const duration = Date.now() - startTime;
    const durationSeconds = (duration / 1000).toFixed(1);

    // Print summary
    console.log('\n' + '━'.repeat(50));
    if (DRY_RUN) {
      console.log('✅ Dry Run Complete!\n');
      console.log('Summary:');
      console.log(`  • Categories validated: ${DEFAULT_CATEGORIES.length}`);
      console.log(`  • Duration: ${durationSeconds}s\n`);
      console.log('Run without --dry-run flag to perform actual migration.');
    } else {
      console.log('✅ Migration Complete!\n');
      console.log('Summary:');
      console.log(`  • Total operations: ${successful + failed}`);
      console.log(`  • Successful: ${successful}`);
      console.log(`  • Failed: ${failed}`);
      console.log(`  • Execution time: ${durationSeconds}s\n`);

      if (failed === 0) {
        console.log('Next steps:');
        console.log('  1. Update GraphQL queries to fetch category references');
        console.log('  2. Update TypeScript types for category objects');
        console.log('  3. Update UI components for dynamic categories');
        console.log('  4. Test gallery page with new category system\n');
      } else {
        console.log('⚠️  Some operations failed. Please review errors above.\n');
      }
    }

    process.exit(failed > 0 ? 1 : 0);
  } catch (error) {
    console.error('\n✗ Fatal error during migration:', error);
    process.exit(1);
  }
}

// Run migration
migrate().catch((error) => {
  console.error('\n✗ Fatal error during migration:', error);
  process.exit(1);
});
