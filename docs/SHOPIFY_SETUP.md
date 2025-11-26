# Shopify Storefront Setup Guide

Complete guide for connecting this Next.js storefront to a new Shopify store.

**Time Required:** 30-60 minutes
**Difficulty:** Beginner-friendly with technical sections

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Shopify Store Configuration](#2-shopify-store-configuration)
3. [Create a Custom App](#3-create-a-custom-app)
4. [Configure API Access Scopes](#4-configure-api-access-scopes)
5. [Get Your API Credentials](#5-get-your-api-credentials)
6. [Configure Environment Variables](#6-configure-environment-variables)
7. [Run Migration Scripts](#7-run-migration-scripts)
8. [Configure Navigation Menus](#8-configure-navigation-menus)
9. [Set Up Webhooks](#9-set-up-webhooks)
10. [Verify Your Integration](#10-verify-your-integration)
11. [Troubleshooting](#11-troubleshooting)
12. [Appendix: API Scopes Reference](#appendix-api-scopes-reference)

---

## 1. Prerequisites

Before you begin, ensure you have:

### Required
- **Node.js 20+** - [Download](https://nodejs.org/)
- **pnpm 10.19.0+** - Install with `npm install -g pnpm`
- **Shopify Store** - A Shopify account with an active store (Basic plan or higher)
- **Terminal/Command Line** - Basic familiarity with running commands

### Optional (Recommended)
- **Vercel Account** - For deployment ([vercel.com](https://vercel.com))
- **Code Editor** - VS Code recommended ([code.visualstudio.com](https://code.visualstudio.com))

### Verify Installation

```bash
node --version    # Should show v20.x or higher
pnpm --version    # Should show 10.19.0 or higher
```

---

## 2. Shopify Store Configuration

### Enable Headless Commerce

Your Shopify store needs to allow custom storefronts (headless mode):

1. Log in to your [Shopify Admin](https://admin.shopify.com)
2. Go to **Settings** (gear icon, bottom left)
3. Click **Apps and sales channels**
4. Verify you can access **Develop apps** (you'll use this in the next step)

> **Note:** All Shopify plans support custom storefronts through the Storefront API. No special plan upgrade is required.

### Recommended Store Settings

While in Shopify Admin, configure these settings:

1. **Settings > Checkout**
   - Ensure checkout is enabled and functional
   - Test with a test order if this is a new store

2. **Settings > Markets**
   - Configure your selling regions
   - Set primary market currency

3. **Online Store > Navigation** (we'll configure menus later)
   - Note that this is where header/footer menus live

---

## 3. Create a Custom App

Custom apps provide API access to your store. You'll create one app that provides both Storefront and Admin API access.

### Step-by-Step

1. Go to **Settings > Apps and sales channels**
2. Click **Develop apps** at the top
3. If prompted, click **Allow custom app development**
4. Click **Create an app**
5. Enter an App name (e.g., "Fern & Fog Storefront")
6. Select yourself as the App developer
7. Click **Create app**

> **Official Documentation:** [Creating custom apps](https://help.shopify.com/en/manual/apps/app-types/custom-apps)

---

## 4. Configure API Access Scopes

After creating your app, you need to configure which parts of your store the app can access.

### Configure Storefront API Scopes

The Storefront API is used by your website to display products and handle cart operations.

1. In your app settings, click **Configure Storefront API scopes**
2. Enable these scopes:

| Scope | Purpose |
|-------|---------|
| `unauthenticated_read_product_listings` | Display products on your storefront |
| `unauthenticated_read_product_inventory` | Show stock availability |
| `unauthenticated_read_product_pickup_locations` | Support buy online, pick up in store |
| `unauthenticated_read_checkouts` | Read checkout information |
| `unauthenticated_write_checkouts` | Create and modify shopping carts |
| `unauthenticated_read_content` | Read CMS content (metaobjects) |
| `unauthenticated_read_metaobjects` | Read custom CMS data |

3. Click **Save**

### Configure Admin API Scopes

The Admin API is used by migration scripts to set up your store content. You only need this for initial setup and content migrations.

1. Click **Configure Admin API scopes**
2. Enable these scopes:

| Scope | Purpose |
|-------|---------|
| `read_products` | Read product data |
| `write_products` | Create/update products (migrations) |
| `read_collections` | Read collection data |
| `write_collections` | Create/update collections (migrations) |
| `read_content` | Read metaobjects |
| `write_content` | Create metaobject definitions |
| `read_metaobjects` | Read custom CMS data |
| `write_metaobjects` | Create/update CMS content |
| `write_metaobject_definitions` | Create metaobject types |
| `read_files` | Read uploaded files |
| `write_files` | Upload images (product migrations) |
| `read_inventory` | Read inventory levels |

3. Click **Save**

> **Important:** If you add scopes later, you must reinstall the app to apply changes.

---

## 5. Get Your API Credentials

Now install your app and retrieve the access tokens.

### Install the App

1. In your app settings, click **Install app** (top right)
2. Review the permissions and click **Install**

### Copy Your Credentials

After installation, you'll see your credentials:

#### Storefront API Access Token
1. Go to **API credentials** tab
2. Under **Storefront API access token**, click **Reveal token once**
3. **Copy and save this token immediately** - you can only view it once!
4. If you lose it, click **Uninstall** and reinstall the app to generate a new one

#### Admin API Access Token
1. Under **Admin API access token**, click **Reveal token once**
2. **Copy and save this token immediately**
3. You'll need this for running migration scripts

#### Store Domain
Your store domain is in the format: `your-store-name.myshopify.com`

Find it in:
- Your browser URL when logged into Shopify Admin
- **Settings > Domains** in Shopify Admin

---

## 6. Configure Environment Variables

### Create Your Environment File

```bash
# From the project root
cp .env.example .env.local
```

### Fill in Your Credentials

Open `.env.local` in your editor and add your values:

```bash
# Shopify Integration (REQUIRED)
SHOPIFY_STORE_DOMAIN=your-store-name.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-storefront-token-from-step-5
SHOPIFY_REVALIDATION_SECRET=generate-a-random-secret

# Admin API (REQUIRED for migration scripts)
SHOPIFY_ADMIN_ACCESS_TOKEN=your-admin-token-from-step-5

# Enable Shopify Mode
NEXT_PUBLIC_USE_SHOPIFY=true
```

### Generate a Revalidation Secret

The revalidation secret secures your webhook endpoint. Generate a random string:

**Option 1: Using Node.js**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Option 2: Using OpenSSL**
```bash
openssl rand -hex 32
```

**Option 3: Online Generator**
Use any secure password generator (32+ characters)

### Verify Your Configuration

```bash
# Test that the app starts
pnpm dev
```

Visit `http://localhost:3000`. You may see empty content if you haven't run migrations yet - that's expected!

---

## 7. Run Migration Scripts

Migration scripts create the necessary metaobject definitions in Shopify and populate them with initial content.

### Recommended Order

Run these scripts in order. Always run the `:dry` version first to preview changes.

#### Step 1: Page Metadata (SEO)

```bash
# Preview what will be created
pnpm setup:metadata:dry

# Create the metaobject definition and entries
pnpm setup:metadata
```

This creates SEO metadata for all pages (titles, descriptions, OpenGraph images).

#### Step 2: Homepage Hero

```bash
pnpm setup:homepage:dry    # Preview
pnpm setup:homepage        # Create
```

This creates the homepage hero section (heading, description, call-to-action buttons, background image).

#### Step 3: About Page

```bash
pnpm setup:about:dry       # Preview
pnpm setup:about           # Create
```

This creates about page content including story text, process steps, and company values.

#### Step 4: Contact Page

```bash
pnpm setup:contact:dry     # Preview
pnpm setup:contact         # Create
```

This creates contact page content (intro text, optional contact details).

#### Step 5: Products (Optional)

Only run this if migrating products from local data:

```bash
pnpm migrate:products:dry  # Preview
pnpm migrate:products      # Migrate
```

#### Step 6: Gallery (Optional)

Only run this if using the gallery feature:

```bash
pnpm migrate:gallery:dry   # Preview
pnpm migrate:gallery       # Migrate
```

### Verify in Shopify Admin

After running migrations:

1. Go to **Settings > Custom data > Metaobjects**
2. You should see definitions for:
   - `page_metadata`
   - `homepage_hero`
   - `about_page`
   - `about_process_step`
   - `about_value`
   - `contact_page`
   - (and `gallery_item`, `gallery_category` if you ran gallery migrations)

3. Click each to see the created entries

---

## 8. Configure Navigation Menus

The storefront pulls navigation from Shopify menus. You need to create two menus.

### Create Header Menu

1. Go to **Online Store > Navigation**
2. Click **Add menu**
3. Set the title to exactly: `Header menu`
4. Add menu items:
   - **Shop** → Link to `/products`
   - **Gallery** → Link to `/gallery`
   - **About** → Link to `/about`
   - **Contact** → Link to `/contact`
5. Click **Save menu**

### Create Footer Menu

1. Click **Add menu** again
2. Set the title to exactly: `Footer menu`
3. Add menu items:
   - **Privacy Policy** → Link to your privacy page
   - **Terms of Service** → Link to your terms page
   - **Shipping & Returns** → Link to your shipping page
   - (Add any other footer links)
5. Click **Save menu**

> **Important:** The menu titles must be "Header menu" and "Footer menu" (case-sensitive) for the storefront to find them.

---

## 9. Set Up Webhooks

Webhooks notify your storefront when content changes in Shopify, triggering cache updates so changes appear immediately.

### Create Webhooks in Shopify

1. Go to **Settings > Notifications**
2. Scroll down to **Webhooks**
3. Click **Create webhook**

Create these webhooks (each pointing to your domain):

| Event | Webhook URL |
|-------|-------------|
| Product creation | `https://your-domain.com/api/revalidate?secret=YOUR_SECRET` |
| Product update | `https://your-domain.com/api/revalidate?secret=YOUR_SECRET` |
| Product deletion | `https://your-domain.com/api/revalidate?secret=YOUR_SECRET` |
| Collection creation | `https://your-domain.com/api/revalidate?secret=YOUR_SECRET` |
| Collection update | `https://your-domain.com/api/revalidate?secret=YOUR_SECRET` |
| Collection deletion | `https://your-domain.com/api/revalidate?secret=YOUR_SECRET` |

Replace:
- `your-domain.com` with your actual domain (e.g., `fernandfogcreations.com`)
- `YOUR_SECRET` with the `SHOPIFY_REVALIDATION_SECRET` from your `.env.local`

### Webhook Format

Select **JSON** as the webhook format.

### API Version

Select the latest stable API version (e.g., `2024-10`).

> **Note:** For metaobject updates (CMS content), Shopify doesn't have dedicated webhook events. The storefront uses time-based cache expiration (1 day) for CMS content, or you can manually trigger revalidation.

### Test Webhooks

After deployment, test webhook delivery:

1. Make a change to a product in Shopify Admin
2. Go to **Settings > Notifications > Webhooks**
3. Click on a webhook to see delivery history
4. Verify successful delivery (200 status code)

---

## 10. Verify Your Integration

### Local Development Checklist

Start the development server:

```bash
pnpm dev
```

Then verify each feature:

| Feature | How to Test | Expected Result |
|---------|-------------|-----------------|
| Homepage | Visit `/` | Hero section displays with your content |
| Products | Visit `/products` | Products from Shopify display |
| Product Detail | Click any product | Product page with variants loads |
| Add to Cart | Click "Add to Cart" | Cart drawer opens, item appears |
| Cart Update | Change quantity | Cart updates immediately |
| Checkout | Click "Checkout" | Redirects to Shopify checkout |
| Navigation | Click menu items | All links work, menus render |
| About Page | Visit `/about` | CMS content displays |
| Contact Page | Visit `/contact` | Contact form displays |
| Gallery | Visit `/gallery` | Gallery items display (if migrated) |

### Production Checklist

Before going live:

- [ ] All environment variables set in hosting platform (Vercel)
- [ ] `NEXT_PUBLIC_USE_SHOPIFY=true` in production
- [ ] Webhooks configured with production domain
- [ ] SSL certificate active (HTTPS)
- [ ] Domain connected and DNS propagated
- [ ] Test purchase completed successfully
- [ ] Mobile responsiveness verified
- [ ] SEO metadata rendering correctly (check page source)

---

## 11. Troubleshooting

### Common Errors

#### "Failed to fetch products" or Empty Product List

**Cause:** Storefront API credentials are incorrect or missing scopes.

**Fix:**
1. Verify `SHOPIFY_STORE_DOMAIN` format: `store-name.myshopify.com` (no https://)
2. Check `SHOPIFY_STOREFRONT_ACCESS_TOKEN` is correct
3. Ensure all required Storefront API scopes are enabled
4. Reinstall the app if you added scopes after initial installation

#### "Admin API Error" During Migrations

**Cause:** Admin API token missing or insufficient permissions.

**Fix:**
1. Verify `SHOPIFY_ADMIN_ACCESS_TOKEN` is set
2. Check all Admin API scopes are enabled (especially `write_metaobjects`)
3. Reinstall the app to get a fresh token

#### Cart Not Working

**Cause:** Checkout scopes not enabled.

**Fix:**
1. Ensure `unauthenticated_write_checkouts` scope is enabled
2. Verify `unauthenticated_read_checkouts` scope is enabled
3. Reinstall app after adding scopes

#### Menus Not Displaying

**Cause:** Menu names don't match expected values.

**Fix:**
1. Go to **Online Store > Navigation**
2. Ensure menu titles are exactly "Header menu" and "Footer menu"
3. Check menus have at least one item

#### Webhooks Not Working

**Cause:** Secret mismatch or incorrect URL.

**Fix:**
1. Verify webhook URL includes your secret: `?secret=YOUR_SECRET`
2. Check `SHOPIFY_REVALIDATION_SECRET` matches the URL parameter
3. Ensure webhook URL uses HTTPS
4. Check webhook delivery history in Shopify Admin

#### Content Not Updating

**Cause:** Cache not invalidated.

**Fix:**
1. Wait up to 24 hours (default cache duration)
2. Manually trigger revalidation:
   ```bash
   curl -X POST "https://your-domain.com/api/revalidate?secret=YOUR_SECRET" \
     -H "x-shopify-topic: metaobjects/update"
   ```
3. Redeploy for immediate cache clear

### Getting Help

If you're still stuck:

1. Check the [Shopify Storefront API Documentation](https://shopify.dev/docs/api/storefront)
2. Review error messages in your terminal/console
3. Check Shopify Admin > Settings > Notifications > Webhooks for delivery failures
4. See other docs in this project:
   - [CLAUDE.md](../CLAUDE.md) - Technical architecture
   - [Shopify CMS Guide](SHOPIFY_CMS_GUIDE.md) - Content management

---

## Appendix: API Scopes Reference

### Storefront API Scopes (Required)

| Scope | Description | Used For |
|-------|-------------|----------|
| `unauthenticated_read_product_listings` | Read products visible in the online store | Displaying product catalog |
| `unauthenticated_read_product_inventory` | Read inventory quantities | Showing stock levels |
| `unauthenticated_read_product_pickup_locations` | Read pickup location info | Local pickup features |
| `unauthenticated_read_checkouts` | Read checkout sessions | Cart functionality |
| `unauthenticated_write_checkouts` | Create/update checkouts | Cart add/update/remove |
| `unauthenticated_read_content` | Read content resources | CMS content |
| `unauthenticated_read_metaobjects` | Read custom metaobjects | Page metadata, hero, about, contact |

### Admin API Scopes (For Migrations)

| Scope | Description | Used For |
|-------|-------------|----------|
| `read_products` | Read product data | Migration scripts |
| `write_products` | Create/update products | Product migration |
| `read_collections` | Read collection data | Migration scripts |
| `write_collections` | Create/update collections | Collection migration |
| `read_content` | Read content resources | Reading metaobjects |
| `write_content` | Manage content resources | Creating metaobjects |
| `read_metaobjects` | Read metaobject entries | Setup scripts |
| `write_metaobjects` | Create/update metaobjects | CMS content setup |
| `write_metaobject_definitions` | Create metaobject types | Initial schema setup |
| `read_files` | Read files | Image verification |
| `write_files` | Upload files | Product image upload |
| `read_inventory` | Read inventory | Stock level sync |

### When to Reinstall Your App

You must reinstall your custom app when:
- Adding new API scopes
- Changing from development to production tokens
- Troubleshooting authentication issues

To reinstall:
1. Go to **Settings > Apps and sales channels > Develop apps**
2. Click your app
3. Click **Uninstall app**
4. Click **Install app** again
5. Copy the new tokens to your `.env.local`

---

## Next Steps

After completing this setup:

1. **Customize Content** - Edit metaobject entries in Shopify Admin
2. **Add Products** - Create products in Shopify Admin or via migration scripts
3. **Configure Integrations** - Set up Jotform, Sentry, analytics (see `.env.example`)
4. **Deploy** - Push to Vercel or your hosting platform
5. **Go Live** - Connect your domain and launch!

See [Shopify CMS Guide](SHOPIFY_CMS_GUIDE.md) for managing content after setup.
