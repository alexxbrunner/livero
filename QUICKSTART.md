# 🚀 Livero - Quick Start Guide

## Step 1: Install PostgreSQL

### macOS (with Homebrew)
```bash
brew install postgresql@14
brew services start postgresql@14
createdb livero
```

### Windows
Download from https://www.postgresql.org/download/windows/

### Linux
```bash
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
```

## Step 2: Setup Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your database credentials
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

Backend will be running on http://localhost:4000

## Step 3: Setup Frontend

Open a new terminal:

```bash
cd ..  # back to project root
npm install
npm run dev
```

Frontend will be running on http://localhost:3000

## Step 4: Login

Visit http://localhost:3000 and login with:

**Admin**: admin@livero.com / admin123  
**Store**: store1@example.com / store123

## 🎉 You're ready!

- Browse Vienna marketplace at http://localhost:3000/city/vienna
- View store dashboard at http://localhost:3000/store-dashboard
- Access admin panel at http://localhost:3000/admin

## Troubleshooting

**Port already in use?**
- Backend: Change `PORT` in `backend/.env`
- Frontend: Next.js will offer another port

**Database connection error?**
- Check PostgreSQL is running
- Verify `DATABASE_URL` in `backend/.env`
- Make sure database exists: `createdb livero`

**Module not found?**
- Run `npm install` in both root and backend folders

## Next Steps

1. Explore the Vienna marketplace
2. Create a new store account
3. Test the onboarding flow
4. Trigger a product sync from the store dashboard
5. View analytics and billing information

For detailed documentation, see README.md

