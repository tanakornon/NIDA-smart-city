import { IRepository } from '../types/repository';
import { PowerSummaryData } from '../types/sensor.type';
import mysql, { MySqlRow } from '../utils/mysql';
import { post } from '../utils/request';

export class PowerSummaryRepository implements IRepository {
  public async extract(): Promise<MySqlRow[]> {
    const data = await mysql.query(`
      SELECT
        Device,
        IFNULL(SUM(kW), 0) AS kW,
        IFNULL(SUM(kWh), 0) AS kWh
      FROM
        powermeter
      WHERE
        DataDateTime 
        BETWEEN DATE_SUB( CURDATE(), INTERVAL 2 DAY ) 
        AND DATE_SUB( CURDATE(), INTERVAL 1 DAY )
      GROUP BY
        Device
    `);

    return data;
  }

  public async load(data: PowerSummaryData[]): Promise<void> {
    await post('log_power_summary', data);
  }
}
