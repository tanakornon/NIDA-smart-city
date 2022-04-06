import PowerTotalService from './services/power-total.service';
import redis from './databases/redis';

async function clear() {
  await redis.start();
  await PowerTotalService.clearDailySum();
}

clear().then(() => {
  console.log('Clear redis complete');
});
