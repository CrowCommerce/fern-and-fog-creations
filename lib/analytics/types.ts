/**
 * Analytics event definitions for type-safe dual-tracking
 * (Vercel Analytics + Google Tag Manager)
 */

// All trackable event names
export type AnalyticsEventName =
  | 'product_view'
  | 'add_to_cart'
  | 'remove_from_cart'
  | 'update_cart_quantity'
  | 'checkout_initiated'
  | 'search_performed'
  | 'contact_form_submitted'
  | 'contact_form_error'
  | 'gallery_filter'
  | 'gallery_item_click'
  | 'gallery_lightbox_navigate';

// Event property types for each event
export interface ProductViewProperties {
  product_id: string;
  product_title: string;
  price: number;
  collection?: string;
}

export interface AddToCartProperties {
  product_id: string;
  variant_id: string;
  product_title: string;
  price: number;
}

export interface RemoveFromCartProperties {
  product_id: string;
  variant_id: string;
  product_title: string;
}

export interface UpdateCartQuantityProperties {
  product_id: string;
  variant_id: string;
  product_title: string;
  old_quantity: number;
  new_quantity: number;
}

export interface CheckoutInitiatedProperties {
  cart_total: number;
  item_count: number;
}

export interface SearchPerformedProperties {
  query: string;
  results_count: number;
}

export interface ContactFormSubmittedProperties {
  has_phone: boolean;
}

export interface ContactFormErrorProperties {
  error_code: string;
  error_message: string;
}

export interface GalleryFilterProperties {
  filter_id: string;
  filter_name: string;
  previous_filter: string;
}

export interface GalleryItemClickProperties {
  item_id: string;
  item_title: string;
  category: string;
  index: number;
}

export interface GalleryLightboxNavigateProperties {
  direction: 'previous' | 'next';
  from_index: number;
  to_index: number;
  item_title: string;
}

// Discriminated union for type-safe event tracking
export type AnalyticsEvent =
  | { name: 'product_view'; properties: ProductViewProperties }
  | { name: 'add_to_cart'; properties: AddToCartProperties }
  | { name: 'remove_from_cart'; properties: RemoveFromCartProperties }
  | { name: 'update_cart_quantity'; properties: UpdateCartQuantityProperties }
  | { name: 'checkout_initiated'; properties: CheckoutInitiatedProperties }
  | { name: 'search_performed'; properties: SearchPerformedProperties }
  | { name: 'contact_form_submitted'; properties: ContactFormSubmittedProperties }
  | { name: 'contact_form_error'; properties: ContactFormErrorProperties }
  | { name: 'gallery_filter'; properties: GalleryFilterProperties }
  | { name: 'gallery_item_click'; properties: GalleryItemClickProperties }
  | { name: 'gallery_lightbox_navigate'; properties: GalleryLightboxNavigateProperties };

// Extract properties type for a given event name
export type EventProperties<T extends AnalyticsEventName> = Extract<
  AnalyticsEvent,
  { name: T }
>['properties'];
