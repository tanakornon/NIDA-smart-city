import { IRepository } from '../types/repository';
import { BuildingAllData } from '../types/sensor.type';
import mysql, { MySqlRow } from '../utils/mysql';
import { post } from '../utils/request';

export class BuildingAllRepository implements IRepository {
  private async queryLatestUpdate() {
    const maxDateRows = await mysql.query(`
      SELECT
        MAX(DataDateTime) AS maxDate
      FROM
        buildingall_total
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
        kW,
        kWhM01,
        kWhM02,
        kWhM03,
        kWhM04,
        kWhM05,
        kWhM06,
        kWhM07,
        kWhM08,
        kWhM09,
        kWhM10,
        kWhM11,
        kWhM12,
        kWhYear
      FROM
        buildingall_total
      WHERE
        DataDateTime = CAST('${latestUpdate}' AS DATETIME)
    `);

    return data;
  }

  public async load(data: BuildingAllData[]): Promise<void> {
    await post('log_buildingall_total', data);
  }
}
