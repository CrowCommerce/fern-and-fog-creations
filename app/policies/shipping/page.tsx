import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shipping Policy | Fern & Fog Creations',
  description: 'Shipping policy for Fern & Fog Creations - Learn about our shipping methods, rates, and delivery times.',
};

export default function ShippingPolicyPage() {
  return (
    <div className="bg-parchment min-h-screen">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-display font-bold text-moss mb-8">Shipping Policy</h1>

        <div className="prose prose-lg max-w-none text-bark">
          {/*
            NOTE: This content can be managed via Shopify Admin:
            1. Go to Settings > Policies in your Shopify admin
            2. Edit your Shipping Policy
            3. The content will automatically sync here if using Shopify's legal pages API

            For now, this is placeholder content that should be replaced with your actual shipping policy.
          */}

          <p className="text-sm text-bark/60 italic mb-8">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-display font-semibold text-fern mb-4">Shipping Methods</h2>
            <p>
              We offer several shipping options to ensure your handcrafted coastal treasures arrive safely at your door.
              All items are carefully packaged to protect delicate pieces like sea glass earrings and pressed flower resin jewelry.
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li><strong>Standard Shipping:</strong> 5-7 business days</li>
              <li><strong>Expedited Shipping:</strong> 2-3 business days</li>
              <li><strong>Express Shipping:</strong> 1-2 business days</li>
              <li><strong>International Shipping:</strong> 10-21 business days (where available)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-display font-semibold text-fern mb-4">Shipping Rates</h2>
            <p>
              Shipping costs are calculated at checkout based on your location, the weight and dimensions of your order,
              and your selected shipping method. Free standard shipping is available on orders over $75 within the
              continental United States.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-display font-semibold text-fern mb-4">Processing Time</h2>
            <p>
              Most orders are processed and shipped within 1-3 business days. Please note that some items are made to order
              and may require additional processing time. If your order includes custom or made-to-order items, we'll notify
              you of the expected processing time before shipment.
            </p>
            <p className="mt-4">
              Orders placed on weekends or holidays will be processed on the next business day.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-display font-semibold text-fern mb-4">Tracking Your Order</h2>
            <p>
              Once your order ships, you'll receive a shipping confirmation email with a tracking number. You can use this
              number to track your package's progress on the carrier's website. If you have any questions about your shipment,
              please don't hesitate to contact us.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-display font-semibold text-fern mb-4">Shipping Restrictions</h2>
            <p>
              We currently ship to addresses within the United States and select international destinations. Unfortunately,
              we cannot ship to P.O. boxes for certain items due to carrier restrictions. International customers are responsible
              for any customs duties or taxes that may apply.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-display font-semibold text-fern mb-4">Damaged or Lost Packages</h2>
            <p>
              We take great care in packaging our handmade items. However, if your order arrives damaged, please contact us
              within 48 hours of delivery with photos of the damage. We'll work with you to resolve the issue promptly.
            </p>
            <p className="mt-4">
              If your package appears lost in transit, please contact us and we'll initiate a trace with the carrier.
              We'll work to resolve the situation as quickly as possible.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-display font-semibold text-fern mb-4">Address Changes</h2>
            <p>
              If you need to change your shipping address after placing an order, please contact us immediately.
              We can only modify addresses before the order has been shipped. Once a package is in transit,
              we cannot redirect it to a different address.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-display font-semibold text-fern mb-4">Contact Us</h2>
            <p>
              If you have any questions about shipping, please contact us at{' '}
              <a href="mailto:shipping@fernandfogcreations.com" className="text-fern hover:text-moss underline">
                shipping@fernandfogcreations.com
              </a>
            </p>
          </section>

          <div className="mt-12 p-6 bg-mist/50 rounded-lg border border-mist">
            <p className="text-sm text-bark/70">
              <strong>Note for Shopify Integration:</strong> This shipping policy can be managed and updated
              directly from your Shopify admin panel under Settings → Policies. Changes made there will
              automatically be reflected on your storefront.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
