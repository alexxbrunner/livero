import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Search products and brands
router.get('/', async (req, res) => {
  try {
    const { q, cityId, limit = 10 } = req.query;

    if (!q || typeof q !== 'string') {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const searchQuery = q.trim().toLowerCase();
    const limitNum = parseInt(limit as string, 10);

    // Build where clause for city filter
    const cityFilter = cityId ? { cityId: cityId as string } : {};

    // Search products
    const products = await prisma.product.findMany({
      where: {
        ...cityFilter,
        OR: [
          {
            title: {
              contains: searchQuery,
              mode: 'insensitive',
            },
          },
          {
            description: {
              contains: searchQuery,
              mode: 'insensitive',
            },
          },
          {
            brand: {
              contains: searchQuery,
              mode: 'insensitive',
            },
          },
          {
            store: {
              name: {
                contains: searchQuery,
                mode: 'insensitive',
              },
            },
          },
        ],
      },
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
            slug: true,
            currency: true,
          },
        },
      },
      take: limitNum,
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Search brands (get unique brands from products)
    const brandProducts = await prisma.product.findMany({
      where: {
        ...cityFilter,
        brand: {
          not: null,
          contains: searchQuery,
          mode: 'insensitive',
        },
      },
      select: {
        brand: true,
        brandDescription: true,
      },
      distinct: ['brand'],
      take: 5,
    });

    // Get unique brands
    const brands = brandProducts
      .filter((p) => p.brand)
      .map((p) => ({
        name: p.brand,
        description: p.brandDescription,
      }));

    // Search stores
    const stores = await prisma.store.findMany({
      where: {
        ...cityFilter,
        status: 'ACTIVE',
        name: {
          contains: searchQuery,
          mode: 'insensitive',
        },
      },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        logoUrl: true,
        city: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
      take: 5,
    });

    res.json({
      query: q,
      results: {
        products,
        brands,
        stores,
      },
      total: products.length + brands.length + stores.length,
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Search failed' });
  }
});

// Quick search suggestions (for autocomplete)
router.get('/suggestions', async (req, res) => {
  try {
    const { q, cityId } = req.query;

    if (!q || typeof q !== 'string') {
      return res.json({ suggestions: [] });
    }

    const searchQuery = q.trim().toLowerCase();
    const cityFilter = cityId ? { cityId: cityId as string } : {};

    // Get top product names
    const productSuggestions = await prisma.product.findMany({
      where: {
        ...cityFilter,
        OR: [
          {
            title: {
              contains: searchQuery,
              mode: 'insensitive',
            },
          },
          {
            brand: {
              contains: searchQuery,
              mode: 'insensitive',
            },
          },
        ],
      },
      select: {
        title: true,
        brand: true,
      },
      take: 5,
    });

    // Create suggestions array
    const suggestions: { text: string; type: string }[] = [];

    productSuggestions.forEach((product) => {
      if (product.title.toLowerCase().includes(searchQuery)) {
        suggestions.push({
          text: product.title,
          type: 'product',
        });
      }
      if (product.brand && product.brand.toLowerCase().includes(searchQuery)) {
        const exists = suggestions.find(
          (s) => s.text.toLowerCase() === product.brand!.toLowerCase()
        );
        if (!exists) {
          suggestions.push({
            text: product.brand,
            type: 'brand',
          });
        }
      }
    });

    res.json({ suggestions: suggestions.slice(0, 8) });
  } catch (error) {
    console.error('Suggestions error:', error);
    res.status(500).json({ error: 'Failed to get suggestions' });
  }
});

export default router;

