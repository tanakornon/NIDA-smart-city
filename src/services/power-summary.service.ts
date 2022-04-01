import { PowerSummaryRepository } from '../repositories/power-summary.repo';
import { PowerSummaryData } from '../types/sensor.type';
import { getYesterdayDate } from '../utils/date';
import { printlog } from '../utils/log';

export class PowerSummaryService {
  private repo = new PowerSummaryRepository();

  private transform(data: any): PowerSummaryData {
    const date = new Date(data.DataDateTime);
    let building = 'Other';

    const buildingList = {
      AUDITORIUM: ['AUDITORIUM'],
      BUNCHANA: ['BUNCHANA', 'PM01', 'PM02'],
      CHUP: ['CHUP'],
      MALAI: ['MALAI'],
      NARADHIP: ['NARADHIP'],
      NAVAMIN: ['NAVAMIN'],
      NIDA_HOUSE: ['NIDA_HOUSE'],
      NIDASUMPUN: ['NIDASUMPUN'],
      RATCHAPHRUEK: ['RATCHAPHRUEK', 'PM05'],
      SERITHAI: ['SERITHAI'],
      SIAM: ['SIAM', 'PM03', 'PM04']
    };

    Object.entries(buildingList).every((entry) => {
      const [key, value] = entry;
      const isBuilding = value.filter((text) => data.Device.startsWith(text));

      if (isBuilding.length > 0) {
        building = key;
        return false;
      }

      return true;
    });

    return {
      CreateAt: Date.now() / 1000,
      Date: getYesterdayDate(),
      Building: building,
      kW: data.kW,
      kWh: data.kWh
    };
  }

  private summarize(data: PowerSummaryData[]): PowerSummaryData[] {
    let holder: { [key: string]: PowerSummaryData } = {};

    data.forEach((row) => {
      if (holder.hasOwnProperty(row.Building)) {
        holder[row.Building].kW += row.kW;
        holder[row.Building].kWh += row.kWh;
      } else {
        holder[row.Building] = row;
      }
    });

    return Object.values(holder);
  }

  public async migratePowerSummaryData() {
    printlog(' - Extract data ..... ');

    const rawData = await this.repo.extract();

    printlog('OK\n');
    printlog(' - Transform data ... ');

    const processedData = rawData.map((row) => this.transform(row));
    const summarizeData = this.summarize(processedData);

    printlog('OK\n');
    printlog(' - Load data ........ ');

    await this.repo.load(summarizeData);

    printlog('OK\n');
  }
}
