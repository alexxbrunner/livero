import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { body, validationResult } from 'express-validator';
import { authenticate, requireRole, AuthRequest } from '../middleware/auth.middleware';

const router = Router();
const prisma = new PrismaClient();

// All routes require ADMIN role
router.use(authenticate);
router.use(requireRole('ADMIN'));

// Create city
router.post(
  '/cities',
  [
    body('name').notEmpty(),
    body('slug').notEmpty(),
    body('country').notEmpty(),
    body('monthlyFee').isNumeric(),
  ],
  async (req: AuthRequest, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, slug, country, currency, monthlyFee } = req.body;

      const city = await prisma.city.create({
        data: {
          name,
          slug,
          country,
          currency: currency || 'EUR',
          monthlyFee,
        },
      });

      res.json(city);
    } catch (error) {
      console.error('Error creating city:', error);
      res.status(500).json({ error: 'Failed to create city' });
    }
  }
);

// Get all cities (including inactive)
router.get('/cities', async (req: AuthRequest, res) => {
  try {
    const cities = await prisma.city.findMany({
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

// Update city
router.patch('/cities/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const city = await prisma.city.update({
      where: { id },
      data: updates,
    });

    res.json(city);
  } catch (error) {
    console.error('Error updating city:', error);
    res.status(500).json({ error: 'Failed to update city' });
  }
});

// Get all stores
router.get('/stores', async (req: AuthRequest, res) => {
  try {
    const { status } = req.query;

    const where: any = {};
    if (status) {
      where.status = status;
    }

    const stores = await prisma.store.findMany({
      where,
      include: {
        city: true,
        user: {
          select: {
            email: true,
          },
        },
        _count: {
          select: { products: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(stores);
  } catch (error) {
    console.error('Error fetching stores:', error);
    res.status(500).json({ error: 'Failed to fetch stores' });
  }
});

// Update store status
router.patch('/stores/:id/status', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['PENDING', 'ACTIVE', 'PAUSED', 'REJECTED'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const store = await prisma.store.update({
      where: { id },
      data: { status },
      include: {
        city: true,
        user: {
          select: {
            email: true,
          },
        },
      },
    });

    res.json(store);
  } catch (error) {
    console.error('Error updating store status:', error);
    res.status(500).json({ error: 'Failed to update store status' });
  }
});

// Get dashboard KPIs
router.get('/dashboard', async (req: AuthRequest, res) => {
  try {
    const { cityId } = req.query;

    const whereCity = cityId ? { id: cityId as string } : {};
    const whereStore = cityId ? { cityId: cityId as string } : {};
    const whereProduct = cityId ? { cityId: cityId as string } : {};

    const [
      totalCities,
      totalStores,
      activeStores,
      pendingStores,
      totalProducts,
      totalViews,
      totalClicks,
    ] = await Promise.all([
      prisma.city.count({ where: { ...whereCity, isActive: true } }),
      prisma.store.count({ where: whereStore }),
      prisma.store.count({ where: { ...whereStore, status: 'ACTIVE' } }),
      prisma.store.count({ where: { ...whereStore, status: 'PENDING' } }),
      prisma.product.count({ where: { ...whereProduct, availability: true } }),
      prisma.event.count({
        where: {
          type: 'VIEW',
          product: whereProduct,
        },
      }),
      prisma.event.count({
        where: {
          type: 'CLICK',
          product: whereProduct,
        },
      }),
    ]);

    // Get recent sync logs
    const recentSyncs = await prisma.syncLog.findMany({
      where: cityId ? { store: { cityId: cityId as string } } : {},
      include: {
        store: {
          select: {
            name: true,
          },
        },
      },
      orderBy: { startedAt: 'desc' },
      take: 10,
    });

    res.json({
      overview: {
        totalCities,
        totalStores,
        activeStores,
        pendingStores,
        totalProducts,
        totalViews,
        totalClicks,
        conversionRate: totalViews > 0 ? (totalClicks / totalViews) * 100 : 0,
      },
      recentSyncs,
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

export default router;

