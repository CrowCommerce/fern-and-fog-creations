import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock the data-source module before importing sitemap
vi.mock('@/lib/data-source', () => ({
  getProducts: vi.fn(),
}));

describe('sitemap.ts', () => {
  const originalEnv = process.env.NEXT_PUBLIC_SITE_URL;

  beforeEach(async () => {
    vi.clearAllMocks();
    const { getProducts } = await import('@/lib/data-source');
    (getProducts as any).mockResolvedValue([
      { handle: 'test-product-1', updatedAt: '2024-01-01' },
      { handle: 'test-product-2', updatedAt: '2024-01-02' },
    ]);
  });

  afterEach(() => {
    process.env.NEXT_PUBLIC_SITE_URL = originalEnv;
    vi.resetModules();
  });

  it('generates sitemap with static pages', async () => {
    const sitemap = (await import('../sitemap')).default;
    const result = await sitemap();
    
    const urls = result.map(entry => entry.url);
    
    expect(urls).toContain('https://test.example.com');
    expect(urls).toContain('https://test.example.com/products');
    expect(urls).toContain('https://test.example.com/gallery');
    expect(urls).toContain('https://test.example.com/about');
    expect(urls).toContain('https://test.example.com/contact');
  });

  it('includes policy pages in sitemap', async () => {
    const sitemap = (await import('../sitemap')).default;
    const result = await sitemap();
    
    const urls = result.map(entry => entry.url);
    
    expect(urls).toContain('https://test.example.com/policies/privacy');
    expect(urls).toContain('https://test.example.com/policies/shipping');
    expect(urls).toContain('https://test.example.com/policies/returns');
    expect(urls).toContain('https://test.example.com/policies/terms');
  });

  it('includes collection pages in sitemap', async () => {
    const sitemap = (await import('../sitemap')).default;
    const result = await sitemap();
    
    const urls = result.map(entry => entry.url);
    
    expect(urls).toContain('https://test.example.com/products/earrings');
    expect(urls).toContain('https://test.example.com/products/resin');
    expect(urls).toContain('https://test.example.com/products/driftwood');
    expect(urls).toContain('https://test.example.com/products/wall-hangings');
  });

  it('sets correct priority for homepage', async () => {
    const sitemap = (await import('../sitemap')).default;
    const result = await sitemap();
    
    const homepage = result.find(entry => entry.url === 'https://test.example.com');
    
    expect(homepage?.priority).toBe(1);
  });

  it('sets correct priority for products page', async () => {
    const sitemap = (await import('../sitemap')).default;
    const result = await sitemap();
    
    const productsPage = result.find(entry => entry.url === 'https://test.example.com/products');
    
    expect(productsPage?.priority).toBe(0.9);
  });

  it('sets lower priority for policy pages', async () => {
    const sitemap = (await import('../sitemap')).default;
    const result = await sitemap();
    
    const privacyPage = result.find(entry => entry.url === 'https://test.example.com/policies/privacy');
    
    expect(privacyPage?.priority).toBe(0.3);
  });

  it('includes lastModified date for all entries', async () => {
    const sitemap = (await import('../sitemap')).default;
    const result = await sitemap();
    
    result.forEach(entry => {
      expect(entry.lastModified).toBeInstanceOf(Date);
    });
  });

  it('includes changeFrequency for static pages', async () => {
    const sitemap = (await import('../sitemap')).default;
    const result = await sitemap();
    
    const homepage = result.find(entry => entry.url === 'https://test.example.com');
    
    expect(homepage?.changeFrequency).toBe('daily');
  });

  it('fetches and includes product pages', async () => {
    const sitemap = (await import('../sitemap')).default;
    const { getProducts } = await import('@/lib/data-source');
    
    await sitemap();
    
    expect(getProducts).toHaveBeenCalled();
  });

  it('includes dynamic product URLs', async () => {
    const sitemap = (await import('../sitemap')).default;
    const result = await sitemap();
    
    const urls = result.map(entry => entry.url);
    
    expect(urls).toContain('https://test.example.com/product/test-product-1');
    expect(urls).toContain('https://test.example.com/product/test-product-2');
  });

  it('handles empty product list gracefully', async () => {
    const { getProducts } = await import('@/lib/data-source');
    (getProducts as any).mockResolvedValue([]);
    
    const sitemap = (await import('../sitemap')).default;
    const result = await sitemap();
    
    // Should still have static pages
    expect(result.length).toBeGreaterThan(0);
  });

  it('handles getProducts error gracefully', async () => {
    const { getProducts } = await import('@/lib/data-source');
    (getProducts as any).mockRejectedValue(new Error('API Error'));
    
    const sitemap = (await import('../sitemap')).default;
    
    // Should not throw
    await expect(sitemap()).resolves.toBeDefined();
  });
});