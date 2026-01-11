-- Add CUSTOMER role to UserRole enum
ALTER TYPE "UserRole" ADD VALUE IF NOT EXISTS 'CUSTOMER';

-- Create Customer table
CREATE TABLE IF NOT EXISTS "Customer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL UNIQUE,
    "name" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Customer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create Favorite table
CREATE TABLE IF NOT EXISTS "Favorite" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "customerId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Favorite_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Favorite_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create unique constraint on Favorite
CREATE UNIQUE INDEX IF NOT EXISTS "Favorite_customerId_productId_key" ON "Favorite"("customerId", "productId");

-- Create indexes
CREATE INDEX IF NOT EXISTS "Favorite_customerId_idx" ON "Favorite"("customerId");
CREATE INDEX IF NOT EXISTS "Favorite_productId_idx" ON "Favorite"("productId");

