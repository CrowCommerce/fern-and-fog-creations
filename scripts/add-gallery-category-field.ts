#!/usr/bin/env tsx

/**
 * Add Category Field to Gallery Item Script
 *
 * Adds the missing 'category' field to the gallery_item metaobject definition.
 * This fixes the "Field definition 'category' does not exist" error.
 *
 * Usage:
 *   pnpm fix:gallery:add-category-field
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
    };
  }>(query);

  if (!result.metaobjectDefinitionByType) {
    throw new Error('gallery_item definition not found');
  }

  // Check if category field already exists
  const categoryField = result.metaobjectDefinitionByType.fieldDefinitions.find(
    (f) => f.key === 'category'
  );

  if (categoryField) {
    throw new Error(
      `Category field already exists as type "${categoryField.type.name}". No action needed.`
    );
  }

  return result.metaobjectDefinitionByType.id;
}

/**
 * Add category field to gallery_item definition
 */
async function addCategoryField(definitionId: string): Promise<void> {
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
            type: 'single_line_text_field',
            required: false, // false to allow existing items without category
            description: 'Category slug (earrings, resin, driftwood, wall-hangings)',
            validations: [
              {
                name: 'choices',
                value: JSON.stringify(['earrings', 'resin', 'driftwood', 'wall-hangings']),
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
    throw new Error(`Failed to add category field: ${errors}`);
  }
}

/**
 * Main function
 */
async function main() {
  console.log('\n🔧 Add Category Field to Gallery Item');
  console.log('━'.repeat(50));

  // Validate connection
  console.log('📡 Validating Shopify connection...');
  const connected = await validateConnection();
  if (!connected) {
    console.error('\n✗ Failed to connect to Shopify. Please check your credentials.');
    process.exit(1);
  }
  console.log('✓ Connected to Shopify Admin API\n');

  try {
    // Get definition and check if field exists
    console.log('🔍 Checking gallery_item definition...');
    const definitionId = await getGalleryItemDefinitionId();
    console.log('✓ Definition found, category field is missing\n');

    // Add the category field
    console.log('➕ Adding category field...');
    await addCategoryField(definitionId);
    console.log('✓ Category field added successfully!\n');

    console.log('━'.repeat(50));
    console.log('✅ Done!\n');
    console.log('Next step: Run `pnpm fix:gallery:categories` to populate category values.\n');
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
