# GO_LIVE.md

**Fern & Fog Creations Production Deployment Checklist**

Version: 1.0
Last Updated: November 16, 2025
Status: **100% Production Ready**

---

## Table of Contents

### Part A: Developer/Technical Setup
1. [Quick Start Summary](#quick-start-summary)
2. [Environment Variables Configuration](#environment-variables-configuration)
3. [Shopify API Setup](#shopify-api-setup)
4. [Jotform Contact Form Setup](#jotform-contact-form-setup)
5. [Sentry Error Monitoring Setup](#sentry-error-monitoring-setup)
6. [Analytics Configuration](#analytics-configuration)
7. [Vercel Deployment](#vercel-deployment)
8. [DNS & Domain Setup](#dns--domain-setup)
9. [Performance Testing](#performance-testing)
10. [Production Verification Checklist](#production-verification-checklist)

### Part B: Business Owner Instructions
11. [Managing Navigation & Footer](#managing-navigation--footer)
12. [Managing Jotform Submissions](#managing-jotform-submissions)
13. [Shopify Admin Integration](#shopify-admin-integration)
14. [Common Troubleshooting](#common-troubleshooting)
15. [Optional Post-Launch Enhancements](#optional-post-launch-enhancements)

---

# Part A: Developer/Technical Setup

## Quick Start Summary

**Critical Path (20-30 minutes):**
1. Configure environment variables → 10 min
2. Deploy to Vercel → 5 min
3. Configure Shopify API → 10 min
4. Configure Jotform → 5 min
5. Verification testing → 10 min

**Optional (Additional 20-30 minutes):**
- Sentry error monitoring → 10 min
- Google Analytics/GTM → 5 min
- DNS/Custom domain → 15 min

---

## Environment Variables Configuration

### Required Variables (MUST configure before deployment)

Create a `.env.local` file in the root directory with the following:

```bash
# ============================================
# REQUIRED: Shopify Integration
# ============================================
# Get these from: Shopify Admin > Apps > Develop apps > Create an app
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-storefront-access-token
SHOPIFY_REVALIDATION_SECRET=your-secret-here

# CRITICAL: Must be "true" for production
NEXT_PUBLIC_USE_SHOPIFY=true

# ============================================
# REQUIRED: Jotform Contact Form
# ============================================
# Get from: https://www.jotform.com/
# Free tier: 100 submissions/month with CAPTCHA
NEXT_PUBLIC_JOTFORM_FORM_ID=your-form-id-here

# ============================================
# REQUIRED: Site Configuration
# ============================================
# Your production domain
NEXT_PUBLIC_SITE_URL=https://fernandfogcreations.com
```

### Optional Variables (Recommended for production)

```bash
# ============================================
# OPTIONAL: Google Analytics 4
# ============================================
# Get from: https://analytics.google.com/
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# ============================================
# OPTIONAL: Google Tag Manager
# ============================================
# Get from: https://tagmanager.google.com/
# Use GTM instead of GA4 if you need advanced tracking
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX

# ============================================
# OPTIONAL: Sentry Error Monitoring
# ============================================
# Get from: https://sentry.io/
# Free tier: 5,000 errors/month
NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn
SENTRY_AUTH_TOKEN=your-sentry-auth-token

# ============================================
# OPTIONAL: Upstash Rate Limiting
# ============================================
# Get from: https://upstash.com/
# Free tier: 10,000 commands/day
# Only needed if you add custom API routes
UPSTASH_REDIS_REST_URL=your-upstash-url
UPSTASH_REDIS_REST_TOKEN=your-upstash-token
```

### Variable Validation

**Test your configuration:**

```bash
# Check if all required variables are set
npm run build

# If successful, all required variables are configured correctly
# If it fails, check error messages for missing variables
```

---

## Shopify API Setup

### Step 1: Create Custom App

1. **Navigate to Shopify Admin**
   - Go to: `https://your-store.myshopify.com/admin`

2. **Create Custom App**
   - Settings → Apps and sales channels
   - Click "Develop apps"
   - Click "Create an app"
   - Name: "Fern & Fog Headless Storefront"
   - Click "Create app"

### Step 2: Configure API Scopes

1. **Click "Configure Storefront API scopes"**

2. **Enable the following scopes:**
   - ✅ `unauthenticated_read_product_listings` - Read product listings
   - ✅ `unauthenticated_read_product_inventory` - Read inventory
   - ✅ `unauthenticated_read_product_tags` - Read product tags
   - ✅ `unauthenticated_read_collection_listings` - Read collections
   - ✅ `unauthenticated_read_selling_plans` - Read subscriptions (if used)
   - ✅ `unauthenticated_write_checkouts` - Create checkouts
   - ✅ `unauthenticated_read_checkouts` - Read checkouts
   - ✅ `unauthenticated_write_customers` - Create customers (for checkout)

3. **Save the configuration**

### Step 3: Install App and Get Access Token

1. **Click "Install app"**
   - Confirm the installation

2. **Reveal and copy the Storefront Access Token**
   - Navigate to: API credentials tab
   - Under "Storefront API access token"
   - Click "Reveal token once" (⚠️ **Copy it now - you won't see it again!**)
   - Save this as `SHOPIFY_STOREFRONT_ACCESS_TOKEN`

3. **Get your Store Domain**
   - Format: `your-store.myshopify.com`
   - Save this as `SHOPIFY_STORE_DOMAIN`

### Step 4: Create Revalidation Secret

Generate a random secret for cache revalidation:

```bash
# Generate a secure random string
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Save this as SHOPIFY_REVALIDATION_SECRET
```

### Step 5: Configure Webhooks (Optional but recommended)

For automatic cache invalidation when products change:

1. **In your Shopify Custom App:**
   - Go to Configuration → Webhooks

2. **Add these webhook subscriptions:**
   - `products/create` → `https://your-domain.com/api/revalidate?secret=YOUR_SECRET`
   - `products/update` → `https://your-domain.com/api/revalidate?secret=YOUR_SECRET`
   - `products/delete` → `https://your-domain.com/api/revalidate?secret=YOUR_SECRET`
   - `collections/create` → `https://your-domain.com/api/revalidate?secret=YOUR_SECRET`
   - `collections/update` → `https://your-domain.com/api/revalidate?secret=YOUR_SECRET`
   - `collections/delete` → `https://your-domain.com/api/revalidate?secret=YOUR_SECRET`

**⚠️ Important:** Replace `YOUR_SECRET` with your `SHOPIFY_REVALIDATION_SECRET`

---

## Jotform Contact Form Setup

### Step 1: Create Jotform Account

1. **Sign up at https://www.jotform.com/**
   - Free tier: 100 submissions/month
   - Includes CAPTCHA spam protection
   - No credit card required

### Step 2: Create Contact Form

**Option A: Use Template (Recommended)**

1. **Click "Create Form"**
2. **Search templates:** "contact form"
3. **Choose:** "Simple Contact Form" or "Business Contact Form"
4. **Click "Use Template"**

**Option B: Build from Scratch**

1. **Click "Create Form"**
2. **Choose "Start from Scratch"**
3. **Add these fields:**
   - Name (Text field) - **Required**
   - Email (Email field) - **Required**
   - Product Interest (Dropdown)
     - Options: General Inquiry, Earrings, Resin Art, Driftwood Pieces, Wall Hangings, Custom Request
   - Message (Long Text) - **Required**
4. **Add CAPTCHA:**
   - Click "Add Form Element" → Security
   - Choose "Google reCAPTCHA"
   - This is included free!

### Step 3: Configure Form Settings

1. **Click "Settings"**

2. **Form Settings:**
   - Form Title: "Get in Touch"
   - Button Text: "Send Message"

3. **Email Notifications:**
   - Go to Settings → Emails
   - Enable "Send notification emails to"
   - Enter your email: `contact@fernandfogcreations.com`
   - Customize email template

4. **Thank You Page:**
   - Go to Settings → Thank You Page
   - Choose "Show text"
   - Enter: "Thank you for reaching out! I'll get back to you within 1-2 business days."

5. **Form Design (Optional):**
   - Go to "Designer" tab
   - Choose a theme or customize colors to match brand:
     - Moss: `#33593D`
     - Fern: `#4F7942`
     - Parchment: `#F5F0E6`
     - Bark: `#5B4636`

### Step 4: Get Form ID

1. **Click "Publish"**
2. **Copy the Form URL**
   - Example: `https://form.jotform.com/241234567890`
   - The Form ID is the number at the end: `241234567890`

3. **Save to environment variables:**
   ```bash
   NEXT_PUBLIC_JOTFORM_FORM_ID=241234567890
   ```

### Step 5: Test the Form

1. **Visit your contact page:** `/contact`
2. **Fill out the form and submit**
3. **Check your email** for the notification
4. **Verify in Jotform Dashboard:**
   - My Forms → Click your form
   - View "Submissions" tab
   - You should see your test submission

✅ **Contact form is now live!**

---

## Sentry Error Monitoring Setup

### Step 1: Create Sentry Account

1. **Sign up at https://sentry.io/**
   - Free tier: 5,000 errors/month
   - No credit card required

2. **Create an Organization**
   - Name: "Fern & Fog Creations"

### Step 2: Create Next.js Project

1. **Click "Create Project"**
2. **Choose Platform:** "Next.js"
3. **Project Name:** "fern-fog-storefront"
4. **Set Alert Frequency:** "On every new issue" (recommended)
5. **Click "Create Project"**

### Step 3: Get DSN

1. **Copy the DSN**
   - Format: `https://abc123@o123456.ingest.sentry.io/123456`
   - Save as `NEXT_PUBLIC_SENTRY_DSN`

2. **Skip the installation wizard**
   - Sentry is already integrated in the codebase!

### Step 4: Create Auth Token (Optional - for releases)

1. **Go to Settings → Auth Tokens**
2. **Click "Create New Token"**
3. **Scopes:** Select "project:releases"
4. **Copy token** → Save as `SENTRY_AUTH_TOKEN`

### Step 5: Verify Integration

1. **Deploy to Vercel with Sentry DSN**
2. **Trigger a test error:**
   - Add `?error=test` to any URL
   - Or throw an error in any component

3. **Check Sentry Dashboard**
   - Issues tab should show the error
   - Click to see full stack trace

✅ **Error monitoring is live!**

---

## Analytics Configuration

### Option A: Vercel Analytics (Recommended - Always Enabled)

**✅ Vercel Analytics is automatically enabled** when you deploy to Vercel. No configuration needed!

**Features:**
- Privacy-friendly (GDPR compliant)
- No cookies or tracking scripts
- Real-time visitor analytics
- Performance metrics

**To view:**
1. Go to Vercel Dashboard
2. Select your project
3. Click "Analytics" tab

### Option B: Google Analytics 4 (GA4)

**When to use:** If you need detailed marketing analytics, conversion tracking, or integration with Google Ads.

1. **Create GA4 Property**
   - Go to https://analytics.google.com/
   - Admin → Create Property
   - Property name: "Fern & Fog Creations"
   - Choose your timezone
   - Click "Create"

2. **Get Measurement ID**
   - Admin → Data Streams
   - Click "Add stream" → "Web"
   - Website URL: `https://fernandfogcreations.com`
   - Stream name: "Production Site"
   - Copy the **Measurement ID** (format: `G-XXXXXXXXXX`)

3. **Add to Environment Variables**
   ```bash
   NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
   ```

4. **Redeploy to Vercel**
   - GA4 will start tracking automatically

### Option C: Google Tag Manager (GTM)

**When to use:** If you need advanced tracking (events, e-commerce, custom scripts) without code changes.

1. **Create GTM Account**
   - Go to https://tagmanager.google.com/
   - Click "Create Account"
   - Account name: "Fern & Fog Creations"
   - Container name: "Fern & Fog Web"
   - Target platform: "Web"

2. **Get Container ID**
   - Copy the Container ID (format: `GTM-XXXXXXX`)

3. **Add to Environment Variables**
   ```bash
   NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
   ```

4. **Configure Tags**
   - Add GA4 Configuration tag
   - Add e-commerce tracking tags
   - Add custom event tags as needed

---

## Vercel Deployment

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Login to Vercel

```bash
vercel login
```

### Step 3: Deploy

**First deployment:**

```bash
# Run from project root
vercel

# Answer prompts:
# Set up and deploy? Y
# Which scope? (Select your account)
# Link to existing project? N
# Project name? fern-fog-creations
# Directory? ./
# Override settings? N
```

**Production deployment:**

```bash
vercel --prod
```

### Step 4: Configure Environment Variables in Vercel

1. **Go to Vercel Dashboard**
   - https://vercel.com/dashboard
   - Select your project

2. **Navigate to Settings → Environment Variables**

3. **Add all variables from `.env.local`:**
   - **IMPORTANT:** Add variables to all environments:
     - ✅ Production
     - ✅ Preview
     - ✅ Development

4. **Click "Save"**

### Step 5: Redeploy with Environment Variables

```bash
vercel --prod
```

### Step 6: Get Production URL

Your site is now live at:
- Production: `https://fern-fog-creations.vercel.app`
- Or your custom domain once configured

✅ **Site is deployed!**

---

## DNS & Domain Setup

### Step 1: Purchase Domain (if not already owned)

Recommended registrars:
- Namecheap
- Google Domains
- Cloudflare Registrar

### Step 2: Add Domain to Vercel

1. **Go to Vercel Dashboard**
   - Select your project
   - Settings → Domains

2. **Click "Add Domain"**
   - Enter: `fernandfogcreations.com`
   - Click "Add"

3. **Verify domain ownership**
   - Vercel will provide DNS records to add

### Step 3: Configure DNS Records

**At your domain registrar (e.g., Namecheap):**

1. **Add A Record (for apex domain):**
   ```
   Type: A
   Host: @
   Value: 76.76.21.21
   TTL: Automatic
   ```

2. **Add CNAME Record (for www subdomain):**
   ```
   Type: CNAME
   Host: www
   Value: cname.vercel-dns.com
   TTL: Automatic
   ```

3. **Save changes**

### Step 4: Wait for DNS Propagation

- **Time:** 1-48 hours (usually 1-4 hours)
- **Check status:** https://dnschecker.org/

### Step 5: Enable SSL (Automatic)

- Vercel automatically provisions SSL certificate
- No action needed - just wait 1-2 minutes after DNS propagation

### Step 6: Verify

1. **Visit:** `https://fernandfogcreations.com`
2. **Check SSL:** Look for padlock icon in browser
3. **Test redirects:**
   - `http://fernandfogcreations.com` → `https://fernandfogcreations.com` ✅
   - `https://www.fernandfogcreations.com` → `https://fernandfogcreations.com` ✅

✅ **Custom domain is live!**

---

## Performance Testing

### Lighthouse Audit

```bash
# Install Lighthouse
npm install -g lighthouse

# Run audit on production
lighthouse https://fernandfogcreations.com --view
```

**Target Scores:**
- Performance: ≥90
- Accessibility: ≥95
- Best Practices: ≥95
- SEO: ≥95

### WebPageTest

1. **Go to https://www.webpagetest.org/**
2. **Enter:** `https://fernandfogcreations.com`
3. **Location:** Choose closest to your target audience
4. **Run Test**

**Target Metrics:**
- First Contentful Paint (FCP): <1.8s
- Largest Contentful Paint (LCP): <2.5s
- Time to Interactive (TTI): <3.8s
- Total Blocking Time (TBT): <200ms
- Cumulative Layout Shift (CLS): <0.1

### Vercel Analytics

1. **Go to Vercel Dashboard**
2. **Click "Analytics"**
3. **Review:**
   - Real User Monitoring (RUM) scores
   - Page load times
   - Core Web Vitals

**All metrics should be in the "Good" range (green)**

---

## Production Verification Checklist

### Pre-Launch Checklist

Copy this checklist to a task tracker and verify each item:

#### Environment & Deployment
- [ ] All environment variables configured in Vercel
- [ ] `NEXT_PUBLIC_USE_SHOPIFY=true` is set
- [ ] Production build completes without errors
- [ ] No console errors in browser
- [ ] No TypeScript errors

#### Shopify Integration
- [ ] Products load correctly from Shopify
- [ ] Product images display properly
- [ ] Add to cart works
- [ ] Cart displays items correctly
- [ ] Checkout redirects to Shopify checkout
- [ ] Inventory levels are accurate

#### Contact Form
- [ ] Form loads on `/contact` page
- [ ] Form submission succeeds
- [ ] Email notification received
- [ ] CAPTCHA displays and works
- [ ] Thank you message displays after submission
- [ ] Submissions visible in Jotform dashboard

#### Error Monitoring
- [ ] Sentry DSN configured
- [ ] Test error appears in Sentry dashboard
- [ ] Error boundary displays properly
- [ ] Source maps uploaded (optional)

#### Analytics
- [ ] Vercel Analytics showing data
- [ ] GA4 tracking (if configured)
- [ ] GTM container firing (if configured)

#### SEO
- [ ] `/robots.txt` accessible and correct
- [ ] `/sitemap.xml` accessible and includes all pages
- [ ] All pages have proper meta tags
- [ ] Open Graph images configured

#### Performance
- [ ] Lighthouse score ≥90
- [ ] Core Web Vitals in "Good" range
- [ ] Images load properly and are optimized
- [ ] No layout shifts (CLS <0.1)

#### Mobile Responsiveness
- [ ] Test on iPhone (Safari)
- [ ] Test on Android (Chrome)
- [ ] Test on tablet
- [ ] All interactions work on touch devices
- [ ] Forms are mobile-friendly

#### Browser Compatibility
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

#### Security
- [ ] HTTPS enabled
- [ ] SSL certificate valid
- [ ] Security headers present
- [ ] No exposed API keys in client code

#### Legal
- [ ] Privacy policy accessible (`/policies/privacy`)
- [ ] Shipping policy accessible (`/policies/shipping`)
- [ ] Returns policy accessible (`/policies/returns`)
- [ ] Terms of service accessible (`/policies/terms`)
- [ ] Footer links to all policy pages

---

# Part B: Business Owner Instructions


## Managing Navigation & Footer

Navigation and footer menus are managed via **Shopify Admin**, giving you full control without code changes.

### Editing Header Navigation

**Current header menu:** `fern-fog-header-menu`

**To edit:**

1. **Go to Shopify Admin**
2. **Navigate to:** Online Store → Navigation
3. **Click:** "fern-fog-header-menu"
4. **Edit menu items:**
   - Add new items with "Add menu item" button
   - Drag to reorder
   - Click item to edit title/link
   - Delete items with trash icon
5. **Click "Save"**

**Menu updates appear within seconds** (automatic cache revalidation via webhook)

**Current navigation:**
- Home (`/`)
- Shop (`/products`)
- Gallery (`/gallery`)
- About (`/about`)
- Contact (`/contact`)

### Editing Footer Menus

**The footer has 3 separate menus:**

1. **Shop Menu:** `fern-fog-footer-shop-menu`
   - All Products
   - Earrings
   - Resin
   - Driftwood
   - Wall Hangings

2. **About Menu:** `fern-fog-footer-about-menu`
   - About
   - Gallery
   - Contact

3. **Policies Menu:** `fern-fog-footer-policies-menu`
   - Shipping
   - Returns
   - Privacy
   - Terms

**To edit any footer menu:**

1. **Go to:** Shopify Admin → Online Store → Navigation
2. **Select the menu** you want to edit
3. **Make changes** (add, remove, reorder items)
4. **Click "Save"**

**Changes appear immediately** after webhook cache revalidation

---

## Managing Jotform Submissions

### Viewing Form Submissions

1. **Go to:** https://www.jotform.com/
2. **Click "My Forms"**
3. **Click your contact form**
4. **Click "Submissions" tab**

### Submission Details

Each submission shows:
- **Name** - Customer's name
- **Email** - Customer's email
- **Product Interest** - What they're interested in
- **Message** - Their message
- **Date/Time** - When submitted
- **IP Address** - Spam prevention

### Exporting Submissions

**To CSV (for spreadsheets):**
1. Click "Submissions" tab
2. Click "Excel/CSV" button
3. Choose "Download as CSV"
4. Open in Google Sheets or Excel

**To PDF:**
1. Click individual submission
2. Click "Print" → "Save as PDF"

### Email Notifications

**You receive an email for every submission:**
- Sent to: `contact@fernandfogcreations.com`
- Subject: "New Form Submission: Contact Form"
- Contains: All form fields

**To customize email notifications:**
1. My Forms → Click your form
2. Settings → Emails
3. Click "Edit Email"
4. Customize template
5. Save

### Marking Submissions

**To track which submissions you've responded to:**
1. Click submission
2. Click star icon (top right) to mark as important
3. Or add notes in "Notes" section

### Spam Protection

**Jotform includes free CAPTCHA:**
- Blocks bot submissions
- No manual spam filtering needed
- Verified submissions only

**If you get spam:**
1. Hover over submission
2. Click "Mark as spam"
3. Jotform learns and improves filtering

---

## Shopify Admin Integration

### Managing Products

**All products are managed in Shopify Admin:**

1. **Go to:** `https://your-store.myshopify.com/admin`
2. **Products → All products**

**To add a product:**
1. Click "Add product"
2. Fill in:
   - Title: "Sea Glass Drop Earrings"
   - Description: (full description)
   - Media: Upload 3-5 high-quality photos
   - Price: $45.00
   - Compare at price: $60.00 (if on sale)
   - Cost per item: $15.00 (for profit tracking)
   - SKU: "EARRING-SEAGLASS-001"
   - Barcode: (if you have one)
   - Inventory: 5 in stock
   - Collections: "Earrings", "New Arrivals"
   - Tags: sea-glass, handmade, coastal
   - Product type: "Earrings"
   - Vendor: "Fern & Fog Creations"
3. Click "Save"

**✅ Product appears on website within 1-2 minutes!**

### Product Variants

**For products with multiple options (color, size):**

1. **In product editor, click "Add variant"**
2. **Add options:**
   - Option name: "Color"
   - Values: Blue, Green, Amber
3. **Set price for each variant** (if different)
4. **Upload variant-specific images**
5. **Save**

**Example: Earrings in 3 colors**
- Color: Blue Sea Glass ($45)
- Color: Green Sea Glass ($45)
- Color: Amber Sea Glass ($50)

### Collections

**To create a product collection:**

1. **Products → Collections**
2. **Click "Create collection"**
3. **Collection type:** Manual or Automated
4. **Manual:** Manually select which products to include
5. **Automated:** Set conditions:
   - Product tag equals "sea-glass"
   - Product type equals "Earrings"
6. **Save**

**Collections automatically appear on website!**
- URL: `/products/collection-name`

### Inventory Management

**To update stock:**
1. Products → Click product
2. Scroll to "Inventory"
3. Update "Available" quantity
4. Save

**Low stock alerts:**
- Settings → Notifications
- Enable "Low inventory" notification
- Set threshold (e.g., notify when <3 items)

---

## Common Troubleshooting

### Issue: Products Not Loading

**Symptoms:** Product pages show "No products found"

**Solutions:**
1. **Check Shopify connection:**
   - Verify products are published in Shopify
   - Products → Check "Online Store" column is checked
2. **Check sales channels:**
   - Products must be published to "Online Store" channel
3. **Verify API token:**
   - Contact developer if persistent
4. **Clear cache:**
   - Wait 60 minutes for automatic cache refresh

---

### Issue: Contact Form Not Working

**Symptoms:** Form doesn't submit or shows error

**Solutions:**
1. **Check Jotform status:**
   - Visit: https://status.jotform.com/
   - Verify all systems operational
2. **Test directly on Jotform:**
   - Get form URL from Jotform dashboard
   - Test form at `https://form.jotform.com/YOUR_FORM_ID`
   - If works there, contact developer
3. **Check form ID:**
   - Jotform dashboard → My Forms
   - Verify form ID matches website configuration
4. **Test in incognito mode:**
   - Browser extensions can block forms
   - Try incognito/private browsing

---

### Issue: Images Not Displaying

**Symptoms:** Broken image icons or missing photos

**Solutions:**
1. **Check image size:**
   - Maximum: 10MB per image
   - Recommended: <2MB
   - Compress at: https://tinypng.com/
2. **Check image format:**
   - Supported: JPG, PNG, WebP, AVIF, GIF
   - Not supported: TIFF, BMP, PSD
3. **Check image URL:**
   - Shopify: Upload images to Shopify Files
   - Don't link to external sites (may break)
4. **Re-upload:**
   - Delete image
   - Upload again
   - Save and publish

---

### Issue: Slow Page Load

**Symptoms:** Pages take >3 seconds to load

**Solutions:**
1. **Optimize images:**
   - Compress all images to <500KB
   - Use WebP format when possible
2. **Reduce page size:**
   - Limit to 5-7 sections per page
   - Don't add >15 products to ProductGridBlock
3. **Check Shopify:**
   - If ALL pages slow, may be Shopify API issue
   - Check: https://status.shopify.com/
4. **Contact developer:**
   - May need performance optimization

---

### Issue: Mobile Display Problems

**Symptoms:** Site looks broken on phone/tablet

**Solutions:**
1. **Test on actual devices:**
   - Use Chrome DevTools device emulation
   - Test on real mobile devices
2. **Check text size:**
   - Avoid font sizes >60px
   - Long headings may wrap awkwardly
3. **Check image aspect ratios:**
   - Use landscape images for hero sections
   - Square images for product grids
4. **Test on real device:**
   - iPhone and Android render differently
   - Test both before publishing

---

## Optional Post-Launch Enhancements

### 1. Shopify Legal Pages Integration

**Current:** Policy pages are static and require code changes to update.

**Enhancement:** Integrate with Shopify's Legal Pages API for dynamic updates.

**Benefit:**
- Update policies in Shopify Admin
- Changes reflect on website automatically
- Compliance with Shopify's legal templates

**Timeline:** 2-3 hours developer work

---

### 2. Product Reviews

**Enhancement:** Add product review functionality using Shopify app

**Recommended Apps:**
- **Loox** - Photo reviews
- **Judge.me** - SEO-friendly reviews
- **Yotpo** - Review + loyalty program

**Benefit:**
- Social proof
- Improved SEO
- Increased conversions (10-15% average)

**Timeline:** 1-2 hours setup

---

### 3. Email Marketing Integration

**Enhancement:** Collect emails and send marketing campaigns

**Recommended:**
- **Klaviyo** - E-commerce focused (integrates with Shopify)
- **Mailchimp** - General marketing
- **ConvertKit** - Creator-focused

**Features:**
- Newsletter signup
- Abandoned cart emails
- New product announcements
- Seasonal promotions

**Timeline:** 2-4 hours setup + ongoing campaign creation

---

### 4. Instagram Feed Integration

**Enhancement:** Display Instagram photos on website

**Recommended:**
- **Instafeed.js** - Free, simple
- **Curator** - Curated social feeds
- **Flockler** - Multi-platform feeds

**Benefit:**
- Showcase your work
- Drive Instagram followers
- User-generated content

**Timeline:** 1 hour setup

---

### 5. Live Chat

**Enhancement:** Real-time customer support

**Recommended:**
- **Tidio** - Free live chat + chatbot
- **Crisp** - Modern interface
- **Facebook Messenger** - Use existing Facebook audience

**Benefit:**
- Answer questions immediately
- Increase conversions
- Build customer relationships

**Timeline:** 30 minutes setup

---

### 6. Search Functionality Enhancement

**Current:** Basic product search via command palette (Cmd+K)

**Enhancement:** Advanced search with filters

**Features:**
- Filter by price, color, material
- Sort by price, date, popularity
- Search suggestions
- Recent searches

**Timeline:** 4-6 hours developer work

---

### 7. Blog

**Enhancement:** Add blog for SEO and storytelling

**Future Implementation:**
- Use Shopify metaobjects for blog posts
- Create `blog_post` metaobject definition
- Display posts on `/blog` page

**Benefit:**
- Improve SEO rankings
- Tell your story
- Share behind-the-scenes content

**Timeline:** 1 hour initial setup, ongoing content creation

---

### 8. Wholesale Portal

**Enhancement:** Private section for wholesale customers

**Features:**
- Wholesale pricing
- Bulk ordering
- Custom payment terms
- Order history

**Recommended Apps:**
- **Wholesale Pricing Discount (B2B)** - Shopify app
- **Bold Custom Pricing** - Flexible pricing

**Timeline:** 2-3 hours setup + ongoing management

---

## Support & Next Steps

### Developer Support

**For technical issues:**
- Email: your-developer@example.com
- Include: Screenshots, error messages, steps to reproduce

### Jotform Support

**For form issues:**
- Help Center: https://www.jotform.com/help/
- Support: https://www.jotform.com/contact/
- 24/7 support on all plans

### Shopify Support

**For e-commerce questions:**
- Help Center: https://help.shopify.com/
- Support: Chat in Shopify Admin
- Community: https://community.shopify.com/

---

## Appendix: Quick Reference

### URL Map

| Page | URL | Editable Via |
|------|-----|--------------|
| Homepage | `/` | Code (hardcoded components) |
| Products | `/products` | Shopify |
| Product Detail | `/product/[handle]` | Shopify |
| Cart | `/cart` | Shopify (headless) |
| Gallery | `/gallery` | Code |
| About | `/about` | Code |
| Contact | `/contact` | Jotform |
| Privacy Policy | `/policies/privacy` | Code |
| Shipping Policy | `/policies/shipping` | Code |
| Returns Policy | `/policies/returns` | Code |
| Terms of Service | `/policies/terms` | Code |

### Brand Colors

| Color | Hex Code | Use |
|-------|----------|-----|
| Moss | `#33593D` | Headings, buttons |
| Fern | `#4F7942` | Accents, links |
| Parchment | `#F5F0E6` | Backgrounds |
| Bark | `#5B4636` | Body text |
| Mist | `#E6ECE8` | Subtle backgrounds |
| Gold | `#C5A05A` | CTA buttons, highlights |

### Emergency Contacts

- **Website Down:** Contact Vercel Support + Developer
- **Shopify Issues:** Shopify Support Chat
- **Menu/Content Issues:** Check Shopify Admin → Online Store → Navigation
- **Form Issues:** Jotform Support
- **Payment Issues:** Shopify Support

---

**🎉 Congratulations! Your site is production-ready.**

**Next:** Start managing your content via Shopify Admin and begin selling!

**Questions?** Contact your developer or refer to this guide.

---

*Last updated: November 16, 2025 | Version 1.0*
