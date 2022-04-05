import { MySqlRow } from '../databases/mysql';

export interface IRepository {
  extract: () => Promise<MySqlRow[]>;
  extractManual: () => Promise<MySqlRow[]>;
  load: (data: any) => Promise<void>;
}
