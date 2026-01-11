-- Add brand fields to Product table
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "brand" TEXT;
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "brandDescription" TEXT;

-- Create index on brand for faster queries
CREATE INDEX IF NOT EXISTS "Product_brand_idx" ON "Product"("brand");

