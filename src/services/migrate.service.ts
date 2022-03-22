import { DustRepository } from '../repositories/dust.repo';
import { PowerRepository } from '../repositories/power.repo';
import { WaterMeterRepository } from '../repositories/water.repo';
import { DustData, PowerData, WaterData } from '../types/sensor.type';

export class MigrateService {
  private dustRepo = new DustRepository();
  private powerRepo = new PowerRepository();
  private waterRepo = new WaterMeterRepository();

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

  private transformWaterData(data: any): WaterData {
    const date = new Date(data.DataDateTime);

    return {
      CreateAt: date.getTime() / 1000,
      DataDateTime: date,
      ...data
    };
  }

  public async migrateDustData() {
    process.stdout.write(' - Extract data ..... ');
    const rawData = await this.dustRepo.extract();
    process.stdout.write('OK\n');

    process.stdout.write(' - Transform data ... ');
    const processedData = rawData.map((row) => this.transformDustData(row));
    process.stdout.write('OK\n');

    process.stdout.write(' - Load data ........ ');
    await this.dustRepo.load(processedData);
    process.stdout.write('OK\n');
  }

  public async migratePowerData() {
    process.stdout.write(' - Extract data ..... ');
    const rawData = await this.powerRepo.queryLatestMeter();
    process.stdout.write('OK\n');

    process.stdout.write(' - Transform data ... ');
    const processedData = rawData.map((row) => this.transformPowerData(row));
    process.stdout.write('OK\n');

    process.stdout.write(' - Load data ........ ');
    await this.powerRepo.load(processedData);
    process.stdout.write('OK\n');
  }

  public async migrateWaterData() {
    process.stdout.write(' - Extract data ..... ');
    const rawData = await this.waterRepo.queryLatestMeter();
    process.stdout.write('OK\n');

    process.stdout.write(' - Transform data ... ');
    const processedData = rawData.map((row) => this.transformWaterData(row));
    process.stdout.write('OK\n');

    process.stdout.write(' - Load data ........ ');
    await this.waterRepo.load(processedData);
    process.stdout.write('OK\n');
  }
}
