import imageFragment from './image';

/**
 * Lightweight product fragment for product listings and cards.
 * Use this for collection pages, related products, and search results
 * to reduce GraphQL payload size (~60% smaller than full product fragment).
 *
 * For full product details (variants, options, all images, SEO),
 * use the full `product` fragment instead.
 */
const productSummaryFragment = /* GraphQL */ `
  fragment productSummary on Product {
    id
    handle
    availableForSale
    title
    priceRange {
      maxVariantPrice {
        amount
        currencyCode
      }
      minVariantPrice {
        amount
        currencyCode
      }
    }
    featuredImage {
      ...image
    }
    tags
    updatedAt
  }
  ${imageFragment}
`;

export default productSummaryFragment;
