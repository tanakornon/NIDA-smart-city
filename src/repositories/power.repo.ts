import { IRepository } from '../types/repository';
import { PowerData } from '../types/sensor.type';
import mysql, { MySqlRow } from '../utils/mysql';
import { post } from '../utils/request';

export class PowerRepository implements IRepository {
  private async queryLatestUpdate() {
    const maxDateRows = await mysql.query(`
      SELECT
        DATE_FORMAT(MAX(DataDateTime), '%Y-%m-%dT%TZ') AS maxDate
      FROM
        powermeter
    `);

    const latestUpdate = maxDateRows.shift();

    if (latestUpdate) {
      return latestUpdate.maxDate;
    }

    return undefined;
  }

  public async extract(): Promise<MySqlRow[]> {
    const latestUpdate = await this.queryLatestUpdate();
    const data = await mysql.query(`
      SELECT
        DataDateTime,
        Device,
        kW,
        kWh
      FROM
        powermeter
      WHERE
        DataDateTime = STR_TO_DATE('${latestUpdate}', '%Y-%m-%dT%TZ')
    `);

    return data;
  }

  public async load(data: PowerData[]): Promise<void> {
    await post('log_power', data);
  }
}
