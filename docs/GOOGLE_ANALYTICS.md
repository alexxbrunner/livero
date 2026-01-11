# Google Analytics Integration Guide

This project includes a complete Google Analytics 4 (GA4) integration with custom event tracking for e-commerce and user behavior.

## Setup

### 1. Get Your Google Analytics ID

1. Go to [Google Analytics](https://analytics.google.com/)
2. Create a new GA4 property if you haven't already
3. Get your Measurement ID (format: `G-XXXXXXXXXX`)

### 2. Add Environment Variable

Add your Google Analytics Measurement ID to your environment variables:

**`.env.local`** (for local development):
```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

**Production** (Vercel/Railway/etc.):
Add the same environment variable in your hosting platform's settings.

### 3. Verify Installation

1. Start your development server
2. Open your website
3. Open browser DevTools → Network tab
4. Look for requests to `googletagmanager.com/gtag/js`
5. In GA4 Real-time reports, you should see your activity

## Automatic Tracking

The following events are automatically tracked:

- **Page Views**: Every route change is tracked
- **Sessions**: User sessions and engagement
- **Traffic Sources**: Referrers, UTM parameters
- **Device Information**: Browser, OS, screen size
- **Geographic Data**: Country, city, language

## Custom Events Available

### E-commerce Events

```typescript
import { trackProductView, trackProductClick, trackAddToFavorites } from '@/lib/analytics';

// Track product view
trackProductView({
  id: 'prod_123',
  name: 'Luxury Sofa',
  price: 1299.99,
  category: 'Furniture',
  brand: 'BrandName'
});

// Track product click
trackProductClick({
  id: 'prod_123',
  name: 'Luxury Sofa',
  price: 1299.99,
  category: 'Furniture',
  position: 0 // Position in list
});

// Track add to favorites
trackAddToFavorites({
  id: 'prod_123',
  name: 'Luxury Sofa',
  price: 1299.99
});
```

### Search Events

```typescript
import { trackSearch } from '@/lib/analytics';

trackSearch('modern chair', 42); // search term, results count
```

### Store Events

```typescript
import { trackStoreView, trackCategoryView } from '@/lib/analytics';

trackStoreView({
  id: 'store_123',
  name: 'Modern Furniture Co.',
  city: 'Vienna'
});

trackCategoryView('Living Room', 156);
```

### User Events

```typescript
import { trackUserRegistration, trackUserLogin } from '@/lib/analytics';

trackUserRegistration('CUSTOMER');
trackUserLogin('STORE');
```

### Store Owner Events

```typescript
import { trackStoreSync, trackPriceUpdate, trackTeamInvite } from '@/lib/analytics';

trackStoreSync(125, 4500); // items synced, duration in ms

trackPriceUpdate('prod_123', 999.99, 899.99); // product id, old price, new price

trackTeamInvite('EDITOR');
```

### Language Tracking

```typescript
import { trackLanguageChange } from '@/lib/analytics';

trackLanguageChange('en', 'de');
```

### Newsletter Signup

```typescript
import { trackNewsletterSignup } from '@/lib/analytics';

trackNewsletterSignup('user@example.com');
```

## Custom Events

For custom tracking not covered by the helpers:

```typescript
import { event } from '@/lib/analytics';

event({
  action: 'button_click',
  category: 'engagement',
  label: 'hero_cta',
  value: 1
});
```

## GA4 Reports to Set Up

### Recommended Custom Reports

1. **Product Performance**
   - Metrics: Views, Clicks, Add to Favorites
   - Dimensions: Product Name, Category, Brand

2. **Store Performance**
   - Metrics: Store Views, Product Views from Store
   - Dimensions: Store Name, City

3. **User Funnel**
   - Steps: Landing → Product View → Add to Favorites → Store Visit

4. **Search Analysis**
   - Metrics: Search Count, Results Count
   - Dimensions: Search Term

## Privacy & GDPR Compliance

The implementation follows privacy best practices:

1. **No Personal Data**: User emails and personal info are NOT sent to GA
2. **Anonymized IPs**: GA4 anonymizes IPs by default
3. **Cookie Consent**: Consider adding a cookie consent banner for EU users

### Adding Cookie Consent (Optional)

For GDPR compliance, you may want to add a cookie consent banner. Popular options:

- [CookieYes](https://www.cookieyes.com/)
- [OneTrust](https://www.onetrust.com/)
- [Cookiebot](https://www.cookiebot.com/)

To conditionally load GA only after consent:

```typescript
// Modify GoogleAnalytics.tsx to check for consent
if (hasUserConsent()) {
  // Load GA scripts
}
```

## Testing

### Local Testing

GA works in development mode. To test:

1. Open browser DevTools
2. Console → type `window.gtag` - should show function
3. Network tab → filter for "google" - should see requests
4. GA Real-time reports → should see your activity

### Production Testing

After deployment:

1. Visit your live site
2. Check GA Real-time reports
3. Verify events are appearing correctly

## Debugging

Enable GA debug mode:

```typescript
// In GoogleAnalytics.tsx, add to config:
gtag('config', '${GA_MEASUREMENT_ID}', {
  debug_mode: true,
  page_path: window.location.pathname,
});
```

Then check browser console for detailed GA logs.

## Best Practices

1. **Don't Track Sensitive Data**: Never send passwords, credit cards, or PII
2. **Use Consistent Naming**: Keep event names lowercase with underscores
3. **Test Before Deploy**: Always test events in development
4. **Monitor Data**: Regularly check GA to ensure data is flowing correctly
5. **Set Up Alerts**: Create alerts in GA for unusual traffic patterns

## Troubleshooting

### Events Not Appearing

1. Check environment variable is set correctly
2. Verify GA Measurement ID format: `G-XXXXXXXXXX`
3. Check browser console for errors
4. Disable ad blockers/privacy extensions
5. Check GA Real-time reports (events can take 24-48h to appear in standard reports)

### Duplicate Events

1. Make sure Google Analytics component is only included once (in root layout)
2. Check for multiple gtag script loads in browser DevTools

## Additional Resources

- [GA4 Documentation](https://developers.google.com/analytics/devguides/collection/ga4)
- [Next.js Analytics Guide](https://nextjs.org/docs/app/building-your-application/optimizing/analytics)
- [GA4 E-commerce Events](https://developers.google.com/analytics/devguides/collection/ga4/ecommerce)

