# CMS Strategy Recommendation for Fern & Fog Creations

**Date:** November 16, 2025
**Decision:** Builder.io + Shopify Hybrid Approach
**Status:** Recommended for Implementation

---

## Executive Summary

After analyzing the feasibility of making the entire website editable via Builder.io versus using Shopify as the primary CMS, we recommend an **Enhanced Hybrid Strategy** that uses both platforms strategically:

- **Builder.io** for visual marketing content (homepage, landing pages)
- **Shopify** for structured operational content (gallery, policies, products)

This approach balances business user experience, technical maintainability, and cost-effectiveness.

---

## Strategic Decision

### ✅ Recommended: Enhanced Hybrid Approach

**Content Distribution Strategy:**

| Content Type | Platform | Rationale |
|--------------|----------|-----------|
| **Homepage** | Builder.io | Visual editing, seasonal updates, marketing flexibility |
| **Landing Pages** | Builder.io | Campaigns, promotions, A/B testing capability |
| **About Page** | Builder.io | Brand storytelling, visual design control |
| **Gallery Items** | Shopify Metaobjects | Structured data, form-based editing acceptable |
| **Policy Pages** | Shopify Legal API | Built-in support, compliance-focused, rarely changes |
| **Navigation Menus** | Shopify Menu API | Familiar interface, infrequent updates |
| **Products** | Shopify | Already implemented, core e-commerce |
| **Blog** (if needed) | Shopify Blog | Native feature, adequate for basic content marketing |

---

## Why This Beats the Alternatives

### vs. Full Builder.io Migration

**Hybrid Advantages:**
- ✅ **50% lower development cost** (16-23 hrs vs 37-49 hrs)
- ✅ **Can start with $0/year** (free tier, upgrade only if needed)
- ✅ **Less vendor lock-in** (critical data stays in Shopify)
- ✅ **Better tool for job** (gallery/policies fit Shopify better)

**What You Give Up:**
- ❌ Some content split between platforms (minor inconvenience)

### vs. Full Shopify CMS Migration

**Hybrid Advantages:**
- ✅ **Visual page building** for marketing content
- ✅ **Design flexibility** for custom layouts
- ✅ **Modern CMS features** (A/B testing, scheduling, revision history)
- ✅ **Better business user experience** for creative pages

**What You Give Up:**
- ❌ Single platform simplicity (manageable with clear documentation)
- ❌ Potential Builder.io costs (but can start free)

---

## Implementation Roadmap

### Phase 1: Foundation (Months 1-2)

**Goal:** Enable self-service for operational content

**Tasks:**

1. **✅ Implement Shopify Policy Pages API** COMPLETED (November 16, 2025)
   - ✅ Created `lib/shopify/queries/policies.ts` with GraphQL queries
   - ✅ Added types to `lib/shopify/types.ts` (ShopPolicy, Policies)
   - ✅ Implemented `getPolicies()` and `getPolicy()` functions in `lib/shopify/index.ts`
   - ✅ Updated all 4 policy pages to use Shopify API (privacy, shipping, refund, terms)
   - ✅ Removed fallback content - pages now show simple "not configured" message
   - ✅ Fixed rich text rendering by installing `@tailwindcss/typography` plugin
   - **Actual Time:** ~4 hours
   - **Business Impact:** Legal teams can now update compliance docs via Shopify Admin > Settings > Policies without code deployment
   - **Next Step:** Copy current policy content from code to Shopify Admin (manual step)

2. **Implement Shopify Gallery Metaobjects** ⏱️ 10-14 hours
   - Create `gallery_item` metaobject definition in Shopify Admin
   - Define fields: title, category, image, materials, story, createdDate
   - Build GraphQL queries in `lib/shopify/queries/gallery.ts`
   - Update `app/gallery/page.tsx` to fetch from Shopify API
   - Replace `data/gallery.ts` with dynamic data
   - **Business Impact:** Add new past work without developer involvement
   - **Priority:** HIGH (frequent updates expected)

3. **Create Homepage in Builder.io** ⏱️ 2-3 hours
   - Use existing custom components (HeroBlock, CategoryGridBlock, etc.)
   - Replace hardcoded fallback in `app/page.tsx`
   - Test on Builder.io Free tier
   - **Business Impact:** Update homepage seasonally for holidays/campaigns
   - **Priority:** MEDIUM (demonstrates Builder.io value)

**Total Phase 1 Effort:** 16-23 hours
**Completed:** 4 hours (Task 1) | **Remaining:** 12-19 hours (Tasks 2-3)

**Expected Outcomes:**
- ✅ Policies: Legal updates without code deployment (COMPLETE)
- ⏳ Gallery: Business users can add items themselves (IN PROGRESS)
- ⏳ Homepage: Seasonal updates without developer (PENDING)

### Phase 2: Content Migration (Months 3-4)

**Goal:** Migrate static pages to Builder.io

**Tasks:**

4. **Create About Page in Builder.io** ⏱️ 2-3 hours
   - Migrate content from `app/about/page.tsx`
   - Use TextBlock, HeroBlock, FeatureGridBlock components
   - Remove hardcoded about page (or set up redirect)
   - **Business Impact:** Update brand story without code changes

5. **Optional: Migrate Navigation to Shopify** ⏱️ 2-3 hours
   - Use existing `getMenu()` function from `lib/shopify/index.ts`
   - Remove Builder.io navigation fallback
   - Business users edit via Shopify Admin > Navigation
   - **Business Impact:** Update nav links in familiar Shopify interface
   - **Priority:** LOW (navigation changes are infrequent)

**Total Phase 2 Effort:** 4-6 hours

### Phase 3: Evaluation & Optimization (Months 5-6)

**Goal:** Assess Builder.io usage and decide on upgrade

**Tasks:**

6. **Track Builder.io Usage Metrics**
   - Pages created: Homepage + X landing pages
   - Edit frequency: X times/month
   - Free tier limitations hit: AI generations, history, users?
   - Business user feedback: Ease of use, feature requests

7. **Make Upgrade Decision**
   - **Stay on Free Tier if:**
     - Using only homepage + 1-2 landing pages
     - Edits are infrequent (less than weekly)
     - 7-day history is sufficient
     - Single user is okay
   - **Upgrade to Pro ($99/mo) if:**
     - Creating frequent landing pages (seasonal, promotional)
     - Need A/B testing for conversion optimization
     - Want 90-day activity history
     - Multiple team members need access
     - Need advanced targeting features

### Phase 4: Scale as Needed (Months 7-12)

**Optional Enhancements:**

8. **Blog Implementation** ⏱️ 12-16 hours (only if content marketing is critical)
   - **Shopify Blog Option:**
     - Use native Shopify Blog feature
     - Fetch via Storefront API
     - Build blog pages in Next.js
     - Business users write in Shopify Admin
   - **Builder.io Blog Option:**
     - Create `blog-post` model
     - Build custom blog components
     - Visual editing for blog posts

9. **Advanced Builder.io Features** (if upgraded to Pro)
   - Set up A/B testing for homepage variants
   - Implement content scheduling for seasonal campaigns
   - Configure targeting rules (mobile vs desktop, location-based)

---

## Cost Analysis

### Year 1 Investment

**Development Costs (One-Time):**
- Phase 1 (Foundation): 16-23 hours @ $100/hr = **$1,600-$2,300**
- Phase 2 (Migration): 4-6 hours @ $100/hr = **$400-$600**
- **Total Development: $2,000-$2,900**

**Platform Costs (Recurring):**
- Shopify: $0 additional (existing plan includes Pages, Metaobjects, APIs)
- Builder.io Free Tier: **$0/year**
- Builder.io Pro (if needed): **$1,188/year** ($99/mo)

**Year 1 Total Range:**
- **Minimum (Free tier):** $2,000-$2,900 (one-time dev only)
- **Maximum (Pro upgrade Month 7):** $2,594-$3,488 (dev + 6 months Pro)

### Ongoing Annual Costs (Year 2+)

- Builder.io Free: **$0/year**
- Builder.io Pro: **$1,188/year**
- Shopify: No change to existing plan

### Cost Comparison vs Alternatives

| Approach | Year 1 | Year 2-5 | Dev Hours |
|----------|--------|----------|-----------|
| **Hybrid (Recommended)** | $2,000-$3,488 | $0-$1,188/yr | 16-29 hrs |
| **Full Builder.io** | $4,888-$6,088 | $1,188/yr | 37-49 hrs |
| **Full Shopify** | $3,100-$4,900 | $0/yr | 31-43 hrs |

**Hybrid is 30-40% cheaper in Year 1 and offers most flexibility.**

### Return on Investment

**Developer Time Savings:**
- Current state: 3-5 hours/month for content updates
- Post-implementation: 0.5-1 hour/month (reduced by 80%)
- **Monthly savings: $300-$500** @ $100/hr
- **Annual savings: $3,600-$6,000**

**ROI Calculation:**
- **Break-even point:** 4-7 months
- **3-year net savings:** $8,800-$15,100

---

## Technical Implementation Details

### Shopify Metaobjects for Gallery

**Metaobject Definition:**
```javascript
// Created in Shopify Admin > Settings > Custom data

Name: Gallery Item
Type: gallery_item

Fields:
- title (Single line text)
- category (Single line text)
- image (File)
- materials (List of single line text)
- story (Multi-line text)
- created_date (Date)
```

**GraphQL Query:**
```graphql
query GetGalleryItems {
  metaobjects(type: "gallery_item", first: 50) {
    edges {
      node {
        id
        handle
        fields {
          key
          value
          reference {
            ... on MediaImage {
              image {
                url
                altText
              }
            }
          }
        }
      }
    }
  }
}
```

**Implementation File:** `lib/shopify/queries/gallery.ts`

### Shopify Policy Pages API

**GraphQL Query:**
```graphql
query GetPolicyPages {
  shop {
    privacyPolicy {
      id
      title
      body
      url
    }
    refundPolicy {
      id
      title
      body
      url
    }
    shippingPolicy {
      id
      title
      body
      url
    }
    termsOfService {
      id
      title
      body
      url
    }
  }
}
```

**Implementation Files:**
- `lib/shopify/queries/policies.ts` (new file)
- `app/policies/[policy]/page.tsx` (update existing)

**Business User Workflow:**
1. Log into Shopify Admin
2. Go to Settings > Policies
3. Edit policy in WYSIWYG editor
4. Save (auto-publishes to website)

### Builder.io Free Tier Limitations

**What's Included:**
- ✅ 1 space (sufficient for Fern & Fog)
- ✅ 20 AI generations/month (enough for small business)
- ✅ 7-day activity history (acceptable for most use cases)
- ✅ Unlimited page views
- ✅ Visual editor
- ✅ Custom components (7 already built)

**What's Missing (Pro Features):**
- ❌ Multi-user collaboration (Free = 1 user only)
- ❌ 90-day activity history (Free = 7 days)
- ❌ Custom roles
- ❌ A/B testing
- ❌ Advanced targeting
- ❌ Priority support

**Recommendation:** Start free, upgrade to Pro only if limitations become blockers.

---

## Success Metrics

### 3-Month Checkpoint

**Measure these KPIs:**

1. **Business User Independence**
   - Gallery items added without developer: Target ≥5
   - Policy updates completed independently: Target ≥1
   - Homepage edits without developer: Target ≥2

2. **Cost Efficiency**
   - Builder.io tier in use: Free / Pro
   - Developer hours saved: Target ≥10 hours

3. **Content Velocity**
   - New landing pages created: Target ≥1
   - Time to create landing page: Target <30 min
   - Gallery items added: Target ≥5

### 6-Month Review

**Decision Points:**

**Upgrade to Builder.io Pro if:**
- Creating ≥2 landing pages/month
- Need A/B testing for conversion optimization
- Multiple users need editing access
- 7-day history is insufficient

**Stay on Free Tier if:**
- Homepage + 0-1 landing pages is sufficient
- Single user editor is acceptable
- Infrequent edits (less than weekly)

**Adjust Strategy if:**
- Not using Builder.io at all → Consider full Shopify approach
- Using Builder.io heavily → Consider migrating more content

---

## Risks & Mitigation

### Risk 1: Builder.io Price Increase

**Likelihood:** Medium
**Impact:** High ($1,188/year could increase)

**Mitigation:**
- Lock in annual pricing when possible
- Maintain Shopify Pages as fallback option
- Don't migrate critical operational content to Builder.io
- Keep content easily exportable

### Risk 2: Business User Learning Curve

**Likelihood:** Medium
**Impact:** Low (temporary productivity dip)

**Mitigation:**
- Create video tutorials for common tasks
- Schedule 1-hour training session
- Document step-by-step workflows
- Start with simple pages (homepage only)

### Risk 3: Platform Integration Issues

**Likelihood:** Low
**Impact:** Medium (broken pages, data sync issues)

**Mitigation:**
- Implement in staging environment first
- Comprehensive testing before production deploy
- Keep hardcoded fallbacks during transition
- Monitor error logs (Sentry)

### Risk 4: Builder.io Free Tier Limitations Hit Earlier Than Expected

**Likelihood:** Low
**Impact:** Low (just need to upgrade)

**Mitigation:**
- Monitor usage dashboard monthly
- Budget for potential Pro upgrade
- Have upgrade decision criteria ready

---

## Migration Checklist

### Pre-Implementation

- [ ] Review current content inventory
- [ ] Audit which pages need visual editing vs form-based editing
- [ ] Set up staging environment for testing
- [ ] Create backups of current data files (`data/gallery.ts`, etc.)
- [ ] Document current content update workflows

### Phase 1 Implementation

**Policy Pages (Task 1)** - COMPLETED ✅
- [x] Create `lib/shopify/queries/policies.ts`
- [x] Add types to `lib/shopify/types.ts`
- [x] Implement `getPolicies()` and `getPolicy()` functions
- [x] Update `app/policies/[policy]/page.tsx` files (all 4 pages)
- [x] Remove fallback content from policy pages
- [x] Install and configure `@tailwindcss/typography` for rich text rendering
- [x] Test all policy pages
- [ ] **MANUAL STEP:** Copy existing policy content to Shopify Admin > Settings > Policies

**Gallery Metaobjects (Task 2)** - IN PROGRESS ⏳
- [ ] Create Shopify metaobject definition for gallery items
- [ ] Migrate existing gallery data to Shopify metaobjects (12 items)
- [ ] Build `lib/shopify/queries/gallery.ts`
- [ ] Update `app/gallery/page.tsx` to fetch from Shopify
- [ ] Test gallery page thoroughly

**Builder.io Homepage (Task 3)** - PENDING
- [ ] Create homepage in Builder.io using existing components
- [ ] Test homepage on multiple devices

**Deployment**
- [ ] Deploy to production

### Post-Implementation

- [ ] Create documentation for business users (Shopify gallery workflow)
- [ ] Create documentation for business users (Shopify policy workflow)
- [ ] Create documentation for business users (Builder.io homepage workflow)
- [ ] Schedule training session with business users
- [ ] Monitor error logs for 1 week
- [ ] Gather business user feedback
- [ ] Set 3-month review date

---

## Decision Matrix

### When to Choose Each Platform

**Use Builder.io for content that:**
- Changes frequently (seasonal, promotional)
- Needs custom layouts
- Benefits from visual editing
- Requires A/B testing
- Is marketing-focused

**Examples:** Homepage, landing pages, about page, campaign pages

**Use Shopify for content that:**
- Is structured data
- Changes infrequently
- Is operational (not marketing)
- Is compliance-related
- Fits form-based editing

**Examples:** Gallery items, policies, navigation, products

**Keep Hardcoded for:**
- Custom functionality (product filters, variant selectors)
- Complex interactions (cart drawer, checkout flow)
- Performance-critical pages (product detail pages)

---

## Long-Term Strategic Considerations

### Year 1-2: Foundation & Optimization

**Focus:** Implement hybrid approach, optimize workflows, measure ROI

**Expected State:**
- Gallery self-service operational
- Policies self-service operational
- Homepage seasonal updates happening
- 0-3 landing pages created
- Builder.io tier decision made

### Year 2-3: Content Marketing Expansion

**Potential Growth:**
- Add blog if content marketing becomes priority
- Create seasonal campaign landing pages (4-6/year)
- Implement A/B testing for conversion optimization
- Expand gallery to 50+ items

**Platform Evolution:**
- Likely need Builder.io Pro ($99/mo)
- Consider Shopify plan upgrade if hitting limits
- Potentially add email marketing integration

### Year 3-5: Scale & Sophistication

**Advanced Possibilities:**
- Headless CMS for multi-channel (web + mobile app)
- Advanced personalization (location-based, returning visitor)
- Multi-language support
- International expansion

**Technology Reassessment:**
- Re-evaluate CMS needs based on growth
- Consider enterprise solutions if scaling significantly
- Maintain flexibility to migrate if better options emerge

### Exit Strategy

**If Needing to Migrate Away:**

**From Builder.io:**
- Export all content via Builder.io API
- Rebuild pages using exported JSON
- Transition to alternative (Contentful, Sanity, Shopify Pages)
- **Effort:** 40-60 hours

**From Shopify:**
- Much larger undertaking (entire platform)
- Export products, customers, orders via API
- Migrate to alternative commerce platform
- **Effort:** 200+ hours
- **Recommendation:** Avoid unless absolutely necessary

---

## Approval & Next Steps

### Recommended Action

**Approve and proceed with Enhanced Hybrid Approach**

**Immediate Next Steps:**

1. **Kickoff Meeting** (Week 1)
   - Review this strategy document
   - Confirm priorities and timeline
   - Assign development resources

2. **Phase 1 Development** (Weeks 2-4)
   - Implement Shopify gallery metaobjects (10-14 hours)
   - Implement Shopify policy pages (4-6 hours)
   - Create homepage in Builder.io free tier (2-3 hours)
   - Total: 16-23 hours over 3 weeks

3. **Testing & Training** (Week 5)
   - User acceptance testing
   - Business user training session
   - Documentation review

4. **Production Deployment** (Week 6)
   - Deploy to production
   - Monitor for issues
   - Gather initial feedback

5. **90-Day Review** (Week 18)
   - Review success metrics
   - Assess Builder.io tier needs
   - Plan Phase 2 if applicable

---

## Implementation Log

### November 16, 2025 - Phase 1, Task 1 COMPLETED ✅

**What Was Implemented:**

1. **Shopify Policy Pages API Integration**
   - Created `lib/shopify/queries/policies.ts` with GraphQL query for all 4 policy types
   - Added TypeScript types: `ShopPolicy`, `Policies`, `ShopifyPoliciesOperation`
   - Implemented `getPolicies()` and `getPolicy(type)` functions with caching
   - Updated all 4 policy pages to fetch from Shopify dynamically:
     - `/app/policies/privacy/page.tsx`
     - `/app/policies/shipping/page.tsx`
     - `/app/policies/returns/page.tsx`
     - `/app/policies/terms/page.tsx`

2. **Fallback Content Removal**
   - Removed 80-140 lines of hardcoded fallback content per policy page
   - Replaced with simple "Policy Not Configured" message
   - Cleaner UI: centered message box with instructions to configure in Shopify Admin

3. **Typography Plugin Fix**
   - Identified root cause: `@tailwindcss/typography` plugin was not installed
   - Installed `@tailwindcss/typography@0.5.19`
   - Configured plugin in `app/globals.css` with `@plugin` directive (Tailwind v4 syntax)
   - Verified font weights loaded in `app/layout.tsx` (Cormorant: 400, 500, 600, 700)
   - **Result:** Rich text from Shopify (bold, italic, lists, headings) now renders correctly

**How It Works:**
- Policy pages call `getPolicy('privacy' | 'shipping' | 'refund' | 'terms')`
- If Shopify has policy configured, renders HTML with `dangerouslySetInnerHTML`
- If not configured, shows helpful message with Shopify Admin instructions
- Uses `prose prose-lg` classes for beautiful typography styling
- Cached with Next.js 16's `'use cache'` directive for performance

**Business Impact:**
- ✅ Legal/compliance teams can now update all 4 policies via Shopify Admin > Settings > Policies
- ✅ No code changes or deployments required for policy updates
- ✅ Rich text formatting (bold, lists, headings) works correctly
- ✅ Clean, professional appearance for unconfigured policies

**Manual Step Required:**
- [ ] Copy current policy content from old fallback code to Shopify Admin (one-time migration)

**Actual Time:** ~4 hours (on target with estimate)

---

## Conclusion

The Enhanced Hybrid Approach provides the optimal balance of:
- ✅ **User Experience** - Visual editing where it matters, forms where they're fine
- ✅ **Cost Efficiency** - Start at $0/year, scale only if needed
- ✅ **Technical Quality** - Maintain modern Next.js architecture
- ✅ **Business Agility** - Enable self-service content updates
- ✅ **Future Flexibility** - Easy to adjust strategy based on actual usage

**This is not an all-or-nothing decision.** The hybrid approach allows you to:
- Start small (just homepage in Builder.io)
- Test real-world usage
- Scale up or down based on actual needs
- Maintain optionality for the future

**Recommendation:** Approve and proceed with Phase 1 implementation.

---

**Document Prepared By:** Development Team
**Date:** November 16, 2025
**Status:** Phase 1 In Progress (Task 1/3 Complete)
**Estimated Timeline:** 4-5 weeks remaining to full Phase 1 implementation
**Total Investment:** $2,000-$2,900 (Year 1)
**Completed Investment:** ~$400 (Task 1: 4 hours @ $100/hr)
