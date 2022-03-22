import { DustRepository } from '../repositories/dust.repo';
import { PowerRepository } from '../repositories/power.repo';
import { DustData, PowerData } from '../types/sensor.type';

export class MigrateService {
  private dustRepo = new DustRepository();
  private powerRepo = new PowerRepository();

  private transformDustData(data: any): DustData {
    const date = new Date(data.DataDateTime);

    return {
      CreateAt: date.getDate() / 1000,
      DataDateTime: date,
      Device: data.Device,
      CO2: data.CO2,
      Humidity: data.Humidity,
      PM25: data.PM25,
      Temperature: data.Temperature
    };
  }

  private transformPowerData(data: any): PowerData {
    const date = new Date(data.DataDateTime);

    return {
      CreateAt: date.getDate() / 1000,
      DataDateTime: date,
      Device: data.Device,
      kW: data.kW,
      kWh: data.kWh
    };
  }

  public async migrateDustData() {
    const rawData = await this.dustRepo.extract();
    const dustData = rawData.map((row) => this.transformDustData(row));
    await this.dustRepo.request(dustData);
  }

  public async migratePowerData() {
    const rawData = await this.powerRepo.queryLatestMeter();
    const powerData = rawData.map((row) => this.transformPowerData(row));
    await this.powerRepo.request(powerData);
  }
}
