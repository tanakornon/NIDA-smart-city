import mysql from '../utils/mysql';

export class DustRepository {
  private async queryLatestUpdate() {
    const maxDateRows = await mysql.query(`
      SELECT
        MAX(DataDateTime) AS maxDate
      FROM
        pm25
    `);

    const latestUpdate = maxDateRows[0].maxDate;
    return latestUpdate;
  }

  public async queryLatestPM25() {
    const latestUpdate = await this.queryLatestUpdate();
    const pm25 = await mysql.query(`
      SELECT
        Device,
        CO2,
        Humidity,
        PM25,
        Temperature
      FROM
        pm25
      WHERE
        DataDateTime = CONVERT_TZ('${latestUpdate}', '+00:00', '+07:00')
    `);

    return pm25;
  }
}
