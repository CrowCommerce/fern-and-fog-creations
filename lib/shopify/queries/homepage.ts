/**
 * Homepage GraphQL Queries
 *
 * Fetches homepage content from Shopify metaobjects
 */

export const getHomepageHeroQuery = /* GraphQL */ `
  query getHomepageHero {
    metaobjects(type: "homepage_hero", first: 1) {
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

export const getHomepageCategoriesQuery = /* GraphQL */ `
  query getHomepageCategories($first: Int!) {
    metaobjects(type: "homepage_category", first: $first, sortKey: "updated_at") {
      nodes {
        id
        handle
        fields {
          key
          value
          reference {
            ... on MediaImage {
              image {
                url
                altText
                width
                height
              }
            }
          }
        }
      }
    }
  }
`;

export const getHomepageFeaturesQuery = /* GraphQL */ `
  query getHomepageFeatures($first: Int!) {
    metaobjects(type: "homepage_feature", first: $first, sortKey: "updated_at") {
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
