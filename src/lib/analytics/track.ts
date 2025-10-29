/**
 * Universal Analytics & GTM Event Dispatcher
 *
 * Sends events to both Vercel Analytics and Google Tag Manager dataLayer.
 * Safe for Edge runtime; gracefully handles missing dependencies.
 *
 * @example
 * ```ts
 * import { trackPageView, trackEvent } from '@/lib/analytics/track';
 *
 * // Track page view
 * trackPageView({ path: '/products', title: 'Products', referrer: document.referrer });
 *
 * // Track custom event
 * trackEvent('add_to_cart', { product_id: '123', value: 29.99 });
 * ```
 */

"use client";

import { track as vercelTrack } from "@vercel/analytics";

type PageView = {
  path: string;
  title?: string;
  referrer?: string;
  source?: string;
};

declare global {
  interface Window {
    dataLayer: any[] | undefined;
  }
}

/**
 * Track a page view in both Vercel Analytics and GTM dataLayer
 *
 * @param evt - Page view event data (path, title, referrer, source)
 */
export function trackPageView(evt: PageView) {
  // Vercel Analytics custom event
  try {
    vercelTrack?.("page_view", evt);
  } catch (error) {
    // Silently fail in production
    if (process.env.NODE_ENV === "development") {
      console.warn("Vercel Analytics trackPageView failed:", error);
    }
  }

  // Google Tag Manager dataLayer
  try {
    if (typeof window !== "undefined") {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "page_view",
        ...evt,
      });
    }
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("GTM dataLayer push failed:", error);
    }
  }
}

/**
 * Track a custom event in both Vercel Analytics and GTM dataLayer
 *
 * @param name - Event name (e.g., 'add_to_cart', 'purchase', 'click_cta')
 * @param payload - Event data payload
 */
export function trackEvent(name: string, payload: Record<string, any> = {}) {
  // Vercel Analytics custom event
  try {
    vercelTrack?.(name, payload);
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn(`Vercel Analytics trackEvent '${name}' failed:`, error);
    }
  }

  // Google Tag Manager dataLayer
  try {
    if (typeof window !== "undefined") {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: name,
        ...payload,
      });
    }
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn(`GTM dataLayer push '${name}' failed:`, error);
    }
  }
}

/**
 * Track e-commerce events (add_to_cart, purchase, etc.)
 *
 * @param eventName - E-commerce event name
 * @param ecommerce - E-commerce data (items, value, currency, etc.)
 */
export function trackEcommerce(
  eventName: string,
  ecommerce: {
    items?: Array<{
      item_id: string;
      item_name: string;
      price?: number;
      quantity?: number;
      [key: string]: any;
    }>;
    value?: number;
    currency?: string;
    transaction_id?: string;
    [key: string]: any;
  }
) {
  trackEvent(eventName, { ecommerce });
}
