import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google';

/**
 * Renders analytics integrations when their environment IDs are defined.
 *
 * Reads NEXT_PUBLIC_GA_ID and NEXT_PUBLIC_GTM_ID and, when present, renders
 * Google Analytics (GA4) and Google Tag Manager (GTM) components respectively.
 *
 * @returns A React fragment that contains the GA and/or GTM integration components when their IDs are set.
 */
export function Analytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;

  return (
    <>
      {/* Google Analytics (GA4) */}
      {gaId && <GoogleAnalytics gaId={gaId} />}

      {/* Google Tag Manager (GTM) - Alternative to GA */}
      {gtmId && <GoogleTagManager gtmId={gtmId} />}
    </>
  );
}