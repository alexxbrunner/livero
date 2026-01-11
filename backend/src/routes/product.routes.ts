import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get bestsellers (most viewed products)
router.get('/bestsellers', async (req: any, res: any) => {
  try {
    const limit = parseInt(req.query.limit as string) || 12;

    // Get products with most views
    const productViews = await prisma.event.groupBy({
      by: ['productId'],
      where: {
        type: 'VIEW',
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
        },
      },
      _count: {
        productId: true,
      },
      orderBy: {
        _count: {
          productId: 'desc',
        },
      },
      take: limit,
    });

    if (productViews.length === 0) {
      // If no views, return most recent products
      const products = await prisma.product.findMany({
        where: {
          availability: true,
        },
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
        orderBy: { createdAt: 'desc' },
        take: limit,
      });
      return res.json({ products });
    }

    const productIds = productViews.map((pv) => pv.productId);

    const products = await prisma.product.findMany({
      where: {
        id: { in: productIds },
        availability: true,
      },
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
    });

    // Sort products by view count
    const sortedProducts = productIds
      .map((id) => products.find((p) => p.id === id))
      .filter((p): p is NonNullable<typeof p> => p !== undefined);

    res.json({ products: sortedProducts });
  } catch (error) {
    console.error('Error fetching bestsellers:', error);
    res.status(500).json({ error: 'Failed to fetch bestsellers' });
  }
});

// Get products with filters
router.get('/', async (req: any, res: any) => {
  try {
    const {
      citySlug,
      storeId,
      category,
      minPrice,
      maxPrice,
      search,
      page = '1',
      limit = '24',
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Build where clause
    const where: any = {
      availability: true,
    };

    if (citySlug) {
      const city = await prisma.city.findUnique({
        where: { slug: citySlug as string },
      });
      if (city) {
        where.cityId = city.id;
      }
    }

    if (storeId) {
      where.storeId = storeId;
    }

    if (category) {
      where.category = category;
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice as string);
      if (maxPrice) where.price.lte = parseFloat(maxPrice as string);
    }

    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
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
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum,
      }),
      prisma.product.count({ where }),
    ]);

    res.json({
      products,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Get product by ID
router.get('/:id', async (req: any, res: any) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        store: {
          select: {
            id: true,
            name: true,
            slug: true,
            logoUrl: true,
            websiteUrl: true,
            description: true,
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
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Track view event
    await prisma.event.create({
      data: {
        productId: id,
        type: 'VIEW',
      },
    });

    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// Track click event
router.post('/:id/click', async (req: any, res: any) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    await prisma.event.create({
      data: {
        productId: id,
        type: 'CLICK',
      },
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Error tracking click:', error);
    res.status(500).json({ error: 'Failed to track click' });
  }
});

// Track request event
router.post('/:id/request', async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { metadata } = req.body;

    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    await prisma.event.create({
      data: {
        productId: id,
        type: 'REQUEST',
        metadata,
      },
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Error tracking request:', error);
    res.status(500).json({ error: 'Failed to track request' });
  }
});

// Get categories for a city
router.get('/categories/:citySlug', async (req: any, res: any) => {
  try {
    const { citySlug } = req.params;

    const city = await prisma.city.findUnique({
      where: { slug: citySlug },
    });

    if (!city) {
      return res.status(404).json({ error: 'City not found' });
    }

    const categories = await prisma.product.findMany({
      where: {
        cityId: city.id,
        availability: true,
        category: { not: null },
      },
      select: {
        category: true,
      },
      distinct: ['category'],
    });

    const categoryList = categories
      .map((c) => c.category)
      .filter((c): c is string => c !== null);

    res.json(categoryList);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

export default router;

