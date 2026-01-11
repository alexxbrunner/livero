import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, requireRole, AuthRequest } from '../middleware/auth.middleware';

const router = Router();
const prisma = new PrismaClient();

// Get billing information
router.get('/info', authenticate, requireRole('STORE'), async (req: AuthRequest, res) => {
  try {
    const store = await prisma.store.findUnique({
      where: { userId: req.user!.userId },
      include: {
        city: {
          select: {
            monthlyFee: true,
            currency: true,
            name: true,
          },
        },
      },
    });

    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }

    const billingInfo = {
      monthlyFee: store.city.monthlyFee,
      currency: store.city.currency,
      cityName: store.city.name,
      marketingShare: Number(store.city.monthlyFee) * 0.8,
      platformFee: Number(store.city.monthlyFee) * 0.2,
      nextBillingDate: getNextBillingDate(store.createdAt),
      status: store.status,
    };

    res.json(billingInfo);
  } catch (error) {
    console.error('Error fetching billing info:', error);
    res.status(500).json({ error: 'Failed to fetch billing information' });
  }
});

// Get invoices
router.get('/invoices', authenticate, requireRole('STORE'), async (req: AuthRequest, res) => {
  try {
    const store = await prisma.store.findUnique({
      where: { userId: req.user!.userId },
      include: {
        city: true,
      },
    });

    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }

    // Generate invoices based on store creation date
    const invoices = generateInvoices(store);

    res.json(invoices);
  } catch (error) {
    console.error('Error fetching invoices:', error);
    res.status(500).json({ error: 'Failed to fetch invoices' });
  }
});

// Download invoice (returns invoice data for PDF generation)
router.get('/invoices/:invoiceId/download', authenticate, requireRole('STORE'), async (req: AuthRequest, res) => {
  try {
    const { invoiceId } = req.params;

    const store = await prisma.store.findUnique({
      where: { userId: req.user!.userId },
      include: {
        city: true,
      },
    });

    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }

    // Generate invoice data
    const invoice = generateInvoiceData(invoiceId, store);

    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    res.json(invoice);
  } catch (error) {
    console.error('Error downloading invoice:', error);
    res.status(500).json({ error: 'Failed to download invoice' });
  }
});

// Helper functions
function getNextBillingDate(createdAt: Date): Date {
  const now = new Date();
  const created = new Date(createdAt);
  const billingDay = created.getDate();
  
  const nextBilling = new Date(now.getFullYear(), now.getMonth(), billingDay);
  
  if (nextBilling <= now) {
    nextBilling.setMonth(nextBilling.getMonth() + 1);
  }
  
  return nextBilling;
}

function generateInvoices(store: any) {
  const invoices = [];
  const startDate = new Date(store.createdAt);
  const now = new Date();
  
  let currentDate = new Date(startDate);
  let invoiceNumber = 1000;
  
  while (currentDate < now) {
    const invoiceDate = new Date(currentDate);
    const nextMonth = new Date(currentDate);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    
    const isPaid = currentDate < now;
    
    invoices.push({
      id: `INV-${invoiceNumber}`,
      invoiceNumber: `INV-${invoiceNumber}`,
      date: invoiceDate.toISOString(),
      dueDate: invoiceDate.toISOString(),
      amount: Number(store.city.monthlyFee),
      currency: store.city.currency || 'EUR',
      status: isPaid ? 'paid' : 'pending',
      period: {
        start: invoiceDate.toISOString(),
        end: nextMonth.toISOString(),
      },
      storeName: store.name,
      cityName: store.city.name,
    });
    
    currentDate = nextMonth;
    invoiceNumber++;
  }
  
  return invoices.reverse(); // Most recent first
}

function generateInvoiceData(invoiceId: string, store: any) {
  const invoices = generateInvoices(store);
  const invoice = invoices.find(inv => inv.id === invoiceId);
  
  if (!invoice) return null;
  
  return {
    ...invoice,
    store: {
      name: store.name,
      address: 'Store Address', // Would come from store profile
      email: store.user?.email || 'store@example.com',
    },
    company: {
      name: 'Livero',
      address: 'Ringstraße 1, 1010 Vienna, Austria',
      email: 'billing@livero.com',
      taxId: 'ATU12345678',
    },
    lineItems: [
      {
        description: `Livero Store Membership - ${store.city.name}`,
        quantity: 1,
        unitPrice: Number(store.city.monthlyFee),
        total: Number(store.city.monthlyFee),
      },
    ],
    subtotal: Number(store.city.monthlyFee),
    tax: 0,
    total: Number(store.city.monthlyFee),
  };
}

export default router;

