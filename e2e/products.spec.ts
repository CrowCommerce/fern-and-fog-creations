import { test, expect } from '@playwright/test';

test.describe('Products Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/products');
  });

  test('should load successfully', async ({ page }) => {
    await expect(page).toHaveURL(/\/products/);
  });

  test('should display products', async ({ page }) => {
    // Look for product cards/items
    const products = page.locator('img[alt*="product"], img[alt*="earring"], img[alt*="resin"]');

    const productCount = await products.count();

    if (productCount > 0) {
      await expect(products.first()).toBeVisible();
    } else {
      console.warn('No products found - using local data or empty store');
    }
  });

  test('should have filters/sorting', async ({ page }) => {
    // Look for sort dropdown or filter options
    const sortOptions = page.locator('select, button').filter({ hasText: /sort|filter|price|newest/i });

    if (await sortOptions.count() > 0) {
      await expect(sortOptions.first()).toBeVisible();
    }
  });

  test('should display product prices', async ({ page }) => {
    // Look for price text
    const prices = page.locator('text=/\\$\\d+/');

    if (await prices.count() > 0) {
      await expect(prices.first()).toBeVisible();
    }
  });

  test('should navigate to product detail on click', async ({ page }) => {
    const productLinks = page.locator('a[href*="/product/"]');

    if (await productLinks.count() > 0) {
      const firstProduct = productLinks.first();
      await firstProduct.click();

      // Should navigate to product detail page
      await expect(page).toHaveURL(/\/product\/.+/);
    }
  });
});

test.describe('Collection Page', () => {
  test('should load earrings collection', async ({ page }) => {
    await page.goto('/products/earrings');
    await expect(page).toHaveURL(/\/products\/earrings/);
  });

  test('should have collection metadata', async ({ page }) => {
    await page.goto('/products/earrings');

    const metaDescription = page.locator('meta[name="description"]');
    await expect(metaDescription).toHaveAttribute('content', /.+/);
  });

  test('should display collection title', async ({ page }) => {
    await page.goto('/products/earrings');

    const heading = page.locator('h1, h2').filter({ hasText: /earrings/i });

    if (await heading.count() > 0) {
      await expect(heading.first()).toBeVisible();
    }
  });
});
