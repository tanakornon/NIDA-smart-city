import cron from 'node-cron';

import { MigrateService } from './services/migrate.service';
import { PowerSummaryService } from './services/power-summary.service';
import mysql from './utils/mysql';

async function main() {
  const migrateService = new MigrateService();
  const powerSummaryService = new PowerSummaryService();

  console.log('Migrate PM2.5 Data');
  await migrateService.migrateDustData();

  console.log('Migrate Building All Total Data');
  await migrateService.migrateBuildingAllData();

  console.log('Migrate Power Data');
  await migrateService.migratePowerData();

  console.log('Migrate Water Data');
  await migrateService.migrateWaterData();

  console.log('Migrate Water Quality Data');
  await migrateService.migrateOaqData();

  console.log('Migrate Power Summary Data');
  await powerSummaryService.migratePowerSummaryData();
}

cron.schedule('*/15 * * * *', function () {
  main().catch((err) => {
    console.error(err.message);
  });
});
