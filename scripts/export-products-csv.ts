#!/usr/bin/env ts-node

/**
 * CSV Export Script for Shopify
 *
 * Exports local products to Shopify-compatible CSV format for manual import.
 *
 * Usage:
 *   ts-node scripts/export-products-csv.ts
 *   or
 *   npm run export:csv
 *
 * Outputs:
 *   - products.csv - Product data in Shopify import format
 *   - images.csv - Image URLs for reference
 *
 * After running this script, import products.csv via:
 *   Shopify Admin → Products → Import
 */

import * as fs from 'fs'
import * as path from 'path'
import { products } from '../data/products'
import type { Product } from '../data/products'

// ============================================================================
// CSV Generation Functions
// ============================================================================

/**
 * Escape CSV field value
 */
function escapeCsvField(value: string | number | boolean | undefined): string {
  if (value === undefined || value === null) {
    return ''
  }

  const stringValue = String(value)

  // If contains comma, quote, or newline, wrap in quotes and escape quotes
  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
    return `"${stringValue.replace(/"/g, '""')}"`
  }

  return stringValue
}

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
 * Build tags string from product
 */
function buildTagsString(product: Product): string {
  const tags: string[] = []

  tags.push(product.category)

  if (product.featured) {
    tags.push('featured')
  }

  product.materials.forEach(material => {
    tags.push(`material:${material}`)
  })

  return tags.join(', ')
}

/**
 * Generate CSV row for a product or variant
 */
interface CsvRow {
  Handle: string
  Title: string
  'Body (HTML)': string
  Vendor: string
  Type: string
  Tags: string
  Published: string
  'Option1 Name': string
  'Option1 Value': string
  'Option2 Name': string
  'Option2 Value': string
  'Option3 Name': string
  'Option3 Value': string
  'Variant SKU': string
  'Variant Grams': string
  'Variant Inventory Tracker': string
  'Variant Inventory Qty': string
  'Variant Inventory Policy': string
  'Variant Fulfillment Service': string
  'Variant Price': string
  'Variant Compare At Price': string
  'Variant Requires Shipping': string
  'Variant Taxable': string
  'Variant Barcode': string
  'Image Src': string
  'Image Position': string
  'Image Alt Text': string
  'Gift Card': string
  'SEO Title': string
  'SEO Description': string
  'Google Shopping / Google Product Category': string
  'Google Shopping / Gender': string
  'Google Shopping / Age Group': string
  'Google Shopping / MPN': string
  'Google Shopping / AdWords Grouping': string
  'Google Shopping / AdWords Labels': string
  'Google Shopping / Condition': string
  'Google Shopping / Custom Product': string
  'Google Shopping / Custom Label 0': string
  'Google Shopping / Custom Label 1': string
  'Google Shopping / Custom Label 2': string
  'Google Shopping / Custom Label 3': string
  'Google Shopping / Custom Label 4': string
  'Variant Image': string
  'Variant Weight Unit': string
  'Variant Tax Code': string
  'Cost per item': string
  Status: string
}

function generateProductRows(product: Product): CsvRow[] {
  const rows: CsvRow[] = []

  const baseRow: Partial<CsvRow> = {
    Handle: product.slug,
    Title: product.name,
    'Body (HTML)': `<p>${product.description}</p>${product.story ? `\n<p><em>${product.story}</em></p>` : ''}`,
    Vendor: 'Fern & Fog Creations',
    Type: mapCategoryToProductType(product.category),
    Tags: buildTagsString(product),
    Published: product.forSale ? 'TRUE' : 'FALSE',
    'Variant Inventory Tracker': '',
    'Variant Inventory Policy': 'deny',
    'Variant Fulfillment Service': 'manual',
    'Variant Requires Shipping': 'TRUE',
    'Variant Taxable': 'TRUE',
    'Gift Card': 'FALSE',
    'SEO Title': product.name,
    'SEO Description': product.description.substring(0, 160),
    'Variant Weight Unit': 'lb',
    Status: product.forSale ? 'active' : 'draft'
  }

  if (product.variants && product.options) {
    // Product with variants
    product.variants.forEach((variant, index) => {
      const isFirstVariant = index === 0

      const row: CsvRow = {
        ...baseRow,
        // Only include product-level data on first variant
        Handle: isFirstVariant ? baseRow.Handle! : product.slug,
        Title: isFirstVariant ? baseRow.Title! : '',
        'Body (HTML)': isFirstVariant ? baseRow['Body (HTML)']! : '',
        Vendor: isFirstVariant ? baseRow.Vendor! : '',
        Type: isFirstVariant ? baseRow.Type! : '',
        Tags: isFirstVariant ? baseRow.Tags! : '',
        Published: isFirstVariant ? baseRow.Published! : '',

        // Options (up to 3)
        'Option1 Name': product.options?.[0]?.name || '',
        'Option1 Value': variant.selectedOptions[0]?.value || '',
        'Option2 Name': product.options?.[1]?.name || '',
        'Option2 Value': variant.selectedOptions[1]?.value || '',
        'Option3 Name': product.options?.[2]?.name || '',
        'Option3 Value': variant.selectedOptions[2]?.value || '',

        // Variant data
        'Variant SKU': variant.sku || `${product.slug}-${variant.id}`,
        'Variant Price': variant.price.toFixed(2),
        'Variant Inventory Qty': variant.quantityAvailable?.toString() || '0',
        'Variant Image': variant.image || '',

        // Image (first variant gets product images)
        'Image Src': isFirstVariant && product.images[0] ? product.images[0] : '',
        'Image Position': isFirstVariant ? '1' : '',
        'Image Alt Text': isFirstVariant ? product.name : '',

        // Empty fields
        'Variant Grams': '',
        'Variant Compare At Price': '',
        'Variant Barcode': '',
        'Google Shopping / Google Product Category': '',
        'Google Shopping / Gender': '',
        'Google Shopping / Age Group': '',
        'Google Shopping / MPN': '',
        'Google Shopping / AdWords Grouping': '',
        'Google Shopping / AdWords Labels': '',
        'Google Shopping / Condition': 'new',
        'Google Shopping / Custom Product': 'TRUE',
        'Google Shopping / Custom Label 0': '',
        'Google Shopping / Custom Label 1': '',
        'Google Shopping / Custom Label 2': '',
        'Google Shopping / Custom Label 3': '',
        'Google Shopping / Custom Label 4': '',
        'Variant Tax Code': '',
        'Cost per item': '',
        'Variant Inventory Tracker': baseRow['Variant Inventory Tracker']!,
        'Variant Inventory Policy': baseRow['Variant Inventory Policy']!,
        'Variant Fulfillment Service': baseRow['Variant Fulfillment Service']!,
        'Variant Requires Shipping': baseRow['Variant Requires Shipping']!,
        'Variant Taxable': baseRow['Variant Taxable']!,
        'Gift Card': baseRow['Gift Card']!,
        'SEO Title': isFirstVariant ? baseRow['SEO Title']! : '',
        'SEO Description': isFirstVariant ? baseRow['SEO Description']! : '',
        'Variant Weight Unit': baseRow['Variant Weight Unit']!,
        Status: isFirstVariant ? baseRow.Status! : ''
      }

      rows.push(row)
    })
  } else {
    // Simple product (no variants)
    const row: CsvRow = {
      ...baseRow,
      'Option1 Name': '',
      'Option1 Value': '',
      'Option2 Name': '',
      'Option2 Value': '',
      'Option3 Name': '',
      'Option3 Value': '',
      'Variant SKU': product.slug,
      'Variant Grams': '',
      'Variant Price': product.price.toFixed(2),
      'Variant Compare At Price': '',
      'Variant Inventory Qty': '0',
      'Variant Barcode': '',
      'Image Src': product.images[0] || '',
      'Image Position': '1',
      'Image Alt Text': product.name,
      'Variant Image': '',
      'Google Shopping / Google Product Category': '',
      'Google Shopping / Gender': '',
      'Google Shopping / Age Group': '',
      'Google Shopping / MPN': '',
      'Google Shopping / AdWords Grouping': '',
      'Google Shopping / AdWords Labels': '',
      'Google Shopping / Condition': 'new',
      'Google Shopping / Custom Product': 'TRUE',
      'Google Shopping / Custom Label 0': '',
      'Google Shopping / Custom Label 1': '',
      'Google Shopping / Custom Label 2': '',
      'Google Shopping / Custom Label 3': '',
      'Google Shopping / Custom Label 4': '',
      'Variant Tax Code': '',
      'Cost per item': '',
      'Variant Inventory Tracker': baseRow['Variant Inventory Tracker']!,
      'Variant Inventory Policy': baseRow['Variant Inventory Policy']!,
      'Variant Fulfillment Service': baseRow['Variant Fulfillment Service']!,
      'Variant Requires Shipping': baseRow['Variant Requires Shipping']!,
      'Variant Taxable': baseRow['Variant Taxable']!,
      'Gift Card': baseRow['Gift Card']!,
      'SEO Title': baseRow['SEO Title']!,
      'SEO Description': baseRow['SEO Description']!,
      'Variant Weight Unit': baseRow['Variant Weight Unit']!,
      Status: baseRow.Status!
    } as CsvRow

    rows.push(row)
  }

  return rows
}

/**
 * Generate CSV content
 */
function generateCsv(): string {
  const allRows: CsvRow[] = []

  // Generate rows for all products
  products.forEach(product => {
    const rows = generateProductRows(product)
    allRows.push(...rows)
  })

  // Get headers from first row
  const headers = Object.keys(allRows[0]) as Array<keyof CsvRow>

  // Generate CSV lines
  const lines: string[] = []

  // Header row
  lines.push(headers.map(h => escapeCsvField(h)).join(','))

  // Data rows
  allRows.forEach(row => {
    const values = headers.map(header => escapeCsvField(row[header]))
    lines.push(values.join(','))
  })

  return lines.join('\n')
}

/**
 * Generate images reference CSV
 */
function generateImagesCSV(): string {
  const lines: string[] = []

  lines.push('Product Handle,Image Path,Image URL,Image Position')

  products.forEach(product => {
    product.images.forEach((image, index) => {
      lines.push(
        [
          escapeCsvField(product.slug),
          escapeCsvField(image),
          escapeCsvField(''), // URL (leave empty for local paths)
          escapeCsvField(index + 1)
        ].join(',')
      )
    })
  })

  return lines.join('\n')
}

// ============================================================================
// Main Function
// ============================================================================

async function main() {
  console.log('📦 Exporting products to Shopify CSV format...\n')

  const outputDir = path.join(process.cwd(), 'exports')

  // Create exports directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }

  // Generate and write products CSV
  const productsCsv = generateCsv()
  const productsPath = path.join(outputDir, 'products.csv')
  fs.writeFileSync(productsPath, productsCsv, 'utf-8')
  console.log(`✅ Exported: ${productsPath}`)
  console.log(`   Products: ${products.length}`)

  // Generate and write images CSV
  const imagesCsv = generateImagesCSV()
  const imagesPath = path.join(outputDir, 'images.csv')
  fs.writeFileSync(imagesPath, imagesCsv, 'utf-8')
  console.log(`✅ Exported: ${imagesPath}`)

  console.log('\n' + '='.repeat(60))
  console.log('📊 Export Summary:')
  console.log(`   Products exported: ${products.length}`)
  console.log(`   Total variants: ${products.reduce((sum, p) => sum + (p.variants?.length || 1), 0)}`)
  console.log('')
  console.log('Next steps:')
  console.log('  1. Upload images to a public URL (or use image upload script)')
  console.log('  2. Update image URLs in products.csv if needed')
  console.log('  3. Import products.csv via Shopify Admin → Products → Import')
  console.log('='.repeat(60) + '\n')
}

if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch(error => {
      console.error('\n❌ Export failed:', error)
      process.exit(1)
    })
}

export { generateCsv, generateImagesCSV }
