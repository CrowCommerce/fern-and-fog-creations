# Shopify CMS Guide for Fern & Fog Creations

**For Business Users**: This guide explains how to manage your website content using Shopify Admin.

---

## Table of Contents

1. [Introduction](#introduction)
2. [Accessing Shopify Admin](#accessing-shopify-admin)
3. [Managing Page Metadata (SEO)](#managing-page-metadata-seo)
4. [Managing Navigation Menus](#managing-navigation-menus)
5. [Managing Homepage Content](#managing-homepage-content)
6. [Managing About Page Content](#managing-about-page-content)
7. [Managing Contact Page Content](#managing-contact-page-content)
8. [Managing Gallery Items](#managing-gallery-items)
9. [Common Tasks](#common-tasks)
10. [Troubleshooting](#troubleshooting)

---

## Introduction

Your Fern & Fog Creations website uses **Shopify as a Content Management System (CMS)**. This means all your website content—from navigation menus to page text—is managed directly in Shopify Admin.

**Benefits:**
- ✅ Edit content without touching code
- ✅ Changes appear instantly on your website (via webhooks)
- ✅ One platform for products AND website content
- ✅ No need to learn multiple tools

---

## Accessing Shopify Admin

### Login Steps

1. **Go to:** `your-store.myshopify.com/admin`
2. **Enter** your email and password
3. **Click** "Log in"

### Finding Content Settings

All website content is managed using **Shopify Metaobjects**:

1. From Shopify Admin sidebar, click **"Settings"** (bottom left)
2. Click **"Custom data"**
3. Click **"Metaobjects"**

This is where you'll find all editable website content!

---

## Managing Page Metadata (SEO)

Page metadata controls how your pages appear in Google search results and social media shares.

### What is Page Metadata?

- **Title**: What appears in Google search results (e.g., "Handmade Sea Glass Earrings | Fern & Fog")
- **Description**: The snippet under the title in search results
- **Keywords**: Help Google understand your page content
- **Robots settings**: Tell Google whether to index the page

### Editing Page Metadata

1. **Navigate to:** Settings → Custom data → Metaobjects
2. **Click:** "page_metadata"
3. **You'll see entries for:**
   - homepage
   - about
   - contact
   - gallery
   - products

4. **Click** the page you want to edit
5. **Update fields:**
   - **page_id**: (Don't change this!)
   - **seo_title**: 60 characters or less
   - **seo_description**: 160 characters or less
   - **keywords**: Comma-separated (e.g., "sea glass, handmade jewelry, coastal decor")
   - **robots_index**: Check to allow Google to show this page
   - **robots_follow**: Check to let Google follow links on this page
   - **og_image_url**: (Optional) Link to social media preview image

6. **Click "Save"**

### Best Practices for SEO

✅ **DO:**
- Keep titles under 60 characters
- Make descriptions compelling and under 160 characters
- Use natural language (write for humans, not robots)
- Include your brand name in titles
- Use relevant keywords naturally

❌ **DON'T:**
- Stuff keywords unnaturally
- Use ALL CAPS
- Duplicate titles across pages
- Leave description blank
- Use generic titles like "Home"

### Example: Homepage SEO

```
Title: Handmade Coastal Decor & Sea Glass Jewelry | Fern & Fog Creations
Description: Shop unique handcrafted sea glass earrings, pressed flower resin art, and driftwood decor. Each piece is one-of-a-kind, made with materials from the Pacific Northwest coast.
Keywords: handmade jewelry, sea glass earrings, coastal decor, driftwood art, pressed flowers, Pacific Northwest crafts
```

---

## Managing Navigation Menus

Your website has two menus:
- **Header Menu** (top navigation)
- **Footer Menu** (bottom of every page)

### Editing Menus

1. **Navigate to:** Shopify Admin sidebar → **"Online Store"** → **"Navigation"**
2. **You'll see:**
   - `header-menu` - Top navigation
   - `footer-menu` - Footer links

3. **Click** the menu you want to edit
4. **To add a menu item:**
   - Click "Add menu item"
   - Enter name (e.g., "Gallery")
   - Enter link (e.g., "/gallery")
   - Click "Add"

5. **To reorder items:**
   - Drag and drop using the ⋮⋮ handle

6. **To remove an item:**
   - Click the ⋮ menu → "Remove"

7. **Click "Save menu"**

### Menu Link Formats

| Page | Link Format | Example |
|------|-------------|---------|
| Homepage | `/` | `/` |
| Products | `/products` | `/products` |
| Collection | `/products/[collection]` | `/products/earrings` |
| Gallery | `/gallery` | `/gallery` |
| About | `/about` | `/about` |
| Contact | `/contact` | `/contact` |

**Important:** Links must start with `/` (forward slash)

### Menu Changes & Cache

✅ Menu changes appear **instantly** on your website (webhook revalidation)

---

## Managing Homepage Content

The homepage hero section is fully editable via Shopify metaobjects.

### Editing Homepage Hero

1. **Navigate to:** Settings → Custom data → Metaobjects
2. **Click:** "homepage_hero"
3. **Click:** "main" (the only entry)
4. **Editable fields:**
   - **heading**: Main hero text (e.g., "Handmade Coastal & Woodland Treasures")
   - **description**: Supporting text below heading
   - **background_image_url**: Hero background image (full URL)
   - **cta_primary_text**: First button text (e.g., "View Gallery")
   - **cta_primary_url**: First button link (e.g., "/gallery")
   - **cta_secondary_text**: (Optional) Second button text
   - **cta_secondary_url**: (Optional) Second button link

5. **Click "Save"**

### Image Requirements

- **Size:** 1920x1080px (recommended)
- **Format:** JPG or PNG
- **File size:** Under 500KB for best performance
- **Upload:** Use Shopify Files (Settings → Files → Upload)

### Example Hero Content

```
Heading: Handmade Coastal & Woodland Treasures
Description: Sea glass earrings, pressed flower resin, driftwood décor—crafted in small batches with materials gathered from the Pacific Northwest shores.
CTA Primary: View Gallery → /gallery
CTA Secondary: Shop New Arrivals → /products
```

---

## Managing About Page Content

The About page is divided into sections, all manageable via Shopify.

### About Page Main Content

1. **Navigate to:** Settings → Custom data → Metaobjects
2. **Click:** "about_page"
3. **Click:** "main" entry
4. **Editable fields:**
   - **hero_heading**: Page title
   - **hero_intro**: Opening paragraph
   - **story_heading**: "My Story" section title
   - **story_content**: Full story text
   - **quote_text**: (Optional) Pull quote
   - **quote_attribution**: (Optional) Quote author
   - **quote_image_url**: (Optional) Quote image
   - **process_heading**: "How I Create" section title
   - **values_heading**: "Values" section title
   - **cta_heading**: Bottom call-to-action title
   - **cta_description**: CTA description
   - **cta_primary_text/url**: Main CTA button
   - **cta_secondary_text/url**: (Optional) Secondary CTA

5. **Click "Save"**

### About Page Process Steps

These are the "How I Create" steps (Gathered → Crafted → Treasured).

1. **Navigate to:** Settings → Custom data → Metaobjects
2. **Click:** "about_process_step"
3. **You'll see 3 entries** (one for each step)
4. **Click** a step to edit:
   - **title**: Step name (e.g., "Gathered")
   - **description**: Step explanation
   - **icon_type**: gathered, crafted, or treasured
   - **sort_order**: Controls display order (1, 2, 3)

5. **Click "Save"**

**To add a new step:** Click "Add entry" → fill fields → Save

### About Page Values

These are your core values (4 items by default).

1. **Navigate to:** Settings → Custom data → Metaobjects
2. **Click:** "about_value"
3. **You'll see 4 values**
4. **Click** a value to edit:
   - **title**: Value name (e.g., "Sustainability")
   - **description**: What this value means
   - **sort_order**: Display order (1-4)

5. **Click "Save"**

---

## Managing Contact Page Content

The contact page text is editable, while the form itself is managed through Jotform.

### Editing Contact Page Text

1. **Navigate to:** Settings → Custom data → Metaobjects
2. **Click:** "contact_page"
3. **Click:** "main" entry
4. **Editable fields:**
   - **heading**: Page title (e.g., "Get in Touch")
   - **description**: Intro text above form
   - **email_display**: (Optional) Show email address
   - **phone_display**: (Optional) Show phone number
   - **business_hours**: (Optional) When you're available
   - **response_time**: (Optional) Expected response time

5. **Click "Save"**

### Managing the Contact Form (Jotform)

The actual form is managed at **jotform.com** (not Shopify).

**To view submissions:**
1. Log in to Jotform.com
2. Go to "My Forms"
3. Click your contact form
4. View submissions, export to Excel, set up email notifications

**To edit form fields:**
1. In Jotform, click "Edit Form"
2. Drag and drop fields
3. Click "Publish" when done
4. Changes appear instantly on your website

---

## Managing Gallery Items

Gallery items showcase your work with images, titles, descriptions, and categories.

### Adding a Gallery Item

1. **Navigate to:** Settings → Custom data → Metaobjects
2. **Click:** "gallery_item"
3. **Click:** "Add entry"
4. **Fill required fields:**
   - **title**: Item name (e.g., "Seafoam Sea Glass Earrings")
   - **description**: What makes this piece special
   - **image_url**: Full URL to image (upload via Settings → Files)
   - **category**: earrings, resin, driftwood, wall-hangings, or pressed-flowers
   - **is_sold**: Check if item is sold
   - **featured**: Check to highlight on gallery page
   - **sort_order**: Controls display order (lower numbers first)
   - **created_at_date**: (Optional) When piece was made
   - **materials**: (Optional) Comma-separated (e.g., "sea glass, sterling silver")

5. **Click "Save"**

### Editing Gallery Items

1. Find the item in the "gallery_item" list
2. Click to open
3. Make changes
4. Click "Save"

### Deleting Gallery Items

1. Click the item
2. Click the ⋮ menu (top right)
3. Click "Delete"
4. Confirm deletion

### Gallery Image Best Practices

- **Size:** 800x600px (recommended)
- **Format:** JPG for photos, PNG for graphics
- **File size:** Under 200KB
- **Quality:** High resolution, well-lit

---

## Common Tasks

### Updating Product SEO

Products have built-in SEO fields:

1. From Shopify Admin, go to **"Products"**
2. Click the product you want to edit
3. Scroll to **"Search engine listing"**
4. Click "Edit website SEO"
5. Update:
   - Page title
   - Description
   - URL handle
6. Click "Save"

### Updating Collection SEO

Similar to products:

1. Go to **"Products"** → **"Collections"**
2. Click the collection
3. Scroll to "Search engine listing"
4. Click "Edit website SEO"
5. Update title and description
6. Click "Save"

### Previewing Changes Before Publishing

Unfortunately, Shopify doesn't have a "preview" mode for metaobjects. Changes are live immediately.

**Best practice:** Make changes during low-traffic hours (early morning).

### Reverting Changes

Shopify doesn't have automatic version history for metaobjects.

**Best practice:** Keep a backup of important content in a Google Doc before making major changes.

---

## Troubleshooting

### "Changes aren't appearing on the website"

**Solution:**
1. Wait 30 seconds (webhook delay)
2. Hard refresh your browser (Ctrl+Shift+R on Windows, Cmd+Shift+R on Mac)
3. Check that you clicked "Save" in Shopify
4. Verify you're editing the correct metaobject entry

### "I don't see a metaobject type mentioned in this guide"

**Solution:**
1. Make sure you're in Settings → Custom data → Metaobjects
2. If it's truly missing, contact your developer (it may need to be created)

### "Menu changes aren't showing"

**Solution:**
1. Verify you clicked "Save menu"
2. Hard refresh browser
3. Check that links start with `/`
4. Verify you're editing the correct menu (header-menu vs footer-menu)

### "Image isn't loading"

**Solution:**
1. Verify the image URL is complete and starts with `https://`
2. Check that the image was uploaded to Shopify Files
3. Verify image file size is under 5MB
4. Try opening the image URL in a new browser tab to confirm it's accessible

### "SEO changes not showing in Google"

**Patience required!** Google can take 2-4 weeks to re-index pages with new metadata.

**To speed up:**
1. Go to Google Search Console
2. Request re-indexing for the specific page

---

## Need Help?

If you're stuck or need assistance:

1. **Check this guide first** - Most common tasks are covered
2. **Shopify Help Center**: help.shopify.com
3. **Contact your developer** for technical issues
4. **Jotform Support**: support.jotform.com (for form issues)

---

**Last updated:** January 2025
**Version:** 1.0
