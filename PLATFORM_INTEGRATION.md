# Platform Integration Guide

This guide explains how to connect and sync products from Shopify, WooCommerce, Shopware, and Shoptet to the Livero platform.

## Table of Contents

- [Overview](#overview)
- [Shopify Integration](#shopify-integration)
- [WooCommerce Integration](#woocommerce-integration)
- [Shopware Integration](#shopware-integration)
- [Shoptet Integration](#shoptet-integration)
- [Sync Process](#sync-process)
- [Troubleshooting](#troubleshooting)

## Overview

Livero supports automatic product synchronization from four major e-commerce platforms:

1. **Shopify** - Popular SaaS e-commerce platform
2. **WooCommerce** - WordPress-based e-commerce plugin
3. **Shopware** - Open-source e-commerce platform
4. **Shoptet** - Leading e-commerce platform in Central Europe

All platforms use API-based authentication and product fetching. The sync process runs automatically every 30 minutes and performs a full reconciliation nightly at 2 AM.

## Shopify Integration

### Prerequisites

- A Shopify store (Shopify Plus, Shopify, or Shopify Lite)
- Admin access to your Shopify store
- Ability to create private apps or use Admin API access

### Step 1: Create a Private App in Shopify

1. Log in to your Shopify admin panel
2. Go to **Settings** → **Apps and sales channels**
3. Click **Develop apps** (at the bottom)
4. Click **Create an app**
5. Name your app (e.g., "Livero Integration")
6. Click **Create app**

### Step 2: Configure API Permissions

1. Click **Configure Admin API scopes**
2. Enable the following scopes:
   - `read_products` - To fetch product data
   - `read_product_listings` - To access product listings
   - `read_inventory` - To check product availability
3. Click **Save**

### Step 3: Install the App

1. Click **Install app**
2. Click **Install** to confirm
3. After installation, you'll see:
   - **API key** (Client ID)
   - **API secret key** (Client Secret)
   - **Admin API access token**

### Step 4: Get Your Store URL

Your Shopify store URL format:
- `https://your-store-name.myshopify.com`
- Or your custom domain: `https://yourdomain.com`

### Step 5: Configure in Livero

During store onboarding, provide:

```json
{
  "shopUrl": "https://your-store-name.myshopify.com",
  "apiKey": "your-api-key",
  "apiSecret": "your-api-secret-key"
}
```

**Note:** For newer Shopify Admin API (2023+), you may only need the **Admin API access token**:

```json
{
  "shopUrl": "https://your-store-name.myshopify.com",
  "accessToken": "your-admin-api-access-token"
}
```

### Shopify API Implementation

The sync service uses the Shopify Admin API:

```typescript
// Example API call structure
GET https://{shopUrl}/admin/api/2024-01/products.json
Headers:
  X-Shopify-Access-Token: {accessToken}
  Content-Type: application/json
```

**API Endpoints Used:**
- `GET /admin/api/{version}/products.json` - Fetch all products
- `GET /admin/api/{version}/products/{id}.json` - Fetch single product
- `GET /admin/api/{version}/inventory_levels.json` - Check inventory

**Rate Limits:**
- Shopify allows 2 requests per second per store
- Burst limit: 40 requests
- The sync service implements rate limiting automatically

---

## WooCommerce Integration

### Prerequisites

- WordPress site with WooCommerce plugin installed
- Admin access to WordPress
- WooCommerce REST API enabled (default in WooCommerce 3.0+)

### Step 1: Generate API Credentials

1. Log in to your WordPress admin panel
2. Go to **WooCommerce** → **Settings** → **Advanced** → **REST API**
3. Click **Add key**
4. Fill in the details:
   - **Description**: "Livero Integration"
   - **User**: Select an admin user
   - **Permissions**: **Read** (we only need to read products)
5. Click **Generate API key**
6. **Important:** Copy both:
   - **Consumer key**
   - **Consumer secret**
   - (You won't be able to see the secret again!)

### Step 2: Get Your Site URL

Your WooCommerce site URL:
- `https://yourdomain.com`
- Or `https://yourdomain.com/shop` (if using a subdirectory)

### Step 3: Configure in Livero

During store onboarding, provide:

```json
{
  "siteUrl": "https://yourdomain.com",
  "consumerKey": "ck_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "consumerSecret": "cs_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
}
```

### WooCommerce API Implementation

The sync service uses the WooCommerce REST API:

```typescript
// Example API call structure
GET https://{siteUrl}/wp-json/wc/v3/products
Headers:
  Authorization: Basic {base64(consumerKey:consumerSecret)}
  Content-Type: application/json
```

**API Endpoints Used:**
- `GET /wp-json/wc/v3/products` - Fetch all products
- `GET /wp-json/wc/v3/products/{id}` - Fetch single product
- `GET /wp-json/wc/v3/products?per_page=100&page={page}` - Paginated products

**Authentication:**
- Uses HTTP Basic Authentication
- Consumer key and secret are base64 encoded
- Format: `Authorization: Basic base64(consumerKey:consumerSecret)`

**Rate Limits:**
- Default: 15 requests per 15 seconds
- Can be configured in WooCommerce settings
- The sync service handles pagination automatically

---

## Shopware Integration

### Prerequisites

- Shopware 6.x installation
- Admin access to Shopware
- API access enabled (default in Shopware 6)

### Step 1: Create Integration in Shopware

1. Log in to your Shopware admin panel
2. Go to **Settings** → **System** → **Integrations**
3. Click **Add integration**
4. Fill in:
   - **Label**: "Livero Integration"
   - **Access key**: (auto-generated, copy this!)
   - **Secret access key**: (auto-generated, copy this!)
5. Under **Permissions**, enable:
   - `product:read`
   - `product_stream:read`
   - `category:read`
6. Click **Save**

### Step 2: Get Your Shop URL

Your Shopware shop URL:
- `https://yourdomain.com`
- Or `https://shop.yourdomain.com`

### Step 3: Configure in Livero

During store onboarding, provide:

```json
{
  "shopUrl": "https://yourdomain.com",
  "accessKey": "SWIAXXXXXXXXXXXXXXXXXXXXXXXX",
  "secretKey": "your-secret-access-key"
}
```

### Shopware API Implementation

The sync service uses the Shopware Store API and Admin API:

```typescript
// Example API call structure
POST https://{shopUrl}/api/search/product
Headers:
  Authorization: Bearer {accessToken}
  Content-Type: application/json
  sw-access-key: {accessKey}
```

**API Endpoints Used:**
- `POST /api/search/product` - Search/fetch products (Store API)
- `GET /api/product/{id}` - Fetch single product (Store API)
- `GET /api/product` - List products (Admin API - requires different auth)

**Authentication:**
- Shopware uses OAuth 2.0 or API access keys
- For Store API: Use `sw-access-key` header
- For Admin API: Use OAuth token

**Rate Limits:**
- Default: 100 requests per minute
- Can be configured in Shopware settings
- The sync service implements rate limiting

**Product Search Query Example:**
```json
{
  "includes": {
    "product": ["id", "name", "description", "price", "cover", "categories"]
  },
  "filter": [
    {
      "type": "equals",
      "field": "product.active",
      "value": true
    }
  ],
  "limit": 100
}
```

---

## Shoptet Integration

### Prerequisites

- Shoptet e-shop (any plan)
- Admin access to your Shoptet admin panel
- API access enabled (available on all plans)

### Step 1: Enable API Access in Shoptet

1. Log in to your Shoptet admin panel
2. Go to **Settings** → **Integrations** → **API**
3. Enable **API access** if not already enabled
4. Click **Generate API credentials**
5. You will receive:
   - **API Key** (also called "Secret key" or "Heslo")
   - **Shop ID** (your shop identifier)
   - **API URL** (your shop's API endpoint)

### Step 2: Get Your Shop Information

Your Shoptet shop information:
- **Shop URL**: `https://your-shop.shoptet.cz` or your custom domain
- **Shop ID**: Found in API settings (usually a number)
- **API URL**: Usually `https://your-shop.shoptet.cz/api`

### Step 3: Configure in Livero

During store onboarding, provide:

```json
{
  "shopUrl": "https://your-shop.shoptet.cz",
  "apiKey": "your-api-key",
  "shopId": "your-shop-id"
}
```

**Note:** Shoptet API uses HTTP Basic Authentication with:
- **Username**: Your shop ID
- **Password**: Your API key

### Shoptet API Implementation

The sync service uses the Shoptet REST API:

```typescript
// Example API call structure
GET https://{shopUrl}/api/products
Headers:
  Authorization: Basic {base64(shopId:apiKey)}
  Content-Type: application/json
  Shoptet-Account: {shopId}
```

**API Endpoints Used:**
- `GET /api/products` - Fetch all products
- `GET /api/products/{id}` - Fetch single product
- `GET /api/products?page={page}&limit={limit}` - Paginated products

**Authentication:**
- Uses HTTP Basic Authentication
- Format: `Authorization: Basic base64(shopId:apiKey)`
- Additional header: `Shoptet-Account: {shopId}` (sometimes required)

**Rate Limits:**
- Default: 100 requests per minute
- Varies by Shoptet plan
- The sync service implements rate limiting automatically

**API Response Example:**
```json
{
  "data": [
    {
      "id": 12345,
      "code": "PROD-001",
      "name": "Product Name",
      "description": "Product description",
      "price": 1999.00,
      "priceVat": 2418.79,
      "vatRate": 21,
      "availability": {
        "available": true,
        "stock": 10
      },
      "images": [
        {
          "url": "https://cdn.shoptet.cz/image.jpg",
          "order": 1
        }
      ],
      "categories": [
        {
          "id": 1,
          "name": "Category Name"
        }
      ],
      "url": "https://your-shop.shoptet.cz/product-url"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 100,
    "total": 250
  }
}
```

**Product Data Mapping for Shoptet:**

| Shoptet Field | Livero Field | Notes |
|--------------|--------------|-------|
| `id` | `externalId` | Product ID from Shoptet |
| `name` | `title` | Product name |
| `description` | `description` | Product description (HTML) |
| `price` | `price` | Price without VAT |
| `availability.available` | `availability` | Boolean |
| `images[].url` | `images` | Array of image URLs |
| `categories[].name` | `category` | First category name |
| `code` | `sku` | Product code/SKU |
| `url` | `url` | Product page URL |

**Important Notes:**
- Shoptet prices may include or exclude VAT - check your shop settings
- Product descriptions may contain HTML - handle accordingly
- Images are returned as an array of objects with `url` and `order` fields
- Categories are returned as an array - use the first category or concatenate

---

## Sync Process

### Automatic Sync

The Livero backend automatically syncs products:

1. **Delta Sync**: Every 30 minutes
   - Syncs only active stores
   - Fetches products from the platform API
   - Updates existing products or creates new ones

2. **Full Reconciliation**: Daily at 2 AM
   - Syncs all active stores
   - Performs complete product refresh
   - Removes products that no longer exist in the source platform

### Manual Sync

Store owners can trigger a manual sync from the dashboard:

1. Log in to **Store Dashboard**
2. Click **Sync Products** button
3. Wait for sync to complete (usually 1-5 minutes)
4. View sync logs to see results

### Sync Process Flow

```
1. Store owner configures platform credentials
2. Backend validates credentials
3. Sync job fetches products from platform API
4. Products are transformed to Livero format
5. Products are upserted (create or update) in database
6. Sync log is created with results
7. Store owner can view sync status in dashboard
```

### Product Data Mapping

Products are mapped from platform format to Livero format:

| Platform Field | Livero Field | Notes |
|---------------|--------------|-------|
| `id` | `externalId` | Platform's product ID |
| `title` / `name` | `title` | Product name |
| `description` / `body_html` | `description` | Product description |
| `price` / `regular_price` | `price` | Product price |
| `images` / `media` | `images` | Array of image URLs |
| `category` / `product_type` | `category` | Product category |
| `in_stock` / `available` | `availability` | Boolean |
| `sku` / `code` | `sku` | Stock keeping unit |
| `url` / `permalink` | `url` | Product page URL |

**Note:** Field names vary by platform. See platform-specific sections for detailed mappings.

### Sync Logs

Each sync creates a log entry with:
- **Status**: `SUCCESS`, `FAILED`, or `IN_PROGRESS`
- **Items Synced**: Number of products synced
- **Message**: Success or error message
- **Errors**: Array of any product-level errors
- **Started At**: Sync start timestamp
- **Completed At**: Sync completion timestamp

---

## Troubleshooting

### Common Issues

#### 1. Authentication Errors (401 Unauthorized)

**Shopify:**
- Verify API key and secret are correct
- Check that the app is installed and active
- Ensure API scopes are enabled

**WooCommerce:**
- Verify consumer key and secret are correct
- Check that the API key has "Read" permissions
- Ensure the API key user has admin access

**Shopware:**
- Verify access key and secret key are correct
- Check that integration has proper permissions
- Ensure the integration is active

**Shoptet:**
- Verify API key and shop ID are correct
- Check that API access is enabled in Shoptet settings
- Ensure you're using the correct shop URL format
- Verify HTTP Basic Authentication format (shopId:apiKey)

#### 2. Products Not Syncing

- Check sync logs in the store dashboard
- Verify store status is "ACTIVE"
- Check platform API is accessible
- Review backend logs for errors

#### 3. Rate Limiting Errors

- The sync service automatically handles rate limits
- If issues persist, check platform-specific rate limits
- Consider reducing sync frequency for large stores

#### 4. Missing Product Data

- Verify products exist in the source platform
- Check that products are published/active
- Ensure API permissions include product read access

### Testing Your Integration

1. **Test API Connection:**
   ```bash
   # Shopify
   curl -H "X-Shopify-Access-Token: YOUR_TOKEN" \
        https://your-store.myshopify.com/admin/api/2024-01/products.json
   
   # WooCommerce
   curl -u "consumer_key:consumer_secret" \
        https://yourdomain.com/wp-json/wc/v3/products
   
   # Shopware
   curl -H "sw-access-key: YOUR_KEY" \
        -X POST https://yourdomain.com/api/search/product \
        -H "Content-Type: application/json" \
        -d '{"limit": 10}'
   ```

2. **Check Sync Logs:**
   - Go to Store Dashboard
   - View "Sync Logs" section
   - Check for error messages

3. **Verify Products:**
   - After sync, check products appear in your city marketplace
   - Verify product data is correct
   - Check images load properly

### Support

For platform-specific API documentation:

- **Shopify**: https://shopify.dev/docs/api/admin-rest
- **WooCommerce**: https://woocommerce.github.io/woocommerce-rest-api-docs/
- **Shopware**: https://developer.shopware.com/docs/guides/integrations-api/
- **Shoptet**: https://shoptet.cz/api-doc/ (Czech/Slovak documentation)

---

## Implementation Notes

### Current Status

The sync service currently has placeholder implementations for all three platforms. To enable full functionality:

1. **Shopify**: Implement actual API calls using Shopify Admin API
2. **WooCommerce**: Implement actual API calls using WooCommerce REST API
3. **Shopware**: Implement actual API calls using Shopware Store/Admin API
4. **Shoptet**: Implement actual API calls using Shoptet REST API

### Code Location

- Sync service: `backend/src/services/sync.service.ts`
- Sync jobs: `backend/src/jobs/sync.jobs.ts`
- Store routes: `backend/src/routes/store.routes.ts`

### Next Steps

1. **Add SHOPTET to Platform Enum** (Required for Shoptet support):
   - Update `backend/prisma/schema.prisma` to add `SHOPTET` to the Platform enum
   - Create and run migration: `npm run prisma:migrate`
   - Regenerate Prisma client: `npm run prisma:generate`

2. Replace mock implementations with real API calls
3. Add error handling and retry logic
4. Implement rate limiting per platform
5. Add webhook support for real-time updates (optional)
6. Add product variant support (if needed)

---

## Security Best Practices

1. **Encrypt Credentials**: Store API credentials encrypted in the database
2. **Use HTTPS**: Always use HTTPS for API calls
3. **Rotate Keys**: Regularly rotate API keys and secrets
4. **Limit Permissions**: Only grant necessary API permissions
5. **Monitor Access**: Log all API access for security auditing
6. **Rate Limiting**: Implement rate limiting to prevent abuse

---

## Additional Resources

- [Shopify API Documentation](https://shopify.dev/docs/api)
- [WooCommerce REST API Documentation](https://woocommerce.github.io/woocommerce-rest-api-docs/)
- [Shopware API Documentation](https://developer.shopware.com/docs/guides/integrations-api/)
- [Livero Backend README](../backend/README.md)

