import axios from 'axios';
import mongoose from 'mongoose';

import { DustData } from '../types/sensor.type';
import mysql, { MySqlRow } from '../utils/mysql';

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

  public async extract(): Promise<MySqlRow[]> {
    const latestUpdate = await this.queryLatestUpdate();
    const pm25 = await mysql.query(`
      SELECT
        DataDateTime,
        Device,
        CO2,
        Humidity,
        PM25,
        Temperature
      FROM
        pm25
    `);

    return pm25;
  }

  public async load(data: DustData[]) {
    const dustSchema = new mongoose.Schema({
      DataDateTime: Date,
      Device: String,
      CO2: Number,
      Humidity: Number,
      PM25: Number,
      Temperature: Number
    });

    const DustModel = mongoose.model('log_pm25', dustSchema);

    await DustModel.insertMany(data)
      .then(function () {
        console.log('Insert log_pm25'); // Success
      })
      .catch(function (error) {
        console.log(error); // Failure
      });
  }

  public async request(data: DustData[]) {
    console.log(JSON.stringify(data));
    await axios
      .post('http://10.10.161.37:8000/log_pm25', data)
      .then((response) => console.info(response.data))
      .catch((err) => console.error(err.message));
  }
}
