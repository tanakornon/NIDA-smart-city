import { DustRepository } from '../repositories/dust.repo';
import { PowerRepository } from '../repositories/power.repo';
import { DustData, PowerData } from '../types/sensor.type';

export class MigrateService {
  private dustRepo = new DustRepository();
  private powerRepo = new PowerRepository();

  private transformDustData(data: any): DustData {
    const date = new Date(data.DataDateTime);

    return {
      CreateAt: date.getTime() / 1000,
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
      CreateAt: date.getTime() / 1000,
      DataDateTime: date,
      Device: data.Device,
      kW: data.kW,
      kWh: data.kWh
    };
  }

  public async migrateDustData() {
    process.stdout.write(' - Extract data ... ');
    const rawData = await this.dustRepo.extract();
    process.stdout.write('OK\n');

    process.stdout.write(' - Transform data ... ');
    const dustData = rawData.map((row) => this.transformDustData(row));
    process.stdout.write('OK\n');

    process.stdout.write(' - Load data ... ');
    await this.dustRepo.load(dustData);
    process.stdout.write('OK\n');
  }

  public async migratePowerData() {
    process.stdout.write(' - Extract data ... ');
    const rawData = await this.powerRepo.queryLatestMeter();
    process.stdout.write('OK\n');

    process.stdout.write(' - Transform data ... ');
    const powerData = rawData.map((row) => this.transformPowerData(row));
    process.stdout.write('OK\n');

    process.stdout.write(' - Load data ... ');
    await this.powerRepo.load(powerData);
    process.stdout.write('OK\n');
  }
}
