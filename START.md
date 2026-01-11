# 🚀 Quick Start - Running the Livero Platform

## ⚠️ PostgreSQL Required

The platform needs PostgreSQL running. Here's how to get it started:

### Option 1: Install PostgreSQL (Recommended)

**macOS:**
```bash
# Install PostgreSQL
brew install postgresql@14

# Start PostgreSQL
brew services start postgresql@14

# Create database
createdb livero
```

**Then run:**
```bash
cd backend
npx prisma migrate dev --name init
npm run prisma:seed
npm run dev
```

### Option 2: Use Docker (Alternative)

```bash
# Start PostgreSQL in Docker
docker run --name livero-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=livero -p 5432:5432 -d postgres:14

# Then run migrations
cd backend
npx prisma migrate dev --name init
npm run prisma:seed
npm run dev
```

## 🎬 Starting the Servers

### Terminal 1 - Backend
```bash
cd backend
npm run dev
```
Backend runs on: http://localhost:4000

### Terminal 2 - Frontend
```bash
npm run dev
```
Frontend runs on: http://localhost:3000

## 🎯 Access the Platform

- **Homepage**: http://localhost:3000
- **Vienna Marketplace**: http://localhost:3000/city/vienna
- **Categories**: http://localhost:3000/categories
- **About**: http://localhost:3000/about

### Demo Login Credentials

**Admin Dashboard** (http://localhost:3000/login)
- Email: `admin@livero.com`
- Password: `admin123`

**Store Dashboard** (http://localhost:3000/login)
- Email: `store1@example.com`
- Password: `store123`

## 📱 What to Explore

1. **Public Marketplace** - Browse products from all stores
2. **Store Dashboard** - View detailed analytics, sync products
3. **Admin Panel** - Manage cities and approve stores
4. **Categories** - Browse by product category
5. **Legal Pages** - Privacy, Terms, Imprint

## 🔧 Troubleshooting

**Port already in use?**
```bash
# Kill process on port 4000 (backend)
lsof -ti:4000 | xargs kill -9

# Kill process on port 3000 (frontend)
lsof -ti:3000 | xargs kill -9
```

**Database connection error?**
- Make sure PostgreSQL is running: `brew services list`
- Check connection: `psql -h localhost -U postgres -d livero`

**Need help?**
See TROUBLESHOOTING.md for more solutions.

