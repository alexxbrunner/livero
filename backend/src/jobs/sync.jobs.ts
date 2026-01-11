import cron from 'node-cron';
import { PrismaClient } from '@prisma/client';
import { syncStoreProducts } from '../services/sync.service';

const prisma = new PrismaClient();

export function startSyncJobs() {
  // Delta sync every 30 minutes
  cron.schedule('*/30 * * * *', async () => {
    console.log('Running scheduled delta sync...');
    await runSync();
  });

  // Nightly reconciliation at 2 AM
  cron.schedule('0 2 * * *', async () => {
    console.log('Running nightly reconciliation sync...');
    await runSync(true);
  });
}

async function runSync(fullReconciliation = false) {
  try {
    const stores = await prisma.store.findMany({
      where: { status: 'ACTIVE' },
    });

    console.log(`Starting sync for ${stores.length} active stores`);

    for (const store of stores) {
      try {
        console.log(`Syncing store: ${store.name} (${store.id})`);
        await syncStoreProducts(store.id);
      } catch (error) {
        console.error(`Error syncing store ${store.name}:`, error);
      }
    }

    console.log('Sync completed');
  } catch (error) {
    console.error('Error in sync job:', error);
  }
}

