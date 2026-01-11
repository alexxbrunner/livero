import { PrismaClient, Platform } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();

interface ProductData {
  externalId: string;
  title: string;
  description?: string;
  price: number;
  images?: any;
  category?: string;
  availability: boolean;
  sku?: string;
  url?: string;
}

export async function syncStoreProducts(storeId: string): Promise<void> {
  const syncLog = await prisma.syncLog.create({
    data: {
      storeId,
      status: 'IN_PROGRESS',
      message: 'Starting product sync',
    },
  });

  try {
    const store = await prisma.store.findUnique({
      where: { id: storeId },
      include: { city: true },
    });

    if (!store) {
      throw new Error('Store not found');
    }

    let products: ProductData[] = [];

    switch (store.platform) {
      case 'SHOPIFY':
        products = await syncShopify(store.credentials as any);
        break;
      case 'WOOCOMMERCE':
        products = await syncWooCommerce(store.credentials as any);
        break;
      case 'SHOPWARE':
        products = await syncShopware(store.credentials as any);
        break;
      case 'SHOPTET':
        products = await syncShoptet(store.credentials as any);
        break;
    }

    // Upsert products
    let synced = 0;
    const errors: any[] = [];

    for (const productData of products) {
      try {
        await prisma.product.upsert({
          where: {
            storeId_externalId: {
              storeId: store.id,
              externalId: productData.externalId,
            },
          },
          create: {
            storeId: store.id,
            cityId: store.cityId,
            externalId: productData.externalId,
            title: productData.title,
            description: productData.description,
            price: productData.price,
            currency: store.city.currency,
            images: productData.images,
            category: productData.category,
            availability: productData.availability,
            sku: productData.sku,
            url: productData.url,
          },
          update: {
            title: productData.title,
            description: productData.description,
            price: productData.price,
            images: productData.images,
            category: productData.category,
            availability: productData.availability,
            sku: productData.sku,
            url: productData.url,
          },
        });
        synced++;
      } catch (error) {
        errors.push({
          product: productData.externalId,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    // Update store last sync
    await prisma.store.update({
      where: { id: storeId },
      data: { lastSyncAt: new Date() },
    });

    // Complete sync log
    await prisma.syncLog.update({
      where: { id: syncLog.id },
      data: {
        status: 'SUCCESS',
        message: `Synced ${synced} products`,
        itemsSynced: synced,
        errors: errors.length > 0 ? errors : undefined,
        completedAt: new Date(),
      },
    });
  } catch (error) {
    console.error('Sync error:', error);
    await prisma.syncLog.update({
      where: { id: syncLog.id },
      data: {
        status: 'FAILED',
        message: error instanceof Error ? error.message : 'Unknown error',
        completedAt: new Date(),
      },
    });
  }
}

async function syncShopify(credentials: any): Promise<ProductData[]> {
  // Mock implementation - replace with actual Shopify API calls
  const { shopUrl, apiKey, apiSecret } = credentials;

  try {
    // Example: GET /admin/api/2024-01/products.json
    // This is a mock - implement actual Shopify API integration
    console.log('Syncing from Shopify:', shopUrl);

    // Return mock data for now
    return generateMockProducts(10);
  } catch (error) {
    console.error('Shopify sync error:', error);
    throw error;
  }
}

async function syncWooCommerce(credentials: any): Promise<ProductData[]> {
  // Mock implementation - replace with actual WooCommerce API calls
  const { siteUrl, consumerKey, consumerSecret } = credentials;

  try {
    // Example: GET /wp-json/wc/v3/products
    // This is a mock - implement actual WooCommerce API integration
    console.log('Syncing from WooCommerce:', siteUrl);

    // Return mock data for now
    return generateMockProducts(10);
  } catch (error) {
    console.error('WooCommerce sync error:', error);
    throw error;
  }
}

async function syncShopware(credentials: any): Promise<ProductData[]> {
  // Mock implementation - replace with actual Shopware API calls
  const { shopUrl, accessKey, secretKey } = credentials;

  try {
    // Example: POST /api/search/product
    // This is a mock - implement actual Shopware API integration
    console.log('Syncing from Shopware:', shopUrl);

    // Return mock data for now
    return generateMockProducts(10);
  } catch (error) {
    console.error('Shopware sync error:', error);
    throw error;
  }
}

async function syncShoptet(credentials: any): Promise<ProductData[]> {
  // Mock implementation - replace with actual Shoptet API calls
  const { shopUrl, apiKey, shopId } = credentials;

  try {
    // Example: GET /api/products
    // This is a mock - implement actual Shoptet API integration
    console.log('Syncing from Shoptet:', shopUrl);

    // Return mock data for now
    return generateMockProducts(10);
  } catch (error) {
    console.error('Shoptet sync error:', error);
    throw error;
  }
}

function generateMockProducts(count: number): ProductData[] {
  const categories = [
    'Sofas & Couches',
    'Chairs',
    'Tables',
    'Beds',
    'Storage',
    'Lighting',
    'Decor',
    'Textiles',
  ];

  const products: ProductData[] = [];

  for (let i = 1; i <= count; i++) {
    products.push({
      externalId: `PROD-${Date.now()}-${i}`,
      title: `Product ${i}`,
      description: `Beautiful interior product description for item ${i}`,
      price: Math.floor(Math.random() * 2000) + 100,
      images: {
        urls: [
          `https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800`,
        ],
      },
      category: categories[Math.floor(Math.random() * categories.length)],
      availability: true,
      sku: `SKU-${i}`,
      url: `https://example.com/products/${i}`,
    });
  }

  return products;
}

