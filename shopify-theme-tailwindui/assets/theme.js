/**
 * Fern & Fog Creations Theme JavaScript
 * Handles mobile menu, cart drawer, and cart operations
 */

(function() {
  'use strict';

  // ============================================================================
  // Mobile Menu
  // ============================================================================
  class MobileMenu {
    constructor() {
      this.menu = document.querySelector('[data-mobile-menu]');
      this.panel = document.querySelector('[data-mobile-menu-panel]');
      this.backdrop = document.querySelector('[data-mobile-menu-backdrop]');
      this.toggleBtn = document.querySelector('[data-mobile-menu-toggle]');
      this.closeBtn = document.querySelector('[data-mobile-menu-close]');

      if (!this.menu) return;

      this.isOpen = false;
      this.init();
    }

    init() {
      this.toggleBtn?.addEventListener('click', () => this.open());
      this.closeBtn?.addEventListener('click', () => this.close());
      this.backdrop?.addEventListener('click', () => this.close());

      // Close on Escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.isOpen) {
          this.close();
        }
      });
    }

    open() {
      this.isOpen = true;
      this.menu.style.display = 'block';

      requestAnimationFrame(() => {
        this.backdrop?.classList.add('opacity-100');
        this.backdrop?.classList.remove('opacity-0');
        this.panel?.classList.remove('-translate-x-full');
        this.panel?.classList.add('translate-x-0');
      });

      // Prevent body scroll
      document.body.style.overflow = 'hidden';
    }

    close() {
      this.isOpen = false;
      this.backdrop?.classList.remove('opacity-100');
      this.backdrop?.classList.add('opacity-0');
      this.panel?.classList.add('-translate-x-full');
      this.panel?.classList.remove('translate-x-0');

      setTimeout(() => {
        this.menu.style.display = 'none';
      }, 300);

      // Restore body scroll
      document.body.style.overflow = '';
    }
  }

  // ============================================================================
  // Cart Drawer
  // ============================================================================
  class CartDrawer {
    constructor() {
      this.drawer = document.querySelector('[data-cart-drawer]');
      this.panel = document.querySelector('[data-cart-drawer-panel]');
      this.backdrop = document.querySelector('[data-cart-drawer-backdrop]');
      this.toggleBtns = document.querySelectorAll('[data-cart-drawer-toggle]');
      this.closeBtns = document.querySelectorAll('[data-cart-drawer-close]');

      if (!this.drawer) return;

      this.isOpen = false;
      this.init();
    }

    init() {
      this.toggleBtns.forEach(btn => {
        btn.addEventListener('click', () => this.toggle());
      });

      this.closeBtns.forEach(btn => {
        btn.addEventListener('click', () => this.close());
      });

      this.backdrop?.addEventListener('click', () => this.close());

      // Close on Escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.isOpen) {
          this.close();
        }
      });

      // Handle cart item quantity changes
      document.addEventListener('click', (e) => {
        if (e.target.closest('[data-cart-item-increase]')) {
          const btn = e.target.closest('[data-cart-item-increase]');
          this.updateQuantity(btn.dataset.itemKey, 1);
        } else if (e.target.closest('[data-cart-item-decrease]')) {
          const btn = e.target.closest('[data-cart-item-decrease]');
          this.updateQuantity(btn.dataset.itemKey, -1);
        } else if (e.target.closest('[data-cart-item-remove]')) {
          const btn = e.target.closest('[data-cart-item-remove]');
          this.removeItem(btn.dataset.itemKey);
        }
      });
    }

    toggle() {
      if (this.isOpen) {
        this.close();
      } else {
        this.open();
      }
    }

    open() {
      this.isOpen = true;
      this.drawer.style.display = 'block';

      requestAnimationFrame(() => {
        this.backdrop?.classList.add('opacity-100');
        this.backdrop?.classList.remove('opacity-0');
        this.panel?.classList.remove('translate-x-full');
        this.panel?.classList.add('translate-x-0');
      });

      // Prevent body scroll
      document.body.style.overflow = 'hidden';
    }

    close() {
      this.isOpen = false;
      this.backdrop?.classList.remove('opacity-100');
      this.backdrop?.classList.add('opacity-0');
      this.panel?.classList.add('translate-x-full');
      this.panel?.classList.remove('translate-x-0');

      setTimeout(() => {
        this.drawer.style.display = 'none';
      }, 500);

      // Restore body scroll
      document.body.style.overflow = '';
    }

    async updateQuantity(key, change) {
      const item = document.querySelector(`[data-cart-item][data-item-key="${key}"]`);
      if (!item) return;

      const quantityElement = item.querySelector('[data-item-quantity]');
      const currentQuantity = parseInt(quantityElement.textContent);
      const newQuantity = currentQuantity + change;

      if (newQuantity < 1) {
        return this.removeItem(key);
      }

      try {
        const response = await fetch(window.routes.cart_change_url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: key,
            quantity: newQuantity
          })
        });

        if (response.ok) {
          const cart = await response.json();
          this.refreshCart(cart);
        }
      } catch (error) {
        console.error('Error updating cart:', error);
      }
    }

    async removeItem(key) {
      try {
        const response = await fetch(window.routes.cart_change_url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: key,
            quantity: 0
          })
        });

        if (response.ok) {
          const cart = await response.json();
          this.refreshCart(cart);
        }
      } catch (error) {
        console.error('Error removing item:', error);
      }
    }

    refreshCart(cart) {
      // Update cart count in header
      document.querySelectorAll('[data-cart-count]').forEach(el => {
        el.textContent = cart.item_count;
      });

      // Reload the page to refresh cart drawer content
      // In a production environment, you'd want to update the DOM dynamically
      window.location.reload();
    }
  }

  // ============================================================================
  // Add to Cart Form
  // ============================================================================
  class AddToCartForm {
    constructor(form) {
      this.form = form;
      this.submitButton = form.querySelector('[type="submit"]');
      this.init();
    }

    init() {
      this.form.addEventListener('submit', async (e) => {
        e.preventDefault();
        await this.handleSubmit();
      });
    }

    async handleSubmit() {
      const formData = new FormData(this.form);

      // Disable submit button
      this.submitButton.setAttribute('disabled', true);
      const originalText = this.submitButton.textContent;
      this.submitButton.textContent = 'Adding...';

      try {
        const response = await fetch(window.routes.cart_add_url, {
          method: 'POST',
          body: formData
        });

        if (response.ok) {
          const data = await response.json();

          // Update cart count
          const cartCountResponse = await fetch('/cart.js');
          const cart = await cartCountResponse.json();

          document.querySelectorAll('[data-cart-count]').forEach(el => {
            el.textContent = cart.item_count;
          });

          // Open cart drawer
          const cartDrawer = new CartDrawer();
          cartDrawer.open();

          // Show success feedback
          this.submitButton.textContent = 'Added!';
          setTimeout(() => {
            this.submitButton.textContent = originalText;
            this.submitButton.removeAttribute('disabled');
          }, 2000);
        } else {
          throw new Error('Failed to add to cart');
        }
      } catch (error) {
        console.error('Error adding to cart:', error);
        this.submitButton.textContent = 'Error - Try Again';
        setTimeout(() => {
          this.submitButton.textContent = originalText;
          this.submitButton.removeAttribute('disabled');
        }, 2000);
      }
    }
  }

  // ============================================================================
  // Product Variant Selector
  // ============================================================================
  class VariantSelector {
    constructor(container) {
      this.container = container;
      this.selects = container.querySelectorAll('select[name^="options"]');
      this.variantInput = container.querySelector('[name="id"]');
      this.priceElement = container.querySelector('[data-product-price]');
      this.addToCartButton = container.querySelector('[type="submit"]');

      if (!this.selects.length) return;

      this.init();
    }

    init() {
      this.selects.forEach(select => {
        select.addEventListener('change', () => this.updateVariant());
      });

      this.updateVariant();
    }

    updateVariant() {
      const selectedOptions = Array.from(this.selects).map(select => select.value);

      // Find matching variant (this would need product JSON data)
      // For now, this is a placeholder
      console.log('Selected options:', selectedOptions);
    }
  }

  // ============================================================================
  // Initialize on DOM Ready
  // ============================================================================
  function init() {
    // Initialize mobile menu
    new MobileMenu();

    // Initialize cart drawer
    new CartDrawer();

    // Initialize add to cart forms
    document.querySelectorAll('form[action*="/cart/add"]').forEach(form => {
      new AddToCartForm(form);
    });

    // Initialize variant selectors
    document.querySelectorAll('[data-product-form]').forEach(form => {
      new VariantSelector(form);
    });
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
