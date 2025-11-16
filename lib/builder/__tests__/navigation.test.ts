import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getNavigation, getFooterNavigation } from '../navigation';

// Mock resolve-content module
vi.mock('../resolve-content', () => ({
  resolveBuilderContent: vi.fn(),
}));

describe('lib/builder/navigation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getNavigation', () => {
    it('returns default navigation when Builder.io content is not available', async () => {
      const { resolveBuilderContent } = await import('../resolve-content');
      (resolveBuilderContent as any).mockResolvedValue(null);
      
      const result = await getNavigation();
      
      expect(result).toEqual([
        { name: 'Home', href: '/' },
        { name: 'Gallery', href: '/gallery' },
        { name: 'Shop', href: '/products' },
        { name: 'Contact', href: '/contact' },
        { name: 'About', href: '/about' },
      ]);
    });

    it('returns Builder.io navigation when available', async () => {
      const { resolveBuilderContent } = await import('../resolve-content');
      const mockNavigation = [
        { name: 'Custom Home', href: '/' },
        { name: 'Custom Shop', href: '/shop' },
      ];
      
      (resolveBuilderContent as any).mockResolvedValue({
        data: { items: mockNavigation },
      });
      
      const result = await getNavigation();
      
      expect(result).toEqual(mockNavigation);
    });

    it('calls resolveBuilderContent with correct parameters', async () => {
      const { resolveBuilderContent } = await import('../resolve-content');
      (resolveBuilderContent as any).mockResolvedValue(null);
      
      await getNavigation();
      
      expect(resolveBuilderContent).toHaveBeenCalledWith('navigation', {
        userAttributes: { id: 'main-navigation' },
      });
    });

    it('returns default navigation when Builder.io content has no items', async () => {
      const { resolveBuilderContent } = await import('../resolve-content');
      (resolveBuilderContent as any).mockResolvedValue({
        data: {},
      });
      
      const result = await getNavigation();
      
      expect(result).toHaveLength(5);
      expect(result[0]).toHaveProperty('name', 'Home');
    });

    it('handles Builder.io error gracefully', async () => {
      const { resolveBuilderContent } = await import('../resolve-content');
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      (resolveBuilderContent as any).mockRejectedValue(new Error('Builder.io API Error'));
      
      const result = await getNavigation();
      
      expect(result).toHaveLength(5); // Default navigation
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        '[Builder.io] Error fetching navigation:',
        expect.any(Error)
      );
      
      consoleErrorSpy.mockRestore();
    });

    it('validates navigation item structure', async () => {
      const { resolveBuilderContent } = await import('../resolve-content');
      (resolveBuilderContent as any).mockResolvedValue(null);
      
      const result = await getNavigation();
      
      result.forEach(item => {
        expect(item).toHaveProperty('name');
        expect(item).toHaveProperty('href');
        expect(typeof item.name).toBe('string');
        expect(typeof item.href).toBe('string');
      });
    });
  });

  describe('getFooterNavigation', () => {
    it('returns default footer navigation when Builder.io content is not available', async () => {
      const { resolveBuilderContent } = await import('../resolve-content');
      (resolveBuilderContent as any).mockResolvedValue(null);
      
      const result = await getFooterNavigation();
      
      expect(result).toHaveProperty('shop');
      expect(result).toHaveProperty('about');
      expect(result).toHaveProperty('policies');
      expect(result.shop).toHaveLength(5);
      expect(result.about).toHaveLength(3);
      expect(result.policies).toHaveLength(4);
    });

    it('returns Builder.io footer navigation when available', async () => {
      const { resolveBuilderContent } = await import('../resolve-content');
      const mockFooter = {
        shop: [{ name: 'Custom Shop', href: '/custom-shop' }],
        about: [{ name: 'Custom About', href: '/custom-about' }],
        policies: [{ name: 'Custom Policy', href: '/custom-policy' }],
      };
      
      (resolveBuilderContent as any).mockResolvedValue({
        data: mockFooter,
      });
      
      const result = await getFooterNavigation();
      
      expect(result).toEqual(mockFooter);
    });

    it('calls resolveBuilderContent with correct parameters', async () => {
      const { resolveBuilderContent } = await import('../resolve-content');
      (resolveBuilderContent as any).mockResolvedValue(null);
      
      await getFooterNavigation();
      
      expect(resolveBuilderContent).toHaveBeenCalledWith('footer', {
        userAttributes: { id: 'main-footer' },
      });
    });

    it('merges partial Builder.io data with defaults', async () => {
      const { resolveBuilderContent } = await import('../resolve-content');
      const partialFooter = {
        shop: [{ name: 'Custom Shop', href: '/custom' }],
        // about and policies missing
      };
      
      (resolveBuilderContent as any).mockResolvedValue({
        data: partialFooter,
      });
      
      const result = await getFooterNavigation();
      
      expect(result.shop).toEqual(partialFooter.shop);
      expect(result.about).toHaveLength(3); // Default
      expect(result.policies).toHaveLength(4); // Default
    });

    it('handles Builder.io error gracefully', async () => {
      const { resolveBuilderContent } = await import('../resolve-content');
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      (resolveBuilderContent as any).mockRejectedValue(new Error('Builder.io API Error'));
      
      const result = await getFooterNavigation();
      
      expect(result).toHaveProperty('shop');
      expect(result).toHaveProperty('about');
      expect(result).toHaveProperty('policies');
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        '[Builder.io] Error fetching footer navigation:',
        expect.any(Error)
      );
      
      consoleErrorSpy.mockRestore();
    });

    it('validates footer navigation structure', async () => {
      const { resolveBuilderContent } = await import('../resolve-content');
      (resolveBuilderContent as any).mockResolvedValue(null);
      
      const result = await getFooterNavigation();
      
      ['shop', 'about', 'policies'].forEach(section => {
        expect(Array.isArray(result[section as keyof typeof result])).toBe(true);
        result[section as keyof typeof result].forEach(item => {
          expect(item).toHaveProperty('name');
          expect(item).toHaveProperty('href');
        });
      });
    });

    it('includes correct default policy links', async () => {
      const { resolveBuilderContent } = await import('../resolve-content');
      (resolveBuilderContent as any).mockResolvedValue(null);
      
      const result = await getFooterNavigation();
      
      expect(result.policies).toContainEqual({ name: 'Shipping', href: '/policies/shipping' });
      expect(result.policies).toContainEqual({ name: 'Returns', href: '/policies/returns' });
      expect(result.policies).toContainEqual({ name: 'Privacy', href: '/policies/privacy' });
      expect(result.policies).toContainEqual({ name: 'Terms', href: '/policies/terms' });
    });
  });
});