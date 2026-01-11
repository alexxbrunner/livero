# 🚀 Quick Start: Google Analytics Setup

## Step 1: Get Your GA4 Measurement ID

1. Go to https://analytics.google.com/
2. Create a new GA4 Property or select existing one
3. Navigate to **Admin** (gear icon)
4. Under **Property**, click **Data Streams**
5. Click your web stream (or create one)
6. Copy your **Measurement ID** (format: `G-XXXXXXXXXX`)

## Step 2: Add to Environment Variables

Create or update `.env.local` in your project root:

```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

**Important**: Replace `G-XXXXXXXXXX` with your actual Measurement ID!

## Step 3: Restart Development Server

```bash
# Stop your dev server (Ctrl+C)
# Then restart:
npm run dev
```

## Step 4: Verify It's Working

1. Open your app: http://localhost:3000
2. Open browser DevTools → **Console**
3. Type: `window.gtag`
   - Should show: `ƒ gtag(){...}` (function)
   - If `undefined`, check environment variable

4. Open DevTools → **Network** tab
5. Filter by "google"
6. You should see requests to `googletagmanager.com`

7. Go to GA4 → **Reports** → **Realtime**
8. You should see yourself as an active user!

## Step 5: Deploy to Production

### For Vercel:
1. Go to your project settings
2. Navigate to **Environment Variables**
3. Add:
   - Key: `NEXT_PUBLIC_GA_MEASUREMENT_ID`
   - Value: `G-XXXXXXXXXX`
4. Redeploy your app

### For Railway/Render/Other:
Add the same environment variable in your platform's settings.

## 🎉 That's It!

Your Google Analytics is now tracking:
- ✅ Page views
- ✅ User sessions
- ✅ Product views
- ✅ Add to favorites
- ✅ Search queries
- ✅ Store visits
- ✅ And more!

## 📊 View Your Data

Go to Google Analytics:
- **Realtime**: See current visitors
- **Reports → Engagement**: See page views, events
- **Reports → Monetization**: See e-commerce data (after setup)

## Need Help?

Check the full documentation: `docs/GOOGLE_ANALYTICS.md`

