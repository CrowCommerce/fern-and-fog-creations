/**
 * GraphQL query for fetching page metadata from Shopify Metaobjects
 *
 * Page metadata is stored as metaobjects with type "page_metadata".
 * This allows business users to edit page titles, descriptions, and SEO settings
 * without code changes.
 *
 * IMPORTANT: This query uses the Admin API pattern (metaobjectByHandle)
 * which is NOT available in the Storefront API. We need to use metaobjects query instead.
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
