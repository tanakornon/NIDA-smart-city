import * as mysql from 'mysql';
import { RedisClientOptions } from 'redis';

export const mysqlConfig: mysql.ConnectionConfig = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'root',
  database: 'advreports_production',
  timezone: '+07'
};

export const redisConfig: RedisClientOptions = {
  url: 'redis://127.0.0.1'
};
