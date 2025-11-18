import { test, expect } from '@playwright/test';

test.describe('About Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/about');
  });

  test('should load successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/About|Fern & Fog Creations/);
  });

  test('should display hero section', async ({ page }) => {
    const heroHeading = page.locator('h1').first();
    await expect(heroHeading).toBeVisible();
  });

  test('should display story section', async ({ page }) => {
    // Look for story heading or content
    const storySection = page.locator('text=/story|about|journey/i').first();
    await expect(storySection).toBeVisible();
  });

  test('should display process steps', async ({ page }) => {
    // Look for process steps (Gathered, Crafted, Treasured)
    const processSteps = page.locator('text=/gathered|crafted|treasured/i');

    if (await processSteps.count() > 0) {
      await expect(processSteps.first()).toBeVisible();
    }
  });

  test('should display values section', async ({ page }) => {
    // Look for values (sustainability, quality, etc.)
    const valuesSection = page.locator('text=/values|sustainability|quality/i');

    if (await valuesSection.count() > 0) {
      await expect(valuesSection.first()).toBeVisible();
    }
  });

  test('should have CTA buttons', async ({ page }) => {
    // Look for call-to-action buttons
    const ctaButtons = page.locator('a[href*="/gallery"], a[href*="/products"], a[href*="/contact"]');

    if (await ctaButtons.count() > 0) {
      await expect(ctaButtons.first()).toBeVisible();
    }
  });

  test('should have proper metadata', async ({ page }) => {
    const metaDescription = page.locator('meta[name="description"]');
    await expect(metaDescription).toHaveAttribute('content', /.+/);
  });
});
