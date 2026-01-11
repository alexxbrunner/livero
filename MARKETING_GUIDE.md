# 📊 Complete Analytics & Ads Setup Guide

Your Livaro platform now has **dual tracking** for maximum marketing effectiveness:
- **Google Analytics 4**: Deep insights and behavior analysis
- **Facebook Pixel**: Ad campaign optimization and retargeting

## 🚀 Quick Setup (5 Minutes)

### 1. Get Your IDs

#### Google Analytics
1. Go to https://analytics.google.com/
2. Create GA4 Property → Get Measurement ID (`G-XXXXXXXXXX`)

#### Facebook Pixel
1. Go to https://business.facebook.com/events_manager
2. Create Pixel → Get Pixel ID (`123456789012345`)

### 2. Add to `.env.local`

```bash
# Google Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Facebook Pixel
NEXT_PUBLIC_FB_PIXEL_ID=123456789012345
```

### 3. Restart & Verify

```bash
npm run dev
```

**Verification Checklist:**
- ✅ `window.gtag` exists (Google Analytics)
- ✅ `window.fbq` exists (Facebook Pixel)
- ✅ Green checkmark in Facebook Pixel Helper
- ✅ Activity in GA4 Realtime reports
- ✅ Events in Facebook Test Events

## 📊 What's Being Tracked

### Automatically Tracked Events

| Event | Google Analytics | Facebook Pixel | Purpose |
|-------|-----------------|----------------|---------|
| **Page Views** | ✅ | ✅ | Traffic analysis |
| **Product Views** | ✅ | ✅ | Interest tracking |
| **Add to Favorites** | ✅ | ✅ | High-intent users |
| **Search** | ✅ | ✅ | Product discovery |
| **User Registration** | ✅ | ✅ | New signups |
| **Newsletter Signup** | ✅ | ✅ | Lead generation |
| **Store Views** | ✅ | ✅ | Store interest |
| **Category Views** | ✅ | ✅ | Category popularity |

### Store Owner Events

| Event | Tracked | Use Case |
|-------|---------|----------|
| Store Onboarding | ✅ | Conversion funnel |
| Product Sync | ✅ | Platform usage |
| Price Updates | ✅ | Activity monitoring |
| Team Invites | ✅ | Collaboration |

## 🎯 Marketing Strategy Guide

### Phase 1: Data Collection (Week 1-2)

**Goal**: Gather baseline data

1. **Let Both Pixels Collect Data**
   - Don't run ads yet
   - Monitor GA4 + Facebook Events Manager
   - Identify popular products/categories

2. **Set Up Custom Events**
   - Add tracking to key pages
   - Test events are firing correctly

3. **Analyze Traffic Sources**
   - Organic search
   - Social media
   - Direct traffic
   - Referrals

### Phase 2: Audience Building (Week 3-4)

**Goal**: Create retargeting audiences

#### Google Analytics Audiences
1. Go to GA4 → **Audiences**
2. Create audiences:
   - Product viewers (last 30 days)
   - High-engagement users (3+ pages)
   - Cart abandoners
   - Store visitors

3. Link to Google Ads for remarketing

#### Facebook Custom Audiences
1. Go to Facebook Ads Manager → **Audiences**
2. Create audiences:
   - **Warm**: Viewed content (last 30 days)
   - **Hot**: Added to wishlist (last 14 days)
   - **Store Owners**: Viewed store onboarding
   - **Newsletter**: Lead events

3. Create lookalike audiences (1%, 3%, 5%)

### Phase 3: Ad Campaigns (Week 5+)

**Goal**: Drive conversions

#### Campaign Structure

```
Campaign 1: Customer Acquisition
├── Ad Set 1: Cold Traffic (Lookalike 1%)
│   ├── Ad: Carousel of products
│   └── Optimize for: ViewContent
├── Ad Set 2: Retargeting (Product Viewers)
│   ├── Ad: Dynamic Product Ads
│   └── Optimize for: AddToWishlist
└── Ad Set 3: High Intent (Wishlist)
    ├── Ad: Special offer
    └── Optimize for: Purchase

Campaign 2: Store Recruitment
├── Ad Set 1: Store Owners (Interest targeting)
│   ├── Ad: Platform benefits
│   └── Optimize for: CompleteRegistration
└── Ad Set 2: Leads (Engagement)
    ├── Ad: Lead form
    └── Optimize for: Lead
```

## 💰 Budget Allocation

### Starting Budget: €100/month

| Campaign | Budget | Expected Results |
|----------|--------|------------------|
| **Brand Awareness** | €30 | 10,000+ impressions |
| **Retargeting** | €40 | 100-200 clicks |
| **Conversions** | €30 | 10-20 leads |

### Scaling Budget: €500/month

| Campaign | Budget | Expected Results |
|----------|--------|------------------|
| **Cold Traffic** | €150 | 50,000+ impressions |
| **Retargeting** | €200 | 500-1000 clicks |
| **Conversions** | €150 | 50-100 leads |

## 📈 Key Metrics to Monitor

### Google Analytics Dashboard

**Traffic Metrics:**
- Sessions
- Users
- Bounce Rate (<60% is good)
- Avg. Session Duration (>2 min is good)

**Engagement:**
- Pages/Session (3+ is good)
- Product Views
- Category Views

**Conversions:**
- Registration Rate
- Newsletter Signups
- Store Signups

### Facebook Ads Manager

**Campaign Health:**
- **CPM**: €5-15 (Cost per 1000 impressions)
- **CTR**: 1-2% (Click-through rate)
- **CPC**: €0.50-2.00 (Cost per click)
- **CVR**: 2-5% (Conversion rate)

**Quality Metrics:**
- Relevance Score: 7+ (out of 10)
- Frequency: <3 (ad shown to same person)
- Match Rate: >30% for Conversions API

## 🎨 Ad Creative Best Practices

### Image Ads
- **Size**: 1200x628px (Facebook/Instagram Feed)
- **Text**: <20% of image
- **Message**: Clear value proposition
- **CTA**: Strong action (Shop Now, Learn More)

### Video Ads
- **Length**: 15-30 seconds
- **Hook**: First 3 seconds are critical
- **Captions**: 85% watch without sound
- **Format**: Square (1:1) or vertical (4:5)

### Carousel Ads
- **Images**: 3-5 products
- **Consistency**: Similar style across cards
- **Order**: Best-performing first
- **CTA**: Same on all cards

## 🔄 Testing & Optimization

### A/B Testing Checklist

Test one element at a time:
- ✅ Headlines
- ✅ Images/Videos
- ✅ CTA buttons
- ✅ Target audiences
- ✅ Ad placements

### Weekly Optimization Tasks

**Monday**: Review weekend performance
- Pause underperforming ads (CTR <0.5%)
- Increase budget on winners (+20%)

**Wednesday**: Mid-week check
- Monitor frequency (should be <3)
- Check for ad fatigue
- Test new creative

**Friday**: Week wrap-up
- Analyze best performers
- Plan next week's tests
- Update audience insights

## 🛡️ Privacy & Compliance

### GDPR Requirements

1. **Cookie Consent Banner**
   - Show before loading pixels
   - Allow opt-out
   - Store consent choice

2. **Privacy Policy**
   - Mention Google Analytics
   - Mention Facebook Pixel
   - Explain data usage
   - Provide opt-out links

3. **Data Deletion**
   - Honor deletion requests
   - Remove from both platforms
   - Document the process

### iOS 14.5+ Tracking

**Challenge**: Apple's ATT limits tracking

**Solutions**:
1. **Conversions API** (server-side tracking)
2. **Domain Verification** in Facebook
3. **Aggregated Events** (8 events limit)
4. **First-party data** collection

## 📚 Advanced Features

### Google Analytics 4

**Custom Dimensions:**
```typescript
gtag('event', 'purchase', {
  city: 'Vienna',
  store_type: 'furniture',
  user_tier: 'premium'
});
```

**Enhanced E-commerce:**
```typescript
gtag('event', 'add_to_cart', {
  items: [{
    item_id: 'prod_123',
    item_name: 'Luxury Sofa',
    item_category: 'Furniture',
    price: 1299.99,
    quantity: 1
  }]
});
```

### Facebook Conversions API

**Server-side tracking for better match rates:**

```typescript
// backend/src/services/facebook.ts
await trackServerEvent('Purchase', {
  email: user.email,
  phone: user.phone,
  ip: req.ip,
  userAgent: req.headers['user-agent'],
  fbp: cookies.fbp,
  fbc: cookies.fbc
}, {
  value: 99.99,
  currency: 'EUR'
});
```

## 🎓 Learning Resources

### Google Analytics
- [GA4 Academy](https://analytics.google.com/analytics/academy/)
- [GA4 Reports Guide](https://support.google.com/analytics/answer/9212670)
- [Event Reference](https://developers.google.com/analytics/devguides/collection/ga4/reference/events)

### Facebook Ads
- [Facebook Blueprint](https://www.facebook.com/business/learn) - Free courses
- [Pixel Setup Guide](https://www.facebook.com/business/help/952192354843755)
- [Dynamic Ads](https://www.facebook.com/business/help/397103717129942)

## 🚨 Common Issues & Fixes

### Issue: Pixels Not Loading

**Check:**
```bash
# Environment variables
echo $NEXT_PUBLIC_GA_MEASUREMENT_ID
echo $NEXT_PUBLIC_FB_PIXEL_ID

# Restart if needed
npm run dev
```

### Issue: Events Not Tracking

**GA4:**
- Check browser console for errors
- Use GA4 Debugger extension
- Wait 24-48h for reports

**Facebook:**
- Install Pixel Helper
- Check Test Events tool
- Disable ad blockers

### Issue: Low Conversion Rates

**Optimize:**
- Better ad creative
- Clearer CTA
- Mobile optimization
- Landing page speed
- Simpler forms

## 🎯 Success Metrics by Goal

### Goal: Increase Product Sales
- **Primary**: Conversion Rate (CR)
- **Secondary**: Add to Wishlist rate
- **Tertiary**: Average Order Value (AOV)

### Goal: Recruit Stores
- **Primary**: Registration completions
- **Secondary**: Onboarding completion rate
- **Tertiary**: Cost per acquisition (CPA)

### Goal: Grow Newsletter
- **Primary**: Lead events
- **Secondary**: Email CTR
- **Tertiary**: Subscription growth rate

## 🎉 Your Marketing Stack is Complete!

You now have:
- ✅ **Dual tracking** (GA4 + Facebook)
- ✅ **E-commerce events** for product insights
- ✅ **User journey** tracking
- ✅ **Ad campaign** optimization tools
- ✅ **Retargeting audiences** ready
- ✅ **Conversion funnel** visibility

**Ready to grow Livaro! 🚀**

---

## Quick Reference

**Documentation:**
- `ANALYTICS_SETUP.md` - Google Analytics quick start
- `FACEBOOK_PIXEL_SETUP.md` - Facebook Pixel quick start
- `docs/GOOGLE_ANALYTICS.md` - GA4 detailed guide
- `docs/FACEBOOK_PIXEL.md` - Pixel detailed guide

**Support:**
- Google Analytics: https://support.google.com/analytics
- Facebook Business: https://www.facebook.com/business/help

