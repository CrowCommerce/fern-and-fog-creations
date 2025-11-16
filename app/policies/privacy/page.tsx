import type { Metadata } from 'next';
import { getPolicy } from '@/lib/shopify';

export const metadata: Metadata = {
  title: 'Privacy Policy | Fern & Fog Creations',
  description: 'Privacy policy for Fern & Fog Creations - Learn how we collect, use, and protect your personal information.',
};

export default async function PrivacyPolicyPage() {
  const policy = await getPolicy('privacy');

  return (
    <div className="bg-parchment min-h-screen">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-display font-bold text-moss mb-8">
          {policy?.title || 'Privacy Policy'}
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
              Please configure your privacy policy in Shopify Admin &rarr; Settings &rarr; Policies.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
