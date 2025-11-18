/**
 * GraphQL query for fetching page metadata from Shopify Metaobjects
 *
 * Page metadata is stored as metaobjects with type "page_metadata".
 * This allows business users to edit page titles, descriptions, and SEO settings
 * without code changes.
 *
 * Note: This query uses the Storefront API metaobjects query pattern.
 * The metaobjects query is available in the Storefront API and allows filtering by type.
 */

export const getPageMetadataQuery = /* GraphQL */ `
  query getPageMetadata($type: String!, $first: Int!) {
    metaobjects(type: $type, first: $first) {
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
