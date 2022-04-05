import { BuildingAllRepository } from '../repositories/building-all.repo';
import { DustRepository } from '../repositories/dust.repo';
import { OaqRepository } from '../repositories/oaq.repo';
import { PowerRepository } from '../repositories/power.repo';
import { WaterMeterRepository } from '../repositories/water.repo';
import { IRepository } from '../types/repository';
import { printlog } from '../utils/log';

class MigrateService {
  private buildingAllRepo = new BuildingAllRepository();
  private dustRepo = new DustRepository();
  private powerRepo = new PowerRepository();
  private oaqRepo = new OaqRepository();
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
    printlog(' - Extract data ..... ');

    const rawData = await repo.extract();

    printlog('OK\n');
    printlog(' - Transform data ... ');

    const processedData = rawData.map((row) => this.transform(row));

    printlog('OK\n');
    printlog(' - Load data ........ ');

    await repo.load(processedData);

    printlog('OK\n');
  }

  public async migrateDustData() {
    await this.migrateData(this.dustRepo);
  }

  public async migrateBuildingAllData() {
    await this.migrateData(this.buildingAllRepo);
  }

  public async migratePowerData() {
    await this.migrateData(this.powerRepo);
  }

  public async migrateOaqData() {
    await this.migrateData(this.oaqRepo);
  }

  public async migrateWaterData() {
    await this.migrateData(this.waterRepo);
  }
}

export default new MigrateService();
