import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import robots from '../robots';

describe('robots.ts', () => {
  const originalEnv = process.env.NEXT_PUBLIC_SITE_URL;

  afterEach(() => {
    process.env.NEXT_PUBLIC_SITE_URL = originalEnv;
  });

  it('returns robots configuration with default URL', () => {
    delete process.env.NEXT_PUBLIC_SITE_URL;
    
    const result = robots();
    
    expect(result).toHaveProperty('rules');
    expect(result).toHaveProperty('sitemap');
    expect(result.sitemap).toBe('https://fernandfogcreations.com/sitemap.xml');
  });

  it('uses NEXT_PUBLIC_SITE_URL when provided', () => {
    process.env.NEXT_PUBLIC_SITE_URL = 'https://custom.example.com';
    
    const result = robots();
    
    expect(result.sitemap).toBe('https://custom.example.com/sitemap.xml');
  });

  it('allows all user agents', () => {
    const result = robots();
    
    expect(result.rules).toHaveLength(1);
    expect(result.rules[0].userAgent).toBe('*');
  });

  it('allows root path', () => {
    const result = robots();
    
    expect(result.rules[0].allow).toBe('/');
  });

  it('disallows API routes', () => {
    const result = robots();
    
    expect(result.rules[0].disallow).toContain('/api/');
  });

  it('disallows admin routes', () => {
    const result = robots();
    
    expect(result.rules[0].disallow).toContain('/admin/');
  });

  it('disallows Next.js internal routes', () => {
    const result = robots();
    
    expect(result.rules[0].disallow).toContain('/_next/');
  });

  it('disallows cart page', () => {
    const result = robots();
    
    expect(result.rules[0].disallow).toContain('/cart');
  });

  it('disallows checkout page', () => {
    const result = robots();
    
    expect(result.rules[0].disallow).toContain('/checkout');
  });

  it('disallows account pages', () => {
    const result = robots();
    
    expect(result.rules[0].disallow).toContain('/account');
  });

  it('disallows search result pages with query params', () => {
    const result = robots();
    
    expect(result.rules[0].disallow).toContain('/search?*');
  });

  it('returns proper MetadataRoute.Robots structure', () => {
    const result = robots();
    
    expect(result).toMatchObject({
      rules: expect.arrayContaining([
        expect.objectContaining({
          userAgent: expect.any(String),
          allow: expect.any(String),
          disallow: expect.any(Array),
        }),
      ]),
      sitemap: expect.any(String),
    });
  });
});