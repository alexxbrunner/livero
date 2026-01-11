# 🚀 How to Run the Backend

## Quick Start

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies** (if not already done)
   ```bash
   npm install
   ```

3. **Ensure environment variables are set**
   Check that `.env` file exists and contains:
   ```env
   DATABASE_URL="postgresql://alexvbrunner@localhost:5432/livero?schema=public"
   JWT_SECRET="livero-secret-key-change-in-production-2024"
   PORT=4000
   NODE_ENV=development
   ```

4. **Generate Prisma Client** (if needed)
   ```bash
   npm run prisma:generate
   ```

5. **Run database migrations** (if needed)
   ```bash
   npm run prisma:migrate
   ```

6. **Seed the database** (optional, for initial data)
   ```bash
   npm run prisma:seed
   ```

7. **Start the development server**
   ```bash
   npm run dev
   ```

The backend will start on **http://localhost:4000**

## Available Scripts

- `npm run dev` - Start development server with hot reload (nodemon + ts-node)
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Run production build (requires `npm run build` first)
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:seed` - Seed database with sample data
- `npm run prisma:studio` - Open Prisma Studio (database GUI)

## Prerequisites

- **PostgreSQL** must be running
- Database `livero` must exist
- Node.js 18+ installed

## Check if everything is set up

1. **Check database connection:**
   ```bash
   psql -U alexvbrunner -d livero -c "SELECT 1;"
   ```

2. **Check if Prisma Client is generated:**
   ```bash
   ls node_modules/.prisma/client
   ```

3. **Check if tables exist:**
   ```bash
   psql -U alexvbrunner -d livero -c "\dt"
   ```

## Troubleshooting

### Port 4000 already in use?
Change `PORT` in `.env` file to a different port (e.g., `4001`)

### Database connection error?
- Make sure PostgreSQL is running: `brew services list` (macOS) or `sudo systemctl status postgresql` (Linux)
- Verify database exists: `createdb livero`
- Check DATABASE_URL in `.env` matches your PostgreSQL setup

### Module not found errors?
- Run `npm install` in the backend directory
- Run `npm run prisma:generate` to generate Prisma Client

### Prisma errors?
- Run `npm run prisma:generate`
- Run `npm run prisma:migrate` to ensure migrations are applied

## API Endpoints

Once running, the API is available at:
- Health check: `GET http://localhost:4000/health`
- API routes: `http://localhost:4000/api/*`

See the main README.md for full API documentation.

