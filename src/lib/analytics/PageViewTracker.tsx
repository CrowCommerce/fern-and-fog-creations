/**
 * App Router Page View Tracker
 *
 * Automatically tracks page views on route changes using Next.js App Router hooks.
 * Sends events to both Vercel Analytics and Google Tag Manager.
 *
 * Usage:
 * Add this component to your root layout (app/layout.tsx):
 * ```tsx
 * import PageViewTracker from '@/lib/analytics/PageViewTracker';
 *
 * export default function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <body>
 *         {children}
 *         <PageViewTracker />
 *       </body>
 *     </html>
 *   );
 * }
 * ```
 *
 * For Pages Router (legacy), use this pattern in _app.tsx:
 * ```tsx
 * import { useRouter } from 'next/router';
 * import { useEffect } from 'react';
 * import { trackPageView } from '@/lib/analytics/track';
 *
 * function MyApp({ Component, pageProps }) {
 *   const router = useRouter();
 *
 *   useEffect(() => {
 *     const handler = (url: string) => {
 *       trackPageView({
 *         path: url,
 *         title: document.title,
 *         referrer: document.referrer,
 *       });
 *     };
 *
 *     // Track initial page load
 *     handler(router.asPath);
 *
 *     // Track route changes
 *     router.events.on('routeChangeComplete', handler);
 *     return () => router.events.off('routeChangeComplete', handler);
 *   }, [router]);
 *
 *   return <Component {...pageProps} />;
 * }
 * ```
 */

"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { trackPageView } from "./track";

export default function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Construct full URL with query params
    const url = pathname + (searchParams?.toString() ? `?${searchParams}` : "");

    // Delay to allow document.title to settle after navigation
    // Next.js updates the title asynchronously, so we wait a tick
    const timeoutId = setTimeout(() => {
      trackPageView({
        path: url,
        title: typeof document !== "undefined" ? document.title : undefined,
        referrer: typeof document !== "undefined" ? document.referrer : undefined,
      });
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [pathname, searchParams]);

  // This component renders nothing
  return null;
}
