import type { Metadata } from 'next';
import { getPolicy } from '@/lib/shopify';

export const metadata: Metadata = {
  title: 'Terms of Service | Fern & Fog Creations',
  description: 'Terms of service for Fern & Fog Creations - Learn about the terms and conditions governing your use of our website and services.',
};

export default async function TermsOfServicePage() {
  const policy = await getPolicy('terms');

  return (
    <div className="bg-parchment min-h-screen">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-display font-bold text-moss mb-8">
          {policy?.title || 'Terms of Service'}
        </h1>

        {policy?.body ? (
          // Render Shopify policy content (managed via Shopify Admin > Settings > Policies)
          <div
            className="prose prose-lg max-w-none text-bark"
            dangerouslySetInnerHTML={{ __html: policy.body }}
          />
        ) : (
          // Policy not configured in Shopify Admin
          <div className="p-8 bg-mist/50 rounded-lg border border-mist text-center">
            <p className="text-bark/70 mb-2">
              <strong>Policy Not Configured</strong>
            </p>
            <p className="text-sm text-bark/60">
              Please configure your terms of service in Shopify Admin &rarr; Settings &rarr; Policies.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
