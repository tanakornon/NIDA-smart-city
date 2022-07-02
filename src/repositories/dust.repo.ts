import { DustData } from '../types/sensor.type';
import { IRepository } from '../types/repository';
import mysql, { MySqlRow } from '../databases/mysql';
import { post } from '../databases/mongo';

export class DustRepository implements IRepository {
  private async queryLatestUpdate() {
    const maxDateRows = await mysql.query(`
      SELECT
        DATE_FORMAT(MAX(DataDateTime), '%Y-%m-%dT%TZ') AS maxDate
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
    const data = await mysql.query(`
      SELECT
        DataDateTime,
        Device,
        COALESCE(CO2, CO2_Outdoor)                  AS CO2,
        COALESCE(Humidity, Humidity_Outdoor)        AS Humidity,
        COALESCE(PM25, PM2_Outdoor)                 AS PM25,
        COALESCE(Temperature, Temperature_Outdoor)  AS Temperature
      FROM
        pm25
      WHERE
        DataDateTime = STR_TO_DATE('${latestUpdate}', '%Y-%m-%dT%TZ')
    `);

    return data;
  }

  public async extractManual(): Promise<MySqlRow[]> {
    const data = await mysql.query(`
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
        MOD ( DATE_FORMAT( DataDateTime, '%i' ), 15 ) = 0 
        AND DATEDIFF( DataDateTime, CURRENT_TIMESTAMP ) >= -5
    `);

    return data;
  }

  public async load(data: DustData[]): Promise<void> {
    await post('log_pm25', data);
  }
}
