#!/usr/bin/env ts-node

/**
 * Automated Migration Script: Local Products → Shopify
 *
 * This script uploads products from src/data/products.ts to Shopify using
 * the Admin GraphQL API.
 *
 * Requirements:
 * - SHOPIFY_STORE_DOMAIN environment variable
 * - SHOPIFY_ADMIN_ACCESS_TOKEN environment variable (not Storefront token!)
 *
 * Usage:
 *   npm run migrate:shopify
 *   or
 *   ts-node scripts/migrate-to-shopify.ts
 *
 * Features:
 * - Creates products with variants and options
 * - Uploads images to Shopify CDN
 * - Sets product tags and metafields
 * - Shows progress with detailed logging
 * - Handles errors gracefully
 */

import * as fs from 'fs'
import * as path from 'path'
import { products } from '../src/data/products'
import type { Product } from '../src/data/products'

// ============================================================================
// Configuration
// ============================================================================

const SHOPIFY_STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN || ''
const SHOPIFY_ADMIN_ACCESS_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN || ''
const SHOPIFY_ADMIN_API_VERSION = '2024-01' // Update as needed

if (!SHOPIFY_STORE_DOMAIN || !SHOPIFY_ADMIN_ACCESS_TOKEN) {
  console.error('❌ Error: Missing required environment variables:')
  console.error('   - SHOPIFY_STORE_DOMAIN')
  console.error('   - SHOPIFY_ADMIN_ACCESS_TOKEN')
  console.error('')
  console.error('Add these to your .env.local file')
  process.exit(1)
}

const ADMIN_API_URL = `https://${SHOPIFY_STORE_DOMAIN}/admin/api/${SHOPIFY_ADMIN_API_VERSION}/graphql.json`

// ============================================================================
// GraphQL Mutations
// ============================================================================

const CREATE_PRODUCT_MUTATION = `
  mutation createProduct($input: ProductInput!) {
    productCreate(input: $input) {
      product {
        id
        title
        handle
        status
        variants(first: 250) {
          edges {
            node {
              id
              title
              sku
              price
            }
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`

const UPLOAD_IMAGE_MUTATION = `
  mutation productCreateMedia($media: [CreateMediaInput!]!, $productId: ID!) {
    productCreateMedia(media: $media, productId: $productId) {
      media {
        alt
        mediaContentType
        status
      }
      mediaUserErrors {
        field
        message
      }
    }
  }
`

// ============================================================================
// Shopify API Client
// ============================================================================

async function shopifyAdminFetch<T = unknown>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  const response = await fetch(ADMIN_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': SHOPIFY_ADMIN_ACCESS_TOKEN
    },
    body: JSON.stringify({
      query,
      variables
    })
  })

  if (!response.ok) {
    throw new Error(`Shopify API request failed: ${response.statusText}`)
  }

  const result = await response.json()

  if (result.errors) {
    throw new Error(`GraphQL errors: ${JSON.stringify(result.errors)}`)
  }

  return result.data as T
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Map local category to Shopify product type
 */
function mapCategoryToProductType(category: Product['category']): string {
  const mapping: Record<Product['category'], string> = {
    'earrings': 'Earrings',
    'resin': 'Resin Art',
    'driftwood': 'Driftwood Décor',
    'wall-hangings': 'Wall Hangings'
  }
  return mapping[category]
}

/**
 * Build tags array from product metadata
 */
function buildTags(product: Product): string[] {
  const tags: string[] = []

  // Add category tag
  tags.push(product.category)

  // Add featured tag
  if (product.featured) {
    tags.push('featured')
  }

  // Add material tags (with "material:" prefix)
  product.materials.forEach(material => {
    tags.push(`material:${material}`)
  })

  return tags
}

/**
 * Upload image from local filesystem or URL to Shopify
 */
async function uploadProductImages(
  productId: string,
  images: string[]
): Promise<void> {
  const mediaInputs = images.map(imageUrl => {
    // Check if image is local file path or external URL
    const isLocalFile = imageUrl.startsWith('/') || imageUrl.startsWith('./')

    if (isLocalFile) {
      // For local files, we need to upload via staged upload
      // This is more complex and requires separate mutation
      console.warn(`⚠️  Skipping local image: ${imageUrl} (use image upload utility instead)`)
      return null
    }

    return {
      originalSource: imageUrl,
      alt: path.basename(imageUrl, path.extname(imageUrl)),
      mediaContentType: 'IMAGE'
    }
  }).filter(Boolean)

  if (mediaInputs.length === 0) {
    return
  }

  try {
    await shopifyAdminFetch(UPLOAD_IMAGE_MUTATION, {
      productId,
      media: mediaInputs
    })
  } catch (error) {
    console.error(`Failed to upload images for product ${productId}:`, error)
  }
}

/**
 * Create product in Shopify with variants
 */
async function createProduct(product: Product): Promise<void> {
  console.log(`\n📦 Creating product: ${product.name}`)

  // Build product input
  const productInput: Record<string, unknown> = {
    title: product.name,
    descriptionHtml: `<p>${product.description}</p>${product.story ? `\n<p><em>${product.story}</em></p>` : ''}`,
    productType: mapCategoryToProductType(product.category),
    vendor: 'Fern & Fog Creations',
    tags: buildTags(product),
    status: product.forSale ? 'ACTIVE' : 'DRAFT'
  }

  // Handle variants vs single product
  if (product.variants && product.options) {
    // Product with variants
    productInput.options = product.options.map(opt => opt.name)
    productInput.variants = product.variants.map(variant => ({
      title: variant.title,
      price: variant.price.toString(),
      sku: variant.sku || `${product.slug}-${variant.id}`,
      inventoryQuantities: variant.quantityAvailable
        ? [
            {
              availableQuantity: variant.quantityAvailable,
              locationId: 'gid://shopify/Location/XXXXX' // TODO: Get from settings
            }
          ]
        : [],
      options: variant.selectedOptions.map(opt => opt.value)
    }))
  } else {
    // Simple product (no variants)
    productInput.variants = [
      {
        price: product.price.toString(),
        sku: product.slug,
        inventoryQuantities: []
      }
    ]
  }

  try {
    // Create product
    const result = await shopifyAdminFetch<{
      productCreate: {
        product: { id: string; handle: string }
        userErrors: Array<{ field: string; message: string }>
      }
    }>(CREATE_PRODUCT_MUTATION, { input: productInput })

    if (result.productCreate.userErrors.length > 0) {
      console.error('❌ Failed to create product:')
      result.productCreate.userErrors.forEach(error => {
        console.error(`   - ${error.field}: ${error.message}`)
      })
      return
    }

    const createdProduct = result.productCreate.product
    console.log(`✅ Created: ${createdProduct.handle} (ID: ${createdProduct.id})`)

    // Upload images (if external URLs)
    if (product.images.length > 0) {
      console.log(`   📸 Uploading ${product.images.length} image(s)...`)
      await uploadProductImages(createdProduct.id, product.images)
    }
  } catch (error) {
    console.error(`❌ Error creating product "${product.name}":`, error)
  }
}

// ============================================================================
// Main Migration Function
// ============================================================================

async function migrateProducts() {
  console.log('🚀 Starting product migration to Shopify...\n')
  console.log(`   Store: ${SHOPIFY_STORE_DOMAIN}`)
  console.log(`   Products to migrate: ${products.length}\n`)

  let successCount = 0
  let failCount = 0

  for (const product of products) {
    try {
      await createProduct(product)
      successCount++
    } catch (error) {
      console.error(`❌ Failed to migrate ${product.name}:`, error)
      failCount++
    }

    // Add small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500))
  }

  console.log('\n' + '='.repeat(60))
  console.log('📊 Migration Summary:')
  console.log(`   ✅ Successfully migrated: ${successCount}`)
  console.log(`   ❌ Failed: ${failCount}`)
  console.log(`   📦 Total: ${products.length}`)
  console.log('='.repeat(60) + '\n')
}

// ============================================================================
// Entry Point
// ============================================================================

if (require.main === module) {
  migrateProducts()
    .then(() => {
      console.log('✨ Migration complete!\n')
      process.exit(0)
    })
    .catch(error => {
      console.error('\n❌ Migration failed:', error)
      process.exit(1)
    })
}

export { migrateProducts, createProduct }
