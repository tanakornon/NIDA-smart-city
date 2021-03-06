import cron from 'node-cron';

import MigrateService from './services/migrate.service';
import PowerTotalService from './services/power-total.service';
import redis from './databases/redis';
import { printlog } from './utils/log';

async function setup() {
  printlog('Setup');
  await redis.start();
  await PowerTotalService.validateDailySum();
}

async function main() {
  printlog('Migrate PM2.5 Data');
  await MigrateService.migrateDustData();

  printlog('Migrate Building All Total Data');
  await MigrateService.migrateBuildingAllData();

  printlog('Migrate Power Data');
  await MigrateService.migratePowerData();

  printlog('Migrate Water Data');
  await MigrateService.migrateWaterData();

  printlog('Migrate Water Quality Data');
  await MigrateService.migrateOaqData();

  printlog('Migrate Power Summary Data');
  await PowerTotalService.migrate();
}

async function monthly() {
  printlog('Clear Power Summary Data');
  await PowerTotalService.clearDailySum();
}

setup().then(() => {
  // At 00:00 on day-of-month 1.
  cron.schedule('0 0 1 * *', function () {
    monthly()
      .then(() => main())
      .catch((err) => {
        console.error(err.message);
      });
  });

  // At every 15th minute from 15 through 59 past hour 0 on day-of-month 1.
  cron.schedule('15-59/15 0 1 * *', function () {
    main().catch((err) => {
      console.error(err.message);
    });
  });

  // At every 15th minute past every hour from 1 through 23 on day-of-month 1.
  cron.schedule('*/15 1-23 1 * *', function () {
    main().catch((err) => {
      console.error(err.message);
    });
  });

  // At every 15th minute on every day-of-month from 2 through 31.
  cron.schedule('*/15 * 2-31 * *', function () {
    main().catch((err) => {
      console.error(err.message);
    });
  });
});
