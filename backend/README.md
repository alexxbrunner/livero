# Livero Backend

Express + TypeScript backend for Livero platform.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up PostgreSQL database and update `.env` file

3. Run migrations and seed:
```bash
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

4. Start development server:
```bash
npm run dev
```

Server runs on http://localhost:4000

## API Documentation

See main README.md for full API documentation.

