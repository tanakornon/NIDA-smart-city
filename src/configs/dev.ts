import * as mysql from 'mysql';

export const mysqlConfig: mysql.ConnectionConfig = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'password',
  database: 'advreports_production'
};

export const mongoConfig = 'mongodb://localhost:27017/nidaioc';
