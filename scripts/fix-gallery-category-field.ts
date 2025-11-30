#!/usr/bin/env tsx

/**
 * Fix Gallery Category Field Script
 *
 * Updates the gallery_item metaobject definition to change the 'category' field
 * from a text field to a metaobject_reference pointing to gallery_category.
 *
 * This is a one-time fix script. After running, you can delete it.
 *
 * Usage:
 *   pnpm fix:gallery:category-field
 */

import { validateConnection, shopifyAdminRequest } from './lib/shopify-admin.js';

interface MetaobjectDefinitionUpdateResponse {
  metaobjectDefinitionUpdate: {
    metaobjectDefinition?: {
      id: string;
    };
    userErrors: Array<{ field?: string[]; message: string }>;
  };
}

/**
 * Get gallery_item definition ID
 */
async function getGalleryItemDefinitionId(): Promise<string> {
  const query = `
    query {
      metaobjectDefinitionByType(type: "gallery_item") {
        id
        fieldDefinitions {
          key
          name
          type {
            name
          }
        }
      }
    }
  `;

  const result = await shopifyAdminRequest<{
    metaobjectDefinitionByType: {
      id: string;
      fieldDefinitions: Array<{ key: string; name: string; type: { name: string } }>;
    } | null;
  }>(query);

  if (!result.metaobjectDefinitionByType) {
    throw new Error('gallery_item definition not found');
  }

  // Check current category field type
  const categoryField = result.metaobjectDefinitionByType.fieldDefinitions.find(
    (f) => f.key === 'category'
  );

  if (categoryField) {
    console.log(`   Current category field type: ${categoryField.type.name}`);
    if (categoryField.type.name === 'metaobject_reference') {
      throw new Error('Category field is already a metaobject_reference. No fix needed!');
    }
  } else {
    throw new Error('Category field not found on gallery_item definition');
  }

  return result.metaobjectDefinitionByType.id;
}

/**
 * Get gallery_category definition ID
 */
async function getCategoryDefinitionId(): Promise<string> {
  const query = `
    query {
      metaobjectDefinitionByType(type: "gallery_category") {
        id
      }
    }
  `;

  const result = await shopifyAdminRequest<{
    metaobjectDefinitionByType: { id: string } | null;
  }>(query);

  if (!result.metaobjectDefinitionByType) {
    throw new Error(
      'gallery_category definition not found. Run migrate:gallery first to create categories.'
    );
  }

  return result.metaobjectDefinitionByType.id;
}

/**
 * Delete the old category field
 */
async function deleteCategoryField(definitionId: string): Promise<void> {
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

  const variables = {
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

  const result = await shopifyAdminRequest<MetaobjectDefinitionUpdateResponse>(mutation, variables);

  if (result.metaobjectDefinitionUpdate.userErrors.length > 0) {
    const errors = result.metaobjectDefinitionUpdate.userErrors.map((e) => e.message).join(', ');
    throw new Error(`Failed to delete category field: ${errors}`);
  }
}

/**
 * Create the new category field as metaobject_reference
 */
async function createCategoryReferenceField(
  definitionId: string,
  categoryDefinitionId: string
): Promise<void> {
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

  const variables = {
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

  const result = await shopifyAdminRequest<MetaobjectDefinitionUpdateResponse>(mutation, variables);

  if (result.metaobjectDefinitionUpdate.userErrors.length > 0) {
    const errors = result.metaobjectDefinitionUpdate.userErrors.map((e) => e.message).join(', ');
    throw new Error(`Failed to create category reference field: ${errors}`);
  }
}

/**
 * Main function
 */
async function main() {
  console.log('\n🔧 Fix Gallery Category Field');
  console.log('━'.repeat(50));
  console.log('This will convert the category field from text to metaobject_reference\n');

  // Validate connection
  console.log('📡 Validating Shopify connection...');
  const connected = await validateConnection();
  if (!connected) {
    console.error('\n✗ Failed to connect to Shopify. Please check your credentials.');
    process.exit(1);
  }
  console.log('✓ Connected to Shopify Admin API\n');

  try {
    // Get gallery_item definition
    console.log('🔍 Checking gallery_item definition...');
    const galleryItemDefId = await getGalleryItemDefinitionId();
    console.log('✓ Found gallery_item definition\n');

    // Get gallery_category definition
    console.log('🔍 Checking gallery_category definition...');
    const categoryDefId = await getCategoryDefinitionId();
    console.log('✓ Found gallery_category definition\n');

    // Step 1: Delete old field
    console.log('🗑️  Step 1/2: Deleting old text-based category field...');
    await deleteCategoryField(galleryItemDefId);
    console.log('✓ Old category field deleted\n');

    // Step 2: Create new field
    console.log('➕ Step 2/2: Creating new metaobject_reference category field...');
    await createCategoryReferenceField(galleryItemDefId, categoryDefId);
    console.log('✓ New category reference field created\n');

    console.log('━'.repeat(50));
    console.log('✅ Fix Complete!\n');
    console.log('The category field is now a metaobject_reference to gallery_category.');
    console.log('\n⚠️  Note: Existing gallery items will have lost their category values.');
    console.log('You may need to re-assign categories to each gallery item in Shopify Admin.\n');
  } catch (error) {
    console.error('\n✗ Error:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

// Run
main().catch((error) => {
  console.error('\n✗ Fatal error:', error);
  process.exit(1);
});
