import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@livero.com' },
    update: {},
    create: {
      email: 'admin@livero.com',
      password: adminPassword,
      role: 'ADMIN',
      admin: {
        create: {
          name: 'Admin User',
        },
      },
    },
  });
  console.log('✅ Admin user created');

  // Create Vienna city
  const vienna = await prisma.city.upsert({
    where: { slug: 'vienna' },
    update: {},
    create: {
      name: 'Vienna',
      slug: 'vienna',
      country: 'Austria',
      currency: 'EUR',
      monthlyFee: 500,
      isActive: true,
    },
  });
  console.log('✅ Vienna city created');

  // Create 3 stores
  const stores = [
    {
      email: 'store1@example.com',
      name: 'Nordic Living',
      description: 'Scandinavian-inspired furniture and home decor',
      platform: 'SHOPIFY',
      logoUrl: 'https://images.unsplash.com/photo-1567016432779-094069958ea5?w=200',
    },
    {
      email: 'store2@example.com',
      name: 'Casa Moderna',
      description: 'Modern Italian furniture and design',
      platform: 'WOOCOMMERCE',
      logoUrl: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=200',
    },
    {
      email: 'store3@example.com',
      name: 'Vintage Treasures',
      description: 'Curated vintage and antique furniture',
      platform: 'SHOPWARE',
      logoUrl: 'https://images.unsplash.com/photo-1618220179428-22790b461013?w=200',
    },
  ];

  const storePassword = await bcrypt.hash('store123', 10);

  for (const storeData of stores) {
    const user = await prisma.user.upsert({
      where: { email: storeData.email },
      update: {},
      create: {
        email: storeData.email,
        password: storePassword,
        role: 'STORE',
      },
    });

    const slug = storeData.name.toLowerCase().replace(/\s+/g, '-');

    await prisma.store.upsert({
      where: { slug },
      update: {},
      create: {
        userId: user.id,
        cityId: vienna.id,
        name: storeData.name,
        slug,
        description: storeData.description,
        logoUrl: storeData.logoUrl,
        websiteUrl: `https://${slug}.example.com`,
        platform: storeData.platform as any,
        credentials: {
          shopUrl: `https://${slug}.myshopify.com`,
          apiKey: 'demo-key',
          apiSecret: 'demo-secret',
        },
        status: 'ACTIVE',
      },
    });

    console.log(`✅ Store created: ${storeData.name}`);
  }

  // Create sample products
  const activeStores = await prisma.store.findMany({
    where: { status: 'ACTIVE' },
  });

  const productTemplates = [
    {
      title: 'Modern Velvet Sofa',
      description: 'Luxurious 3-seater sofa with premium velvet upholstery',
      price: 1299,
      category: 'Sofas & Couches',
      images: { urls: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800'] },
    },
    {
      title: 'Scandinavian Dining Table',
      description: 'Solid oak dining table with clean lines',
      price: 899,
      category: 'Tables',
      images: { urls: ['https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800'] },
    },
    {
      title: 'Mid-Century Lounge Chair',
      description: 'Iconic design with walnut frame and leather cushions',
      price: 649,
      category: 'Chairs',
      images: { urls: ['https://images.unsplash.com/photo-1592078615290-033ee584e267?w=800'] },
    },
    {
      title: 'Minimalist Platform Bed',
      description: 'Low-profile bed frame in natural oak',
      price: 799,
      category: 'Beds',
      images: { urls: ['https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800'] },
    },
    {
      title: 'Industrial Bookshelf',
      description: 'Metal and wood bookshelf with 5 shelves',
      price: 449,
      category: 'Storage',
      images: { urls: ['https://images.unsplash.com/photo-1594620302200-9a762244a156?w=800'] },
    },
    {
      title: 'Brass Floor Lamp',
      description: 'Adjustable arc floor lamp with marble base',
      price: 299,
      category: 'Lighting',
      images: { urls: ['https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=800'] },
    },
    {
      title: 'Ceramic Vase Set',
      description: 'Handcrafted ceramic vases in neutral tones',
      price: 89,
      category: 'Decor',
      images: { urls: ['https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=800'] },
    },
    {
      title: 'Wool Area Rug',
      description: 'Hand-woven wool rug with geometric pattern',
      price: 599,
      category: 'Textiles',
      images: { urls: ['https://images.unsplash.com/photo-1616594266889-a366f57571b8?w=800'] },
    },
    {
      title: 'Leather Accent Chair',
      description: 'Full-grain leather chair with tufted back',
      price: 899,
      category: 'Chairs',
      images: { urls: ['https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800'] },
    },
    {
      title: 'Glass Coffee Table',
      description: 'Tempered glass top with brass frame',
      price: 399,
      category: 'Tables',
      images: { urls: ['https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=800'] },
    },
  ];

  for (const store of activeStores) {
    // Create 8-10 products per store
    const numProducts = 8 + Math.floor(Math.random() * 3);

    for (let i = 0; i < numProducts; i++) {
      const template = productTemplates[i % productTemplates.length];

      await prisma.product.create({
        data: {
          storeId: store.id,
          cityId: store.cityId,
          externalId: `${store.slug}-${i + 1}`,
          title: template.title,
          description: template.description,
          price: template.price + Math.floor(Math.random() * 200) - 100,
          currency: 'EUR',
          images: template.images,
          category: template.category,
          availability: true,
          sku: `SKU-${store.slug}-${i + 1}`,
          url: `${store.websiteUrl}/products/${i + 1}`,
        },
      });
    }

    console.log(`✅ Created ${numProducts} products for ${store.name}`);
  }

  // Create some sample events
  const products = await prisma.product.findMany({ take: 20 });

  for (const product of products) {
    const views = Math.floor(Math.random() * 50) + 10;
    const clicks = Math.floor(views * 0.2);
    const requests = Math.floor(clicks * 0.3);

    // Create view events
    for (let i = 0; i < views; i++) {
      await prisma.event.create({
        data: {
          productId: product.id,
          type: 'VIEW',
          createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
        },
      });
    }

    // Create click events
    for (let i = 0; i < clicks; i++) {
      await prisma.event.create({
        data: {
          productId: product.id,
          type: 'CLICK',
          createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
        },
      });
    }

    // Create request events
    for (let i = 0; i < requests; i++) {
      await prisma.event.create({
        data: {
          productId: product.id,
          type: 'REQUEST',
          createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
        },
      });
    }
  }

  console.log('✅ Sample events created');

  console.log('\n🎉 Seed completed successfully!');
  console.log('\n📝 Login credentials:');
  console.log('Admin: admin@livero.com / admin123');
  console.log('Store 1: store1@example.com / store123');
  console.log('Store 2: store2@example.com / store123');
  console.log('Store 3: store3@example.com / store123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

