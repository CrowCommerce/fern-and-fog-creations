import { test, expect } from '@playwright/test';

test.describe('Accessibility', () => {
  const pages = [
    { name: 'Homepage', url: '/' },
    { name: 'About', url: '/about' },
    { name: 'Contact', url: '/contact' },
    { name: 'Gallery', url: '/gallery' },
    { name: 'Products', url: '/products' },
  ];

  for (const { name, url } of pages) {
    test(`${name} should have proper heading hierarchy`, async ({ page }) => {
      await page.goto(url);

      // Should have exactly one h1
      const h1Elements = page.locator('h1');
      const h1Count = await h1Elements.count();
      expect(h1Count).toBe(1);
    });

    test(`${name} should have alt text on images`, async ({ page }) => {
      await page.goto(url);

      // Get all images
      const images = page.locator('img');
      const imageCount = await images.count();

      if (imageCount > 0) {
        // Check that decorative images have empty alt or proper alt text
        for (let i = 0; i < Math.min(imageCount, 5); i++) {
          const img = images.nth(i);
          const alt = await img.getAttribute('alt');

          // Alt attribute should exist (even if empty for decorative)
          expect(alt).not.toBeNull();
        }
      }
    });

    test(`${name} should have valid links`, async ({ page }) => {
      await page.goto(url);

      // Get all links
      const links = page.locator('a[href]');
      const linkCount = await links.count();

      if (linkCount > 0) {
        // Check first few links have valid href
        for (let i = 0; i < Math.min(linkCount, 5); i++) {
          const link = links.nth(i);
          const href = await link.getAttribute('href');

          expect(href).toBeTruthy();
          expect(href).not.toBe('#');
          expect(href).not.toBe('javascript:void(0)');
        }
      }
    });

    test(`${name} should be keyboard navigable`, async ({ page }) => {
      await page.goto(url);

      // Press Tab a few times
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');

      // Check that something is focused
      const focusedElement = page.locator(':focus');

      // At least one element should be focused after tabbing
      await expect(focusedElement).toHaveCount(1);
      await expect(focusedElement).toBeVisible();
    });
  }
});
