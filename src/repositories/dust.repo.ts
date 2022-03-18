import mysql from '../utils/mysql';

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
        DataDateTime = CAST('${latestUpdate}' AS DATETIME)
    `);

    return pm25;
  }
}
