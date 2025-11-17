/**
 * Contact Page GraphQL Query
 *
 * Fetches contact page content from Shopify metaobjects
 */

export const getContactPageQuery = /* GraphQL */ `
  query getContactPage {
    metaobjects(type: "contact_page", first: 1) {
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
