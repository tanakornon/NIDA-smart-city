import { MySqlRow } from '../utils/mysql';

export interface IRepository {
  extract: () => Promise<MySqlRow[]>;
  extractManual: () => Promise<MySqlRow[]>;
  load: (data: any) => Promise<void>;
}
