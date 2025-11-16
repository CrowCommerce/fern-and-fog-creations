import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google';
import { Analytics as VercelAnalytics } from '@vercel/analytics/react';

export function Analytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;

  return (
    <>
      {/* Vercel Analytics - Always enabled (privacy-friendly, GDPR-compliant) */}
      <VercelAnalytics />

      {/* Google Analytics (GA4) - Optional */}
      {gaId && <GoogleAnalytics gaId={gaId} />}

      {/* Google Tag Manager (GTM) - Optional, typically used instead of GA */}
      {gtmId && <GoogleTagManager gtmId={gtmId} />}
    </>
  );
}
