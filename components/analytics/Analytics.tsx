import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google';

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
