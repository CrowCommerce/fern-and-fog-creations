# Gallery Category Migration Fix

**Date:** November 16, 2025
**Issue:** Migration script failed at Step 3, gallery page displayed blank

---

## Problem Summary

### Initial Migration Error

When running `pnpm migrate:gallery:categories`, the script failed at Step 3 with this error:

```
Variable $definition of type MetaobjectDefinitionUpdateInput! was provided invalid value for fieldDefinitions.0.key (Field is not defined on MetaobjectFieldDefinitionOperationInput)
```

### Root Causes

1. **Incorrect GraphQL Mutation Syntax**
   - The script tried to use `update` operation to change field type
   - Shopify doesn't allow changing a field's type via update
   - Must use `delete` + `create` operations instead

2. **Gallery Page Blank**
   - Gallery items still had text-based categories ("earrings", "resin", etc.)
   - Code expected category metaobject references with nested fields
   - `reshapeGalleryItem()` returned `null` for all items because category wasn't a reference
   - Result: No items displayed on `/gallery` page

---

## What Was Fixed

### 1. Migration Script (`scripts/migrate-gallery-categories.ts`)

**Function:** `updateGalleryItemDefinition()`

**Before (Incorrect):**
```typescript
definition: {
  fieldDefinitions: [
    {
      key: 'category',
      name: 'Category',
      type: 'metaobject_reference',  // ❌ Can't change type via update
      required: true,
      validations: [...]
    }
  ]
}
```

**After (Correct):**
```typescript
definition: {
  fieldDefinitions: [
    // Step 1: Delete old text-based field
    {
      delete: {
        key: 'category'
      }
    },
    // Step 2: Create new metaobject_reference field
    {
      create: {
        key: 'category',
        name: 'Category',
        type: 'metaobject_reference',
        required: true,
        validations: [
          {
            name: 'metaobject_definition_id',
            value: categoryDefinitionId
          }
        ]
      }
    }
  ]
}
```

### 2. Gallery Reshaping Function (`lib/shopify/index.ts`)

**Function:** `reshapeGalleryItem()`

**Added backward compatibility** to handle both:
- **Text-based categories** (legacy) - e.g., "earrings", "resin"
- **Metaobject references** (new) - full category objects with id, name, slug, etc.

**How It Works:**
1. Try to extract category metaobject reference first
2. If found, build category object from reference fields
3. If not found (legacy text), map text value to category object using hardcoded map
4. Gallery displays properly in both states

**Legacy Category Mapping:**
```typescript
const categoryMap = {
  'earrings': { name: 'Earrings', icon: '💎', sortOrder: 1 },
  'resin': { name: 'Resin', icon: '🌸', sortOrder: 2 },
  'driftwood': { name: 'Driftwood', icon: '🪵', sortOrder: 3 },
  'wall-hangings': { name: 'Wall Hangings', icon: '🧵', sortOrder: 4 },
};
```

---

## Updated Migration Steps

### Before Migration

**✅ Your gallery should now be displaying again** thanks to the backward compatibility fix.

### Running the Migration (Updated)

```bash
# 1. Optional: Test with dry-run first
pnpm migrate:gallery:categories:dry

# 2. Run the migration
pnpm migrate:gallery:categories
```

### What the Migration Does (Step by Step)

**Step 1: Create Category Definition** ✅ Already completed
- Creates `gallery_category` metaobject type

**Step 2: Create Category Metaobjects** ✅ Already completed
- Creates 4 default categories: Earrings, Resin, Driftwood, Wall Hangings

**Step 3: Update Gallery Item Definition** ⚠️ Previously failed, now fixed
- Deletes old text-based `category` field
- Creates new `metaobject_reference` `category` field
- **Note:** This temporarily nulls out category values

**Step 4: Update Existing Gallery Items** 🔄 Ready to run
- Finds all gallery items
- Maps text categories to category metaobject IDs
- Updates each item with category reference

### After Migration

Once migration completes successfully:

1. ✅ Gallery displays with category filters (already working)
2. ✅ Categories show icons in filter chips
3. ✅ Users can add/edit categories via Shopify Admin
4. ✅ No code changes needed for category management

---

## Verification Steps

### 1. Check Gallery Display

Visit `http://localhost:3000/gallery` (or your production URL):
- ✅ Should see gallery items displayed
- ✅ Should see category filter chips at top
- ✅ Should see icons in filter chips (💎 🌸 🪵 🧵)
- ✅ Clicking filters should show/hide items

### 2. Check Shopify Admin

**Gallery Categories:**
1. Go to **Content → Metaobjects → Gallery Categories**
2. Should see 4 categories: Earrings, Resin, Driftwood, Wall Hangings
3. Each should have name, slug, description, sort order, icon

**Gallery Items:**
1. Go to **Content → Metaobjects → Gallery Items**
2. Click any gallery item
3. Category field should be a **dropdown** with category options (after migration)
4. Before migration: Category field is **text input** (legacy)

### 3. Check Migration Logs

```bash
# Run migration and watch output
pnpm migrate:gallery:categories
```

Expected output:
```
🚀 Gallery Category Migration Script
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📡 Validating Shopify connection...
✓ Connected to Shopify Admin API

📋 Step 1/4: Creating gallery_category metaobject definition...
ℹ️  Category definition already exists, skipping creation

📂 Step 2/4: Creating category metaobjects...
ℹ️  Category "Earrings" already exists, using existing
ℹ️  Category "Resin" already exists, using existing
ℹ️  Category "Driftwood" already exists, using existing
ℹ️  Category "Wall Hangings" already exists, using existing

🔄 Step 3/4: Updating gallery_item definition...
✓ Gallery item definition updated to use category references

🔗 Step 4/4: Updating existing gallery items...
Found 12 gallery items to update

✓ Updated: first-light-sea-glass → earrings
✓ Updated: ocean-whispers-resin → resin
✓ Updated: driftwood-welcome-sign → driftwood
✓ Updated: coastal-wall-hanging → wall-hangings
... (etc)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Migration Complete!

Summary:
  • Total operations: 16
  • Successful: 16
  • Failed: 0
  • Execution time: 8.3s
```

---

## Troubleshooting

### Gallery still blank after fix

**Check browser console for errors:**
```javascript
// Open browser DevTools (F12)
// Check Console tab for errors
```

**Hard refresh the page:**
- Mac: `Cmd + Shift + R`
- Windows: `Ctrl + Shift + R`

**Check Next.js cache:**
```bash
# Delete .next folder and rebuild
rm -rf .next
pnpm dev
```

### Migration fails at Step 3 again

**Check error message:**
- If "field is required" error: Category field is set as required but items have null values
- If "invalid definition ID": Category definition ID is incorrect

**Solution:**
1. Check category definition exists: Shopify Admin → Settings → Custom data → Metaobjects
2. Verify gallery items exist before running migration
3. Try dry-run mode first: `pnpm migrate:gallery:categories:dry`

### Categories not appearing in filter dropdown

**After migration completes:**
1. Gallery items must have category references set
2. Check at least one item uses each category
3. Hard refresh the page
4. Check browser console for reshaping errors

---

## Backward Compatibility

The `reshapeGalleryItem()` function now permanently supports both:
- Text-based categories (legacy)
- Metaobject reference categories (new)

This ensures:
- ✅ Gallery displays during migration transition
- ✅ Gallery continues to work if migration fails mid-way
- ✅ No disruption to production site
- ✅ Safe rollback if needed

**Note:** Once all gallery items are migrated to metaobject references, the legacy text handling code can be removed, but it's safe to leave in place.

---

## Next Steps

1. ✅ **Gallery is now displaying** - No immediate action needed
2. 🔄 **Run migration when ready** - Use `pnpm migrate:gallery:categories`
3. ✅ **Test category filtering** - Verify filters work after migration
4. 📝 **Document for business users** - GALLERY_MANAGEMENT.md already updated

---

**Questions or Issues?**

Contact the developer or check:
- `docs/GALLERY_TECHNICAL.md` - Technical architecture
- `docs/GALLERY_MANAGEMENT.md` - Business user guide
- `scripts/migrate-gallery-categories.ts` - Migration script source
