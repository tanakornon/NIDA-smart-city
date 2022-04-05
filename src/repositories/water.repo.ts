import { IRepository } from '../types/repository';
import { WaterData } from '../types/sensor.type';
import mysql, { MySqlRow } from '../databases/mysql';
import { post } from '../databases/mongo';

export class WaterMeterRepository implements IRepository {
  private async queryLatestUpdate() {
    const maxDateRows = await mysql.query(`
      SELECT
        DATE_FORMAT(MAX(DataDateTime), '%Y-%m-%dT%TZ') AS maxDate
      FROM
        watermeter
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
        Day01,
        Day02,
        Day03,
        Day04,
        Day05,
        Day06,
        Day07,
        Day08,
        Day09,
        Day10,
        Day11,
        Day12,
        Day13,
        Day14,
        Day15,
        Day16,
        Day17,
        Day18,
        Day19,
        Day20,
        Day21,
        Day22,
        Day23,
        Day24,
        Day25,
        Day26,
        Day27,
        Day28,
        Day29,
        Day30,
        Day31,
        WM_M01,
        WM_M02,
        WM_M03,
        WM_M04,
        WM_M05,
        WM_M06,
        WM_M07,
        WM_M08,
        WM_M09,
        WM_M10,
        WM_M11,
        WM_M12,
        WM_Year,
        WM_SumMonth,
        WM_SumYear
      FROM
        watermeter
      WHERE
        DataDateTime = STR_TO_DATE('${latestUpdate}', '%Y-%m-%dT%TZ')
    `);

    return data;
  }

  public async extractManual(): Promise<MySqlRow[]> {
    const latestUpdate = await this.queryLatestUpdate();
    const data = await mysql.query(`
      SELECT
        DataDateTime,
        Device,
        Day01,
        Day02,
        Day03,
        Day04,
        Day05,
        Day06,
        Day07,
        Day08,
        Day09,
        Day10,
        Day11,
        Day12,
        Day13,
        Day14,
        Day15,
        Day16,
        Day17,
        Day18,
        Day19,
        Day20,
        Day21,
        Day22,
        Day23,
        Day24,
        Day25,
        Day26,
        Day27,
        Day28,
        Day29,
        Day30,
        Day31,
        WM_M01,
        WM_M02,
        WM_M03,
        WM_M04,
        WM_M05,
        WM_M06,
        WM_M07,
        WM_M08,
        WM_M09,
        WM_M10,
        WM_M11,
        WM_M12,
        WM_Year,
        WM_SumMonth,
        WM_SumYear
      FROM
        watermeter
      WHERE
        MOD ( DATE_FORMAT( DataDateTime, '%i' ), 15 ) = 0
        AND DATEDIFF( DataDateTime, CURRENT_TIMESTAMP ) >= -5
    `);

    return data;
  }

  public async load(data: WaterData[]): Promise<void> {
    await post('log_water', data);
  }
}
