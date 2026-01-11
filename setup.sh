#!/bin/bash

echo "🚀 Livero Setup Script"
echo "======================"
echo ""

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Check for PostgreSQL
if ! command -v psql &> /dev/null; then
    echo "⚠️  PostgreSQL not found in PATH. Make sure it's installed and running."
    echo "   On macOS: brew install postgresql@14"
    echo "   On Ubuntu: sudo apt-get install postgresql"
    echo ""
fi

# Setup Backend
echo ""
echo "📦 Setting up backend..."
cd backend

if [ ! -f .env ]; then
    echo "Creating .env file..."
    cat > .env << EOL
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/livero?schema=public"
JWT_SECRET="$(openssl rand -base64 32)"
PORT=4000
NODE_ENV=development
EOL
    echo "✅ Created .env file"
else
    echo "⏭️  .env file already exists"
fi

echo "Installing backend dependencies..."
npm install

echo "Generating Prisma Client..."
npm run prisma:generate

echo "Running database migrations..."
npm run prisma:migrate || {
    echo ""
    echo "⚠️  Migration failed. Make sure PostgreSQL is running and the database exists."
    echo "   Create database: createdb livero"
    exit 1
}

echo "Seeding database..."
npm run prisma:seed

cd ..

# Setup Frontend
echo ""
echo "📦 Setting up frontend..."

if [ ! -f .env.local ]; then
    echo "Creating .env.local file..."
    cat > .env.local << EOL
NEXT_PUBLIC_API_URL=http://localhost:4000/api
EOL
    echo "✅ Created .env.local file"
else
    echo "⏭️  .env.local file already exists"
fi

echo "Installing frontend dependencies..."
npm install

echo ""
echo "✅ Setup complete!"
echo ""
echo "🎉 Next steps:"
echo ""
echo "1. Start the backend (in one terminal):"
echo "   cd backend && npm run dev"
echo ""
echo "2. Start the frontend (in another terminal):"
echo "   npm run dev"
echo ""
echo "3. Open http://localhost:3000 in your browser"
echo ""
echo "📝 Demo accounts:"
echo "   Admin: admin@livero.com / admin123"
echo "   Store: store1@example.com / store123"
echo ""

