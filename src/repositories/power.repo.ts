import mongoose from 'mongoose';
import { PowerData } from '../types/sensor.type';

import mysql from '../utils/mysql';

export class PowerRepository {
  private async queryLatestUpdate() {
    const maxDateRows = await mysql.query(`
      SELECT
        MAX(DataDateTime) AS maxDate
      FROM
        powermeter
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
        kWh
      FROM
        powermeter
      WHERE
        DataDateTime = CAST('${latestUpdate}' AS DATETIME)
    `);

    return meter;
  }

  public async load(data: PowerData[]) {
    const powerSchema = new mongoose.Schema({
      DataDateTime: Date,
      Device: String,
      kW: Number,
      kWh: Number
    });

    const powerModel = mongoose.model('log_power', powerSchema);

    await powerModel
      .insertMany(data)
      .then(function () {
        console.log('Insert log_power'); // Success
      })
      .catch(function (error) {
        console.log(error); // Failure
      });
  }
}
