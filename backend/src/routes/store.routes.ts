import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { body, validationResult } from 'express-validator';
import { authenticate, requireRole, AuthRequest } from '../middleware/auth.middleware';
import { syncStoreProducts } from '../services/sync.service';

const router = Router();
const prisma = new PrismaClient();

// Create store (requires authentication)
router.post(
  '/',
  authenticate,
  requireRole('STORE'),
  [
    body('name').notEmpty(),
    body('cityId').notEmpty(),
    body('platform').isIn(['SHOPIFY', 'WOOCOMMERCE', 'SHOPWARE']),
    body('credentials').isObject(),
  ],
  async (req: AuthRequest, res: any) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, cityId, platform, credentials, description, logoUrl, websiteUrl } = req.body;

      // Check if user already has a store
      const existingStore = await prisma.store.findUnique({
        where: { userId: req.user!.id },
      });

      if (existingStore) {
        return res.status(400).json({ error: 'User already has a store' });
      }

      // Generate slug from name
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

      // Create store
      const store = await prisma.store.create({
        data: {
          userId: req.user!.id,
          cityId,
          name,
          slug,
          platform,
          credentials,
          description,
          logoUrl,
          websiteUrl,
          status: 'PENDING', // Requires admin approval
        },
        include: {
          city: true,
        },
      });

      res.json(store);
    } catch (error) {
      console.error('Error creating store:', error);
      res.status(500).json({ error: 'Failed to create store' });
    }
  }
);

// Get current user's store
router.get('/me', authenticate, requireRole('STORE'), async (req: AuthRequest, res) => {
  try {
    const store = await prisma.store.findUnique({
      where: { userId: req.user!.id },
      include: {
        city: true,
        _count: {
          select: { products: true },
        },
      },
    });

    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }

    res.json(store);
  } catch (error) {
    console.error('Error fetching store:', error);
    res.status(500).json({ error: 'Failed to fetch store' });
  }
});

// Trigger manual sync
router.post('/me/sync', authenticate, requireRole('STORE'), async (req: AuthRequest, res) => {
  try {
    const store = await prisma.store.findUnique({
      where: { userId: req.user!.id },
    });

    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }

    if (store.status !== 'ACTIVE') {
      return res.status(400).json({ error: 'Store must be active to sync' });
    }

    // Start sync in background
    syncStoreProducts(store.id).catch(console.error);

    res.json({ message: 'Sync started' });
  } catch (error) {
    console.error('Error starting sync:', error);
    res.status(500).json({ error: 'Failed to start sync' });
  }
});

// Get sync logs
router.get('/me/sync-logs', authenticate, requireRole('STORE'), async (req: AuthRequest, res) => {
  try {
    const store = await prisma.store.findUnique({
      where: { userId: req.user!.id },
    });

    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }

    const logs = await prisma.syncLog.findMany({
      where: { storeId: store.id },
      orderBy: { startedAt: 'desc' },
      take: 20,
    });

    res.json(logs);
  } catch (error) {
    console.error('Error fetching sync logs:', error);
    res.status(500).json({ error: 'Failed to fetch sync logs' });
  }
});

// Get all active stores (public)
router.get('/', async (req: any, res: any) => {
  try {
    const { cityId, search } = req.query;

    const where: any = {
      status: 'ACTIVE',
    };

    if (cityId) {
      where.cityId = cityId;
    }

    if (search) {
      where.name = {
        contains: search,
        mode: 'insensitive',
      };
    }

    const stores = await prisma.store.findMany({
      where,
      include: {
        city: true,
        _count: {
          select: { products: true },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    // Remove sensitive data
    const publicStores = stores.map((store) => {
      const { credentials, userId, ...publicStore } = store;
      return publicStore;
    });

    res.json(publicStores);
  } catch (error) {
    console.error('Error fetching stores:', error);
    res.status(500).json({ error: 'Failed to fetch stores' });
  }
});

// Get store by slug (public)
router.get('/:slug', async (req: any, res: any) => {
  try {
    const { slug } = req.params;

    const store = await prisma.store.findUnique({
      where: { slug },
      include: {
        city: true,
        _count: {
          select: { products: true },
        },
      },
    });

    if (!store || store.status !== 'ACTIVE') {
      return res.status(404).json({ error: 'Store not found' });
    }

    // Remove sensitive data
    const { credentials, userId, ...publicStore } = store;

    res.json(publicStore);
  } catch (error) {
    console.error('Error fetching store:', error);
    res.status(500).json({ error: 'Failed to fetch store' });
  }
});

export default router;

