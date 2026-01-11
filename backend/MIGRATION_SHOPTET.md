# Migration Guide: Adding SHOPTET Platform Support

To enable Shoptet integration, you need to add `SHOPTET` to the Platform enum in the database schema.

## Steps

1. **Update Prisma Schema**

   Edit `backend/prisma/schema.prisma` and update the Platform enum:

   ```prisma
   enum Platform {
     SHOPIFY
     WOOCOMMERCE
     SHOPWARE
     SHOPTET  // Add this line
   }
   ```

2. **Create Migration**

   ```bash
   cd backend
   npm run prisma:migrate
   ```

   Name the migration: `add_shoptet_platform`

3. **Regenerate Prisma Client**

   ```bash
   npm run prisma:generate
   ```

4. **Verify**

   The TypeScript errors should now be resolved, and SHOPTET will be available as a platform option in the store creation API.

## Manual SQL Migration (Alternative)

If you prefer to create the migration manually:

```sql
-- Add SHOPTET to Platform enum
ALTER TYPE "Platform" ADD VALUE 'SHOPTET';
```

Then run:
```bash
npm run prisma:generate
```

## Notes

- This is a non-breaking change (only adds a new enum value)
- Existing stores will not be affected
- No data migration is required

