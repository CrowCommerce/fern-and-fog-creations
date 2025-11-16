import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Fern & Fog Creations',
  description: 'Privacy policy for Fern & Fog Creations - Learn how we collect, use, and protect your personal information.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-parchment min-h-screen">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-display font-bold text-moss mb-8">Privacy Policy</h1>

        <div className="prose prose-lg max-w-none text-bark">
          {/*
            NOTE: This content can be managed via Shopify Admin:
            1. Go to Settings > Policies in your Shopify admin
            2. Edit your Privacy Policy
            3. The content will automatically sync here if using Shopify's legal pages API

            For now, this is placeholder content that should be replaced with your actual privacy policy.
          */}

          <p className="text-sm text-bark/60 italic mb-8">
            Last updated: November 16, 2025
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-display font-semibold text-fern mb-4">Introduction</h2>
            <p>
              Welcome to Fern & Fog Creations. We respect your privacy and are committed to protecting your personal data.
              This privacy policy will inform you about how we look after your personal data when you visit our website
              and tell you about your privacy rights and how the law protects you.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-display font-semibold text-fern mb-4">Information We Collect</h2>
            <p>We may collect, use, store and transfer different kinds of personal data about you including:</p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li><strong>Identity Data:</strong> First name, last name, username or similar identifier</li>
              <li><strong>Contact Data:</strong> Email address, billing address, delivery address and telephone numbers</li>
              <li><strong>Transaction Data:</strong> Details about payments to and from you and other details of products and services you have purchased from us</li>
              <li><strong>Technical Data:</strong> Internet protocol (IP) address, browser type and version, time zone setting and location, operating system and platform</li>
              <li><strong>Usage Data:</strong> Information about how you use our website, products and services</li>
              <li><strong>Marketing Data:</strong> Your preferences in receiving marketing from us and your communication preferences</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-display font-semibold text-fern mb-4">How We Use Your Information</h2>
            <p>We use your personal data for the following purposes:</p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>To process and deliver your orders</li>
              <li>To manage payments, fees and charges</li>
              <li>To communicate with you about your orders and respond to your inquiries</li>
              <li>To improve our website, products, and services</li>
              <li>To send you marketing communications (with your consent)</li>
              <li>To protect against fraudulent or illegal activity</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-display font-semibold text-fern mb-4">Data Security</h2>
            <p>
              We have put in place appropriate security measures to prevent your personal data from being accidentally lost,
              used or accessed in an unauthorized way, altered or disclosed. We use Shopify's secure checkout process,
              which is PCI DSS compliant.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-display font-semibold text-fern mb-4">Your Rights</h2>
            <p>Under data protection laws, you have rights including:</p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li><strong>Right to access:</strong> Request copies of your personal data</li>
              <li><strong>Right to rectification:</strong> Request correction of inaccurate or incomplete data</li>
              <li><strong>Right to erasure:</strong> Request deletion of your personal data</li>
              <li><strong>Right to restrict processing:</strong> Request restriction of processing of your personal data</li>
              <li><strong>Right to data portability:</strong> Request transfer of your data to another organization</li>
              <li><strong>Right to object:</strong> Object to processing of your personal data</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-display font-semibold text-fern mb-4">Cookies</h2>
            <p>
              Our website uses cookies to distinguish you from other users. This helps us provide you with a good
              experience when you browse our website and allows us to improve our site. We use essential cookies
              for cart functionality and optional cookies for analytics (with your consent).
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-display font-semibold text-fern mb-4">Third-Party Services</h2>
            <p>
              We use Shopify as our e-commerce platform. Your payment information is processed securely through
              Shopify Payments. We may also use third-party services for analytics and marketing purposes.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-display font-semibold text-fern mb-4">Contact Us</h2>
            <p>
              If you have any questions about this privacy policy or our privacy practices, please contact us at{' '}
              <a href="mailto:privacy@fernandfogcreations.com" className="text-fern hover:text-moss underline">
                privacy@fernandfogcreations.com
              </a>
            </p>
          </section>

          <div className="mt-12 p-6 bg-mist/50 rounded-lg border border-mist">
            <p className="text-sm text-bark/70">
              <strong>Note for Shopify Integration:</strong> This privacy policy can be managed and updated
              directly from your Shopify admin panel under Settings → Policies. Changes made there will
              automatically be reflected on your storefront.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
