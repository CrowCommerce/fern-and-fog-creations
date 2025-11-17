# Gallery Management Guide

**For Business Users**
**Last Updated:** November 16, 2025

---

## Overview

The Gallery section of your Fern & Fog Creations website showcases past handmade creations that have found their homes. This guide will help you manage gallery items directly through your Shopify Admin, without needing developer assistance.

**What You Can Do:**
- Add new gallery items to showcase your work
- Edit existing items (update photos, descriptions, materials)
- Delete items that are no longer relevant
- Organize items by category for easy browsing

**No Code Required!** All changes are made through Shopify's easy-to-use Admin interface.

---

## Accessing Gallery Management

1. Log into your Shopify Admin at: `https://your-store.myshopify.com/admin`
2. In the left sidebar, click **Content**
3. Click **Metaobjects**
4. Find and click **Gallery Items**

You'll see a list of all your gallery items. From here, you can add new items, edit existing ones, or delete them.

---

## Adding a New Gallery Item

### Step 1: Create New Entry

1. From the Gallery Items page, click **Add entry** (top right)
2. You'll see a form with several fields to fill out

### Step 2: Fill Out the Form

**Title** (Required)
- The display name for the piece
- Example: "Ocean Waves Resin Pendant"
- This appears as the heading on the website

**Category** (Required)
Choose one category:
- **Earrings** - Sea glass, wire-wrapped, or other earring designs
- **Resin** - Pressed flowers, botanical resin art, pendants
- **Driftwood** - Carved driftwood, signs, natural wood art
- **Wall Hangings** - Woven pieces, tapestries, mounted art

**Image** (Required)
- Click **Add file** to upload your photo
- See Image Guidelines below for best results

**Materials** (Optional)
- List the materials used, separated by commas
- Example: `Sea glass, Copper wire, Vintage beads`
- These appear as bullet points on the website

**Story** (Optional)
- Share the backstory or inspiration for the piece
- Keep it personal and authentic
- Example: "Created from glass found on a foggy morning at Cannon Beach..."
- This appears in italics below the title

**Created Date** (Optional)
- When was the piece made?
- Format: YYYY-MM-DD (e.g., `2024-03-15`)
- Used for organizing items chronologically

**Legacy ID** (Optional)
- Automatically filled by migration script
- Leave blank when creating new items
- Used for internal tracking only

### Step 3: Save

1. Click **Save** (top right)
2. The item will appear on your website immediately (after cache refresh)
3. View it at: `your-website.com/gallery`

---

## Editing an Existing Gallery Item

1. Go to **Content → Metaobjects → Gallery Items**
2. Find the item you want to edit in the list
3. Click on the item title to open it
4. Make your changes in the form
5. Click **Save** (top right)

**Changes appear immediately** on your website (within ~1 minute).

---

## Deleting a Gallery Item

1. Go to **Content → Metaobjects → Gallery Items**
2. Find the item you want to delete
3. Click on the item to open it
4. Click the **Delete** button (usually bottom right or in options menu)
5. Confirm the deletion

**Warning:** Deletions are permanent and cannot be undone. The item will be removed from your website immediately.

---

## Image Guidelines

### Recommended Specifications

- **Format:** JPG or PNG
- **Size:** 1200x1200 pixels (square format works best)
- **File Size:** Under 2 MB for fast loading
- **Aspect Ratio:** 1:1 (square) preferred
- **Quality:** High resolution for clarity

### Tips for Great Photos

**Lighting**
- Use natural light when possible
- Avoid harsh shadows
- Soft, diffused light shows detail best

**Background**
- Clean, neutral backgrounds work best
- White, light gray, or wooden surfaces
- Avoid busy or distracting backgrounds

**Composition**
- Center the piece in the frame
- Fill most of the frame with your creation
- Shoot from directly above for flat items

**Editing**
- Crop to square (1:1 ratio)
- Adjust brightness if needed
- Keep colors natural and true-to-life

### Image Optimization

**Before Uploading:**
1. Resize to 1200x1200 pixels
2. Compress to reduce file size (use tools like TinyPNG.com)
3. Check that details are clear and sharp

---

## Managing Categories

Gallery categories are now fully editable through Shopify Admin - no developer needed!

### Accessing Categories

1. Log into your Shopify Admin
2. Go to **Content → Metaobjects**
3. Click **Gallery Categories**

You'll see a list of all available categories (Earrings, Resin, Driftwood, Wall Hangings).

### Adding a New Category

**Step 1: Create New Category**
1. From the Gallery Categories page, click **Add entry**
2. Fill out the category form

**Step 2: Fill Out Category Fields**

**Name** (Required)
- Display name for the category
- Example: "Sea Glass Jewelry"

**Slug** (Required)
- URL-friendly identifier (lowercase, no spaces)
- Example: "sea-glass-jewelry"
- Must be unique across all categories

**Description** (Optional)
- Brief description of what this category includes
- Example: "Handcrafted jewelry made from natural sea glass found along the Oregon coast"

**Sort Order** (Optional)
- Number determining display order (1 = first)
- Leave blank to add at the end

**Icon** (Optional)
- Emoji to represent the category
- Example: 💎, 🌸, 🪵, 🧵

**Step 3: Save**
1. Click **Save**
2. New category appears immediately in the gallery filter dropdown

### Editing an Existing Category

1. Go to **Content → Metaobjects → Gallery Categories**
2. Click on the category you want to edit
3. Update any fields (name, description, sort order, icon)
4. Click **Save**
5. Changes appear immediately on the website

**Note:** Editing a category name or icon updates it for all gallery items using that category.

### Deleting a Category

⚠️ **Warning:** You cannot delete a category that's currently in use by gallery items.

**To delete a category:**
1. First, reassign all gallery items to a different category
2. Go to **Content → Metaobjects → Gallery Categories**
3. Click on the category
4. Click **Delete** (bottom right)
5. Confirm deletion

### Reordering Categories

Categories appear in the filter dropdown based on **Sort Order**:

1. Edit each category
2. Set Sort Order number (1 = first, 2 = second, etc.)
3. Save each category
4. Filter dropdown automatically reorders

**Example Sort Order:**
- Earrings: Sort Order = 1
- Resin: Sort Order = 2
- Driftwood: Sort Order = 3
- Wall Hangings: Sort Order = 4

---

## Category Definitions (Current)

### Earrings
Sea glass earrings, wire-wrapped designs, handmade jewelry for ears. Includes dangle earrings, studs, and drops.

### Resin
Pressed flowers preserved in resin, botanical art, pendants, coasters, decorative pieces. Includes jewelry and home décor made with epoxy resin.

### Driftwood
Carved driftwood signs, natural wood art, sculptures. Includes welcome signs, wall art, and decorative pieces featuring found wood.

### Wall Hangings
Woven tapestries, macramé, fiber art, textile wall décor. Includes any piece designed to be mounted on a wall.

---

## Best Practices

### Writing Stories

**Do:**
- ✅ Be personal and authentic
- ✅ Share the inspiration or moment
- ✅ Keep it brief (1-3 sentences)
- ✅ Use emotional, evocative language

**Don't:**
- ❌ Write long paragraphs
- ❌ Include pricing or sales information
- ❌ Use generic descriptions
- ❌ Forget to proofread

**Examples:**

**Good:**
"Found during a misty morning walk at Cannon Beach. The frosted aqua glass seemed to glow with its own light."

**Not as Good:**
"This is a pair of earrings made from sea glass. I made them last year."

### Material Lists

**Do:**
- ✅ List most prominent materials first
- ✅ Be specific ("Copper wire" not just "Wire")
- ✅ Use commas to separate items
- ✅ Capitalize proper material names

**Example:**
`Sea glass, Copper wire, Vintage brass beads, Sterling silver hooks`

### Titles

**Do:**
- ✅ Be descriptive and evocative
- ✅ Include key materials or theme
- ✅ Keep under 60 characters
- ✅ Use title case

**Examples:**
- "Ocean Whispers Resin Pendant"
- "Storm-Weathered Driftwood Sign"
- "Seafoam Sea Glass Earrings"

---

## Troubleshooting

### My changes aren't showing up on the website

**Solution:**
- Wait 1-2 minutes for cache to refresh
- Hard refresh the page (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows)
- Clear your browser cache

### My image looks blurry or pixelated

**Solution:**
- Upload a higher resolution image (at least 1200x1200px)
- Make sure the image isn't over-compressed
- Check that you're uploading the original, not a screenshot

### I can't find the Gallery Items section

**Solution:**
- Make sure you're in **Content → Metaobjects** (not Products or Collections)
- If you don't see "Gallery Items", contact your developer - the metaobject definition may need to be created

### I accidentally deleted an item

**Solution:**
- Deletions are permanent and cannot be undone through the Admin
- You may need to re-create the item manually
- If you have a backup, contact your developer for assistance

### The category filter isn't working

**Solution:**
- Make sure you selected a category when creating the gallery item
- Verify the category exists in **Content → Metaobjects → Gallery Categories**
- Check that the category has a valid slug (lowercase, no spaces)
- Try hard refreshing the page (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows)

### I can't find the Gallery Categories section

**Solution:**
- Make sure you're in **Content → Metaobjects** (not Products or Collections)
- Look for "Gallery Category" (singular) in the metaobjects list
- If you don't see "Gallery Category", contact your developer - the category system may need to be set up

### A category doesn't appear in the filter dropdown

**Solution:**
- Make sure at least one gallery item is using that category
- Only categories with gallery items are shown in the filter dropdown
- Create a gallery item with that category to make it appear

### I can't delete a category

**Solution:**
- You cannot delete a category that's currently in use by gallery items
- First, edit all gallery items using that category and change them to a different category
- Then try deleting the category again
- If still having issues, contact your developer

### Category icon not showing

**Solution:**
- Icons must be emoji characters (💎, 🌸, 🪵, etc.)
- Copy the emoji from a website like emojipedia.com
- Paste directly into the Icon field
- Save the category and refresh the gallery page

---

## Workflow Examples

### Adding a New Piece You Just Finished

1. Take photos with good lighting (natural light, plain background)
2. Edit and crop to square (1200x1200px)
3. Log into Shopify Admin
4. Go to Content → Metaobjects → Gallery Items
5. Click "Add entry"
6. Fill in:
   - Title: "Sunset Beach Sea Glass Earrings"
   - Category: earrings
   - Upload your photo
   - Materials: `Pink sea glass, Rose gold wire, Pearl accents`
   - Story: "The rare pink glass was found during a golden hour walk. Each piece glowed like captured sunset."
   - Created Date: Today's date (2024-11-16)
7. Click Save
8. View on website to confirm it looks good

### Updating an Old Item's Photo

1. Take new, better photo
2. Edit and optimize
3. Go to Content → Metaobjects → Gallery Items
4. Find and click the old item
5. In the Image field, click "Change"
6. Upload new photo
7. Click Save
8. Check website to see updated image

### Seasonal Gallery Refresh

**Every 6 months:**
1. Review all gallery items
2. Delete items that no longer represent your current work
3. Add 3-5 new recent pieces
4. Update stories if needed
5. Ensure photos are high quality

---

## Need Help?

**For technical issues:**
- Contact your web developer
- Reference this documentation
- Provide screenshots if possible

**For Shopify Admin questions:**
- Visit Shopify Help Center: https://help.shopify.com
- Use Shopify's 24/7 support chat

---

**Document Version:** 1.0
**Created:** November 16, 2025
**Next Review:** May 2026
