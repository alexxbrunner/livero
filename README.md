# Livero - City-based Interior & Furniture Aggregation Platform

A comprehensive MVP platform that aggregates interior and furniture stores on a per-city basis, enabling collective marketing and seamless inventory synchronization.

## 🏗️ Architecture

- **Frontend**: Next.js 16 with TypeScript, Tailwind CSS (Westwing-inspired design)
- **Backend**: Node.js + Express + TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT-based with email/password
- **Background Jobs**: node-cron for automated inventory syncing
- **Integrations**: Shopify, WooCommerce, Shopware (mock implementations)

## 📋 Features

### Core Functionality
- ✅ City-based marketplace structure
- ✅ Store onboarding with platform integrations
- ✅ Automated inventory synchronization (every 30 min + nightly reconciliation)
- ✅ Public city marketplace with advanced filtering
- ✅ Analytics tracking (views, clicks, requests)
- ✅ Store & Admin dashboards
- ✅ Fixed pricing model with shared marketing fund

### User Roles
- **STORE**: Register, manage inventory, view analytics
- **ADMIN**: Manage cities, approve stores, monitor platform health

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL 14+
- Git

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and update:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `JWT_SECRET`: A secure random string for JWT signing
   - `PORT`: Backend port (default: 4000)

4. **Set up the database**
   ```bash
   # Generate Prisma Client
   npm run prisma:generate

   # Run migrations
   npm run prisma:migrate

   # Seed the database with sample data
   npm run prisma:seed
   ```

5. **Start the backend**
   ```bash
   npm run dev
   ```

   Backend will run on `http://localhost:4000`

### Frontend Setup

1. **Navigate to project root (Next.js app)**
   ```bash
   cd ..  # if you're in backend folder
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   
   The default configuration should work if backend is on port 4000.

4. **Start the frontend**
   ```bash
   npm run dev
   ```

   Frontend will run on `http://localhost:3000`

## 🎭 Demo Accounts

After seeding, you can log in with:

### Admin Account
- Email: `admin@livero.com`
- Password: `admin123`

### Store Accounts
- Email: `store1@example.com` | Password: `store123`
- Email: `store2@example.com` | Password: `store123`
- Email: `store3@example.com` | Password: `store123`

## 📊 Data Models

### Core Entities
- **City**: name, slug, country, currency, monthlyFee
- **Store**: name, cityId, platform, credentials, status
- **Product**: storeId, cityId, externalId, title, price, availability
- **Event**: productId, type (VIEW|CLICK|REQUEST)
- **SyncLog**: storeId, status, message, itemsSynced

## 🔄 Inventory Sync Strategy

1. **Initial Sync**: Full import when store connects platform
2. **Delta Sync**: Every 30 minutes for active stores
3. **Nightly Reconciliation**: Full sync at 2 AM daily
4. **Sync Logs**: All sync operations are logged with status and error details

## 💰 Pricing Model

- Fixed monthly fee per store: €500 (configurable per city)
- **80%** (€400) → City marketing fund
- **20%** (€100) → Platform revenue
- No per-store advertising costs
- Transparent billing dashboard for stores

## 🎨 UI Design

The frontend follows Westwing's aesthetic:
- **Colors**: Warm earth tones (browns, beiges) for primary actions
- **Typography**: Serif fonts for headings, sans-serif for body
- **Layout**: Clean, spacious, high-quality imagery
- **Components**: Card-based layouts, subtle shadows, smooth transitions

## 📁 Project Structure

```
livero/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma      # Database schema
│   │   └── seed.ts            # Seed data
│   ├── src/
│   │   ├── index.ts           # Express server
│   │   ├── middleware/        # Auth middleware
│   │   ├── routes/            # API routes
│   │   ├── services/          # Business logic (sync)
│   │   └── jobs/              # Cron jobs
│   └── package.json
├── app/                       # Next.js 16 app directory
│   ├── page.tsx              # Home page
│   ├── login/page.tsx        # Login
│   ├── register/page.tsx     # Register
│   ├── city/[citySlug]/      # City marketplace
│   ├── product/[productId]/  # Product details
│   ├── store/[storeSlug]/    # Store page
│   ├── store-dashboard/      # Store dashboard
│   ├── store-onboarding/     # Store onboarding
│   └── admin/                # Admin pages
├── lib/                      # Utilities
│   └── api.ts               # Axios instance
├── store/                   # Zustand stores
│   └── authStore.ts         # Auth state
└── package.json
```

## 🛠️ Development Commands

### Backend
```bash
npm run dev          # Start dev server with hot reload
npm run build        # Build for production
npm run start        # Start production server
npm run prisma:studio # Open Prisma Studio (database GUI)
npm run prisma:seed  # Re-seed database
```

### Frontend
```bash
npm run dev          # Start Next.js dev server
npm run build        # Build for production
npm run start        # Start production server
```

## 🌐 API Endpoints

### Public
- `GET /api/cities` - List all active cities
- `GET /api/cities/:slug` - Get city details
- `GET /api/products` - List products with filters
- `GET /api/products/:id` - Get product details
- `POST /api/products/:id/click` - Track click event
- `POST /api/products/:id/request` - Track request event

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login

### Store (Authenticated)
- `GET /api/stores/me` - Get current store
- `POST /api/stores` - Create store
- `POST /api/stores/me/sync` - Trigger manual sync
- `GET /api/stores/me/sync-logs` - Get sync history
- `GET /api/analytics/store` - Get store analytics

### Admin (Admin Only)
- `GET /admin/cities` - List all cities
- `POST /admin/cities` - Create city
- `PATCH /admin/cities/:id` - Update city
- `GET /admin/stores` - List all stores
- `PATCH /admin/stores/:id/status` - Update store status
- `GET /admin/dashboard` - Get admin dashboard data

## 🔐 Security Notes

For production deployment:
- Change `JWT_SECRET` to a secure random string
- Use environment variables for all sensitive data
- Enable HTTPS
- Set up proper CORS policies
- Implement rate limiting
- Add request validation
- Encrypt platform credentials in database

## 🚀 Deployment Considerations

1. **Database**: Use managed PostgreSQL (e.g., AWS RDS, Heroku Postgres)
2. **Backend**: Deploy to Heroku, Railway, or AWS
3. **Frontend**: Deploy to Vercel, Netlify, or AWS Amplify
4. **Environment Variables**: Configure properly on each platform
5. **Cron Jobs**: Ensure background jobs run (use external scheduler if needed)

## 📈 Scaling Strategy

- Implement Redis for caching
- Add CDN for static assets
- Database read replicas for analytics
- Message queue (e.g., Bull/Redis) for sync jobs
- Elasticsearch for advanced product search
- WebSockets for real-time sync status

## 🤝 Contributing

This is an MVP. Future improvements:
- Real platform integrations (Shopify, WooCommerce, Shopware)
- Payment processing (Stripe)
- Email notifications
- Advanced analytics dashboards
- Store messaging system
- Multi-language support
- Mobile apps

## 📄 License

MIT

---

Built with ❤️ for the interior & furniture industry
