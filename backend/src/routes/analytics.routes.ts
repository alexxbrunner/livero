import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, requireRole, AuthRequest } from '../middleware/auth.middleware';

const router = Router();
const prisma = new PrismaClient();

// Get store analytics
router.get('/store', authenticate, requireRole('STORE'), async (req: AuthRequest, res) => {
  try {
    const { period = '30' } = req.query;
    const days = parseInt(period as string);

    const store = await prisma.store.findUnique({
      where: { userId: req.user!.id },
      include: { city: true },
    });

    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const [totalViews, totalClicks, totalRequests, topProducts] = await Promise.all([
      prisma.event.count({
        where: {
          type: 'VIEW',
          product: { storeId: store.id },
          createdAt: { gte: startDate },
        },
      }),
      prisma.event.count({
        where: {
          type: 'CLICK',
          product: { storeId: store.id },
          createdAt: { gte: startDate },
        },
      }),
      prisma.event.count({
        where: {
          type: 'REQUEST',
          product: { storeId: store.id },
          createdAt: { gte: startDate },
        },
      }),
      prisma.event.groupBy({
        by: ['productId'],
        where: {
          product: { storeId: store.id },
          createdAt: { gte: startDate },
        },
        _count: true,
        orderBy: {
          _count: {
            productId: 'desc',
          },
        },
        take: 10,
      }),
    ]);

    // Get product details for top products
    const topProductDetails = await Promise.all(
      topProducts.map(async (tp) => {
        const product = await prisma.product.findUnique({
          where: { id: tp.productId },
          select: {
            id: true,
            title: true,
            price: true,
            images: true,
          },
        });
        return {
          ...product,
          views: tp._count,
        };
      })
    );

    const totalStoresInCity = await prisma.store.count({
      where: { cityId: store.cityId, status: 'ACTIVE' },
    });

    const marketingFund = totalStoresInCity * Number(store.city.monthlyFee) * 0.8;
    const storeContribution = Number(store.city.monthlyFee) * 0.8;

    res.json({
      period: days,
      traffic: {
        views: totalViews,
        clicks: totalClicks,
        requests: totalRequests,
        conversionRate: totalViews > 0 ? (totalClicks / totalViews) * 100 : 0,
      },
      topProducts: topProductDetails,
      billing: {
        monthlyFee: store.city.monthlyFee,
        cityMarketingFund: marketingFund,
        yourContribution: storeContribution,
        platformFee: Number(store.city.monthlyFee) * 0.2,
      },
    });
  } catch (error) {
    console.error('Error fetching store analytics:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

export default router;

