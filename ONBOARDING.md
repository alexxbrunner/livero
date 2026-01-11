# Store Onboarding Flow

## Overview
Complete multi-step onboarding experience for new store owners with a sidebar showing milestones and progress tracking.

## Features

### Onboarding Layout
- **Sidebar with Milestones**: Shows all steps with completion status
- **Progress Bar**: Visual indicator of completion percentage
- **Responsive Design**: Mobile-friendly with collapsible progress bar
- **Support Section**: Quick access to help resources

### Onboarding Steps

#### Step 1: Welcome Screen
- **Purpose**: Welcome message after registration
- **Content**:
  - Success confirmation
  - Overview of upcoming steps
  - Quick benefits preview
  - "Get Started" CTA

#### Step 2: Connect Store
- **Purpose**: Link e-commerce platform to Livero
- **Features**:
  - Platform selection (Shopify/WooCommerce)
  - Store details form (name, city, URL, description)
  - API credentials input
  - Platform-specific instructions
  - Help documentation link

**Required Fields**:
- Store Name
- City selection
- Store URL
- Platform (Shopify/WooCommerce)
- API credentials (platform-specific)

**Shopify Credentials**:
- Store Domain (e.g., yourstore.myshopify.com)
- API Key
- API Password

**WooCommerce Credentials**:
- Consumer Key
- Consumer Secret

#### Step 3: Choose Plan
- **Purpose**: Select subscription tier
- **Features**:
  - Three plan tiers (Starter, Professional, Enterprise)
  - Feature comparison
  - Visual selection with radio buttons
  - Recommended plan highlight
  - Plan details and pricing

**Plan Options**:

**Starter** - €99/month
- Up to 100 products
- Basic analytics
- Email support
- City marketplace listing
- Mobile-optimized storefront

**Professional** - €199/month (Recommended)
- Unlimited products
- Advanced analytics dashboard
- Priority support
- Featured placement
- Collective marketing campaigns
- SEO optimization
- Team collaboration

**Enterprise** - Custom pricing
- Everything in Professional
- Dedicated account manager
- 24/7 phone support
- Custom integrations
- API access
- White-label options
- Multi-location support

## User Flow

```
Registration (STORE role)
    ↓
Step 1: Welcome Screen
    ↓
Step 2: Connect Store
    ↓ (API call to create store)
Step 3: Choose Plan
    ↓ (Complete onboarding)
Store Dashboard
```

## Components

### OnboardingLayout
**Location**: `/components/OnboardingLayout.tsx`

**Props**:
```typescript
interface OnboardingLayoutProps {
  children: React.ReactNode;
  currentStep: number; // 1, 2, or 3
}
```

**Features**:
- Dark sidebar with step indicators
- Check marks for completed steps
- Current step highlighting
- Progress percentage calculation
- Support section at bottom
- Mobile progress bar

### StoreOnboardingPage
**Location**: `/app/store-onboarding/page.tsx`

**State Management**:
```typescript
const [currentStep, setCurrentStep] = useState(1);
const [storeFormData, setStoreFormData] = useState({...});
const [selectedPlan, setSelectedPlan] = useState('PRO');
```

**Key Functions**:
- `checkExistingStore()`: Redirects to dashboard if store exists
- `fetchCities()`: Loads available cities
- `handleConnectStore()`: Creates store via API
- `handleCompletOnboarding()`: Finalizes onboarding

## API Integration

### Create Store
**Endpoint**: `POST /api/stores`

**Request Body**:
```json
{
  "name": "Store Name",
  "cityId": "city_id",
  "description": "Store description",
  "websiteUrl": "https://store.com",
  "logoUrl": "https://store.com/logo.png",
  "platform": "SHOPIFY" | "WOOCOMMERCE",
  "credentials": {
    "apiKey": "api_key",
    "password": "api_password",
    "storeDomain": "store.myshopify.com" // Shopify only
  }
}
```

### Update Store Plan
**Endpoint**: `PATCH /api/stores/me`

**Request Body**:
```json
{
  "plan": "STARTER" | "PRO" | "ENTERPRISE"
}
```

## Design System

### Sidebar Styling
- Background: `bg-neutral-900` (dark)
- Text: White with neutral-400 for secondary
- Step indicators: 48px squares
- Completed: White background with check icon
- Current: White border and background
- Upcoming: Gray border (neutral-700)

### Main Content
- Max width: 4xl (1024px)
- Padding: Responsive (6-12 on mobile, 12-16 on desktop)
- Form inputs: 4px padding, neutral borders
- Buttons: Neutral-900 background, uppercase tracking

### Colors
- Primary: Neutral-900 (black)
- Secondary: Neutral-600 (gray)
- Success: Green-600
- Borders: Neutral-200/300
- Backgrounds: White with neutral-50 accents

## Responsive Behavior

### Desktop (lg and above)
- Sidebar visible (320-384px wide)
- Full step content displayed
- Side-by-side layouts where applicable

### Mobile
- Sidebar hidden
- Compact progress bar at top
- Stacked layouts
- Full-width buttons

## Navigation Rules

### Access Control
- Requires authentication (STORE role)
- Redirects to `/register` if not logged in
- Redirects to `/store-dashboard` if store already exists

### Step Navigation
- Step 1 → Step 2: Click "Get Started"
- Step 2 → Step 3: Submit store form successfully
- Step 3 → Dashboard: Click "Complete Onboarding"
- Can go back from Step 3 to Step 2

### Validation
- All required fields must be filled
- Email format validation
- URL format validation
- Minimum password length (6 characters)

## Integration with Registration

The `/register` page already handles routing:

```typescript
// After successful registration
if (data.user.role === 'STORE') {
  router.push('/store-onboarding')
} else if (data.user.role === 'ADMIN') {
  router.push('/admin')
} else {
  router.push('/')
}
```

## Error Handling

### Store Creation Errors
- Duplicate store name
- Invalid API credentials
- Network errors
- City not found

### Plan Selection Errors
- Failed to update plan
- Network errors

### User Feedback
- Toast notifications for success/error
- Loading states on buttons
- Form validation messages

## Testing the Onboarding

### Manual Testing Steps

1. **Start Onboarding**:
   - Go to `/register`
   - Select "Store" account type
   - Fill in email and password
   - Submit → Should redirect to `/store-onboarding`

2. **Step 1: Welcome**:
   - Verify welcome message displays
   - Verify step overview cards show
   - Click "Get Started" → Should move to Step 2

3. **Step 2: Connect Store**:
   - Select platform (Shopify/WooCommerce)
   - Fill in store details
   - Enter API credentials
   - Submit → Should create store and move to Step 3

4. **Step 3: Choose Plan**:
   - Review plan options
   - Select a plan (radio button)
   - Click "Complete Onboarding" → Should redirect to dashboard

5. **Sidebar**:
   - Verify current step is highlighted
   - Verify completed steps show checkmarks
   - Verify progress bar updates
   - On mobile: Verify compact progress bar

6. **Returning User**:
   - Login with store account
   - Go to `/store-onboarding`
   - Should redirect to dashboard (store exists)

## Future Enhancements

### Possible Additions
1. **Email Verification**: Verify email before connecting store
2. **Store Preview**: Show how store will appear in marketplace
3. **Import Products**: Option to import initial products during onboarding
4. **Payment Setup**: Integrate payment method collection
5. **Tutorial Tour**: Interactive guide through dashboard after completion
6. **Save Progress**: Allow users to complete onboarding in multiple sessions
7. **Skip Options**: Allow skipping optional steps
8. **Video Guides**: Embedded tutorials for each platform

### Analytics
Track onboarding completion rates:
- Users who start Step 1
- Users who reach Step 2
- Users who complete onboarding
- Drop-off points
- Time to complete

## File Structure

```
/app/store-onboarding/
  └─ page.tsx              # Main onboarding page with all steps

/components/
  └─ OnboardingLayout.tsx   # Reusable layout with sidebar
```

## Related Files

- `/app/register/page.tsx` - Registration with role selection
- `/app/store-dashboard/page.tsx` - Destination after onboarding
- `/backend/src/routes/store.routes.ts` - Store creation API
- `/backend/prisma/schema.prisma` - Store model

## Styling Consistency

The onboarding follows the same luxury design patterns as the rest of the website:
- Font: Serif for headings, sans-serif for body
- Uppercase labels with wide letter spacing
- Minimal color palette (black, white, grays)
- Border-based design (no shadows)
- Clean, spacious layouts
- Professional typography

## Support Resources

Users can access help at any point:
- "Contact Support" link in sidebar
- "Need help?" section in Connect Store step
- Links to integration documentation
- FAQ page (via footer)

## Completion Criteria

Onboarding is considered complete when:
1. User account exists (STORE role)
2. Store record created in database
3. Store connected to e-commerce platform
4. Plan selected
5. User redirected to store dashboard

After completion, users can:
- View their dashboard
- Manage products
- Access analytics
- Invite team members
- Update settings

