import { describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('lib/builder/config', () => {
  const originalEnv = process.env.NEXT_PUBLIC_BUILDER_PUBLIC_KEY;

  afterEach(() => {
    process.env.NEXT_PUBLIC_BUILDER_PUBLIC_KEY = originalEnv;
    // Clear module cache to re-import with new env
    vi.resetModules();
  });

  it('has correct API key from environment', async () => {
    process.env.NEXT_PUBLIC_BUILDER_PUBLIC_KEY = 'test-key-123';
    const { builderConfig } = await import('../config');
    
    expect(builderConfig.apiKey).toBe('test-key-123');
  });

  it('uses empty string when API key is not set', async () => {
    delete process.env.NEXT_PUBLIC_BUILDER_PUBLIC_KEY;
    const { builderConfig } = await import('../config');
    
    expect(builderConfig.apiKey).toBe('');
  });

  it('defines all required models', async () => {
    const { builderConfig } = await import('../config');
    
    expect(builderConfig.models).toHaveProperty('page', 'page');
    expect(builderConfig.models).toHaveProperty('productPage', 'product-page');
    expect(builderConfig.models).toHaveProperty('collectionPage', 'collection-page');
    expect(builderConfig.models).toHaveProperty('theme', 'theme');
    expect(builderConfig.models).toHaveProperty('announcementBar', 'announcement-bar');
    expect(builderConfig.models).toHaveProperty('navigation', 'navigation');
    expect(builderConfig.models).toHaveProperty('footer', 'footer');
  });

  it('includes all required reserved paths', async () => {
    const { builderConfig } = await import('../config');
    
    expect(builderConfig.reservedPaths).toContain('products');
    expect(builderConfig.reservedPaths).toContain('product');
    expect(builderConfig.reservedPaths).toContain('cart');
    expect(builderConfig.reservedPaths).toContain('checkout');
    expect(builderConfig.reservedPaths).toContain('account');
    expect(builderConfig.reservedPaths).toContain('api');
    expect(builderConfig.reservedPaths).toContain('_next');
  });

  describe('isReservedPath', () => {
    it('returns true for reserved paths with leading slash', async () => {
      const { builderConfig } = await import('../config');
      
      expect(builderConfig.isReservedPath('/products')).toBe(true);
      expect(builderConfig.isReservedPath('/cart')).toBe(true);
      expect(builderConfig.isReservedPath('/checkout')).toBe(true);
    });

    it('returns true for reserved paths without leading slash', async () => {
      const { builderConfig } = await import('../config');
      
      expect(builderConfig.isReservedPath('products')).toBe(true);
      expect(builderConfig.isReservedPath('cart')).toBe(true);
      expect(builderConfig.isReservedPath('checkout')).toBe(true);
    });

    it('returns true for nested reserved paths', async () => {
      const { builderConfig } = await import('../config');
      
      expect(builderConfig.isReservedPath('/products/earrings')).toBe(true);
      expect(builderConfig.isReservedPath('/product/sea-glass-earrings')).toBe(true);
      expect(builderConfig.isReservedPath('api/cart')).toBe(true);
    });

    it('returns false for non-reserved paths', async () => {
      const { builderConfig } = await import('../config');
      
      expect(builderConfig.isReservedPath('/about')).toBe(false);
      expect(builderConfig.isReservedPath('/gallery')).toBe(false);
      expect(builderConfig.isReservedPath('/contact')).toBe(false);
    });

    it('returns false for empty string', async () => {
      const { builderConfig } = await import('../config');
      
      expect(builderConfig.isReservedPath('')).toBe(false);
    });

    it('returns false for root path', async () => {
      const { builderConfig } = await import('../config');
      
      expect(builderConfig.isReservedPath('/')).toBe(false);
    });

    it('handles paths with trailing slashes', async () => {
      const { builderConfig } = await import('../config');
      
      expect(builderConfig.isReservedPath('/products/')).toBe(true);
      expect(builderConfig.isReservedPath('cart/')).toBe(true);
    });

    it('is case-sensitive', async () => {
      const { builderConfig } = await import('../config');
      
      expect(builderConfig.isReservedPath('/Products')).toBe(false);
      expect(builderConfig.isReservedPath('/CART')).toBe(false);
    });
  });

  it('config object is readonly', async () => {
    const { builderConfig } = await import('../config');
    
    expect(() => {
      // @ts-expect-error Testing readonly
      builderConfig.apiKey = 'new-key';
    }).toThrow();
  });
});