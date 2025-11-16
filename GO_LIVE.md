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
4. [Builder.io CMS Configuration](#builderio-cms-configuration)
5. [Jotform Contact Form Setup](#jotform-contact-form-setup)
6. [Sentry Error Monitoring Setup](#sentry-error-monitoring-setup)
7. [Analytics Configuration](#analytics-configuration)
8. [Vercel Deployment](#vercel-deployment)
9. [DNS & Domain Setup](#dns--domain-setup)
10. [Performance Testing](#performance-testing)
11. [Production Verification Checklist](#production-verification-checklist)

### Part B: Business Owner Instructions
12. [Builder.io Visual Editor Tutorial](#builderio-visual-editor-tutorial)
13. [Managing Navigation & Footer](#managing-navigation--footer)
14. [Managing Jotform Submissions](#managing-jotform-submissions)
15. [Shopify Admin Integration](#shopify-admin-integration)
16. [Common Troubleshooting](#common-troubleshooting)
17. [Optional Post-Launch Enhancements](#optional-post-launch-enhancements)

---

# Part A: Developer/Technical Setup

## Quick Start Summary

**Critical Path (30-45 minutes):**
1. Configure environment variables → 10 min
2. Deploy to Vercel → 5 min
3. Configure Shopify API → 10 min
4. Configure Builder.io → 10 min
5. Configure Jotform → 5 min
6. Verification testing → 10 min

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
# REQUIRED: Builder.io CMS
# ============================================
# Get from: https://builder.io/account/organization
BUILDER_PUBLIC_KEY=your-builder-public-key
NEXT_PUBLIC_BUILDER_PUBLIC_KEY=your-builder-public-key

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

## Builder.io CMS Configuration

### Step 1: Create Builder.io Account

1. **Sign up at https://builder.io/**
   - Use your business email
   - Free plan: 100,000 API calls/month (plenty for small stores)

2. **Create an Organization**
   - Name: "Fern & Fog Creations"
   - Click "Create organization"

### Step 2: Get API Key

1. **Navigate to Account Settings**
   - Click your profile icon (top right)
   - Select "Account" → "Organization"

2. **Copy Public API Key**
   - Find "Public API Keys" section
   - Copy the key
   - Save as both:
     - `BUILDER_PUBLIC_KEY`
     - `NEXT_PUBLIC_BUILDER_PUBLIC_KEY`

### Step 3: Register Custom Components

**⚠️ IMPORTANT:** The following custom components are already registered in the codebase (`src/components/builder/register-components.tsx`). You just need to load them in Builder.io:

1. **Open Builder.io Dashboard**
   - Click "Models" in the left sidebar

2. **Create the "page" Model**
   - Click "+ New Model"
   - Choose "Page"
   - Name: `page`
   - Click "Create"

3. **Connect Your Site**
   - When prompted for "Site URL", enter: `https://your-domain.com`
   - Click "Connect"

4. **Load Custom Components**
   - Builder.io will automatically detect your 7 custom components:
     1. **HeroBlock** - Full-width hero with background image
     2. **CategoryGridBlock** - 4-column category grid
     3. **FeatureGridBlock** - 3-column feature grid with emoji icons
     4. **TextBlock** - Flexible rich text content
     5. **CTABlock** - Call-to-action section
     6. **ProductGridBlock** - Product showcase grid
     7. **GalleryPreviewBlock** - Gallery showcase

### Step 4: Create Additional Models

Create these models for full CMS control:

1. **Navigation Model**
   - Click "+ New Model"
   - Choose "Section"
   - Name: `navigation`
   - Click "Create"

2. **Footer Model**
   - Click "+ New Model"
   - Choose "Section"
   - Name: `footer`
   - Click "Create"

### Step 5: Initial Content Setup

**Create your first page:**

1. **Go to Content tab**
2. **Click "+ New" → "page"**
3. **Set URL Path:** `/` (for homepage)
4. **Drag components from left sidebar:**
   - Add HeroBlock at top
   - Add CategoryGridBlock below
   - Add FeatureGridBlock
   - Customize text and images in right panel
5. **Click "Publish"**

**✅ Your homepage is now editable in Builder.io!**

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

#### Builder.io CMS
- [ ] Homepage loads Builder.io content
- [ ] All 7 custom blocks visible in Builder.io editor
- [ ] Changes in Builder.io reflect on site (refresh after publish)
- [ ] Navigation editable via Builder.io
- [ ] Footer editable via Builder.io

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

## Builder.io Visual Editor Tutorial

### Getting Started

**What is Builder.io?**
Builder.io is a visual content management system that lets you edit your website without writing code. Think of it like a drag-and-drop website builder for specific pages.

### Accessing Builder.io

1. **Go to:** https://builder.io/login
2. **Email:** your-email@fernandfogcreations.com
3. **Password:** (your password)

### Creating a New Page

**Example: Create an "About Us" page**

1. **Click "+ New" button** (top right)
2. **Select "page" model**
3. **Set URL Path:** `/about-us`
4. **Click "Create"**

### Building Your Page

**The Builder.io interface has 3 sections:**

```
┌──────────────┬────────────────────┬──────────────┐
│              │                    │              │
│  Components  │    Live Preview    │   Settings   │
│   (Left)     │      (Center)      │    (Right)   │
│              │                    │              │
└──────────────┴────────────────────┴──────────────┘
```

### Your 7 Custom Fern & Fog Components

#### 1. HeroBlock - Full-Width Hero Section

**When to use:** Top of homepage or landing pages

**How to add:**
1. Drag "HeroBlock" from left sidebar
2. Configure in right panel:
   - **Background Image:** Click "Choose image" → Upload coastal photo
   - **Heading:** "Handmade Coastal Treasures"
   - **Description:** Your tagline/intro text
   - **Primary CTA:** Label: "View Gallery" | Link: `/gallery`
   - **Secondary CTA:** Label: "Shop Now" | Link: `/products`

**Preview:** Hero will show full-width with your image as background

---

#### 2. CategoryGridBlock - 4-Column Grid

**When to use:** Showcase product categories

**How to add:**
1. Drag "CategoryGridBlock" from left sidebar
2. Configure each category:
   - **Category 1:**
     - Name: "Earrings"
     - Image: Upload earring photo
     - Description: "Sea glass and resin earrings"
     - Slug: "earrings"
   - **Category 2, 3, 4:** Repeat for other categories

**Preview:** 4 clickable category cards in a grid

---

#### 3. FeatureGridBlock - 3-Column Features

**When to use:** Highlight your unique value propositions

**How to add:**
1. Drag "FeatureGridBlock" from left sidebar
2. Configure features:
   - **Feature 1:**
     - Icon: 🌊 (emoji picker)
     - Name: "Coastal Materials"
     - Description: "Gathered from Pacific Northwest shores"
   - **Feature 2:**
     - Icon: 🤲
     - Name: "Handcrafted"
     - Description: "Each piece is unique"
   - **Feature 3:**
     - Icon: 🌿
     - Name: "Eco-Friendly"
     - Description: "Sustainable & natural materials"

**Preview:** 3 feature cards with emoji icons

---

#### 4. TextBlock - Rich Text Content

**When to use:** Any text-heavy section (story, about, details)

**How to add:**
1. Drag "TextBlock" from left sidebar
2. Configure:
   - **Heading:** "Our Story"
   - **Content:** Click to edit (supports bold, italic, lists, links)
   - **Alignment:** Left/Center/Right
   - **Background:** Choose color
   - **Max Width:** 3xl (for readability)

**Preview:** Formatted text section

---

#### 5. CTABlock - Call to Action

**When to use:** Encourage specific actions (subscribe, shop, contact)

**How to add:**
1. Drag "CTABlock" from left sidebar
2. Configure:
   - **Heading:** "Ready to Shop?"
   - **Description:** "Explore our handcrafted collection"
   - **Primary Button:** Label: "Shop Collection" | Link: `/products`
   - **Secondary Button:** Label: "View Gallery" | Link: `/gallery`
   - **Background Color:** Choose brand color

**Preview:** Centered CTA with 2 buttons

---

#### 6. ProductGridBlock - Product Showcase

**When to use:** Feature specific products on landing pages

**How to add:**
1. Drag "ProductGridBlock" from left sidebar
2. Add products:
   - **Product 1:**
     - Image: Upload product photo
     - Name: "Sea Glass Earrings"
     - Category: "Earrings"
     - Price: "$45.00"
   - **Add more products** with "+" button

**Preview:** Grid of featured products

---

#### 7. GalleryPreviewBlock - Gallery Showcase

**When to use:** Showcase your best work with stories

**How to add:**
1. Drag "GalleryPreviewBlock" from left sidebar
2. Add gallery items:
   - **Item 1:**
     - Image: Upload photo
     - Title: "Coastal Driftwood Frame"
     - Materials: ["Driftwood", "Sea Glass", "Resin"]
     - Story: "Found on a misty morning..."

**Preview:** Gallery grid with hover storytelling

---

### Publishing Your Page

1. **Preview your changes** (Click "Preview" in top bar)
2. **Click "Publish"** (top right)
3. **Visit your URL** (e.g., `https://fernandfogcreations.com/about-us`)
4. **Refresh browser** to see changes

⏱️ **Changes appear within 1-2 seconds** of publishing

---

## Managing Navigation & Footer

### Editing Navigation Menu

**The site has TWO navigation systems:**
1. **Builder.io Managed** (if you create content in Builder.io)
2. **Hardcoded Fallback** (default if no Builder.io content)

**To enable Builder.io navigation:**

1. **Go to Builder.io → Content**
2. **Click "+ New" → Select "navigation" model**
3. **Build your navigation:**
   - Add Link components
   - Set text and URLs
   - Arrange in desired order
4. **Publish**

**Current default navigation:**
- Home (`/`)
- Products (`/products`)
- Gallery (`/gallery`)
- About (`/about`)
- Contact (`/contact`)

**⚠️ Note:** Navigation requires custom component setup. For now, navigation links are managed in code. Contact your developer to modify.

### Editing Footer

**Same as navigation** - Footer can be managed via Builder.io with the "footer" model.

**Current default footer sections:**
- Shop: Products, Gallery
- About: Our Story, Contact
- Policies: Privacy, Shipping, Returns, Terms

**⚠️ Note:** Footer requires custom component setup. Contact your developer to modify.

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

### Issue: Builder.io Changes Not Appearing

**Symptoms:** You published changes but site still shows old content

**Solutions:**
1. **Wait 5-10 seconds** - Builder.io cache clears gradually
2. **Hard refresh browser:**
   - Mac: Cmd + Shift + R
   - Windows: Ctrl + Shift + R
3. **Check you published:**
   - Builder.io shows "Published" badge
   - Not "Draft" or "Scheduled"
4. **Verify URL path matches:**
   - Builder.io URL: `/about-us`
   - Browser URL: `yoursite.com/about-us`
   - Must match exactly (case-sensitive!)

---

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
   - Builder.io: Use Builder.io's image uploader
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
1. **Preview in Builder.io:**
   - Click device icons (top bar)
   - Test desktop, tablet, mobile views
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

**Use Builder.io:**
- Create "blog-post" model
- Write posts in visual editor
- Automatic SEO optimization

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

### Builder.io Support

**For CMS questions:**
- Documentation: https://www.builder.io/c/docs/intro
- Community: https://forum.builder.io/
- Support: support@builder.io (Pro plans only)

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
| Homepage | `/` | Builder.io |
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

### Brand Colors (for Builder.io)

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
- **Builder.io Issues:** Refresh browser, wait 5 min, then contact developer
- **Form Issues:** Jotform Support
- **Payment Issues:** Shopify Support

---

**🎉 Congratulations! Your site is production-ready.**

**Next:** Create your first Builder.io page and start selling!

**Questions?** Contact your developer or refer to this guide.

---

*Last updated: November 16, 2025 | Version 1.0*
