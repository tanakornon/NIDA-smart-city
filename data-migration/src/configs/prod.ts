import * as mysql from 'mysql';

export const mysqlConfig: mysql.ConnectionConfig = {
  host: '10.10.111.30',
  port: 3306,
  user: 'smartcity',
  password: 'P@ssw0rd',
  database: 'advreports_production'
};