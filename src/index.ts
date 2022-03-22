import { MigrateService } from './services/migrate.service';
import mysql from './utils/mysql';

async function main() {
  const migrate = new MigrateService();

  console.log('Migrate PM2.5 Data...');
  await migrate.migrateDustData();

  console.log('Migrate Power Data...');
  await migrate.migratePowerData();
}

main()
  .then(() => {
    mysql.end();
    process.exit(0);
  })
  .catch((err) => {
    console.error(err.message);
    process.exit(1);
  });
