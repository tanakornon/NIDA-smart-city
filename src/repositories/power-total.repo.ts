import { PowerTotalData } from '../types/sensor.type';
import mysql, { MySqlRow } from '../databases/mysql';
import redis from '../databases/redis';
import { post } from '../databases/mongo';
import { getLocalDate } from '../utils/date';

export class PowerSummaryRepository {
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
        BETWEEN CURDATE()
        AND DATE_ADD( CURDATE(), INTERVAL 1 DAY ) 
      GROUP BY
        Device
    `);

    return data;
  }

  public async load(data: any): Promise<void> {
    await post('power_total', data);
  }

  public async extractManual(): Promise<MySqlRow[]> {
    return [];
  }

  public async getAllSum(key: string) {
    console.log('getAllSum');
    return await redis.getRange(key);
  }

  public async pushSum(key: string, value: string) {
    await redis.push(key, value);
  }

  public async deleteSum(key: string) {
    await redis.delete(key);
  }

  public async setByDate(key: string, value: string) {
    console.log('setByDate');
    const index = getLocalDate() - 1;
    await redis.lset(key, index, value);
  }
}