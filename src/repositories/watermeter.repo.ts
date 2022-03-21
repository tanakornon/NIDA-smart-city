import mysql from '../utils/mysql';

export class WaterMeterRepository {
  private async queryLatestUpdate() {
    const maxDateRows = await mysql.query(`
      SELECT
        MAX(DataDateTime) AS maxDate
      FROM
        watermeter
    `);

    const latestUpdate = maxDateRows.shift();

    if (latestUpdate) {
      return latestUpdate.maxDate;
    }

    return undefined;
  }

  public async queryLatestMeter() {
    const latestUpdate = await this.queryLatestUpdate();
    const meter = await mysql.query(`
      SELECT
        *
      FROM
        watermeter
      WHERE
        DataDateTime = CAST('${latestUpdate}' AS DATETIME)
    `);

    return meter;
  }
}
