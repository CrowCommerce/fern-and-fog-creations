import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Return & Refund Policy | Fern & Fog Creations',
  description: 'Return and refund policy for Fern & Fog Creations - Learn about our return process, eligibility, and refund timelines.',
};

/**
 * Renders the "Return & Refund Policy" page containing structured policy sections, a last-updated timestamp, and a Shopify integration note.
 *
 * @returns The React element representing the Returns & Refund Policy page.
 */
export default function ReturnsPolicyPage() {
  return (
    <div className="bg-parchment min-h-screen">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-display font-bold text-moss mb-8">Return & Refund Policy</h1>

        <div className="prose prose-lg max-w-none text-bark">
          {/*
            NOTE: This content can be managed via Shopify Admin:
            1. Go to Settings > Policies in your Shopify admin
            2. Edit your Refund Policy
            3. The content will automatically sync here if using Shopify's legal pages API

            For now, this is placeholder content that should be replaced with your actual return policy.
          */}

          <p className="text-sm text-bark/60 italic mb-8">
            Last updated: November 16, 2025
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-display font-semibold text-fern mb-4">Our Commitment</h2>
            <p>
              At Fern & Fog Creations, we want you to be completely satisfied with your purchase. Each piece is
              handcrafted with care using natural materials like sea glass, pressed flowers, and driftwood. If you're
              not happy with your order, we're here to help.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-display font-semibold text-fern mb-4">Return Eligibility</h2>
            <p>You may return most items within 30 days of delivery for a full refund. To be eligible for a return:</p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>Items must be in their original condition and packaging</li>
              <li>Jewelry pieces must be unworn and unused</li>
              <li>All original tags and certificates of authenticity must be included</li>
              <li>Items must not show signs of wear or damage</li>
            </ul>
            <p className="mt-4">
              <strong>Please note:</strong> Custom, personalized, or made-to-order items cannot be returned unless
              they arrive damaged or defective.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-display font-semibold text-fern mb-4">How to Initiate a Return</h2>
            <p>To start a return, please follow these steps:</p>
            <ol className="list-decimal pl-6 mt-4 space-y-2">
              <li>Contact us at <a href="mailto:returns@fernandfogcreations.com" className="text-fern hover:text-moss underline">returns@fernandfogcreations.com</a> with your order number</li>
              <li>Provide the reason for your return and any relevant photos if the item is damaged</li>
              <li>Wait for our team to approve your return request and provide return shipping instructions</li>
              <li>Pack the item securely in its original packaging</li>
              <li>Ship the item using the provided return label or tracking number</li>
            </ol>
            <p className="mt-4">
              <strong>Important:</strong> Do not ship items back without contacting us first. Unauthorized returns
              may not be accepted or refunded.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-display font-semibold text-fern mb-4">Return Shipping</h2>
            <p>
              Return shipping costs depend on the reason for your return:
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li><strong>Damaged or defective items:</strong> We'll provide a prepaid return label at no cost to you</li>
              <li><strong>Change of mind or sizing issues:</strong> You're responsible for return shipping costs</li>
              <li><strong>Wrong item shipped:</strong> We'll cover all return shipping costs and send the correct item at no charge</li>
            </ul>
            <p className="mt-4">
              We recommend using a trackable shipping service or purchasing shipping insurance for returns over $50.
              We cannot guarantee that we will receive your returned item without tracking.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-display font-semibold text-fern mb-4">Refund Process</h2>
            <p>
              Once we receive your returned item, we'll inspect it and process your refund within 5-7 business days.
              Refunds will be issued to your original payment method. Please note:
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>Original shipping costs are non-refundable (unless the return is due to our error)</li>
              <li>It may take 5-10 business days for the refund to appear in your account, depending on your bank</li>
              <li>You'll receive an email confirmation once your refund has been processed</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-display font-semibold text-fern mb-4">Exchanges</h2>
            <p>
              We don't offer direct exchanges at this time. If you need a different size, color, or style, please
              return the original item for a refund and place a new order for the item you'd like. This ensures you
              get exactly what you want as quickly as possible.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-display font-semibold text-fern mb-4">Damaged or Defective Items</h2>
            <p>
              We carefully inspect and package all items before shipping. However, if your item arrives damaged or
              defective, please contact us within 48 hours of delivery with:
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>Your order number</li>
              <li>Photos of the damaged item and packaging</li>
              <li>A description of the issue</li>
            </ul>
            <p className="mt-4">
              We'll work with you to send a replacement or issue a full refund, including original shipping costs.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-display font-semibold text-fern mb-4">Non-Returnable Items</h2>
            <p>The following items cannot be returned:</p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>Custom or personalized items (unless damaged or defective)</li>
              <li>Gift cards</li>
              <li>Sale or clearance items marked as "final sale"</li>
              <li>Items returned without prior authorization</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-display font-semibold text-fern mb-4">Contact Us</h2>
            <p>
              If you have any questions about returns or refunds, please contact us at{' '}
              <a href="mailto:returns@fernandfogcreations.com" className="text-fern hover:text-moss underline">
                returns@fernandfogcreations.com
              </a>
            </p>
          </section>

          <div className="mt-12 p-6 bg-mist/50 rounded-lg border border-mist">
            <p className="text-sm text-bark/70">
              <strong>Note for Shopify Integration:</strong> This return policy can be managed and updated
              directly from your Shopify admin panel under Settings → Policies. Changes made there will
              automatically be reflected on your storefront.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}