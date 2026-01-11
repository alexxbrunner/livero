# Facebook Pixel (Meta Pixel) Integration Guide

This project includes a complete Facebook Pixel integration for tracking user behavior, conversions, and running effective Facebook/Instagram ad campaigns.

## Setup

### 1. Get Your Facebook Pixel ID

1. Go to [Facebook Events Manager](https://business.facebook.com/events_manager)
2. Click **Connect Data Sources** → **Web** → **Facebook Pixel**
3. Name your pixel and click **Continue**
4. Choose **Manually Install Code**
5. Copy your **Pixel ID** (a number like: `123456789012345`)

### 2. Add Environment Variable

Add your Facebook Pixel ID to your environment variables:

**`.env.local`** (for local development):
```bash
NEXT_PUBLIC_FB_PIXEL_ID=123456789012345
```

**Production** (Vercel/Railway/etc.):
Add the same environment variable in your hosting platform's settings.

### 3. Verify Installation

1. Install [Facebook Pixel Helper](https://chrome.google.com/webstore/detail/facebook-pixel-helper/fdgfkebogiimcoedlicjlajpkdmockpc) Chrome extension
2. Start your development server
3. Visit your website
4. Click the Pixel Helper icon - should show your pixel firing
5. In Facebook Events Manager → Test Events, you should see activity

## Automatic Tracking

The following events are automatically tracked:

- **PageView**: Every route change
- **Sessions**: User engagement
- **Device/Browser**: Technical details for ad optimization

## Standard Facebook Events Available

### E-commerce Events

```typescript
import { fbViewContent, fbAddToWishlist } from '@/lib/facebook-pixel';

// Track product view
fbViewContent({
  id: 'prod_123',
  name: 'Luxury Sofa',
  price: 1299.99,
  category: 'Furniture',
  brand: 'BrandName'
});

// Track add to wishlist/favorites
fbAddToWishlist({
  id: 'prod_123',
  name: 'Luxury Sofa',
  price: 1299.99,
  category: 'Furniture'
});
```

### Search Events

```typescript
import { fbSearch } from '@/lib/facebook-pixel';

fbSearch('modern chair', 42); // search query, results count (optional)
```

### User Registration & Leads

```typescript
import { fbCompleteRegistration, fbLead, fbNewsletterSignup } from '@/lib/facebook-pixel';

// User registration
fbCompleteRegistration('email', 'CUSTOMER');

// Newsletter signup
fbNewsletterSignup('footer'); // source: 'footer' | 'popup' | 'page'

// Contact form / city request
fbLead('contact'); // type: 'newsletter' | 'contact' | 'request_city'
```

## Custom Events for Livaro Platform

### Store & Category Views

```typescript
import { fbViewStore, fbViewCategory, fbViewCity } from '@/lib/facebook-pixel';

// Track store page view
fbViewStore({
  id: 'store_123',
  name: 'Modern Furniture Co.',
  city: 'Vienna',
  productsCount: 156
});

// Track category view
fbViewCategory('Living Room', 156); // category name, product count

// Track city page view
fbViewCity('Vienna', 45); // city name, stores count
```

### Product Interactions

```typescript
import { fbClickProduct } from '@/lib/facebook-pixel';

fbClickProduct({
  id: 'prod_123',
  name: 'Luxury Sofa',
  price: 1299.99,
  position: 0, // position in list
  listName: 'Featured Products'
});
```

### Store Owner Events

```typescript
import { 
  fbStoreOnboardingStart,
  fbStoreOnboardingComplete,
  fbStoreSync,
  fbProductPriceUpdate,
  fbTeamInvite
} from '@/lib/facebook-pixel';

// Onboarding tracking
fbStoreOnboardingStart();
fbStoreOnboardingComplete('PRO'); // plan type

// Store management
fbStoreSync(125, 4500); // items synced, duration in ms
fbProductPriceUpdate('prod_123', 999.99, 899.99); // product id, old price, new price
fbTeamInvite('EDITOR'); // role
```

### User Experience Events

```typescript
import { fbLanguageChange, fbFilterApplied } from '@/lib/facebook-pixel';

fbLanguageChange('en', 'de');
fbFilterApplied('category', 'Living Room');
```

## Facebook Conversions API (Advanced)

For better tracking and iOS 14.5+ privacy:

### Backend Event Tracking

```typescript
// backend/src/services/facebook-conversions.ts
import crypto from 'crypto';

const FB_PIXEL_ID = process.env.FB_PIXEL_ID;
const FB_ACCESS_TOKEN = process.env.FB_CONVERSION_API_TOKEN;

export async function trackServerEvent(
  eventName: string,
  userData: {
    email?: string;
    phone?: string;
    ip?: string;
    userAgent?: string;
    fbp?: string; // Facebook click ID from cookie
    fbc?: string; // Facebook browser ID from cookie
  },
  customData?: Record<string, any>
) {
  if (!FB_PIXEL_ID || !FB_ACCESS_TOKEN) return;

  const hashedEmail = userData.email 
    ? crypto.createHash('sha256').update(userData.email.toLowerCase()).digest('hex')
    : undefined;

  const hashedPhone = userData.phone
    ? crypto.createHash('sha256').update(userData.phone).digest('hex')
    : undefined;

  const payload = {
    data: [{
      event_name: eventName,
      event_time: Math.floor(Date.now() / 1000),
      action_source: 'website',
      user_data: {
        em: [hashedEmail],
        ph: [hashedPhone],
        client_ip_address: userData.ip,
        client_user_agent: userData.userAgent,
        fbp: userData.fbp,
        fbc: userData.fbc,
      },
      custom_data: customData,
    }],
  };

  try {
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${FB_PIXEL_ID}/events?access_token=${FB_ACCESS_TOKEN}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    );

    const result = await response.json();
    console.log('Facebook Conversion API response:', result);
  } catch (error) {
    console.error('Facebook Conversion API error:', error);
  }
}
```

## Facebook Ads Optimization

### 1. Create Custom Conversions

In Facebook Events Manager:
1. Go to **Custom Conversions**
2. Click **Create Custom Conversion**
3. Select your pixel
4. Define rules (e.g., "ViewContent" event with "category = Furniture")

### 2. Set Up Event Matching

For better attribution:
- Pass user email (hashed) in events where available
- Include `fbp` and `fbc` parameters from cookies
- Use Conversions API for server-side tracking

### 3. Create Custom Audiences

Based on tracked events:
- **Product Viewers**: People who viewed products
- **Wishlist Adders**: People who added to favorites
- **Search Users**: People who searched
- **Store Visitors**: People who viewed stores

### 4. Create Lookalike Audiences

1. Go to **Audiences** in Ads Manager
2. Click **Create Audience** → **Lookalike Audience**
3. Select your custom audience as source
4. Choose location and audience size

## Facebook Pixel Events for Ad Campaigns

### Campaign Type: Awareness
- **PageView**: General traffic
- **ViewContent**: Product interest
- **ViewStore**: Store interest

### Campaign Type: Consideration
- **Search**: Active shoppers
- **ViewCategory**: Category interest
- **AddToWishlist**: High intent

### Campaign Type: Conversion
- **CompleteRegistration**: New users
- **Lead**: Newsletter signups, contact forms
- **Purchase**: (if you add checkout)

## Dynamic Product Ads Setup

### 1. Create Product Catalog

In Facebook Commerce Manager:
1. Go to **Catalogs**
2. Click **Create Catalog**
3. Choose **E-commerce**
4. Upload your products (CSV or API)

### 2. Product Feed Format

```csv
id,title,description,availability,condition,price,link,image_link,brand,category
prod_123,"Luxury Sofa","Modern grey sofa",in stock,new,1299.99 EUR,https://livaro.com/product/prod_123,https://livaro.com/images/sofa.jpg,BrandName,Furniture
```

### 3. Configure Dynamic Ads

In Ads Manager:
1. Create campaign → **Sales** objective
2. Ad Set → Enable **Dynamic Creative**
3. Ads → Select your **Product Catalog**
4. Choose **Product Set** (all products or filtered)

## Privacy & Compliance

### GDPR Compliance

Facebook Pixel can track users in the EU, but you need:

1. **Cookie Consent Banner**
2. **Privacy Policy** mentioning Facebook Pixel
3. **Opt-out mechanism**

### Conditional Loading

```typescript
// components/FacebookPixel.tsx
import { useCookieConsent } from '@/hooks/useCookieConsent';

export default function FacebookPixel() {
  const { hasConsent } = useCookieConsent();
  
  if (!hasConsent) return null;
  
  // ... rest of pixel code
}
```

## Testing

### Test Events Tool

1. Go to Facebook Events Manager
2. Click **Test Events**
3. Enter your website URL or pixel ID
4. Visit your site
5. See events appear in real-time

### Facebook Pixel Helper

Chrome extension that shows:
- ✅ Pixel is loading correctly
- ✅ Events are firing
- ✅ Parameters are being sent
- ⚠️ Any errors or warnings

## Debugging

### Enable Debug Mode

```typescript
// In FacebookPixel.tsx, add after init:
fbq('init', '${FB_PIXEL_ID}');
fbq('set', 'autoConfig', false, '${FB_PIXEL_ID}');
```

### Check Browser Console

```javascript
// In browser console:
window.fbq
// Should show: function

// Test fire an event:
fbq('track', 'PageView');
```

### Common Issues

1. **Pixel not loading**
   - Check environment variable is set
   - Check browser console for errors
   - Disable ad blockers

2. **Events not appearing**
   - Can take a few minutes to appear
   - Check Test Events tool
   - Verify Pixel Helper shows events

3. **iOS 14.5+ Tracking Issues**
   - Implement Conversions API (server-side)
   - Use aggregated event measurement
   - Set up domain verification

## Best Practices

1. **Track Key Events Only**: Don't over-track, focus on conversion funnel
2. **Use Standard Events**: Prefer standard events over custom for better optimization
3. **Pass Value**: Include price/value for e-commerce events
4. **Test Thoroughly**: Use Test Events before launching campaigns
5. **Monitor Regularly**: Check Events Manager for data quality issues
6. **Combine with Conversions API**: For best results, use both pixel and server-side tracking

## Ad Campaign Recommendations

### For Product Sales

1. **Campaign Structure**:
   - Campaign: Sales
   - Ad Set: Dynamic Product Ads
   - Audience: Lookalike of product viewers
   - Placement: Facebook + Instagram Feed + Stories

2. **Optimization**:
   - Optimize for: ViewContent
   - Bid Strategy: Lowest Cost
   - Budget: Start with €20-50/day

### For Store Onboarding

1. **Campaign Structure**:
   - Campaign: Conversions
   - Ad Set: Interest targeting (furniture, interior design, store owners)
   - Optimize for: CompleteRegistration
   - Placement: Facebook Feed, LinkedIn

2. **Custom Audience**:
   - Exclude: Existing store owners
   - Include: Lookalike of registered stores

### For Newsletter Growth

1. **Campaign Structure**:
   - Campaign: Conversions
   - Ad Set: Interest targeting (home decor, furniture)
   - Optimize for: Lead
   - Placement: Facebook + Instagram Feed

2. **Lead Form**:
   - Use Facebook Lead Ads
   - Questions: Email, City, Interests

## Troubleshooting

### Pixel Not Tracking

```bash
# Check if pixel ID is set
echo $NEXT_PUBLIC_FB_PIXEL_ID

# Restart dev server after adding env var
npm run dev
```

### Events Not in Ads Manager

- Events appear in Test Events immediately
- Standard reports can take 15-30 minutes
- Check you're looking at the correct time range

### Low Match Rate

- Implement Conversions API
- Pass more customer data (email, phone - hashed)
- Verify domain in Business Manager

## Additional Resources

- [Facebook Pixel Documentation](https://developers.facebook.com/docs/facebook-pixel)
- [Conversions API Guide](https://developers.facebook.com/docs/marketing-api/conversions-api)
- [Dynamic Ads Setup](https://www.facebook.com/business/help/397103717129942)
- [Event Setup Tool](https://www.facebook.com/business/help/1320516864742493)

