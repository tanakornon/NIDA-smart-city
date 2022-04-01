import cron from 'node-cron';

import { MigrateService } from './services/migrate.service';
import { PowerSummaryService } from './services/power-summary.service';
import mysql from './utils/mysql';

async function fifteenthMinute() {
  const migrate = new MigrateService();

  console.log('Migrate PM2.5 Data');
  await migrate.migrateDustData();

  console.log('Migrate Building All Total Data');
  await migrate.migrateBuildingAllData();

  console.log('Migrate Power Data');
  await migrate.migratePowerData();

  console.log('Migrate Water Data');
  await migrate.migrateWaterData();

  console.log('Migrate Water Quality Data');
  await migrate.migrateOaqData();
}

async function daily() {
  const migrate = new PowerSummaryService();

  console.log('Migrate Power Summary Data');
  await migrate.migratePowerSummaryData();
}

cron.schedule('*/1 * * * *', function () {
  fifteenthMinute().catch((err) => {
    console.error(err.message);
  });
});

cron.schedule('0 0 * * *', function () {
  daily().catch((err) => {
    console.error(err.message);
  });
});
