import mysql from '../utils/mysql';

export class PowerRepository {
  private async queryLatestUpdate() {
    const maxDateRows = await mysql.query(`
    	SELECT
        MAX(DataDateTime) AS maxDate
    	FROM
        meter
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
        DataDateTime,
        Device,
				kW,
				kWh,
      FROM
        meter
      WHERE
        DataDateTime = CAST('${latestUpdate}' AS DATETIME)
    `);

    return meter;
  }
}
