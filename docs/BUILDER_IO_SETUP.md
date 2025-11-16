# Builder.io Setup & Usage Guide

**Last Updated:** November 16, 2025
**Audience:** Content managers, business users, developers

## Table of Contents

1. [Overview](#overview)
2. [Initial Setup](#initial-setup)
3. [Creating Your First Page](#creating-your-first-page)
4. [Using Custom Components](#using-custom-components)
5. [Managing Navigation](#managing-navigation)
6. [Best Practices](#best-practices)
7. [Troubleshooting](#troubleshooting)
8. [Advanced Features](#advanced-features)

---

## Overview

Builder.io is a visual page builder that allows you to create and edit website pages without writing code. Fern & Fog Creations uses Builder.io for:

- Marketing pages (about, blog posts, landing pages)
- Homepage content
- Promotional campaigns
- Content updates without deployments

**What You Need:**
- Builder.io account with access to Fern & Fog workspace
- Basic understanding of drag-and-drop interfaces
- Familiarity with the Fern & Fog brand

---

## Initial Setup

### 1. Access Builder.io

**Dashboard URL:** https://builder.io/content

**Login Requirements:**
- Builder.io account credentials
- Access to Fern & Fog Creations workspace

**If you don't have access:**
- Contact your team administrator
- Request invite to Builder.io workspace
- Follow email invitation to create account

### 2. Verify Environment Variables

Ensure your project has these environment variables configured:

```bash
BUILDER_PUBLIC_KEY=your-api-key
NEXT_PUBLIC_BUILDER_PUBLIC_KEY=your-api-key  # Same value
```

**Location:** `.env.local` or Vercel environment variables

**How to Get API Key:**
1. Log into Builder.io
2. Go to Account Settings
3. Navigate to "Space Settings"
4. Copy "Public API Key"

### 3. Understand the Builder.io Dashboard

**Main Sections:**

- **Content:** Where you create/edit pages
- **Models:** Define content structure (already configured)
- **Data:** Connect external data sources (optional)
- **Insights:** Analytics and performance metrics

**For Content Management:** You'll primarily work in the "Content" section.

---

## Creating Your First Page

### Step 1: Create New Page Entry

1. **Navigate to Content Section**
   - Click "Content" in the left sidebar
   - Click "+ New" button
   - Select "page" model

2. **Configure Page Settings**
   - **Name:** Internal name for your reference (e.g., "About Us Page")
   - **URL Path:** The web address (e.g., `/about-us`, `/blog/summer-collection`)
   - **Description:** Optional internal notes

**Important URL Path Rules:**
- Must start with `/`
- Use lowercase and hyphens (e.g., `/our-story`, not `/Our Story`)
- Cannot use these reserved paths:
  - `/products`, `/product/*`
  - `/cart`, `/checkout`
  - `/api/*`
  - `/gallery`, `/about`, `/contact` (currently hardcoded)

### Step 2: Build Page Content

1. **Access Visual Editor**
   - Click "Edit" on your new page entry
   - Visual editor opens with empty canvas

2. **Add Components**
   - Browse component library in left sidebar
   - Look for "Fern & Fog" custom components section
   - Drag components onto canvas
   - Drop in desired layout order

3. **Configure Components**
   - Click component on canvas to select
   - Right panel shows editable properties
   - Fill in text, images, links, etc.
   - Changes preview in real-time

### Step 3: Preview & Publish

1. **Preview Your Page**
   - Click "Preview" button (top right)
   - Opens page in new tab
   - Test all links and interactions
   - Check responsive design (resize browser)

2. **Publish When Ready**
   - Click "Publish" button (top right)
   - Page is immediately live at your URL path
   - No deployment wait time

**Example Page Creation:**

```
Page Name: About Our Story
URL Path: /our-story
Components:
1. HeroBlock (background image + heading)
2. TextBlock (company story with rich text)
3. FeatureGridBlock (our values with icons)
4. GalleryPreviewBlock (featured work samples)
5. CTABlock (visit gallery or shop now)
```

---

## Using Custom Components

Fern & Fog Creations has 7 custom-built components available in the visual editor. All components maintain the coastal/woodland brand theme.

### 1. HeroBlock

**Purpose:** Full-width hero section with background image

**When to Use:**
- Top of homepage
- Landing page headers
- Campaign introductions

**Configurable Properties:**

| Property | Type | Example |
|----------|------|---------|
| Background Image | URL | `https://cdn.shopify.com/s/files/1/...` |
| Heading | Text | `"Handcrafted Coastal Treasures"` |
| Description | Text | `"Each piece tells a story..."` |
| Primary Button Text | Text | `"Shop Now"` |
| Primary Button Link | URL | `/products` |
| Secondary Button Text | Text | `"Our Story"` |
| Secondary Button Link | URL | `/about-us` |

**Tips:**
- Use high-quality landscape images (1920x800px recommended)
- Keep heading under 60 characters
- Description should be 1-2 sentences max
- Primary button for main action, secondary for alternative path

**Image Requirements:**
- **Format:** JPG, PNG, or WebP
- **Size:** 1920x800px to 2400x1000px
- **File Size:** Under 500KB (compressed)
- **Subject:** Hero should be centered with text safe area

---

### 2. CategoryGridBlock

**Purpose:** 4-column responsive grid showcasing product categories

**When to Use:**
- Shop navigation on homepage
- Category overview pages
- Collection landing pages

**Configurable Properties:**

| Property | Type | Example |
|----------|------|---------|
| Heading | Text | `"Shop by Collection"` |
| Subheading | Text | `"Explore our handcrafted creations"` |
| Categories | Array | See below |
| View All Link | URL | `/products` |

**Category Object Structure (repeat for each category):**

| Field | Type | Example |
|-------|------|---------|
| Name | Text | `"Sea Glass Earrings"` |
| Slug | Text | `"earrings"` |
| Description | Text | `"Found along rocky shores..."` |
| Image | URL | `https://...category-image.jpg` |

**Tips:**
- Add 4 categories for best grid layout
- Use square images (800x800px)
- Slug should match product collection slug
- Keep descriptions brief (1 sentence)

**Important:** Category data entered here is NOT automatically synced with:
- Product data in Shopify
- Categories in `data/products.ts`
- Other pages using CategoryGridBlock

You must manually update each instance.

---

### 3. FeatureGridBlock

**Purpose:** 3-column grid highlighting features, benefits, or values

**When to Use:**
- Product benefits
- Company values
- Process steps
- Why choose us sections

**Configurable Properties:**

| Property | Type | Example |
|----------|------|---------|
| Heading | Text | `"Why Choose Fern & Fog"` |
| Subheading | Text | `"Quality craftsmanship meets coastal beauty"` |
| Background Color | Color | `#F5F0E6` (parchment) |
| Features | Array | See below |

**Feature Object Structure (repeat for each feature):**

| Field | Type | Example |
|-------|------|---------|
| Name | Text | `"Sustainably Sourced"` |
| Description | Text | `"All materials ethically collected..."` |
| Icon | Emoji | `🌊` |

**Brand Color Options:**
- `#F5F0E6` - Parchment (off-white)
- `#E6ECE8` - Mist (light gray)
- `#33593D` - Moss (dark green)
- `#4F7942` - Fern (medium green)

**Tips:**
- Add exactly 3 features for balanced layout
- Use coastal/nature emojis (🌊 🌿 🐚 🪵 ✨)
- Keep descriptions under 2 sentences
- Use parchment or mist backgrounds for readability

---

### 4. ProductGridBlock

**Purpose:** Featured product grid display

**When to Use:**
- Featured products on homepage
- Curated collection highlights
- Best sellers showcase

**Configurable Properties:**

| Property | Type | Example |
|----------|------|---------|
| Heading | Text | `"Featured Creations"` |
| Subheading | Text | `"Our most beloved pieces"` |
| Products | Array | Manual product entry |

**Important Limitations:**
- Products must be manually entered
- NOT automatically synced with Shopify product catalog
- Images and prices must be manually updated
- For auto-synced products, use hardcoded product pages instead

**Tips:**
- Use for static curated selections only
- Update manually when product changes
- Consider using HeroBlock with link to `/products` for dynamic inventory

---

### 5. GalleryPreviewBlock

**Purpose:** Gallery item preview with stories

**When to Use:**
- Homepage gallery teaser
- Landing page gallery section
- Featured work showcase

**Configurable Properties:**

| Property | Type | Example |
|----------|------|---------|
| Heading | Text | `"From the Studio"` |
| Gallery Items | Array | See below |

**Gallery Item Structure:**

| Field | Type | Example |
|-------|------|---------|
| Image | URL | `https://...gallery-image.jpg` |
| Title | Text | `"Ocean Blue Teardrops"` |
| Materials | Text | `"Sea Glass, Sterling Silver"` |
| Story | Text | `"Found along the shores..."` |

**Important Limitations:**
- Gallery items must be manually entered
- NOT synced with main gallery page data (`data/gallery.ts`)
- Must update both places if content changes

**Tips:**
- Use 3-6 gallery items
- Tell authentic stories about materials/inspiration
- Use high-quality product photography
- Link to full gallery page with CTA

---

### 6. TextBlock

**Purpose:** Flexible rich text content block

**When to Use:**
- Long-form about content
- Blog posts
- Policy excerpts
- Any text-heavy sections

**Configurable Properties:**

| Property | Type | Example |
|----------|------|---------|
| Heading | Text | `"Our Story"` |
| Content | Rich Text | Full WYSIWYG editor |
| Alignment | Select | Left / Center / Right |
| Background Color | Color | `#F5F0E6` |
| Max Width | Select | Small / Medium / Large / Full |

**Rich Text Editor Features:**
- Bold, italic, underline
- Headings (H2, H3, H4)
- Bulleted and numbered lists
- Links
- Block quotes
- Code blocks

**Tips:**
- Use headings (H2, H3) to structure content
- Keep paragraphs under 4-5 sentences
- Use lists for scannable content
- Set max width to "Medium" for readability
- Use parchment background for warmth

---

### 7. CTABlock

**Purpose:** Call-to-action section with buttons

**When to Use:**
- Newsletter signups
- Shop now sections
- Contact CTAs
- Promotional offers

**Configurable Properties:**

| Property | Type | Example |
|----------|------|---------|
| Heading | Text | `"Ready to Find Your Perfect Piece?"` |
| Description | Text | `"Browse our full collection..."` |
| Background Color | Color | `#4F7942` (fern) |
| Primary Button Text | Text | `"Shop Now"` |
| Primary Button Link | URL | `/products` |
| Secondary Button Text | Text | `"Contact Us"` |
| Secondary Button Link | URL | `/contact` |

**Tips:**
- Use action-oriented heading
- Keep description concise (1-2 sentences)
- Primary button for main action
- Use brand colors: fern, moss, or gold for CTAs
- Place at end of page to drive conversion

---

## Managing Navigation

### Current State

**Navigation:** Currently using hardcoded fallback (defined in code)

**Future State:** Can be managed via Builder.io (requires configuration)

### How to Configure Builder.io Navigation (For Developers)

1. **Create Navigation Model** (if not exists)
   - Go to Models section
   - Create "navigation" model
   - Define fields for menu items

2. **Create Navigation Content**
   - Go to Content section
   - Create new "navigation" entry
   - Set ID to "main-navigation"
   - Configure menu items

3. **Create Footer Content**
   - Create new "footer" entry
   - Set ID to "main-footer"
   - Configure footer sections

**Once configured, business users can:**
- Edit navigation links without code
- Add/remove menu items
- Update footer content
- Changes publish instantly

**Current Workaround:**
- Navigation requires code changes
- Contact developer to update menu items
- See `lib/builder/navigation.ts`

---

## Best Practices

### Content Strategy

**1. Plan Before Building**
- Sketch page layout on paper first
- Identify key messages and CTAs
- Gather all images and copy beforehand

**2. Maintain Brand Consistency**
- Use Fern & Fog custom components
- Stick to brand colors (moss, fern, parchment, bark, mist, gold)
- Use coastal/woodland imagery
- Keep copy warm and authentic

**3. Optimize for Performance**
- Compress images before uploading (use TinyPNG, Squoosh)
- Aim for under 500KB per image
- Use modern formats (WebP, AVIF) when possible
- Limit to 5-7 sections per page

### Image Guidelines

**Image Sizes by Component:**

| Component | Recommended Size | Aspect Ratio |
|-----------|-----------------|--------------|
| HeroBlock | 1920x800px | 2.4:1 |
| CategoryGridBlock | 800x800px | 1:1 (square) |
| GalleryPreviewBlock | 1200x900px | 4:3 |
| TextBlock | 1200x600px | 2:1 |

**Image Optimization:**
- **Tools:** TinyPNG, Squoosh, ImageOptim
- **Target:** Under 500KB per image
- **Format:** JPG for photos, PNG for graphics with transparency

**Image Hosting:**
- Upload images to Shopify Files or CDN
- Use absolute URLs (e.g., `https://cdn.shopify.com/...`)
- Avoid hotlinking from other sites

### Writing Copy

**Voice & Tone:**
- Warm and authentic
- Storytelling approach
- Coastal/nature-inspired language
- Personal yet professional

**Formatting:**
- Use headings to structure content
- Keep paragraphs short (3-4 sentences)
- Use lists for scannable information
- Include clear calls-to-action

**SEO Best Practices:**
- Include target keywords naturally
- Use descriptive headings
- Write meta descriptions (coming soon in Builder.io)
- Include alt text for images (coming soon)

### Mobile Responsiveness

**All components are mobile-responsive by default:**
- 4-column grids become 1-column on mobile
- Hero images scale and crop appropriately
- Text sizes adjust for readability
- Buttons stack vertically when needed

**Always Test On:**
- Desktop (1920px)
- Tablet (768px)
- Mobile (375px)

**How to Test:**
- Use Preview button
- Resize browser window
- Check on actual devices

---

## Troubleshooting

### Page Not Showing on Website

**Possible Causes:**

1. **URL Path Conflict**
   - **Issue:** Path matches a reserved route
   - **Solution:** Use a different path (avoid `/products`, `/cart`, `/gallery`, etc.)
   - **Check:** See "Protected Routes" in EDITABILITY_GUIDE.md

2. **Page Not Published**
   - **Issue:** Page saved as draft
   - **Solution:** Click "Publish" button in Builder.io editor

3. **Environment Variables Missing**
   - **Issue:** `BUILDER_PUBLIC_KEY` not configured
   - **Solution:** Verify `.env.local` or Vercel env vars
   - **Check:** See EDITABILITY_GUIDE.md for required variables

4. **Caching**
   - **Issue:** Old version showing
   - **Solution:** Hard refresh browser (Cmd+Shift+R or Ctrl+Shift+R)
   - **Advanced:** Clear Vercel cache in dashboard

### Images Not Loading

**Possible Causes:**

1. **Invalid Image URL**
   - **Issue:** Broken or incorrect URL
   - **Solution:** Verify image URL in browser, ensure it's accessible
   - **Test:** Paste URL in new browser tab

2. **Remote Pattern Not Configured**
   - **Issue:** Image domain not allowed in Next.js config
   - **Solution:** Contact developer to add domain to `next.config.ts`
   - **Current Allowed:** `cdn.shopify.com`, `via.placeholder.com`, `tailwindcss.com`

3. **Image Too Large**
   - **Issue:** Image file size causes slow loading
   - **Solution:** Compress image, aim for under 500KB
   - **Tools:** TinyPNG, Squoosh

### Component Not Appearing in Editor

**Possible Causes:**

1. **Component Not Registered**
   - **Issue:** Component missing from Builder.io registration
   - **Solution:** Contact developer to register component
   - **Check:** See `components/builder/register-components.tsx`

2. **Cache Issue**
   - **Issue:** Builder.io editor cache outdated
   - **Solution:** Hard refresh editor (Cmd+Shift+R or Ctrl+Shift+R)
   - **Advanced:** Clear browser cache, try incognito mode

### Changes Not Saving

**Possible Causes:**

1. **Network Issue**
   - **Issue:** Slow or interrupted connection
   - **Solution:** Check internet connection, retry save

2. **Browser Issue**
   - **Issue:** Browser blocking requests
   - **Solution:** Disable ad blockers, try different browser
   - **Recommended:** Chrome, Firefox, Safari (latest versions)

3. **Permissions Issue**
   - **Issue:** Account lacks edit permissions
   - **Solution:** Contact workspace admin for proper access level

### Need More Help?

**Internal Resources:**
- **EDITABILITY_GUIDE.md** - What's editable where
- **CONTENT_MANAGEMENT_GUIDE.md** - Quick start guide
- **CLAUDE.md** - Technical project overview

**External Resources:**
- **Builder.io Docs:** https://www.builder.io/c/docs
- **Builder.io Support:** support@builder.io
- **Community Forum:** https://forum.builder.io/

**Contact Development Team:**
- For technical issues
- To request new components
- To report bugs

---

## Advanced Features

### A/B Testing (Available in Builder.io)

**Feature:** Test multiple page variations

**How to Use:**
1. Create page in Builder.io
2. Click "Add Variant" button
3. Create alternative version (B)
4. Set traffic split (50/50, 70/30, etc.)
5. Publish and monitor results

**Use Cases:**
- Test different hero images
- Compare CTA button text
- Evaluate layout changes

### Targeting & Personalization

**Feature:** Show different content based on user attributes

**Options:**
- Location (city, country)
- Device (mobile, desktop)
- Custom attributes (returning visitor, etc.)

**How to Use:**
1. Click "Targeting" tab in editor
2. Add targeting rules
3. Create personalized content variants

**Use Cases:**
- Mobile-specific offers
- Regional promotions
- Returning customer messaging

### Scheduling (Available in Builder.io)

**Feature:** Schedule content publish and unpublish

**How to Use:**
1. Edit page in Builder.io
2. Click "Schedule" button
3. Set publish date/time
4. Set optional unpublish date/time (for limited campaigns)

**Use Cases:**
- Holiday promotions
- Seasonal content
- Limited-time offers
- Event announcements

### Custom Fields & Data Binding

**Feature:** Create reusable content with custom fields

**Advanced Use Case:**
- Create "Product Spotlight" model
- Define fields (product name, image, price, link)
- Create multiple product spotlight entries
- Bind to ProductGridBlock dynamically

**Requires:** Developer setup of custom models

### Heatmaps & Analytics (Builder.io Insights)

**Feature:** See how users interact with your pages

**Available Metrics:**
- Click heatmaps
- Scroll depth
- Conversion tracking
- Element engagement

**How to Access:**
1. Go to "Insights" section in Builder.io
2. Select page to analyze
3. View interaction data

**Use for:**
- Optimizing CTA placement
- Identifying confusing elements
- Improving user experience

---

## Workflow Examples

### Example 1: Creating a Seasonal Landing Page

**Goal:** Create landing page for "Summer Coastal Collection"

**Steps:**

1. **Create Page**
   - URL path: `/landing/summer-coastal-collection`
   - Name: "Summer Coastal Collection Landing"

2. **Add Components:**
   - **HeroBlock**
     - Background: Beach scene with sea glass
     - Heading: "Summer Coastal Collection"
     - Description: "Limited edition pieces inspired by warm coastal days"
     - Primary CTA: "Shop Collection" → `/products/summer`
     - Secondary CTA: "View Gallery" → `/gallery`

   - **FeatureGridBlock**
     - Heading: "Why You'll Love This Collection"
     - Features:
       - 🌊 "Beach-Found Materials"
       - ✨ "Limited Edition"
       - 🐚 "Summer Colors"

   - **ProductGridBlock**
     - Heading: "Featured Pieces"
     - Manually add 4-6 summer products

   - **CTABlock**
     - Heading: "Ready to Shop?"
     - Primary CTA: "Browse Collection"
     - Background: Fern green

3. **Configure Settings:**
   - Set schedule: Publish June 1, unpublish August 31
   - Add targeting: Show only to US visitors (optional)

4. **Test & Publish:**
   - Preview on mobile and desktop
   - Test all links
   - Publish when ready

### Example 2: Updating Homepage Hero

**Goal:** Change homepage hero for holiday season

**Steps:**

1. **Access Homepage**
   - Go to Builder.io Content
   - Find homepage entry (URL path: `/`)
   - Click "Edit"

2. **Update HeroBlock:**
   - Click HeroBlock component
   - Update background image: Upload new holiday image
   - Update heading: "Holiday Gift Guide"
   - Update description: "Find the perfect handcrafted gift"
   - Update primary CTA: "Shop Gifts" → `/products`

3. **Publish:**
   - Click "Publish"
   - Changes are live immediately

**Time Required:** 5-10 minutes

### Example 3: Creating Blog Post

**Goal:** Write blog post about sea glass sourcing process

**Steps:**

1. **Create Page**
   - URL path: `/blog/how-we-source-sea-glass`
   - Name: "Blog: How We Source Sea Glass"

2. **Add Components:**
   - **HeroBlock**
     - Background: Beach scene
     - Heading: "How We Source Sea Glass"
     - Description: "Our ethical approach to finding coastal treasures"

   - **TextBlock**
     - Heading: "Our Process"
     - Content: Write full blog post using rich text editor
       - Add headings for structure
       - Include bulleted lists
       - Add emphasis with bold/italic
     - Max Width: Medium
     - Alignment: Left

   - **GalleryPreviewBlock**
     - Heading: "Sea Glass Creations"
     - Add 4-6 finished pieces made with sea glass

   - **CTABlock**
     - Heading: "Shop Sea Glass Jewelry"
     - Primary CTA: "Browse Collection"

3. **Publish:**
   - Preview for readability
   - Check mobile layout
   - Publish when satisfied

---

## Quick Reference Cheat Sheet

### Component Selection Guide

**Need a hero section?** → Use **HeroBlock**
**Need to showcase categories?** → Use **CategoryGridBlock**
**Need to highlight features/benefits?** → Use **FeatureGridBlock**
**Need to display specific products?** → Use **ProductGridBlock**
**Need to show gallery items?** → Use **GalleryPreviewBlock**
**Need long-form text content?** → Use **TextBlock**
**Need a call-to-action?** → Use **CTABlock**

### Brand Colors (Hex Codes)

- **Moss:** `#33593D` (dark green)
- **Fern:** `#4F7942` (medium green)
- **Parchment:** `#F5F0E6` (off-white)
- **Bark:** `#5B4636` (brown)
- **Mist:** `#E6ECE8` (light gray)
- **Gold:** `#C5A05A` (accent gold)

### Keyboard Shortcuts (Builder.io Editor)

- **Save:** Cmd/Ctrl + S
- **Undo:** Cmd/Ctrl + Z
- **Redo:** Cmd/Ctrl + Shift + Z
- **Duplicate:** Cmd/Ctrl + D
- **Delete:** Delete/Backspace
- **Preview:** Cmd/Ctrl + P

### Common URL Paths

- Homepage: `/`
- About pages: `/about-us`, `/our-story`, `/team`
- Blog: `/blog/post-title`
- Landing pages: `/landing/campaign-name`

### Reserved Paths (Cannot Use)

- `/products`, `/product/*`
- `/cart`, `/checkout`
- `/gallery`, `/about`, `/contact` (currently hardcoded)
- `/api/*`

---

**Last Updated:** November 16, 2025
**Next Review:** January 16, 2026
**Maintained By:** Development Team
