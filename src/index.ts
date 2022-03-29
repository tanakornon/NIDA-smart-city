import cron from 'node-cron';

import { MigrateService } from './services/migrate.service';
import mysql from './utils/mysql';

async function main() {
  const migrate = new MigrateService();

  console.log('Migrate PM2.5 Data');
  await migrate.migrateDustData();

  console.log('Migrate Building All Total Data');
  await migrate.migratePowerSummaryData();

  console.log('Migrate Power Data');
  await migrate.migratePowerData();

  console.log('Migrate Water Data');
  await migrate.migrateWaterData();
}

cron.schedule('*/15 * * * *', function () {
  main()
    .then(() => {
      mysql.end();
    })
    .catch((err) => {
      console.error(err.message);
    });
});
