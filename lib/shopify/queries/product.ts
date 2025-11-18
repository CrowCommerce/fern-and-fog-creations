import productFragment from '../fragments/product';
import productSummaryFragment from '../fragments/product-summary';

// Individual product detail page - needs full data (variants, images, SEO)
export const getProductQuery = /* GraphQL */ `
  query getProduct($handle: String!) {
    product(handle: $handle) {
      ...product
    }
  }
  ${productFragment}
`;

// Product listing page - use lightweight fragment for better performance
export const getProductsQuery = /* GraphQL */ `
  query getProducts($sortKey: ProductSortKeys, $reverse: Boolean, $query: String) {
    products(sortKey: $sortKey, reverse: $reverse, query: $query, first: 100) {
      edges {
        node {
          ...productSummary
        }
      }
    }
  }
  ${productSummaryFragment}
`;

// Related products - use lightweight fragment for better performance
export const getProductRecommendationsQuery = /* GraphQL */ `
  query getProductRecommendations($productId: ID!) {
    productRecommendations(productId: $productId) {
      ...productSummary
    }
  }
  ${productSummaryFragment}
`;
