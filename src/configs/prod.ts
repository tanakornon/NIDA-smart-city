import * as mssql from 'mssql';
import * as mysql from 'mysql';

export const mysqlConfig: mysql.ConnectionConfig = {
  host: '10.10.111.30',
  port: 3306,
  user: 'smartcity',
  password: 'P@ssw0rd',
  database: 'advreports_production',
  timezone: 'utc'
};

export const mssqlConfig: mssql.config = {
  server: '10.10.161.184',
  user: 'nida',
  password: 'P@ssw0rd',
  database: 'hiptimes',
  options: {
    trustedConnection: true,
    encrypt: true,
    enableArithAbort: true,
    trustServerCertificate: true
  }
};

export const mongoEndpoint = 'http://10.10.161.37:8000';
