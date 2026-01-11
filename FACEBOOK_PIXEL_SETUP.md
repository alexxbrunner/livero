# 🚀 Quick Start: Facebook Pixel Setup

## Step 1: Get Your Facebook Pixel ID

1. Go to https://business.facebook.com/events_manager
2. Click **Connect Data Sources** → **Web** → **Facebook Pixel**
3. Name your pixel (e.g., "Livaro Platform")
4. Click **Continue** → **Manually Install Code**
5. Copy your **Pixel ID** (just the number, e.g., `123456789012345`)

## Step 2: Add to Environment Variables

Create or update `.env.local`:

```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_FB_PIXEL_ID=123456789012345
```

**Important**: Replace with your actual Pixel ID!

## Step 3: Restart Development Server

```bash
# Stop your dev server (Ctrl+C)
# Then restart:
npm run dev
```

## Step 4: Verify It's Working

### Method 1: Facebook Pixel Helper (Recommended)

1. Install [Facebook Pixel Helper](https://chrome.google.com/webstore/detail/facebook-pixel-helper/fdgfkebogiimcoedlicjlajpkdmockpc) Chrome extension
2. Open your website
3. Click the extension icon
4. Should show: ✅ "Facebook Pixel Active"
5. Should see "PageView" event

### Method 2: Browser Console

1. Open your app: http://localhost:3000
2. Open DevTools → **Console**
3. Type: `window.fbq`
   - Should show: `ƒ fbq(){...}` (function)
4. Test an event: `fbq('track', 'PageView')`

### Method 3: Test Events Tool

1. Go to Facebook Events Manager
2. Click **Test Events** (left sidebar)
3. Enter your website URL
4. Visit your site
5. See events appear in real-time! 🎉

## Step 5: Deploy to Production

### For Vercel:
1. Project Settings → **Environment Variables**
2. Add: `NEXT_PUBLIC_FB_PIXEL_ID` = `123456789012345`
3. Redeploy

### For Railway/Render:
Add the same environment variable in your platform settings.

## 🎯 What's Being Tracked

Your Facebook Pixel is now automatically tracking:

### Customer Actions
- ✅ **PageView**: Every page visit
- ✅ **ViewContent**: Product views
- ✅ **AddToWishlist**: Add to favorites
- ✅ **Search**: Product searches
- ✅ **CompleteRegistration**: New signups
- ✅ **Lead**: Newsletter signups

### Store Owner Actions
- ✅ Store onboarding start/complete
- ✅ Product syncs
- ✅ Price updates
- ✅ Team invites

## 📊 View Your Data

### Real-Time Data
1. Go to Events Manager
2. Click **Test Events** or **Overview**
3. See activity as it happens

### Historical Data
1. Events Manager → **Overview**
2. View metrics, top events, devices
3. Data appears within 15-30 minutes

## 🎨 Next Steps: Create Your First Ad Campaign

### 1. Create Custom Audience
1. Go to **Audiences** in Ads Manager
2. Create audience based on your pixel events
3. Example: "People who viewed products in last 30 days"

### 2. Create Lookalike Audience
1. Audiences → **Create Lookalike**
2. Source: Your custom audience
3. Location: Austria, Germany, Slovakia
4. Size: 1% (most similar)

### 3. Launch Campaign
1. Ads Manager → **Create Campaign**
2. Objective: **Sales** or **Traffic**
3. Audience: Your lookalike
4. Budget: €20-50/day
5. Ad Creative: Show your products!

## 🔥 Pro Tips

### For E-commerce Ads
- Use **Dynamic Product Ads** (retarget viewers with exact products)
- Create product catalog in Commerce Manager
- Target "AddToWishlist" event for high-intent users

### For Store Recruitment
- Target business owners, store managers
- Optimize for "CompleteRegistration"
- Use lead forms for easy signup

### For Brand Awareness
- Target people interested in furniture, interior design
- Optimize for "ViewContent"
- Use video ads showcasing stores/products

## 📈 Optimize Your Campaigns

### Week 1-2: Learning Phase
- Facebook learns who converts
- Don't change settings too often
- Let it run with minimum budget

### Week 3+: Scale
- Increase budget by 20% every 3 days
- Create lookalike audiences of converters
- A/B test ad creatives

### Monitor These Metrics
- **CPM** (Cost per 1000 impressions): €5-15 is normal
- **CTR** (Click-through rate): 1-2% is good
- **CPC** (Cost per click): €0.50-2.00 target
- **CVR** (Conversion rate): Track registrations/leads

## 🛠 Troubleshooting

### Pixel Not Loading
```bash
# Check environment variable
echo $NEXT_PUBLIC_FB_PIXEL_ID

# Should output your pixel ID
# If empty, add to .env.local and restart
```

### Events Not Showing
1. Check Pixel Helper shows green checkmark
2. Disable ad blockers
3. Wait 15-30 minutes for Events Manager
4. Check "Test Events" for real-time data

### Low Match Rate (iOS 14.5+)
- Implement Conversions API (server-side tracking)
- Verify your domain in Business Manager
- Use aggregated event measurement

## 🎓 Learning Resources

- **Facebook Blueprint**: Free courses on Facebook ads
- **Events Manager**: Monitor pixel health
- **Pixel Helper**: Debugging tool
- **Creative Hub**: Test ad creatives

## 💰 Budget Recommendations

### Starting Out
- **Testing**: €10-20/day for 7 days
- **Scaling**: Increase by 20% if profitable
- **Minimum**: €5/day per ad set

### Per Objective
- **Traffic/Awareness**: €10-30/day
- **Conversions**: €30-100/day
- **Lead Generation**: €20-50/day

### ROI Targets
- **E-commerce**: 3-5x ROAS (Return on Ad Spend)
- **Leads**: €1-5 per lead
- **App Installs**: €2-10 per install

## 🎉 You're All Set!

Your Facebook Pixel is now:
- ✅ Installed and tracking
- ✅ Collecting valuable data
- ✅ Ready for ad campaigns
- ✅ Optimizing your marketing

**Start creating audiences and campaigns to grow your Livaro platform!**

---

**Need Help?** Check `docs/FACEBOOK_PIXEL.md` for advanced features and troubleshooting.

