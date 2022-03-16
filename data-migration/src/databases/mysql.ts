import * as mysql from 'mysql';

export const createMySqlConnection = () => {
  return mysql.createConnection({
    host: '10.10.111.30',
    user: 'smartcity',
    password: 'P@ssw0rd'
  });
};
