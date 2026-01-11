import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();
const prisma = new PrismaClient();

// Get customer profile
router.get('/profile', authenticate, async (req: any, res: any) => {
  try {
    if (req.user.role !== 'CUSTOMER') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const customer = await prisma.customer.findUnique({
      where: { userId: req.user.userId },
      include: {
        user: {
          select: {
            email: true,
          },
        },
      },
    });

    if (!customer) {
      return res.status(404).json({ error: 'Customer profile not found' });
    }

    res.json(customer);
  } catch (error) {
    console.error('Error fetching customer profile:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Update customer profile
router.patch('/profile', authenticate, async (req: any, res: any) => {
  try {
    if (req.user.role !== 'CUSTOMER') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const { name, phone, address } = req.body;

    const customer = await prisma.customer.update({
      where: { userId: req.user.userId },
      data: {
        ...(name !== undefined && { name }),
        ...(phone !== undefined && { phone }),
        ...(address !== undefined && { address }),
      },
    });

    res.json(customer);
  } catch (error) {
    console.error('Error updating customer profile:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Get customer favorites
router.get('/favorites', authenticate, async (req: any, res: any) => {
  try {
    if (req.user.role !== 'CUSTOMER') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const customer = await prisma.customer.findUnique({
      where: { userId: req.user.userId },
    });

    if (!customer) {
      return res.status(404).json({ error: 'Customer profile not found' });
    }

    const favorites = await prisma.favorite.findMany({
      where: { customerId: customer.id },
      include: {
        product: {
          include: {
            store: {
              select: {
                id: true,
                name: true,
                slug: true,
                logoUrl: true,
              },
            },
            city: {
              select: {
                name: true,
                slug: true,
                currency: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ favorites });
  } catch (error) {
    console.error('Error fetching favorites:', error);
    res.status(500).json({ error: 'Failed to fetch favorites' });
  }
});

// Add product to favorites
router.post('/favorites/:productId', authenticate, async (req: any, res: any) => {
  try {
    if (req.user.role !== 'CUSTOMER') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const { productId } = req.params;

    const customer = await prisma.customer.findUnique({
      where: { userId: req.user.userId },
    });

    if (!customer) {
      return res.status(404).json({ error: 'Customer profile not found' });
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check if already favorited
    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        customerId_productId: {
          customerId: customer.id,
          productId,
        },
      },
    });

    if (existingFavorite) {
      return res.status(400).json({ error: 'Product already in favorites' });
    }

    const favorite = await prisma.favorite.create({
      data: {
        customerId: customer.id,
        productId,
      },
      include: {
        product: {
          include: {
            store: {
              select: {
                name: true,
                slug: true,
              },
            },
            city: {
              select: {
                name: true,
                currency: true,
              },
            },
          },
        },
      },
    });

    res.json({ favorite });
  } catch (error) {
    console.error('Error adding favorite:', error);
    res.status(500).json({ error: 'Failed to add favorite' });
  }
});

// Remove product from favorites
router.delete('/favorites/:productId', authenticate, async (req: any, res: any) => {
  try {
    if (req.user.role !== 'CUSTOMER') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const { productId } = req.params;

    const customer = await prisma.customer.findUnique({
      where: { userId: req.user.userId },
    });

    if (!customer) {
      return res.status(404).json({ error: 'Customer profile not found' });
    }

    await prisma.favorite.delete({
      where: {
        customerId_productId: {
          customerId: customer.id,
          productId,
        },
      },
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Error removing favorite:', error);
    res.status(500).json({ error: 'Failed to remove favorite' });
  }
});

// Check if product is favorited
router.get('/favorites/check/:productId', authenticate, async (req: any, res: any) => {
  try {
    if (req.user.role !== 'CUSTOMER') {
      return res.json({ isFavorite: false });
    }

    const { productId } = req.params;

    const customer = await prisma.customer.findUnique({
      where: { userId: req.user.userId },
    });

    if (!customer) {
      return res.json({ isFavorite: false });
    }

    const favorite = await prisma.favorite.findUnique({
      where: {
        customerId_productId: {
          customerId: customer.id,
          productId,
        },
      },
    });

    res.json({ isFavorite: !!favorite });
  } catch (error) {
    console.error('Error checking favorite:', error);
    res.json({ isFavorite: false });
  }
});

export default router;

