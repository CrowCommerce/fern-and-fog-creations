# TODO

## Custom React Emails Integration

### Overview
Set up custom transactional emails using [React Email](https://react.email/) to replace Shopify's default email templates with branded, customizable emails.

### Research Required (Pre-Implementation)

#### Shopify API Investigation
- [ ] Research Shopify Admin API email notification capabilities
- [ ] Investigate if Storefront API has any email-related functionality
- [ ] Determine if Shopify webhooks can trigger custom email sends (e.g., `orders/create`, `fulfillments/create`)
- [ ] Explore Shopify's notification settings and which can be disabled/overridden
- [ ] Research third-party email service integration (Resend, SendGrid, Postmark) with Shopify

#### Email Types to Evaluate
- [ ] Order confirmation emails
- [ ] Shipping/fulfillment notification emails
- [ ] Order cancelled emails
- [ ] Customer account emails (welcome, password reset)
- [ ] Abandoned cart recovery emails
- [ ] Review request emails
- [ ] Contact form submission confirmations

#### Technical Considerations
- [ ] Determine email service provider (Resend recommended for React Email)
- [ ] Plan webhook endpoints for Shopify events
- [ ] Design email template architecture
- [ ] Consider email preview/testing workflow
- [ ] Plan for email tracking/analytics

### Implementation Steps (After Research)
1. Set up email service provider account
2. Install `react-email` and `@react-email/components`
3. Create base email layout matching Fern & Fog branding
4. Build individual email templates
5. Set up webhook handlers for Shopify events
6. Configure Shopify to disable default notifications (where applicable)
7. Test email delivery and rendering across clients
8. Deploy and monitor
