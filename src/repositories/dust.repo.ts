import { DustData } from '../types/sensor.type';
import { post } from '../utils/request';
import mysql, { MySqlRow } from '../utils/mysql';

export class DustRepository {
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

  public async load(data: DustData[]) {
    await post('log_pm25', data);
  }
}
