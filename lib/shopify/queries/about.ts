/**
 * About Page GraphQL Queries
 *
 * Fetches about page content from Shopify metaobjects
 */

export const getAboutPageQuery = /* GraphQL */ `
  query getAboutPage {
    metaobjects(type: "about_page", first: 1) {
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

export const getAboutProcessStepsQuery = /* GraphQL */ `
  query getAboutProcessSteps($first: Int!) {
    metaobjects(type: "about_process_step", first: $first, sortKey: "updated_at") {
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

export const getAboutValuesQuery = /* GraphQL */ `
  query getAboutValues($first: Int!) {
    metaobjects(type: "about_value", first: $first, sortKey: "updated_at") {
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
