import imageFragment from './image';
import seoFragment from './seo';

const collectionFragment = /* GraphQL */ `
  fragment collection on Collection {
    handle
    title
    description
    seo {
      ...seo
    }
    updatedAt
    image {
      ...image
    }
  }
  ${imageFragment}
  ${seoFragment}
`;

export default collectionFragment;
