import { track } from '@vercel/analytics/server';

/**
 * Server-side analytics tracking for e-commerce operations
 * Uses @vercel/analytics/server for server action tracking
 */

interface ServerAddToCartProps {
  product_id: string;
  variant_id: string;
  product_title: string;
  price: number;
}

interface ServerRemoveFromCartProps {
  product_id: string;
  variant_id: string;
  product_title: string;
}

interface ServerUpdateCartQuantityProps {
  product_id: string;
  variant_id: string;
  product_title: string;
  old_quantity: number;
  new_quantity: number;
}

interface ServerCheckoutInitiatedProps {
  cart_total: number;
  item_count: number;
}

interface ServerSearchPerformedProps {
  query: string;
  results_count: number;
}

interface ServerContactFormSubmittedProps {
  has_phone: boolean;
}

interface ServerContactFormErrorProps {
  error_code: string;
  error_message: string;
}

// Helper to convert typed props to Record for Vercel Analytics
type AnalyticsRecord = Record<string, string | number | boolean | null>;

export const serverAnalytics = {
  // E-commerce events
  addToCart: (props: ServerAddToCartProps) =>
    track('add_to_cart', props as unknown as AnalyticsRecord),

  removeFromCart: (props: ServerRemoveFromCartProps) =>
    track('remove_from_cart', props as unknown as AnalyticsRecord),

  updateCartQuantity: (props: ServerUpdateCartQuantityProps) =>
    track('update_cart_quantity', props as unknown as AnalyticsRecord),

  checkoutInitiated: (props: ServerCheckoutInitiatedProps) =>
    track('checkout_initiated', props as unknown as AnalyticsRecord),

  searchPerformed: (props: ServerSearchPerformedProps) =>
    track('search_performed', props as unknown as AnalyticsRecord),

  // Form events
  contactFormSubmitted: (props: ServerContactFormSubmittedProps) =>
    track('contact_form_submitted', props as unknown as AnalyticsRecord),

  contactFormError: (props: ServerContactFormErrorProps) =>
    track('contact_form_error', props as unknown as AnalyticsRecord),
};
