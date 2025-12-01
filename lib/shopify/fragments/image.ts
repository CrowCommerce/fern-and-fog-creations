/**
 * Optimized image fragment with WebP transform.
 * Shopify CDN automatically serves WebP to supported browsers.
 * Max width of 1200px covers most use cases while reducing payload.
 */
const imageFragment = /* GraphQL */ `
  fragment image on Image {
    url(transform: { maxWidth: 1200, preferredContentType: WEBP })
    altText
    width
    height
  }
`;

export default imageFragment;
