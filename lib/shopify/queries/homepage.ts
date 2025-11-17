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
