# Customer Account & Favorites Feature

## Overview
This feature adds customer account functionality with the ability to save/favorite products.

## Features

### 1. Customer Registration
- New "CUSTOMER" role added to the user system
- Customers can register with:
  - Email and password (required)
  - Name (optional)
- Registration page updated with three account types:
  - Customer (browse and save favorites)
  - Store (manage store products)
  - Admin (platform administration)

### 2. Customer Profile
- Profile includes:
  - Name
  - Phone (optional)
  - Address (optional)
  - Email (from user account)

### 3. Favorites System
- Customers can save products to their favorites
- Features:
  - Add/remove products from favorites
  - View all saved products on dedicated favorites page
  - Favorite button on product pages
  - Heart icon in navbar (for customers only)
  - Responsive favorite management

## Database Schema Changes

### New Tables

#### Customer
- `id` - Unique identifier
- `userId` - Links to User table
- `name` - Customer name (optional)
- `phone` - Phone number (optional)
- `address` - Address (optional)
- `createdAt` - Account creation timestamp
- `updatedAt` - Last update timestamp

#### Favorite
- `id` - Unique identifier
- `customerId` - Links to Customer table
- `productId` - Links to Product table
- `createdAt` - When favorite was added
- Unique constraint on (customerId, productId) to prevent duplicates

### Updated Enums
- `UserRole`: Added `CUSTOMER` option

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register customer account (role: "CUSTOMER")
- `POST /api/auth/login` - Login (returns customer info for CUSTOMER role)

### Customer Profile
- `GET /api/customer/profile` - Get customer profile (requires authentication)
- `PATCH /api/customer/profile` - Update customer profile (requires authentication)

### Favorites
- `GET /api/customer/favorites` - Get all favorites (requires authentication)
- `POST /api/customer/favorites/:productId` - Add product to favorites (requires authentication)
- `DELETE /api/customer/favorites/:productId` - Remove product from favorites (requires authentication)
- `GET /api/customer/favorites/check/:productId` - Check if product is favorited (requires authentication)

## Frontend Components

### New Components
1. **FavoriteButton** (`components/FavoriteButton.tsx`)
   - Toggleable heart icon
   - Shows favorite status
   - Integrates with API
   - Responsive sizing options
   - Only visible to customers

2. **FavoritesPage** (`app/favorites/page.tsx`)
   - Grid display of favorited products
   - Remove from favorites functionality
   - Empty state with call-to-action
   - Responsive layout

### Updated Components
1. **Navbar** (`components/Navbar.tsx`)
   - User menu with dropdown
   - Shows customer name/email
   - Favorites link (customers only)
   - Role-based navigation
   - Logout functionality

2. **Register Page** (`app/register/page.tsx`)
   - Three account type options
   - Customer-specific name field
   - Updated role handling

3. **Login Page** (`app/login/page.tsx`)
   - Role-based redirect (customers → homepage)

4. **Product Page** (`app/product/[productId]/page.tsx`)
   - Favorite button integration
   - Positioned next to store name

## Usage

### For Customers

#### Register as Customer:
1. Go to `/register`
2. Select "Customer" account type
3. Enter email, optional name, and password
4. Submit registration

#### Add Products to Favorites:
1. Browse products
2. Click heart icon on product page
3. View saved items in navbar or at `/favorites`

#### Manage Favorites:
1. Click heart icon in navbar
2. View all saved products
3. Click trash icon to remove items

### For Developers

#### Run Database Migration:
```bash
cd backend
npx prisma migrate dev
```

#### Generate Prisma Client:
```bash
cd backend
npx prisma generate
```

#### Test Customer Registration:
```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "customer@example.com",
    "password": "password123",
    "role": "CUSTOMER",
    "name": "John Doe"
  }'
```

#### Test Adding Favorite (with JWT token):
```bash
curl -X POST http://localhost:4000/api/customer/favorites/{productId} \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Security

- All customer endpoints require authentication
- JWT tokens are validated on each request
- Only customers can access favorites functionality
- CORS enabled for frontend communication
- Passwords hashed with bcrypt

## State Management

- Zustand store updated to support CUSTOMER role
- User state includes customer-specific fields (customerId, name)
- LocalStorage persistence for authentication
- Token automatically included in API requests

## UI/UX Features

- Smooth animations on favorite toggle
- Toast notifications for actions
- Loading states during API calls
- Empty states with helpful CTAs
- Responsive design for all screen sizes
- Consistent luxury brand aesthetic

## Future Enhancements

Potential additions:
- Email notifications for favorites
- Price drop alerts
- Favorite collections/lists
- Share favorites with others
- Wishlist functionality
- Customer order history
- Product recommendations based on favorites

## Notes

- Customers redirect to homepage after login (not dashboard)
- Store and Admin users have different redirect logic
- Favorite button only shows for logged-in customers
- Heart icon in navbar is customer-only
- All customer data protected by authentication

