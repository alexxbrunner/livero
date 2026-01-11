import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get all active cities
router.get('/', async (req: any, res: any) => {
  try {
    const cities = await prisma.city.findMany({
      where: { isActive: true },
      include: {
        _count: {
          select: { stores: true, products: true },
        },
      },
      orderBy: { name: 'asc' },
    });

    res.json(cities);
  } catch (error) {
    console.error('Error fetching cities:', error);
    res.status(500).json({ error: 'Failed to fetch cities' });
  }
});

// Get city by slug
router.get('/:slug', async (req: any, res: any) => {
  try {
    const { slug } = req.params;

    const city = await prisma.city.findUnique({
      where: { slug },
      include: {
        stores: {
          where: { status: 'ACTIVE' },
          select: {
            id: true,
            name: true,
            slug: true,
            logoUrl: true,
            description: true,
          },
        },
        _count: {
          select: { products: true },
        },
      },
    });

    if (!city) {
      return res.status(404).json({ error: 'City not found' });
    }

    res.json(city);
  } catch (error) {
    console.error('Error fetching city:', error);
    res.status(500).json({ error: 'Failed to fetch city' });
  }
});

// Get city stats
router.get('/:slug/stats', async (req: any, res: any) => {
  try {
    const { slug } = req.params;

    const city = await prisma.city.findUnique({
      where: { slug },
    });

    if (!city) {
      return res.status(404).json({ error: 'City not found' });
    }

    const [totalStores, totalProducts, totalViews, totalClicks] = await Promise.all([
      prisma.store.count({
        where: { cityId: city.id, status: 'ACTIVE' },
      }),
      prisma.product.count({
        where: { cityId: city.id, availability: true },
      }),
      prisma.event.count({
        where: {
          type: 'VIEW',
          product: { cityId: city.id },
        },
      }),
      prisma.event.count({
        where: {
          type: 'CLICK',
          product: { cityId: city.id },
        },
      }),
    ]);

    const marketingFund = totalStores * Number(city.monthlyFee) * 0.8;

    res.json({
      city: {
        name: city.name,
        slug: city.slug,
        country: city.country,
        monthlyFee: city.monthlyFee,
      },
      stats: {
        totalStores,
        totalProducts,
        totalViews,
        totalClicks,
        marketingFund,
      },
    });
  } catch (error) {
    console.error('Error fetching city stats:', error);
    res.status(500).json({ error: 'Failed to fetch city stats' });
  }
});

export default router;

