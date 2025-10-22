#!/usr/bin/env ts-node

/**
 * Image Upload Utility for Shopify
 *
 * Uploads local image files to Shopify CDN and attaches them to products.
 *
 * This utility handles:
 * - Staged upload process (required for local files)
 * - Bulk image uploads
 * - Image-to-product associations
 *
 * Requirements:
 * - SHOPIFY_STORE_DOMAIN environment variable
 * - SHOPIFY_ADMIN_ACCESS_TOKEN environment variable
 *
 * Usage:
 *   ts-node scripts/upload-images.ts <productHandle> <imagePath1> <imagePath2> ...
 *   or
 *   npm run upload-images <productHandle> <imagePath1> <imagePath2> ...
 *
 * Example:
 *   ts-node scripts/upload-images.ts seafoam-glass-earrings ./public/stock-assets/products/earrings/sea-glass-earrings.jpg
 */

import * as fs from 'fs'
import * as path from 'path'
import * as crypto from 'crypto'

// ============================================================================
// Configuration
// ============================================================================

const SHOPIFY_STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN || ''
const SHOPIFY_ADMIN_ACCESS_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN || ''
const SHOPIFY_ADMIN_API_VERSION = '2024-01'

if (!SHOPIFY_STORE_DOMAIN || !SHOPIFY_ADMIN_ACCESS_TOKEN) {
  console.error('❌ Error: Missing required environment variables')
  console.error('   Add SHOPIFY_STORE_DOMAIN and SHOPIFY_ADMIN_ACCESS_TOKEN to .env.local')
  process.exit(1)
}

const ADMIN_API_URL = `https://${SHOPIFY_STORE_DOMAIN}/admin/api/${SHOPIFY_ADMIN_API_VERSION}/graphql.json`

// ============================================================================
// GraphQL Mutations
// ============================================================================

const GET_PRODUCT_BY_HANDLE = `
  query getProduct($handle: String!) {
    productByHandle(handle: $handle) {
      id
      title
    }
  }
`

const STAGED_UPLOAD_CREATE = `
  mutation stagedUploadsCreate($input: [StagedUploadInput!]!) {
    stagedUploadsCreate(input: $input) {
      stagedTargets {
        url
        resourceUrl
        parameters {
          name
          value
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`

const CREATE_MEDIA_FROM_URL = `
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
    body: JSON.stringify({ query, variables })
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
// Image Upload Functions
// ============================================================================

/**
 * Get product ID by handle
 */
async function getProductId(handle: string): Promise<string | null> {
  try {
    const result = await shopifyAdminFetch<{
      productByHandle: { id: string; title: string } | null
    }>(GET_PRODUCT_BY_HANDLE, { handle })

    return result.productByHandle?.id || null
  } catch (error) {
    console.error(`Failed to get product with handle "${handle}":`, error)
    return null
  }
}

/**
 * Create staged upload target for image
 */
async function createStagedUpload(
  filename: string,
  mimeType: string,
  fileSize: number
): Promise<{
  url: string
  resourceUrl: string
  parameters: Array<{ name: string; value: string }>
}> {
  const result = await shopifyAdminFetch<{
    stagedUploadsCreate: {
      stagedTargets: Array<{
        url: string
        resourceUrl: string
        parameters: Array<{ name: string; value: string }>
      }>
      userErrors: Array<{ field: string; message: string }>
    }
  }>(STAGED_UPLOAD_CREATE, {
    input: [
      {
        filename,
        mimeType,
        resource: 'IMAGE',
        fileSize: fileSize.toString()
      }
    ]
  })

  if (result.stagedUploadsCreate.userErrors.length > 0) {
    throw new Error(
      `Staged upload failed: ${result.stagedUploadsCreate.userErrors
        .map(e => e.message)
        .join(', ')}`
    )
  }

  return result.stagedUploadsCreate.stagedTargets[0]
}

/**
 * Upload file to staged upload target
 */
async function uploadFileToStaged(
  stagedTarget: {
    url: string
    resourceUrl: string
    parameters: Array<{ name: string; value: string }>
  },
  filePath: string
): Promise<string> {
  const fileBuffer = fs.readFileSync(filePath)
  const formData = new FormData()

  // Add parameters from staged target
  stagedTarget.parameters.forEach(param => {
    formData.append(param.name, param.value)
  })

  // Add file
  const blob = new Blob([fileBuffer])
  formData.append('file', blob, path.basename(filePath))

  const response = await fetch(stagedTarget.url, {
    method: 'POST',
    body: formData
  })

  if (!response.ok) {
    throw new Error(`Failed to upload file: ${response.statusText}`)
  }

  return stagedTarget.resourceUrl
}

/**
 * Attach uploaded image to product
 */
async function attachImageToProduct(
  productId: string,
  imageUrl: string,
  altText: string
): Promise<void> {
  const result = await shopifyAdminFetch<{
    productCreateMedia: {
      media: unknown[]
      mediaUserErrors: Array<{ field: string; message: string }>
    }
  }>(CREATE_MEDIA_FROM_URL, {
    productId,
    media: [
      {
        originalSource: imageUrl,
        alt: altText,
        mediaContentType: 'IMAGE'
      }
    ]
  })

  if (result.productCreateMedia.mediaUserErrors.length > 0) {
    throw new Error(
      `Failed to attach image: ${result.productCreateMedia.mediaUserErrors
        .map(e => e.message)
        .join(', ')}`
    )
  }
}

/**
 * Get MIME type from file extension
 */
function getMimeType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase()
  const mimeTypes: Record<string, string> = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp'
  }
  return mimeTypes[ext] || 'image/jpeg'
}

/**
 * Upload image to Shopify and attach to product
 */
async function uploadImage(
  productHandle: string,
  imagePath: string
): Promise<void> {
  console.log(`\n📸 Uploading: ${path.basename(imagePath)}`)

  // Get product ID
  const productId = await getProductId(productHandle)
  if (!productId) {
    throw new Error(`Product not found with handle: ${productHandle}`)
  }

  console.log(`   Found product: ${productId}`)

  // Check if file exists
  if (!fs.existsSync(imagePath)) {
    throw new Error(`File not found: ${imagePath}`)
  }

  // Get file info
  const filename = path.basename(imagePath)
  const fileSize = fs.statSync(imagePath).size
  const mimeType = getMimeType(imagePath)

  console.log(`   Creating staged upload...`)

  // Create staged upload
  const stagedTarget = await createStagedUpload(filename, mimeType, fileSize)

  console.log(`   Uploading file to CDN...`)

  // Upload file
  const resourceUrl = await uploadFileToStaged(stagedTarget, imagePath)

  console.log(`   Attaching to product...`)

  // Attach to product
  await attachImageToProduct(productId, resourceUrl, filename)

  console.log(`   ✅ Upload complete!`)
}

// ============================================================================
// CLI Entry Point
// ============================================================================

async function main() {
  const args = process.argv.slice(2)

  if (args.length < 2) {
    console.error('Usage: ts-node scripts/upload-images.ts <productHandle> <imagePath1> [imagePath2] ...')
    console.error('')
    console.error('Example:')
    console.error('  ts-node scripts/upload-images.ts seafoam-glass-earrings ./public/stock-assets/products/earrings/sea-glass-earrings.jpg')
    process.exit(1)
  }

  const [productHandle, ...imagePaths] = args

  console.log('🚀 Shopify Image Upload Utility')
  console.log(`   Product: ${productHandle}`)
  console.log(`   Images: ${imagePaths.length}\n`)

  let successCount = 0
  let failCount = 0

  for (const imagePath of imagePaths) {
    try {
      await uploadImage(productHandle, imagePath)
      successCount++
    } catch (error) {
      console.error(`❌ Failed to upload ${imagePath}:`, error)
      failCount++
    }
  }

  console.log('\n' + '='.repeat(60))
  console.log('📊 Upload Summary:')
  console.log(`   ✅ Successfully uploaded: ${successCount}`)
  console.log(`   ❌ Failed: ${failCount}`)
  console.log('='.repeat(60) + '\n')
}

if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch(error => {
      console.error('\n❌ Upload failed:', error)
      process.exit(1)
    })
}

export { uploadImage, getProductId }
