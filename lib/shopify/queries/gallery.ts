/**
 * GraphQL query for fetching gallery items from Shopify Metaobjects
 *
 * Gallery items are stored as metaobjects with type "gallery_item"
 * This query fetches all gallery items with their associated fields, image references,
 * and category metaobject references.
 */

export const getGalleryItemsQuery = /* GraphQL */ `
  query getGalleryItems($first: Int!) {
    metaobjects(type: "gallery_item", first: $first) {
      nodes {
        id
        handle
        fields {
          key
          value
          reference {
            ... on MediaImage {
              image {
                url(transform: { maxWidth: 1200, preferredContentType: WEBP })
                altText
                width
                height
              }
            }
            ... on Metaobject {
              id
              handle
              type
              fields {
                key
                value
              }
            }
          }
        }
      }
    }
  }
`;

/**
 * GraphQL query for fetching gallery page settings from Shopify Metaobjects
 *
 * Gallery page settings are stored as a singleton metaobject with type "gallery_page_settings"
 * and handle "main". This allows business users to edit the page heading and description
 * without code changes.
 *
 * Note: Uses metaobjects query (not metaobjectByHandle) because Storefront API doesn't support
 * metaobjectByHandle - that's only available in Admin API.
 */

export const getGalleryPageSettingsQuery = /* GraphQL */ `
  query getGalleryPageSettings {
    metaobjects(type: "gallery_page_settings", first: 1) {
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
