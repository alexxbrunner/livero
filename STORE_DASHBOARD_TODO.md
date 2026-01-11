# Store Dashboard - Design Update & Backend Routes Implementation Plan

## Design Updates Applied

### 1. **StoreLayout Component** - Luxury Design
✅ **Sidebar (Desktop)**:
- White background (instead of dark)
- Border-right for separation
- Luxury typography with font-serif
- Uppercase tracking for labels
- Active state: neutral-900 background
- Hover effects with neutral-50
- Store info in bordered section

✅ **Dashboard Home Page**:
- Larger padding (p-12)
- Font-serif for headings
- Light font-weight for body text
- Border cards instead of shadows
- Hover animations with border changes
- Uppercase tracking for CTAs
- Larger spacing between sections

## Backend Routes Still Needed

### Products Management
```typescript
// /backend/src/routes/store.routes.ts

// Update product (beyond price)
PATCH /stores/me/products/:productId/edit
Body: { title, description, availability }

// Bulk update products
PATCH /stores/me/products/bulk
Body: { productIds: [], updates: {} }
```

### Team Management
```typescript
// /backend/src/routes/team.routes.ts

// Get team members
GET /stores/me/team

// Invite team member
POST /stores/me/team/invite
Body: { email, role: 'admin' | 'editor' | 'viewer' }

// Update team member role
PATCH /stores/me/team/:memberId
Body: { role }

// Remove team member
DELETE /stores/me/team/:memberId
```

### Plan Management
```typescript
// /backend/src/routes/billing.routes.ts

// Get billing info
GET /stores/me/billing

// Update payment method
POST /stores/me/billing/payment-method
Body: { stripeTokenId }

// Get invoices
GET /stores/me/billing/invoices

// Download invoice
GET /stores/me/billing/invoices/:invoiceId/download

// Change plan
POST /stores/me/billing/change-plan
Body: { planId, cityId }

// Cancel subscription
POST /stores/me/billing/cancel
```

## Frontend Pages Still Needed

### 1. Edit Product Page
```
/store-dashboard/products/[productId]/edit
- Full product editing form
- Image upload
- Category selection
- Description editor
- Price adjustment
- Availability toggle
- Save/Cancel buttons
```

### 2. Invite Team Member Page
```
/store-dashboard/settings/team/invite
- Email input
- Role selector (Admin, Editor, Viewer)
- Permissions checklist
- Send invitation button
```

### 3. Change Plan Page
```
/store-dashboard/settings/plan/change
- Current plan overview
- Available plans grid
- City-specific pricing
- Feature comparison
- Upgrade/Downgrade buttons
```

### 4. Billing & Invoices Page
```
/store-dashboard/settings/billing
- Payment method display
- Update card form
- Invoice history table
- Download invoice buttons
- Next billing date
```

## File Structure to Create

```
/app/store-dashboard/
├── page.tsx ✅
├── analytics/
│   └── page.tsx ✅
├── products/
│   ├── page.tsx ✅
│   └── [productId]/
│       └── edit/
│           └── page.tsx ⚠️ NEEDED
├── settings/
│   ├── page.tsx ✅
│   ├── team/
│   │   ├── page.tsx ⚠️ NEEDED
│   │   └── invite/
│   │       └── page.tsx ⚠️ NEEDED
│   ├── plan/
│   │   ├── page.tsx ⚠️ NEEDED
│   │   └── change/
│   │       └── page.tsx ⚠️ NEEDED
│   └── billing/
│       └── page.tsx ⚠️ NEEDED

/backend/src/routes/
├── store.routes.ts ✅ (needs product edit routes)
├── team.routes.ts ⚠️ NEEDED
└── billing.routes.ts ⚠️ NEEDED
```

## Database Schema Updates Needed

```prisma
// Add to schema.prisma

model TeamMember {
  id        String   @id @default(cuid())
  storeId   String
  email     String
  role      TeamRole @default(VIEWER)
  invitedAt DateTime @default(now())
  acceptedAt DateTime?
  invitedBy String
  
  store Store @relation(fields: [storeId], references: [id], onDelete: Cascade)
  
  @@unique([storeId, email])
  @@index([storeId])
}

enum TeamRole {
  ADMIN
  EDITOR
  VIEWER
}

model Invoice {
  id          String   @id @default(cuid())
  storeId     String
  amount      Decimal
  currency    String   @default("EUR")
  status      InvoiceStatus @default(PENDING)
  dueDate     DateTime
  paidAt      DateTime?
  invoiceUrl  String?
  createdAt   DateTime @default(now())
  
  store Store @relation(fields: [storeId], references: [id], onDelete: Cascade)
  
  @@index([storeId])
  @@index([status])
}

enum InvoiceStatus {
  PENDING
  PAID
  OVERDUE
  CANCELLED
}
```

## Design Consistency Checklist

✅ Font-serif for headings
✅ Uppercase tracking-widest for labels/buttons
✅ Font-light for body text
✅ Border cards (not shadowed)
✅ Neutral color palette
✅ Hover effects with border changes
✅ Proper spacing (p-8, p-12)
✅ Luxury aesthetic maintained

## Next Steps Priority

1. ⚠️ Create backend team management routes
2. ⚠️ Create backend billing routes
3. ⚠️ Create product edit page
4. ⚠️ Create team management pages
5. ⚠️ Create billing pages
6. ⚠️ Create plan change page
7. ⚠️ Add Prisma migrations for new models
8. ⚠️ Implement Stripe integration for billing

## Implementation Notes

- All new pages should use StoreLayout
- Match luxury design pattern (white backgrounds, borders, serif fonts)
- Use uppercase tracking for CTAs
- Implement proper error handling
- Add loading states
- Include toast notifications
- Mobile-responsive design

