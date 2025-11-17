# Menu Management Guide

**Managing Navigation Menus in Shopify for Fern & Fog Creations**

---

## Table of Contents

1. [Overview](#overview)
2. [Accessing Menu Settings](#accessing-menu-settings)
3. [Understanding Your Menus](#understanding-your-menus)
4. [Editing the Header Menu](#editing-the-header-menu)
5. [Editing the Footer Menu](#editing-the-footer-menu)
6. [Menu Link Formats](#menu-link-formats)
7. [Advanced: Custom Menu Items](#advanced-custom-menu-items)
8. [Testing Your Changes](#testing-your-changes)
9. [Common Issues](#common-issues)

---

## Overview

Your Fern & Fog Creations website has **two navigation menus**:

1. **Header Menu** (`header-menu`) - Top navigation bar, visible on every page
2. **Footer Menu** (`footer-menu`) - Bottom links, visible on every page

Both menus are managed in Shopify Admin under **Online Store → Navigation**.

### How Menus Work

- **Instant Updates**: Menu changes appear on your website within seconds (via webhooks)
- **Responsive**: Menus automatically adapt to mobile, tablet, and desktop screens
- **Drag & Drop**: Reorder menu items by dragging
- **Nested Menus**: (Not currently supported, but can be added by developer)

---

## Accessing Menu Settings

### Step-by-Step

1. **Log in** to Shopify Admin (`your-store.myshopify.com/admin`)
2. From the sidebar, click **"Online Store"**
3. Click **"Navigation"**
4. You'll see a list of all menus

![Shopify Navigation Menu](https://via.placeholder.com/800x400/E6ECE8/33593D?text=Shopify+Navigation+Menu)

---

## Understanding Your Menus

### Header Menu (`header-menu`)

**Location:** Top of every page
**Visibility:** Desktop and mobile (mobile = hamburger menu ☰)
**Current Items:**
- Gallery
- Products
- About
- Contact

**Best Practices:**
- Keep to 4-6 main items
- Use short, clear labels (1-2 words)
- Put most important pages first

### Footer Menu (`footer-menu`)

**Location:** Bottom of every page
**Visibility:** All devices
**Current Items:**
- Privacy Policy
- Shipping Policy
- Return Policy
- Terms of Service

**Best Practices:**
- Include legal/policy pages
- Add helpful links (FAQ, Contact, About)
- Can be longer than header menu

---

## Editing the Header Menu

### Opening the Header Menu

1. Go to **Online Store → Navigation**
2. Click **"header-menu"** (or "Main menu" depending on your Shopify setup)

### Adding a Menu Item

1. Click **"Add menu item"** button
2. Fill in the form:
   - **Name**: What visitors see (e.g., "Gallery")
   - **Link**: Where clicking goes (see [Menu Link Formats](#menu-link-formats))
3. Click **"Add"**
4. **Drag to reorder** if needed
5. Click **"Save menu"** (top right)

**Example: Adding a "Shop" Link**

```
Name: Shop
Link: /products
```

### Editing an Existing Item

1. Click the menu item you want to edit
2. Update name or link
3. Click "Apply changes"
4. Click "Save menu"

### Removing a Menu Item

1. Click the **⋮** (three dots) next to the item
2. Click **"Remove"**
3. Click **"Save menu"**

### Reordering Menu Items

1. Click and hold the **⋮⋮** (drag handle) next to item
2. Drag up or down
3. Release when in desired position
4. Click "Save menu"

---

## Editing the Footer Menu

Same process as header menu:

1. Go to **Online Store → Navigation**
2. Click **"footer-menu"**
3. Add, edit, remove, or reorder items
4. Click **"Save menu"**

**Typical Footer Menu Structure:**

```
- About Us → /about
- Contact → /contact
- Gallery → /gallery
- Privacy Policy → /policies/privacy
- Shipping Policy → /policies/shipping
- Return Policy → /policies/returns
- Terms of Service → /policies/terms
```

---

## Menu Link Formats

### Internal Pages (Recommended)

Internal links start with `/` and point to pages on your website.

| Page Type | Link Format | Example |
|-----------|-------------|---------|
| Homepage | `/` | `/` |
| About Page | `/about` | `/about` |
| Contact Page | `/contact` | `/contact` |
| Gallery Page | `/gallery` | `/gallery` |
| All Products | `/products` | `/products` |
| Product Collection | `/products/[handle]` | `/products/earrings` |
| Specific Product | `/product/[handle]` | `/product/seafoam-glass-earrings` |
| Policy Pages | `/policies/[type]` | `/policies/privacy` |
| Cart | `/cart` | `/cart` |
| Search | `/search` | `/search` |

### Collections

Valid collection handles:
- `/products/earrings`
- `/products/resin`
- `/products/driftwood`
- `/products/wall-hangings`
- `/products/pressed-flowers`
- `/products/all` (shows all products)

### External Links

External links must include `https://`:

```
Link: https://www.instagram.com/fernfogcreations
Name: Instagram
```

### Email Links

```
Link: mailto:hello@fernfogcreations.com
Name: Email Us
```

### Phone Links (Mobile-Friendly)

```
Link: tel:+15035551234
Name: Call Us
```

---

## Advanced: Custom Menu Items

### Creating a Dropdown Menu (Requires Developer)

Currently, your menus don't support dropdowns, but they can be added.

**Example structure (requires code changes):**
```
Products ▾
  ├─ Earrings → /products/earrings
  ├─ Resin Art → /products/resin
  └─ Driftwood → /products/driftwood
```

**Contact your developer** if you need dropdown menus.

### Adding Icons to Menu Items (Requires Developer)

Menu items can have icons (like 🛒 for cart), but this requires code changes.

### Conditional Menu Items (Requires Developer)

Show different menu items based on:
- User login status
- Device type (mobile vs desktop)
- Time of year (holiday menus)

Contact your developer for these advanced features.

---

## Testing Your Changes

### After Saving Menu Changes

1. **Wait 10-30 seconds** for webhook to propagate
2. **Hard refresh** your website:
   - **Windows:** Ctrl + Shift + R
   - **Mac:** Cmd + Shift + R
3. **Check both desktop and mobile** views
4. **Click every link** to verify they work

### Mobile Testing

1. **Open** website on your phone (or use browser dev tools)
2. **Tap** the hamburger menu (☰)
3. **Verify:**
   - All menu items appear
   - Links work correctly
   - Menu closes after clicking
   - No overlapping text

### Desktop Testing

1. **Open** website on desktop browser
2. **Hover** over menu items (should highlight)
3. **Click** each link
4. **Verify:**
   - Smooth navigation
   - Active page is highlighted
   - Links go to correct pages

---

## Common Issues

### Issue: "Menu changes aren't showing on the website"

**Solutions:**
1. Verify you clicked **"Save menu"** (top right corner)
2. Wait 30 seconds for webhook propagation
3. Hard refresh browser (Ctrl+Shift+R / Cmd+Shift+R)
4. Clear browser cache
5. Check browser console for errors (F12 → Console tab)

### Issue: "Link goes to 404 page"

**Solutions:**
1. **Check link format** - Must start with `/` for internal pages
2. **Verify page exists** - Try visiting the link directly
3. **Check for typos** - `/prodcuts` vs `/products`
4. **Use correct collection handle** - Must match Shopify collection
5. **Ensure no extra spaces** - Trim whitespace from links

### Issue: "Menu item disappeared after saving"

**Cause:** Link was invalid or name was blank

**Solution:**
1. Add item again with valid name and link
2. Ensure both fields are filled before saving

### Issue: "Menu order changed unexpectedly"

**Cause:** Forgot to drag item to correct position before saving

**Solution:**
1. Re-edit menu
2. Drag items to desired order
3. Save menu

### Issue: "External link not working"

**Solutions:**
1. **Add `https://`** - External links must include protocol
2. **Test URL** - Open link in browser to verify it works
3. **Check for typos** - Verify domain spelling

### Issue: "Mobile menu doesn't close after clicking"

**This is a bug** - Contact developer. Menu should auto-close.

---

## Menu Best Practices

### Naming Menu Items

✅ **DO:**
- Use clear, concise labels ("Gallery" not "See Our Work")
- Keep under 15 characters
- Use title case ("Contact Us" not "CONTACT US")
- Be consistent across menu items

❌ **DON'T:**
- Use all caps (bad for accessibility)
- Use vague labels ("Stuff")
- Use special characters (@, #, $)
- Use overly long names

### Organizing Menu Items

✅ **Logical Order:**
1. Homepage-related items first
2. Shopping/products
3. About/informational pages
4. Contact last

❌ **Random Order:** Confuses visitors

### Number of Menu Items

- **Header:** 4-6 items (ideal)
- **Footer:** 6-10 items (can be more)
- **Too many?** Consider dropdown menus (requires developer)

### Accessibility

✅ **Screen Reader Friendly:**
- Use descriptive names ("Contact" not "Click here")
- Avoid emojis in menu labels
- Test with keyboard navigation (Tab key)

---

## Examples

### Example 1: Simple Header Menu

```
Home → /
Gallery → /gallery
Shop → /products
About → /about
Contact → /contact
```

### Example 2: Shop-Focused Header Menu

```
Home → /
Earrings → /products/earrings
Resin Art → /products/resin
Driftwood → /products/driftwood
Gallery → /gallery
Contact → /contact
```

### Example 3: Footer Menu with Policies

```
About Us → /about
Gallery → /gallery
Contact → /contact
---
Privacy Policy → /policies/privacy
Shipping & Returns → /policies/shipping
Terms of Service → /policies/terms
```

---

## Next Steps

After updating menus:
1. ✅ Test all links on desktop and mobile
2. ✅ Verify menu appears correctly
3. ✅ Check that webhook revalidation worked
4. ✅ Monitor Google Analytics for any 404 errors

---

## Additional Resources

- **Shopify Navigation Docs**: https://help.shopify.com/en/manual/online-store/menus-and-links
- **Your Website**: https://fernfogcreations.com
- **Need Help?**: Contact your developer or Shopify Support

---

**Last updated:** January 2025
**Version:** 1.0
