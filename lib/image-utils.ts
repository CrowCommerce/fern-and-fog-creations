/**
 * Image optimization utilities for Next.js Image component
 */

/**
 * Generates a shimmer effect placeholder for images
 * This provides a better loading experience than blank space
 *
 * @param w - Width of the placeholder
 * @param h - Height of the placeholder
 * @returns Base64-encoded data URL for the shimmer SVG
 */
export function getShimmerPlaceholder(w: number, h: number): string {
  const shimmer = `
    <svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <defs>
        <linearGradient id="g">
          <stop stop-color="#E6ECE8" offset="20%" />
          <stop stop-color="#F5F0E6" offset="50%" />
          <stop stop-color="#E6ECE8" offset="70%" />
        </linearGradient>
      </defs>
      <rect width="${w}" height="${h}" fill="#E6ECE8" />
      <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
      <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
    </svg>
  `;

  const toBase64 = (str: string) =>
    typeof window === 'undefined'
      ? Buffer.from(str).toString('base64')
      : window.btoa(str);

  return `data:image/svg+xml;base64,${toBase64(shimmer)}`;
}

/**
 * Common blur placeholder for hero images (full viewport width)
 */
export const HERO_BLUR_PLACEHOLDER = getShimmerPlaceholder(1920, 1080);

/**
 * Common blur placeholder for product images (square)
 */
export const PRODUCT_BLUR_PLACEHOLDER = getShimmerPlaceholder(800, 800);

/**
 * Common blur placeholder for gallery images
 */
export const GALLERY_BLUR_PLACEHOLDER = getShimmerPlaceholder(600, 400);
