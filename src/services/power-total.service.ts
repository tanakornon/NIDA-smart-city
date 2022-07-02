import { PowerSummaryRepository } from '../repositories/power-total.repo';
import { PowerTotalData } from '../types/sensor.type';
import { getLocalDate, getLocalDateTime } from '../utils/date';
import { printlog } from '../utils/log';

class PowerTotalService {
  private repo = new PowerSummaryRepository();

  public readonly buildingList = {
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
    SIAM: ['SIAM', 'PM03', 'PM04'],
    OTHER: []
  };

  private rawToObject(data: any): PowerTotalData {
    const date = getLocalDateTime();
    let building = 'OTHER';

    Object.entries(this.buildingList).every((entry) => {
      const [key, value] = entry;
      const isBuilding = value.filter((text) => data.Device.startsWith(text));

      if (isBuilding.length > 0) {
        building = key;
        return false;
      }

      return true;
    });

    return {
      CreateAt: date.getTime() / 1000,
      Date: date,
      Building: building,
      kW: data.kW,
      kWh: data.kWh
    };
  }

  private summarize(data: PowerTotalData[]): PowerTotalData[] {
    let holder: { [key: string]: PowerTotalData } = {};

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

  private getAllBuilding(): string[] {
    return Object.keys(this.buildingList);
  }

  public async migrate() {
    printlog(' - Extract data ..... ');

    const rawData = await this.repo.extract();

    printlog(' - Transform data ... ');

    const processedData = rawData.map((row) => this.rawToObject(row));
    const summarizeData = this.summarize(processedData);
    const finalizeData = await Promise.all(
      summarizeData.map(async (data) => {
        await this.repo.setByDate(data.Building, `${data.kW}|${data.kWh}`);

        const sumList = await this.repo.getAllSum(data.Building);
        const kWList: number[] = [];
        const kWhList: number[] = [];

        sumList.forEach((str: string) => {
          const [kW, kWh] = str.split('|').map((s) => parseFloat(s));
          kWList.push(kW);
          kWhList.push(kWh);
        });

        return {
          ...data,
          kW: kWList,
          kWh: kWhList
        };
      })
    ).catch((err) => {
      console.log(err.message);
    });

    printlog(' - Load data ........ ');

    await this.repo.load(finalizeData);
  }

  private async initDailySum(building: string) {
    for (let i = 0; i < 31; i++) {
      await this.repo.pushSum(building, '0|0');
    }
  }

  public async validateDailySum() {
    return await Promise.all(
      this.getAllBuilding().map(async (building) => {
        const list = await this.repo.getAllSum(building);
        if (list.length === 0) {
          await this.initDailySum(building);
        }
        return building;
      })
    );
  }

  public async clearDailySum() {
    return await Promise.all(
      this.getAllBuilding().map(async (building) => {
        await this.repo.deleteSum(building);
        await this.initDailySum(building);
        return building;
      })
    );
  }
}

export default new PowerTotalService();
