const policyFragment = /* GraphQL */ `
  fragment policy on ShopPolicy {
    id
    title
    body
    url
  }
`;

export const getPoliciesQuery = /* GraphQL */ `
  query getPolicies {
    shop {
      privacyPolicy {
        ...policy
      }
      refundPolicy {
        ...policy
      }
      shippingPolicy {
        ...policy
      }
      termsOfService {
        ...policy
      }
    }
  }
  ${policyFragment}
`;
