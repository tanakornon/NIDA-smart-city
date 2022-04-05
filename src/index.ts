import cron from 'node-cron';

import MigrateService from './services/migrate.service';
import PowerTotalService from './services/power-total.service';
import redis from './databases/redis';

let semaphore: boolean = false;

async function setup() {
  await redis.start();
  await PowerTotalService.validateDailySum();
}

async function main() {
  console.log('Migrate PM2.5 Data');
  await MigrateService.migrateDustData();

  console.log('Migrate Building All Total Data');
  await MigrateService.migrateBuildingAllData();

  console.log('Migrate Power Data');
  await MigrateService.migratePowerData();

  console.log('Migrate Water Data');
  await MigrateService.migrateWaterData();

  console.log('Migrate Water Quality Data');
  await MigrateService.migrateOaqData();

  if (!semaphore) {
    console.log('Migrate Power Summary Data');
    await PowerTotalService.migrate();
  } else {
    console.log('Blocked by semaphore!!!!');
  }
}

async function monthly() {
  semaphore = true;
  await PowerTotalService.clearDailySum();
  console.log('Migrate Power Summary Data');
  await PowerTotalService.migrate();
  semaphore = false;
}

setup().then(() => {
  cron.schedule('0 0 1 * *', function () {
    monthly();
  });

  cron.schedule('*/15 * * * *', function () {
    main();
  });

  // // At 00:00 on day-of-month 1.
  // cron.schedule('0 0 1 * *', function () {
  //   monthly()
  //     .then(() => main())
  //     .catch((err) => {
  //       console.error(err.message);
  //     });
  // });

  // // At every 15th minute from 15 through 59 past hour 0 on day-of-month 1.
  // cron.schedule('15-59/15 0 1 * *', function () {
  //   main().catch((err) => {
  //     console.error(err.message);
  //   });
  // });

  // // At every 15th minute past every hour from 1 through 23 on day-of-month 1.
  // cron.schedule('*/15 1-23 1 * *', function () {
  //   main().catch((err) => {
  //     console.error(err.message);
  //   });
  // });

  // // At every 15th minute on every day-of-month from 2 through 31.
  // cron.schedule('*/15 * 2-31 * *', function () {
  //   main().catch((err) => {
  //     console.error(err.message);
  //   });
  // });
});
