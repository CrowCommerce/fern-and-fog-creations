import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render } from '@testing-library/react';
import { Analytics } from '../Analytics';

// Mock @next/third-parties/google
vi.mock('@next/third-parties/google', () => ({
  GoogleAnalytics: ({ gaId }: { gaId: string }) => <div data-testid="google-analytics" data-gaid={gaId} />,
  GoogleTagManager: ({ gtmId }: { gtmId: string }) => <div data-testid="google-tag-manager" data-gtmid={gtmId} />,
}));

describe('Analytics Component', () => {
  const originalGaId = process.env.NEXT_PUBLIC_GA_ID;
  const originalGtmId = process.env.NEXT_PUBLIC_GTM_ID;

  afterEach(() => {
    process.env.NEXT_PUBLIC_GA_ID = originalGaId;
    process.env.NEXT_PUBLIC_GTM_ID = originalGtmId;
  });

  it('renders nothing when no analytics IDs are set', () => {
    delete process.env.NEXT_PUBLIC_GA_ID;
    delete process.env.NEXT_PUBLIC_GTM_ID;
    
    const { container } = render(<Analytics />);
    
    expect(container.firstChild).toBeNull();
  });

  it('renders GoogleAnalytics when GA_ID is provided', () => {
    process.env.NEXT_PUBLIC_GA_ID = 'G-TEST123';
    delete process.env.NEXT_PUBLIC_GTM_ID;
    
    const { getByTestId } = render(<Analytics />);
    
    const gaElement = getByTestId('google-analytics');
    expect(gaElement).toBeInTheDocument();
    expect(gaElement).toHaveAttribute('data-gaid', 'G-TEST123');
  });

  it('renders GoogleTagManager when GTM_ID is provided', () => {
    delete process.env.NEXT_PUBLIC_GA_ID;
    process.env.NEXT_PUBLIC_GTM_ID = 'GTM-TEST123';
    
    const { getByTestId } = render(<Analytics />);
    
    const gtmElement = getByTestId('google-tag-manager');
    expect(gtmElement).toBeInTheDocument();
    expect(gtmElement).toHaveAttribute('data-gtmid', 'GTM-TEST123');
  });

  it('renders both GA and GTM when both IDs are provided', () => {
    process.env.NEXT_PUBLIC_GA_ID = 'G-TEST123';
    process.env.NEXT_PUBLIC_GTM_ID = 'GTM-TEST123';
    
    const { getByTestId } = render(<Analytics />);
    
    expect(getByTestId('google-analytics')).toBeInTheDocument();
    expect(getByTestId('google-tag-manager')).toBeInTheDocument();
  });

  it('handles empty string GA_ID', () => {
    process.env.NEXT_PUBLIC_GA_ID = '';
    delete process.env.NEXT_PUBLIC_GTM_ID;
    
    const { container } = render(<Analytics />);
    
    expect(container.firstChild).toBeNull();
  });

  it('handles empty string GTM_ID', () => {
    delete process.env.NEXT_PUBLIC_GA_ID;
    process.env.NEXT_PUBLIC_GTM_ID = '';
    
    const { container } = render(<Analytics />);
    
    expect(container.firstChild).toBeNull();
  });

  it('passes correct GA ID to GoogleAnalytics', () => {
    const testGaId = 'G-CUSTOM456';
    process.env.NEXT_PUBLIC_GA_ID = testGaId;
    
    const { getByTestId } = render(<Analytics />);
    
    expect(getByTestId('google-analytics')).toHaveAttribute('data-gaid', testGaId);
  });

  it('passes correct GTM ID to GoogleTagManager', () => {
    const testGtmId = 'GTM-CUSTOM789';
    process.env.NEXT_PUBLIC_GTM_ID = testGtmId;
    
    const { getByTestId } = render(<Analytics />);
    
    expect(getByTestId('google-tag-manager')).toHaveAttribute('data-gtmid', testGtmId);
  });
});