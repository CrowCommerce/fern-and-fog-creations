import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | Fern & Fog Creations',
  description: 'Terms of service for Fern & Fog Creations - Learn about the terms and conditions governing your use of our website and services.',
};

export default function TermsOfServicePage() {
  return (
    <div className="bg-parchment min-h-screen">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-display font-bold text-moss mb-8">Terms of Service</h1>

        <div className="prose prose-lg max-w-none text-bark">
          {/*
            CURRENT IMPLEMENTATION: Static placeholder content rendered from JSX.

            MAINTENANCE: To update this policy, manually edit this file and commit changes.

            TODO: Integrate with Shopify Legal Pages API for dynamic content management.
            This would allow non-technical users to update policies via Shopify Admin
            (Settings > Policies) without code deployments.

            Implementation plan:
            1. Add Shopify GraphQL query for shop.termsOfService in lib/shopify/queries/
            2. Create getShopPolicy(type: 'privacy' | 'shipping' | 'refund' | 'terms') in lib/shopify/
            3. Fetch policy content server-side in this page component
            4. Render policy.body HTML if available, fallback to static content below
            5. Add cache tags for policy content revalidation

            Reference: https://shopify.dev/docs/api/storefront/latest/queries/shop#field-shop-termsofservice
          */}

          <p className="text-sm text-bark/60 italic mb-8">
            Last updated: November 16, 2025
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-display font-semibold text-fern mb-4">Agreement to Terms</h2>
            <p>
              By accessing or using the Fern & Fog Creations website, you agree to be bound by these Terms of Service
              and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited
              from using or accessing this site.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-display font-semibold text-fern mb-4">Use License</h2>
            <p>
              Permission is granted to temporarily access the materials on Fern & Fog Creations' website for personal,
              non-commercial use only. This license does not allow you to:
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose or public display</li>
              <li>Attempt to reverse engineer any software on our website</li>
              <li>Remove any copyright or proprietary notations from the materials</li>
              <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-display font-semibold text-fern mb-4">Product Information</h2>
            <p>
              We strive to provide accurate product descriptions and images. However, as each piece is handcrafted using
              natural materials (sea glass, pressed flowers, driftwood), there may be slight variations in color, size,
              and appearance. These variations are part of what makes each piece unique.
            </p>
            <p className="mt-4">
              We reserve the right to limit quantities of any products or services offered and to refuse service to anyone
              at our sole discretion. Product availability is subject to change without notice.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-display font-semibold text-fern mb-4">Pricing</h2>
            <p>
              All prices are in USD and are subject to change without notice. We reserve the right to modify prices at
              any time. However, prices are guaranteed at the time of purchase, even if we later change them.
            </p>
            <p className="mt-4">
              We make every effort to ensure pricing accuracy. If an error is discovered, we'll contact you to confirm
              whether you wish to proceed at the correct price or cancel your order.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-display font-semibold text-fern mb-4">Payment Terms</h2>
            <p>
              Payment is processed securely through Shopify Payments at the time of purchase. We accept major credit cards,
              debit cards, and other payment methods as indicated at checkout. By providing payment information, you
              represent that you are authorized to use the payment method.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-display font-semibold text-fern mb-4">Account Registration</h2>
            <p>
              You may be required to create an account to make a purchase or access certain features. You are responsible
              for maintaining the confidentiality of your account credentials and for all activities under your account.
              Please notify us immediately of any unauthorized use.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-display font-semibold text-fern mb-4">Intellectual Property</h2>
            <p>
              All content on this website, including but not limited to text, images, logos, product designs, and
              photographs, is the property of Fern & Fog Creations and is protected by copyright and trademark laws.
              Unauthorized use of any materials may violate copyright, trademark, and other laws.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-display font-semibold text-fern mb-4">User Conduct</h2>
            <p>You agree not to use our website to:</p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>Violate any local, state, national, or international law</li>
              <li>Transmit any harmful, offensive, or inappropriate content</li>
              <li>Impersonate any person or entity</li>
              <li>Interfere with or disrupt the website or servers</li>
              <li>Collect or harvest personal information about other users</li>
              <li>Engage in any fraudulent activity</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-display font-semibold text-fern mb-4">Limitation of Liability</h2>
            <p>
              Fern & Fog Creations shall not be liable for any indirect, incidental, special, consequential, or punitive
              damages resulting from your use of or inability to use our website or products. Our total liability shall
              not exceed the amount you paid for the product in question.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-display font-semibold text-fern mb-4">Disclaimer</h2>
            <p>
              The materials on our website are provided on an "as is" basis. We make no warranties, expressed or implied,
              and hereby disclaim all other warranties including, without limitation, implied warranties of merchantability,
              fitness for a particular purpose, or non-infringement.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-display font-semibold text-fern mb-4">Links to Third-Party Sites</h2>
            <p>
              Our website may contain links to third-party websites. We are not responsible for the content, accuracy,
              or privacy practices of external sites. Accessing third-party links is at your own risk.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-display font-semibold text-fern mb-4">Modifications to Terms</h2>
            <p>
              We reserve the right to revise these Terms of Service at any time. By continuing to use this website after
              changes are posted, you agree to be bound by the revised terms. Please review this page periodically for updates.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-display font-semibold text-fern mb-4">Governing Law</h2>
            <p>
              These terms and conditions are governed by and construed in accordance with the laws of the jurisdiction
              in which Fern & Fog Creations operates, and you irrevocably submit to the exclusive jurisdiction of the
              courts in that location.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-display font-semibold text-fern mb-4">Contact Information</h2>
            <p>
              If you have any questions about these Terms of Service, please contact us at{' '}
              <a href="mailto:legal@fernandfogcreations.com" className="text-fern hover:text-moss underline">
                legal@fernandfogcreations.com
              </a>
            </p>
          </section>

          <div className="mt-12 p-6 bg-mist/50 rounded-lg border border-mist">
            <p className="text-sm text-bark/70">
              <strong>Current Status:</strong> These terms of service are static content. To update them, edit this file
              directly in the codebase and redeploy.
            </p>
            <p className="text-sm text-bark/70 mt-2">
              <strong>Future Enhancement:</strong> Shopify's Legal Pages API can be integrated to allow
              policy management via Settings → Policies in Shopify Admin, eliminating the need for code changes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
