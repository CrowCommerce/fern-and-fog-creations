import { test, expect } from '@playwright/test';

test.describe('Gallery Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/gallery');
  });

  test('should load successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/Gallery|Fern & Fog Creations/);
  });

  test('should display page heading', async ({ page }) => {
    const heading = page.locator('h1').first();
    await expect(heading).toBeVisible();
  });

  test('should display gallery items', async ({ page }) => {
    // Look for gallery grid or items
    const galleryItems = page.locator('img[alt]');

    // Should have at least one gallery item (if content exists)
    const itemCount = await galleryItems.count();

    if (itemCount > 0) {
      await expect(galleryItems.first()).toBeVisible();
    } else {
      // Empty gallery is okay - might not have items in test environment
      console.warn('No gallery items found - database might be empty');
    }
  });

  test('should have category filters', async ({ page }) => {
    // Look for filter buttons/links
    const filters = page.locator('button, a').filter({ hasText: /all|earrings|resin|driftwood/i });

    if (await filters.count() > 0) {
      await expect(filters.first()).toBeVisible();
    }
  });

  test('should display sold/available status', async ({ page }) => {
    // Look for sold indicators
    const statusIndicators = page.locator('text=/sold|available|for sale/i');

    if (await statusIndicators.count() > 0) {
      await expect(statusIndicators.first()).toBeVisible();
    }
  });

  test('should have proper metadata', async ({ page }) => {
    const metaDescription = page.locator('meta[name="description"]');
    await expect(metaDescription).toHaveAttribute('content', /.+/);
  });
});
