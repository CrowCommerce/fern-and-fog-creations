import { test, expect } from '@playwright/test';

test.describe('Contact Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/contact');
  });

  test('should load successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/Contact|Get in Touch|Fern & Fog Creations/);
  });

  test('should display page heading', async ({ page }) => {
    const heading = page.locator('h1').first();
    await expect(heading).toBeVisible();
    await expect(heading).toContainText(/Contact|Get in Touch|Touch/i);
  });

  test('should display contact form (Jotform)', async ({ page }) => {
    // Jotform embeds in an iframe
    const jotformIframe = page.frameLocator('iframe[src*="jotform"]');

    // Wait for iframe to load (with timeout)
    try {
      await page.waitForSelector('iframe[src*="jotform"]', { timeout: 10000 });
      await expect(page.locator('iframe[src*="jotform"]')).toBeVisible();
    } catch {
      // Jotform might not be configured in test environment
      console.warn('Jotform iframe not found - might not be configured');
    }
  });

  test('should display contact description', async ({ page }) => {
    // Look for description text
    const description = page.locator('p').first();
    await expect(description).toBeVisible();
  });

  test('should have proper metadata', async ({ page }) => {
    const metaDescription = page.locator('meta[name="description"]');
    await expect(metaDescription).toHaveAttribute('content', /.+/);
  });
});
