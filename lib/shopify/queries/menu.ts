import menuFragment from '../fragments/menu';

export const getMenuQuery = /* GraphQL */ `
  query getMenu($handle: String!) {
    menu(handle: $handle) {
      ...menu
    }
  }
  ${menuFragment}
`;
