import * as mysql from 'mysql';

import { parseJson } from './parser';
import { mysqlConfig } from '../configs/dev';

interface MySqlRow {
  [key: string]: string;
}

class MySql {
  private pool;

  constructor() {
    this.pool = mysql.createPool(mysqlConfig);
  }

  public end() {
    console.log('Please wait, releasing MySql connection pool...');
    this.pool.end();
  }

  public query(sql: string): Promise<MySqlRow[]> {
    return new Promise((resolve, reject) => {
      this.pool.query(sql, (err, rows) => {
        if (err) {
          reject(err);
        }

        const json = parseJson(rows);
        resolve(json);
      });
    });
  }
}

export default new MySql();
