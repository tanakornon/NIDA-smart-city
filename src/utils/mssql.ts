import * as mssql from 'mssql';

import { mssqlConfig } from '../configs/prod';

class MsSql {
  constructor() {}

  public end() {}

  public query(sql: string) {}
}

mssql.connect(mssqlConfig, function (err) {});
