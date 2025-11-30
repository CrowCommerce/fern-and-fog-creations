/**
 * Shopify Metaobject Operations
 *
 * Handles creating and managing Shopify metaobjects for gallery items and categories.
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
  categoryId: string; // Shopify metaobject GID for category
  imageId: string; // Shopify file GID
  materials: string[];
  story: string;
  forSale: boolean;
  createdDate: string;
  legacyId: string; // Original ID from data/gallery.ts
}

export interface CategoryData {
  name: string;
  slug: string;
  description: string;
  sortOrder: number;
}

export const DEFAULT_CATEGORIES: CategoryData[] = [
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

/**
 * Create the gallery_category metaobject definition
 */
export async function createGalleryCategoryDefinition(): Promise<string> {
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

  try {
    const result = await shopifyAdminRequest<MetaobjectDefinitionResponse>(mutation, variables);

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
  } catch (error) {
    throw new Error(
      `Failed to create gallery_category definition: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Get the ID of an existing gallery_category metaobject definition
 */
export async function getExistingCategoryDefinitionId(): Promise<string> {
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
    metaobjectDefinitionByType: MetaobjectDefinition | null;
  }>(query);

  if (!result.metaobjectDefinitionByType) {
    throw new Error('Category definition not found');
  }

  return result.metaobjectDefinitionByType.id;
}

/**
 * Create a category metaobject
 */
export async function createCategory(category: CategoryData): Promise<string> {
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
export async function getExistingCategoryId(slug: string): Promise<string | null> {
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
 * Create the gallery_item metaobject definition with category as metaobject_reference
 *
 * @param categoryDefinitionId - The GID of the gallery_category definition
 */
export async function createGalleryItemDefinition(categoryDefinitionId: string): Promise<string> {
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
    const result = await shopifyAdminRequest<MetaobjectDefinitionResponse>(mutation, variables);

    const alreadyExistsError = result.metaobjectDefinitionCreate.userErrors.find(
      (err) => err.code === 'TAKEN' || err.message.includes('already exists')
    );

    if (alreadyExistsError) {
      console.log('   ℹ️  Gallery item definition already exists, skipping creation');
      return await getExistingDefinitionId();
    }

    if (result.metaobjectDefinitionCreate.userErrors.length > 0) {
      const errors = result.metaobjectDefinitionCreate.userErrors.map((e) => e.message).join(', ');
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
 * @param handle - URL-friendly handle for the item
 * @param fields - Gallery item field data (categoryId is now a metaobject GID)
 */
export async function createGalleryItem(handle: string, fields: GalleryItemFields): Promise<string> {
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
        { key: 'category', value: fields.categoryId },
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
    const result = await shopifyAdminRequest<MetaobjectCreateResponse>(mutation, variables);

    if (result.metaobjectCreate.userErrors.length > 0) {
      const errors = result.metaobjectCreate.userErrors
        .map((e) => `${e.field ? e.field.join('.') + ': ' : ''}${e.message}`)
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

  const result = await shopifyAdminRequest<MetaobjectDeleteResponse>(mutation, variables);

  if (result.metaobjectDelete.userErrors.length > 0) {
    const errors = result.metaobjectDelete.userErrors.map((e) => e.message).join(', ');
    throw new Error(`Failed to delete metaobject: ${errors}`);
  }
}

/**
 * Generate a URL-friendly handle from a title
 */
export function generateHandle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
