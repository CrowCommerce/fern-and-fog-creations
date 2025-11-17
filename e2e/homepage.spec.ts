import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/Fern & Fog Creations/);
  });

  test('should display hero section', async ({ page }) => {
    // Hero heading should be visible
    const heroHeading = page.locator('h1').first();
    await expect(heroHeading).toBeVisible();
    await expect(heroHeading).toContainText(/Handmade|Coastal|Treasures/i);
  });

  test('should have working hero CTAs', async ({ page }) => {
    // Primary CTA button
    const primaryCTA = page.getByRole('link').filter({ hasText: /View Gallery|Shop/i }).first();
    await expect(primaryCTA).toBeVisible();
    await expect(primaryCTA).toHaveAttribute('href', /.+/);
  });

  test('should display category section', async ({ page }) => {
    // Look for category cards (earrings, resin, driftwood, etc.)
    const categories = page.locator('text=/Earrings|Resin|Driftwood/i').first();
    await expect(categories).toBeVisible();
  });

  test('should have proper metadata', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/.+Fern & Fog Creations/i);

    // Check meta description exists and has content
    const metaDescription = page.locator('meta[name="description"]');
    const descriptionContent = await metaDescription.getAttribute('content');
    expect(descriptionContent).toBeTruthy();
    expect(descriptionContent!.length).toBeGreaterThan(10);

    // OpenGraph tags are optional but if present, should have content
    const ogTitle = page.locator('meta[property="og:title"]');
    const ogCount = await ogTitle.count();

    if (ogCount > 0) {
      const ogContent = await ogTitle.first().getAttribute('content');
      expect(ogContent).toBeTruthy();
    }
  });

  test('should load hero image', async ({ page }) => {
    // Find the hero background image
    const heroImage = page.locator('img').first();
    await expect(heroImage).toBeVisible();

    // Wait for image to load
    await heroImage.evaluate((img: HTMLImageElement) => {
      return img.complete && img.naturalWidth > 0;
    });
  });
});
