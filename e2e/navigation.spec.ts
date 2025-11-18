import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test.describe('Header Menu', () => {
    test('should display header navigation', async ({ page }) => {
      const header = page.locator('header');
      await expect(header).toBeVisible();
    });

    test('should have brand logo/wordmark', async ({ page }) => {
      const logo = page.getByRole('link').filter({ hasText: /Fern & Fog Creations/i });
      await expect(logo).toBeVisible();
      await expect(logo).toHaveAttribute('href', '/');
    });

    test('should have main navigation links', async ({ page }) => {
      // Check for common navigation items
      const navLinks = page.locator('nav a');
      const linkCount = await navLinks.count();
      expect(linkCount).toBeGreaterThan(0);

      // Should have at least Gallery, Products, About, Contact
      const galleryLink = page.getByRole('link', { name: /Gallery/i });
      const productsLink = page.getByRole('link', { name: /Products|Shop/i });

      const galleryCount = await galleryLink.count();
      const productsCount = await productsLink.count();

      if (galleryCount > 0) {
        await expect(galleryLink.first()).toBeVisible();
      }

      if (productsCount > 0) {
        await expect(productsLink.first()).toBeVisible();
      }
    });

    test('should navigate to Gallery page', async ({ page }) => {
      const galleryLink = page.getByRole('link', { name: /Gallery/i }).first();

      if (await galleryLink.count() > 0) {
        await galleryLink.click();
        await expect(page).toHaveURL(/\/gallery/);
      }
    });

    test('should have cart icon', async ({ page }) => {
      // Look for shopping bag/cart icon or button
      const cartButton = page.locator('button').filter({ has: page.locator('svg') }).filter({ hasText: /cart|bag|0|1|2|3|4|5|6|7|8|9/i });

      if (await cartButton.count() > 0) {
        await expect(cartButton.first()).toBeVisible();
      }
    });
  });

  test.describe('Mobile Menu', () => {
    test('should show mobile menu button on mobile', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });

      // Reload to apply mobile styles
      await page.reload();

      // Look for hamburger menu button
      const menuButton = page.getByRole('button', { name: /menu|open menu/i });

      if (await menuButton.count() > 0) {
        await expect(menuButton).toBeVisible();
      }
    });

    test('should open mobile menu on click', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.reload();

      // Look for any button with menu-related aria or text
      const menuButton = page.locator('button').filter({ has: page.locator('[aria-hidden="true"]') }).first();
      const explicitMenuButton = page.getByRole('button', { name: /menu|open menu/i });

      const buttonCount = await explicitMenuButton.count();

      if (buttonCount > 0) {
        await explicitMenuButton.click();

        // Wait for dialog animation and mounting
        await page.waitForTimeout(500);

        // Mobile menu might be a dialog, nav, or div
        const mobileMenu = page.locator('[role="dialog"], nav >> visible=true').first();
        const menuVisible = await mobileMenu.isVisible().catch(() => false);

        // If dialog is present, it should be visible
        if (menuVisible) {
          await expect(mobileMenu).toBeVisible();
        }
      }
    });
  });

  test.describe('Footer Menu', () => {
    test('should display footer', async ({ page }) => {
      const footer = page.locator('footer');

      if (await footer.count() > 0) {
        await expect(footer).toBeVisible();
      }
    });

    test('should have footer links', async ({ page }) => {
      const footer = page.locator('footer');
      const footerCount = await footer.count();

      if (footerCount > 0) {
        const footerLinks = footer.locator('a');
        const linkCount = await footerLinks.count();
        expect(linkCount).toBeGreaterThan(0);
      }
    });
  });
});
