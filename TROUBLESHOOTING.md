# 🐛 Troubleshooting Guide

## Common Issues & Solutions

### Backend Issues

#### ❌ Database Connection Error
```
Error: Can't reach database server at `localhost:5432`
```

**Solutions:**
1. Check if PostgreSQL is running:
   ```bash
   # macOS
   brew services list
   brew services start postgresql@14
   
   # Linux
   sudo systemctl status postgresql
   sudo systemctl start postgresql
   ```

2. Verify database exists:
   ```bash
   psql -l | grep livero
   # If not found:
   createdb livero
   ```

3. Check credentials in `backend/.env`:
   ```
   DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/livero"
   ```

---

#### ❌ Port 4000 Already in Use
```
Error: listen EADDRINUSE: address already in use :::4000
```

**Solution:**
1. Change port in `backend/.env`:
   ```
   PORT=4001
   ```

2. Update frontend API URL in root `.env.local`:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:4001/api
   ```

---

#### ❌ Prisma Migration Failed
```
Error: P3009: migrate encountered errors
```

**Solutions:**
1. Reset database:
   ```bash
   cd backend
   npm run prisma:migrate -- reset
   npm run prisma:seed
   ```

2. If that fails, manually drop and recreate:
   ```bash
   dropdb livero
   createdb livero
   npm run prisma:migrate
   npm run prisma:seed
   ```

---

#### ❌ JWT Token Error
```
Error: jwt malformed / Invalid token
```

**Solution:**
1. Clear browser localStorage
2. Logout and login again
3. Check `JWT_SECRET` is set in `backend/.env`

---

### Frontend Issues

#### ❌ Port 3000 Already in Use
```
Port 3000 is already in use
```

**Solution:**
Next.js will automatically prompt to use another port (3001). Accept it.

Or manually specify:
```bash
PORT=3001 npm run dev
```

---

#### ❌ API Connection Error / Network Error
```
Error: Network Error
AxiosError: connect ECONNREFUSED
```

**Solutions:**
1. Make sure backend is running on port 4000
2. Check `.env.local` has correct API URL:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:4000/api
   ```
3. Restart the frontend after changing `.env.local`

---

#### ❌ Module Not Found
```
Error: Cannot find module '@/store/authStore'
```

**Solution:**
```bash
# In project root
npm install

# If still failing
rm -rf node_modules package-lock.json
npm install
```

---

#### ❌ Hydration Errors in Next.js
```
Warning: Text content did not match
```

**Solution:**
This is usually from `useAuthStore` on server. Already handled with 'use client' directives. If persisting:
1. Clear `.next` folder:
   ```bash
   rm -rf .next
   npm run dev
   ```

---

### Database Issues

#### ❌ Cannot Create Database
```
ERROR: permission denied to create database
```

**Solution:**
1. Connect as postgres superuser:
   ```bash
   # macOS
   psql postgres
   
   # Linux
   sudo -u postgres psql
   ```

2. Create database and grant permissions:
   ```sql
   CREATE DATABASE livero;
   CREATE USER myuser WITH PASSWORD 'mypassword';
   GRANT ALL PRIVILEGES ON DATABASE livero TO myuser;
   ```

---

#### ❌ Too Many Connections
```
Error: sorry, too many clients already
```

**Solution:**
1. Close unused connections
2. Increase PostgreSQL max_connections
3. Add connection pooling to Prisma:
   ```
   DATABASE_URL="postgresql://...?connection_limit=5"
   ```

---

### Development Issues

#### ❌ Changes Not Reflecting
**Solution:**
1. Hard refresh browser (Cmd+Shift+R / Ctrl+Shift+R)
2. Clear browser cache
3. Restart dev servers
4. Check if you're editing correct file

---

#### ❌ TypeScript Errors After Update
**Solution:**
```bash
# Backend
cd backend
npm run prisma:generate

# Frontend
cd ..
npm run build
```

---

### Production Issues

#### ❌ Environment Variables Not Working
**Solution:**
- In Next.js, public env vars must be prefixed with `NEXT_PUBLIC_`
- Restart server after changing env vars
- On Vercel/Netlify, set in dashboard, not in files

---

#### ❌ CORS Errors in Production
**Solution:**
Update backend `src/index.ts`:
```typescript
app.use(cors({
  origin: ['https://your-frontend-domain.com'],
  credentials: true
}));
```

---

## Getting Help

If your issue isn't covered here:

1. **Check the logs**
   - Backend: Terminal running `npm run dev`
   - Frontend: Browser console (F12)

2. **Verify setup**
   - Node.js version: `node -v` (should be 18+)
   - PostgreSQL version: `psql --version` (should be 14+)
   - All dependencies installed

3. **Clean restart**
   ```bash
   # Stop all servers
   # Then:
   cd backend
   rm -rf node_modules dist
   npm install
   npm run dev
   
   # In another terminal
   cd ..
   rm -rf node_modules .next
   npm install
   npm run dev
   ```

4. **Check the code**
   - Compare with original files
   - Look for typos in file paths
   - Verify all imports are correct

---

## Quick Diagnostics

Run this checklist:

- [ ] PostgreSQL is running
- [ ] Database "livero" exists
- [ ] Backend `.env` file exists with correct values
- [ ] Frontend `.env.local` exists
- [ ] Backend running on port 4000 (or custom port)
- [ ] Frontend can reach backend API
- [ ] Both `node_modules` folders are installed
- [ ] Prisma migrations have run successfully
- [ ] Database has seed data

---

## Still Stuck?

Check these files are correct:
- `backend/.env`
- `.env.local`
- `backend/prisma/schema.prisma`
- `backend/src/index.ts`
- `lib/api.ts`

Everything configured correctly? Try the nuclear option:
```bash
# Backup your .env files first!
rm -rf backend/node_modules backend/dist
rm -rf node_modules .next
cd backend
npm install
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run dev &
cd ..
npm install
npm run dev
```

