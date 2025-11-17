# Metadata & SEO Management Guide

**Optimizing Your Website for Search Engines**

---

## Table of Contents

1. [What is Metadata?](#what-is-metadata)
2. [Why Metadata Matters](#why-metadata-matters)
3. [Types of Metadata](#types-of-metadata)
4. [Managing Page Metadata](#managing-page-metadata)
5. [SEO Best Practices](#seo-best-practices)
6. [OpenGraph & Social Media](#opengraph--social-media)
7. [Robots & Indexing](#robots--indexing)
8. [Monitoring SEO Performance](#monitoring-seo-performance)
9. [Common Mistakes](#common-mistakes)

---

## What is Metadata?

**Metadata** is "data about data" - information that describes your web pages to search engines and social media platforms.

Think of it as your website's "business card" for Google and Facebook.

### Where Metadata Appears

1. **Google Search Results**
   ```
   [Title] Handmade Sea Glass Earrings | Fern & Fog Creations
   https://fernfogcreations.com/products/earrings
   [Description] Shop unique sea glass earrings handcrafted from...
   ```

2. **Social Media Shares** (Facebook, Twitter, LinkedIn)
   - Preview image
   - Title
   - Description
   - Website URL

3. **Browser Tabs**
   - Page title appears in tab

---

## Why Metadata Matters

### For Search Engines (Google)

✅ **Better Rankings** - Well-written metadata helps Google understand your content
✅ **Click-Through Rate** - Compelling descriptions get more clicks
✅ **Keyword Targeting** - Metadata tells Google what your page is about

### For Visitors

✅ **Trust** - Professional metadata looks legitimate
✅ **Clarity** - Visitors know what to expect before clicking
✅ **Social Sharing** - Nice previews when sharing on Facebook/Twitter

### For Your Business

✅ **Free Marketing** - Good SEO = free traffic from Google
✅ **Competitive Edge** - Stand out in search results
✅ **Brand Consistency** - Control how your brand appears online

---

## Types of Metadata

### 1. SEO Title (`seo_title`)

**What:** The clickable headline in Google search results
**Length:** 50-60 characters (Google truncates longer titles)
**Best Practice:** Include main keyword + brand name

**Examples:**
```
✅ GOOD: "Handmade Sea Glass Jewelry | Fern & Fog Creations"
❌ BAD: "Home Page" (too generic)
❌ BAD: "Handmade Artisan Coastal Sea Glass Jewelry Earrings Necklaces Bracelets" (too long)
```

### 2. SEO Description (`seo_description`)

**What:** The text snippet below the title in search results
**Length:** 150-160 characters
**Best Practice:** Compelling summary that includes keywords naturally

**Examples:**
```
✅ GOOD: "Shop unique handcrafted sea glass earrings and coastal decor. Each piece is one-of-a-kind, made with materials from Pacific Northwest shores."

❌ BAD: "We sell stuff." (too vague)
❌ BAD: "Buy sea glass earrings, buy sea glass, sea glass jewelry, buy jewelry, handmade, artisan, coastal..." (keyword stuffing)
```

### 3. Keywords (`keywords`)

**What:** Comma-separated list of relevant search terms
**Note:** Less important than title/description (Google mostly ignores them)
**Best Practice:** 5-10 relevant keywords

**Examples:**
```
✅ GOOD: "sea glass jewelry, handmade earrings, coastal decor, Pacific Northwest crafts"
❌ BAD: "buy, shop, cheap, best, #1" (spammy keywords)
```

### 4. OpenGraph Image (`og_image_url`)

**What:** Image that appears when page is shared on social media
**Size:** 1200x630px (recommended)
**Format:** JPG or PNG

**Best Practice:** Use high-quality product photos or branded graphics

### 5. Robots Settings

**`robots_index`**: Should Google show this page in search results?
- ✅ Check: For public pages (homepage, products, gallery)
- ❌ Uncheck: For private/admin pages

**`robots_follow`**: Should Google follow links on this page?
- ✅ Check: For most pages
- ❌ Uncheck: For low-quality pages (like thank-you pages)

---

## Managing Page Metadata

### Accessing Page Metadata

1. **Go to:** Shopify Admin
2. **Navigate:** Settings → Custom data → Metaobjects
3. **Click:** "page_metadata"
4. **Choose** the page to edit (homepage, about, contact, gallery)

### Metadata Fields Explained

| Field | Purpose | Max Length | Required? |
|-------|---------|------------|-----------|
| `page_id` | Internal identifier | N/A | ✅ Yes (Don't change!) |
| `seo_title` | Google search title | 60 chars | ✅ Yes |
| `seo_description` | Google description snippet | 160 chars | ✅ Yes |
| `keywords` | Search keywords | N/A | ⚠️ Optional |
| `robots_index` | Allow Google indexing | N/A | ✅ Yes |
| `robots_follow` | Follow page links | N/A | ✅ Yes |
| `og_image_url` | Social media image | N/A | ⚠️ Optional |

### Step-by-Step: Editing Homepage Metadata

1. **Open:** page_metadata → homepage
2. **Update fields:**
   ```
   seo_title: Handmade Coastal Decor & Sea Glass Jewelry | Fern & Fog Creations

   seo_description: Shop unique handcrafted sea glass earrings, pressed flower resin art, and driftwood decor. Each piece is one-of-a-kind, made with materials from the Pacific Northwest coast.

   keywords: handmade jewelry, sea glass earrings, coastal decor, driftwood art, pressed flowers, Pacific Northwest crafts

   robots_index: ✅ Checked
   robots_follow: ✅ Checked

   og_image_url: https://cdn.shopify.com/.../homepage-social-share.jpg
   ```

3. **Click "Save"**
4. **Wait 24-48 hours** for Google to re-index

---

## SEO Best Practices

### Title Optimization

✅ **DO:**
- Put most important keywords first
- Include your brand name
- Make it compelling (encourage clicks)
- Keep under 60 characters
- Use vertical bar (|) to separate sections

**Template:**
```
[Primary Keyword] [Secondary Keyword] | [Brand Name]
```

**Examples:**
```
Sea Glass Earrings & Coastal Decor | Fern & Fog Creations
Handmade Pressed Flower Art | Fern & Fog Creations
Pacific Northwest Driftwood Decor | Fern & Fog Creations
```

❌ **DON'T:**
- Use ALL CAPS
- Keyword stuff
- Use clickbait ("You Won't Believe...")
- Duplicate titles across pages
- Use special characters (@, #, $)

### Description Optimization

✅ **DO:**
- Write for humans, not robots
- Include a clear call-to-action
- Mention key benefits/features
- Use active voice
- End with emotion or urgency

**Formula:**
```
[What you offer] + [Key benefit] + [Call to action]
```

**Example:**
```
Discover unique sea glass jewelry handcrafted from Pacific Northwest shores. Each piece tells a story. Shop now and find your treasure.
```

❌ **DON'T:**
- Copy/paste your title as description
- Use generic descriptions across pages
- Stuff keywords unnaturally
- Use salesy language ("Buy now!!!")

### Keyword Selection

✅ **DO:**
- Research what customers actually search
- Use long-tail keywords ("sea glass earrings Oregon")
- Include location if relevant ("Pacific Northwest crafts")
- Think like your customer
- Use Google's search suggestions

**Tools for Keyword Research:**
- Google Search (autocomplete suggestions)
- Google Trends (trending searches)
- Answer The Public (question-based keywords)
- Your competitors' titles

❌ **DON'T:**
- Use unrelated keywords
- Repeat the same keyword 10 times
- Use brand names of competitors
- Use misspellings (Google auto-corrects)

---

## OpenGraph & Social Media

### What is OpenGraph?

OpenGraph is metadata specifically for social media platforms (Facebook, LinkedIn, Twitter).

When someone shares your page, OpenGraph controls:
- Preview image
- Title
- Description
- URL

### Setting OpenGraph Images

1. **Create image:**
   - Size: 1200x630px
   - Format: JPG or PNG
   - Content: Product photo, logo, or branded graphic

2. **Upload to Shopify:**
   - Settings → Files → Upload files
   - Copy the URL

3. **Add to metadata:**
   - Paste URL in `og_image_url` field
   - Save

**Example URLs:**
```
https://cdn.shopify.com/s/files/1/0XXX/XXXX/files/og-homepage.jpg
https://cdn.shopify.com/s/files/1/0XXX/XXXX/files/og-gallery.jpg
```

### Testing Social Shares

**Facebook Debugger:**
1. Go to: https://developers.facebook.com/tools/debug/
2. Enter your URL
3. Click "Scrape Again" if needed
4. Verify image/title/description appear correctly

**Twitter Card Validator:**
1. Go to: https://cards-dev.twitter.com/validator
2. Enter your URL
3. Click "Preview card"

---

## Robots & Indexing

### Robots Meta Tags

`robots_index` and `robots_follow` control how Google indexes your site.

| Setting | Effect | Use When |
|---------|--------|----------|
| Index + Follow | Google shows page & follows links | ✅ Most pages |
| Index + NoFollow | Google shows page but doesn't follow links | Admin/login pages |
| NoIndex + Follow | Google doesn't show page but follows links | Duplicate content |
| NoIndex + NoFollow | Google ignores page completely | Private/temp pages |

### When to Use NoIndex

❌ **Pages to NoIndex:**
- Duplicate content
- Low-quality pages
- Private/admin pages
- Temporary landing pages
- Cart/checkout pages

✅ **Pages to Index:**
- Homepage
- Product pages
- Collection pages
- About/Contact pages
- Blog posts
- Gallery

### Checking Your Index Status

**Google Search Console:**
1. Go to: https://search.google.com/search-console
2. Click "URL Inspection"
3. Enter your page URL
4. See if Google has indexed it

**Manual Check:**
```
site:fernfogcreations.com/about
```
(Paste in Google search - if page appears, it's indexed)

---

## Monitoring SEO Performance

### Google Search Console

**Setup (One-Time):**
1. Go to: https://search.google.com/search-console
2. Add your website
3. Verify ownership (ask developer for help)

**What to Monitor:**
- Search queries (what people searched to find you)
- Click-through rate (CTR)
- Average position in search results
- Pages with errors

### Google Analytics

**What to Monitor:**
- Organic search traffic (from Google)
- Most visited pages
- Bounce rate (% who leave immediately)
- Conversion rate (% who buy)

### Key Metrics

| Metric | Good | Bad | How to Improve |
|--------|------|-----|----------------|
| CTR | >3% | <1% | Better titles/descriptions |
| Bounce Rate | <40% | >70% | Improve page content |
| Avg Position | Top 10 | >20 | Better SEO optimization |
| Organic Traffic | Growing | Declining | More content, better SEO |

---

## Common Mistakes

### ❌ Mistake #1: Duplicate Metadata

**Problem:** Same title/description on multiple pages

**Why it's bad:** Google gets confused about which page to rank

**Fix:**
- Make each page's metadata unique
- Describe what makes that page different

### ❌ Mistake #2: Keyword Stuffing

**Problem:** Repeating keywords unnaturally

**Bad example:**
```
Buy sea glass, sea glass jewelry, sea glass earrings, buy jewelry,
handmade sea glass, sea glass for sale, cheap sea glass
```

**Fix:** Write naturally for humans, not robots

### ❌ Mistake #3: Ignoring Character Limits

**Problem:** Titles/descriptions get truncated in search results

**Fix:**
- Titles: 50-60 characters
- Descriptions: 150-160 characters
- Put important words first

### ❌ Mistake #4: Generic Metadata

**Problem:** "Welcome to our website" or "Home Page"

**Fix:** Be specific about what you offer and why it's valuable

### ❌ Mistake #5: Never Updating Metadata

**Problem:** Set it once, forget it forever

**Fix:**
- Review quarterly
- Update for seasonal changes
- Test different approaches
- Monitor what works

---

## Metadata Checklist

Before publishing:

- [ ] SEO title is under 60 characters
- [ ] SEO title includes main keyword
- [ ] SEO title includes brand name
- [ ] SEO description is under 160 characters
- [ ] SEO description is compelling
- [ ] SEO description includes call-to-action
- [ ] Keywords are relevant (not stuffed)
- [ ] `robots_index` is checked (for public pages)
- [ ] `robots_follow` is checked
- [ ] OpenGraph image is 1200x630px (optional)
- [ ] Metadata is unique (not duplicated)
- [ ] Tested in Google Search Console

---

## Resources

- **Google SEO Starter Guide**: https://developers.google.com/search/docs/beginner/seo-starter-guide
- **Moz Beginner's Guide to SEO**: https://moz.com/beginners-guide-to-seo
- **Shopify SEO Guide**: https://www.shopify.com/blog/ecommerce-seo-beginners-guide
- **Google Search Console**: https://search.google.com/search-console
- **Facebook Debugger**: https://developers.facebook.com/tools/debug/

---

**Last updated:** January 2025
**Version:** 1.0
