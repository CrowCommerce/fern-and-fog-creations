/**
 * Shopify Metaobject Operations
 *
 * Handles creating and managing Shopify metaobjects for gallery items.
 */

import { shopifyAdminRequest } from './shopify-admin.js';

interface MetaobjectDefinition {
  id: string;
  type: string;
  name: string;
}

interface MetaobjectDefinitionResponse {
  metaobjectDefinitionCreate: {
    metaobjectDefinition?: MetaobjectDefinition;
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

interface MetaobjectDeleteResponse {
  metaobjectDelete: {
    deletedId?: string;
    userErrors: Array<{ field?: string[]; message: string }>;
  };
}

export interface GalleryItemFields {
  title: string;
  category: string;
  imageId: string; // Shopify file GID
  materials: string[];
  story: string;
  forSale: boolean;
  createdDate: string;
  legacyId: string; // Original ID from data/gallery.ts
}

/**
 * Create the gallery_item metaobject definition
 *
 * This only needs to be run once. If the definition already exists,
 * the mutation will return an error which we handle gracefully.
 *
 * @returns Metaobject definition ID
 */
export async function createGalleryItemDefinition(): Promise<string> {
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
      name: 'Gallery Item',
      type: 'gallery_item',
      fieldDefinitions: [
        {
          key: 'title',
          name: 'Title',
          type: 'single_line_text_field',
          required: true,
        },
        {
          key: 'category',
          name: 'Category',
          type: 'single_line_text_field',
          required: true,
          validations: [
            {
              name: 'choices',
              value: JSON.stringify(['earrings', 'resin', 'driftwood', 'wall-hangings']),
            },
          ],
        },
        {
          key: 'image',
          name: 'Image',
          type: 'file_reference',
          required: true,
        },
        {
          key: 'materials',
          name: 'Materials',
          type: 'list.single_line_text_field',
          required: false,
        },
        {
          key: 'story',
          name: 'Story',
          type: 'multi_line_text_field',
          required: false,
        },
        {
          key: 'for_sale',
          name: 'For Sale',
          type: 'boolean',
          required: false,
        },
        {
          key: 'created_date',
          name: 'Created Date',
          type: 'date',
          required: false,
        },
        {
          key: 'legacy_id',
          name: 'Legacy ID',
          type: 'single_line_text_field',
          required: false,
          description: 'Original ID from data/gallery.ts for reference',
        },
      ],
      displayNameKey: 'title',
    },
  };

  try {
    const result = await shopifyAdminRequest<MetaobjectDefinitionResponse>(
      mutation,
      variables
    );

    // Check for "already exists" error
    const alreadyExistsError = result.metaobjectDefinitionCreate.userErrors.find(
      err => err.code === 'TAKEN' || err.message.includes('already exists')
    );

    if (alreadyExistsError) {
      console.log('ℹ️  Gallery item definition already exists, skipping creation');
      // Query existing definition to get ID
      return await getExistingDefinitionId();
    }

    if (result.metaobjectDefinitionCreate.userErrors.length > 0) {
      const errors = result.metaobjectDefinitionCreate.userErrors
        .map(e => e.message)
        .join(', ');
      throw new Error(`Failed to create metaobject definition: ${errors}`);
    }

    const definition = result.metaobjectDefinitionCreate.metaobjectDefinition;
    if (!definition) {
      throw new Error('No metaobject definition returned');
    }

    return definition.id;
  } catch (error) {
    throw new Error(
      `Failed to create gallery_item definition: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Get the ID of an existing gallery_item metaobject definition
 */
async function getExistingDefinitionId(): Promise<string> {
  const query = `
    query {
      metaobjectDefinitionByType(type: "gallery_item") {
        id
        type
        name
      }
    }
  `;

  const result = await shopifyAdminRequest<{
    metaobjectDefinitionByType: MetaobjectDefinition;
  }>(query);

  if (!result.metaobjectDefinitionByType) {
    throw new Error('Gallery item definition not found');
  }

  return result.metaobjectDefinitionByType.id;
}

/**
 * Create a gallery item metaobject entry
 *
 * @param handle - URL-friendly handle for the item (e.g., "first-light-sea-glass-collection")
 * @param fields - Gallery item field data
 * @returns Created metaobject ID
 */
export async function createGalleryItem(
  handle: string,
  fields: GalleryItemFields
): Promise<string> {
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
      type: 'gallery_item',
      handle,
      fields: [
        { key: 'title', value: fields.title },
        { key: 'category', value: fields.category },
        { key: 'image', value: fields.imageId },
        { key: 'materials', value: JSON.stringify(fields.materials) },
        { key: 'story', value: fields.story },
        { key: 'for_sale', value: String(fields.forSale) },
        { key: 'created_date', value: fields.createdDate },
        { key: 'legacy_id', value: fields.legacyId },
      ],
    },
  };

  try {
    const result = await shopifyAdminRequest<MetaobjectCreateResponse>(
      mutation,
      variables
    );

    if (result.metaobjectCreate.userErrors.length > 0) {
      const errors = result.metaobjectCreate.userErrors
        .map(e => `${e.field ? e.field.join('.') + ': ' : ''}${e.message}`)
        .join(', ');
      throw new Error(`Failed to create metaobject: ${errors}`);
    }

    const metaobject = result.metaobjectCreate.metaobject;
    if (!metaobject) {
      throw new Error('No metaobject returned from mutation');
    }

    return metaobject.id;
  } catch (error) {
    throw new Error(
      `Failed to create gallery item "${fields.title}": ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Delete a gallery item metaobject by ID
 *
 * Used by the rollback script to clean up created items.
 *
 * @param id - Metaobject GID
 */
export async function deleteGalleryItem(id: string): Promise<void> {
  const mutation = `
    mutation metaobjectDelete($id: ID!) {
      metaobjectDelete(id: $id) {
        deletedId
        userErrors {
          field
          message
        }
      }
    }
  `;

  const variables = { id };

  const result = await shopifyAdminRequest<MetaobjectDeleteResponse>(
    mutation,
    variables
  );

  if (result.metaobjectDelete.userErrors.length > 0) {
    const errors = result.metaobjectDelete.userErrors
      .map(e => e.message)
      .join(', ');
    throw new Error(`Failed to delete metaobject: ${errors}`);
  }
}

/**
 * Generate a URL-friendly handle from a title
 *
 * @param title - Gallery item title
 * @returns URL-friendly handle
 */
export function generateHandle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
