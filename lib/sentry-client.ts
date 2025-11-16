/**
 * Sentry Client-Side Initialization
 *
 * This file sets up Sentry for client-side error tracking in the browser.
 * It should be imported in the root layout to initialize Sentry on page load.
 */

import * as Sentry from '@sentry/nextjs';

// Only initialize if DSN is configured
if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

    // Adjust this value in production
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

    // Session Replay
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,

    // Setting this option to true will print useful information to the console while you're setting up Sentry.
    debug: false,

    // Environment
    environment: process.env.NODE_ENV || 'development',

    // Ignore certain errors
    ignoreErrors: [
      // Browser extensions
      'top.GLOBALS',
      'chrome-extension://',
      'moz-extension://',
      // Random network errors
      'NetworkError',
      'Network request failed',
      'Failed to fetch',
      'Load failed',
      // ResizeObserver loop errors (harmless)
      'ResizeObserver loop limit exceeded',
      'ResizeObserver loop completed with undelivered notifications',
    ],

    // Filter out Builder.io noise
    beforeSend(event, hint) {
      // Ignore Builder.io's Math.random() errors during prerendering
      if (
        event.exception?.values?.[0]?.value?.includes('Math.random') ||
        event.exception?.values?.[0]?.value?.includes('builder.io')
      ) {
        return null;
      }
      return event;
    },
  });

  console.log('[Sentry] Client-side error monitoring initialized');
}

export { Sentry };
