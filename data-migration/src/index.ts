import { MigrateService } from './services/migrate.service';
import mysql from './utils/mysql';

async function main() {
  const migrate = new MigrateService();

  console.log("Extract PM2.5 Data...")
  await migrate.extractDustData();
}

main()
  .then(() => {
    mysql.end();
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
