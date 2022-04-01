import { OaqData } from '../types/sensor.type';
import { IRepository } from '../types/repository';
import mysql, { MySqlRow } from '../utils/mysql';
import { post } from '../utils/request';

export class OaqRepository implements IRepository {
  private async queryLatestUpdate() {
    const maxDateRows = await mysql.query(`
      SELECT
        DATE_FORMAT(MAX(DataDateTime), '%Y-%m-%dT%TZ') AS maxDate
      FROM
        oaq
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
        Air_Temperature   AS AirTemperature,
        CO2,
        EC,
        Humidity,
        PH,
        PM10,
        PM2_5             AS PM25,
        Turbidity,
        Water_Temperature AS WaterTemperature
      FROM
        oaq
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
        Air_Temperature   AS AirTemperature,
        CO2,
        EC,
        Humidity,
        PH,
        PM10,
        PM2_5             AS PM25,
        Turbidity,
        Water_Temperature AS WaterTemperature
      FROM
        oaq
      WHERE
        MOD ( DATE_FORMAT( DataDateTime, '%i' ), 15 ) = 0 
        AND DATEDIFF( DataDateTime, CURRENT_TIMESTAMP ) >= -5
    `);

    return data;
  }

  public async load(data: OaqData[]): Promise<void> {
    await post('log_water_quality', data);
  }
}
