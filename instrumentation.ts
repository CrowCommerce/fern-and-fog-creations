/**
 * Next.js Instrumentation
 *
 * This file is automatically imported by Next.js to set up global instrumentation
 * including error tracking, performance monitoring, and observability.
 *
 * See: https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
 */

export async function register() {
  // Only initialize Sentry if DSN is configured
  const sentryDsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

  if (!sentryDsn) {
    console.log(
      '[Sentry] Sentry DSN not configured. Error monitoring disabled. ' +
        'Set NEXT_PUBLIC_SENTRY_DSN to enable Sentry error tracking.'
    );
    return;
  }

  // Initialize Sentry for server-side
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const Sentry = await import('@sentry/nextjs');

    Sentry.init({
      dsn: sentryDsn,

      // Adjust this value in production, or use tracesSampler for greater control
      tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

      // Setting this option to true will print useful information to the console while you're setting up Sentry.
      debug: false,

      // Replay sampling - set to 0 in production to save on quota
      replaysOnErrorSampleRate: process.env.NODE_ENV === 'production' ? 1.0 : 0,
      replaysSessionSampleRate: 0.1,

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
      ],
    });

    console.log('[Sentry] Server-side error monitoring initialized');
  }

  // Initialize Sentry for Edge Runtime
  if (process.env.NEXT_RUNTIME === 'edge') {
    const Sentry = await import('@sentry/nextjs');

    Sentry.init({
      dsn: sentryDsn,
      tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
      debug: false,
      environment: process.env.NODE_ENV || 'development',
    });

    console.log('[Sentry] Edge runtime error monitoring initialized');
  }
}
