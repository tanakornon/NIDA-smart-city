import { DustRepository } from '../repositories/dust.repo';

export class MigrateService {
  private dustRepo = new DustRepository();

  public async extractDustData() {
    const latestData = await this.dustRepo.queryLatestPM25();
    console.log(latestData);
  }
}
