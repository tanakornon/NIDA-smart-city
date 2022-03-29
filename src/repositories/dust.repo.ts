import { DustData } from '../types/sensor.type';
import { IRepository } from '../types/repository';
import mysql, { MySqlRow } from '../utils/mysql';
import { post } from '../utils/request';

export class DustRepository implements IRepository {
  private async queryLatestUpdate() {
    const maxDateRows = await mysql.query(`
      SELECT
        MAX(DataDateTime) AS maxDate
      FROM
        pm25
    `);

    const latestUpdate = maxDateRows.shift();

    if (latestUpdate) {
      return latestUpdate.maxDate;
    }

    return undefined;
  }

  public async extract(): Promise<MySqlRow[]> {
    const latestUpdate = await this.queryLatestUpdate();
    const pm25 = await mysql.query(`
      SELECT
        DataDateTime,
        Device,
        CO2,
        Humidity,
        PM25,
        Temperature
      FROM
        pm25
      WHERE
        DataDateTime = CAST('${latestUpdate}' AS DATETIME)
    `);

    return pm25;
  }

  public async load(data: DustData[]): Promise<void> {
    await post('log_pm25', data);
  }
}
