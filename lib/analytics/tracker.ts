'use client';

import { track as vercelTrack } from '@vercel/analytics';
import { sendGTMEvent } from '@next/third-parties/google';
import type { AnalyticsEventName, EventProperties } from './types';

/**
 * Check if GTM is enabled via environment variable
 */
export function isGTMEnabled(): boolean {
  return typeof window !== 'undefined' && !!process.env.NEXT_PUBLIC_GTM_ID;
}

/**
 * Unified event tracking - fires to both Vercel Analytics and GTM (if enabled)
 */
export function trackEvent<T extends AnalyticsEventName>(
  name: T,
  properties: EventProperties<T>
): void {
  // Always track to Vercel Analytics
  vercelTrack(name, properties as unknown as Record<string, string | number | boolean>);

  // Conditionally track to GTM if enabled
  if (isGTMEnabled()) {
    sendGTMEvent({
      event: name,
      ...properties,
    });
  }
}

/**
 * Convenience functions for each event type (better DX with autocomplete)
 */
export const analytics = {
  // E-commerce events
  productView: (props: EventProperties<'product_view'>) =>
    trackEvent('product_view', props),

  addToCart: (props: EventProperties<'add_to_cart'>) =>
    trackEvent('add_to_cart', props),

  removeFromCart: (props: EventProperties<'remove_from_cart'>) =>
    trackEvent('remove_from_cart', props),

  updateCartQuantity: (props: EventProperties<'update_cart_quantity'>) =>
    trackEvent('update_cart_quantity', props),

  checkoutInitiated: (props: EventProperties<'checkout_initiated'>) =>
    trackEvent('checkout_initiated', props),

  searchPerformed: (props: EventProperties<'search_performed'>) =>
    trackEvent('search_performed', props),

  // Form events
  contactFormSubmitted: (props: EventProperties<'contact_form_submitted'>) =>
    trackEvent('contact_form_submitted', props),

  contactFormError: (props: EventProperties<'contact_form_error'>) =>
    trackEvent('contact_form_error', props),
};
