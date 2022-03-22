import { MigrateService } from './services/migrate.service';
import mongodb from './utils/mongodb';
import mysql from './utils/mysql';

async function main() {
  mongodb.createConnection();

  const migrate = new MigrateService();

  console.log('Extract PM2.5 Data...');
  await migrate.migrateDustData();

  console.log('Extract Power Data...');
  await migrate.migratePowerData();
}

main()
  .then(() => {
    mongodb.end();
    mysql.end();
    process.exit(0);
  })
  .catch((err) => {
    console.error(err.message);
    process.exit(1);
  });
