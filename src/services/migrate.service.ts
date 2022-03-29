import { DustRepository } from '../repositories/dust.repo';
import { PowerSummaryRepository } from '../repositories/power-summary.repo';
import { PowerRepository } from '../repositories/power.repo';
import { WaterMeterRepository } from '../repositories/water.repo';
import { IRepository } from '../types/repository';
import { print } from '../utils/log';

export class MigrateService {
  private dustRepo = new DustRepository();
  private powerSummaryRepo = new PowerSummaryRepository();
  private powerRepo = new PowerRepository();
  private waterRepo = new WaterMeterRepository();

  private transform(data: any): any {
    const date = new Date(data.DataDateTime);

    return {
      CreateAt: date.getTime() / 1000,
      DataDateTime: date,
      ...data
    };
  }

  private async migrateData(repo: IRepository) {
    print(' - Extract data ..... ');

    const rawData = await repo.extract();

    print('OK\n');
    print(' - Transform data ... ');

    const processedData = rawData.map((row) => this.transform(row));

    print('OK\n');
    print(' - Load data ........ ');

    await repo.load(processedData);

    print('OK\n');
  }

  public async migrateDustData() {
    await this.migrateData(this.dustRepo);
  }

  public async migratePowerSummaryData() {
    await this.migrateData(this.powerSummaryRepo);
  }

  public async migratePowerData() {
    await this.migrateData(this.powerRepo);
  }

  public async migrateWaterData() {
    await this.migrateData(this.waterRepo);
  }
}
