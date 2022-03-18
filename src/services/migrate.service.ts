import { DustRepository } from '../repositories/dust.repo';
import { PowerRepository } from '../repositories/power.repo';

export class MigrateService {
  private dustRepo = new DustRepository();
  private powerRepo = new PowerRepository();

  public async extractDustData() {
    const data = await this.dustRepo.queryLatestPM25();
    console.log(data);
  }

  public async extractPowerData() {
    const data = await this.powerRepo.queryLatestMeter();
    console.log(data);
  }
}
