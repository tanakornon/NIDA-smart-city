export interface DustData {
  CreateAt: number;
  DataDateTime: Date;
  Device: string;
  CO2: number;
  Humidity: number;
  PM25: number;
  Temperature: number;
}

export interface PowerData {
  CreateAt: number;
  DataDateTime: Date;
  Device: string;
  kW: number;
  kWh: number;
}

export interface PowerTotalData {
  CreateAt: number;
  Date: Date;
  Building: string;
  kW: number;
  kWh: number;
}

export interface OaqData {
  CreateAt: number;
  DataDateTime: Date;
  Device: string;
  AirTemperature: number;
  CO2: number;
  EC: number;
  Humidity: number;
  PH: number;
  PM10: number;
  PM25: number;
  Turbidity: number;
  WaterTemperature: number;
}

export interface WaterData {
  CreateAt: number;
  DataDateTime: Date;
  Device: string;
  Day01: number;
  Day02: number;
  Day03: number;
  Day04: number;
  Day05: number;
  Day06: number;
  Day07: number;
  Day08: number;
  Day09: number;
  Day10: number;
  Day11: number;
  Day12: number;
  Day13: number;
  Day14: number;
  Day15: number;
  Day16: number;
  Day17: number;
  Day18: number;
  Day19: number;
  Day20: number;
  Day21: number;
  Day22: number;
  Day23: number;
  Day24: number;
  Day25: number;
  Day26: number;
  Day27: number;
  Day28: number;
  Day29: number;
  Day30: number;
  Day31: number;
  WM_M01: number;
  WM_M02: number;
  WM_M03: number;
  WM_M04: number;
  WM_M05: number;
  WM_M06: number;
  WM_M07: number;
  WM_M08: number;
  WM_M09: number;
  WM_M10: number;
  WM_M11: number;
  WM_M12: number;
  WM_Year: number;
  WM_SumMonth: number;
  WM_SumYear: number;
}

export interface BuildingAllData {
  CreateAt: number;
  DataDateTime: Date;
  Device: string;
  Day01: number;
  Day02: number;
  Day03: number;
  Day04: number;
  Day05: number;
  Day06: number;
  Day07: number;
  Day08: number;
  Day09: number;
  Day10: number;
  Day11: number;
  Day12: number;
  Day13: number;
  Day14: number;
  Day15: number;
  Day16: number;
  Day17: number;
  Day18: number;
  Day19: number;
  Day20: number;
  Day21: number;
  Day22: number;
  Day23: number;
  Day24: number;
  Day25: number;
  Day26: number;
  Day27: number;
  Day28: number;
  Day29: number;
  Day30: number;
  Day31: number;
  kW: number;
  kWhM01: number;
  kWhM02: number;
  kWhM03: number;
  kWhM04: number;
  kWhM05: number;
  kWhM06: number;
  kWhM07: number;
  kWhM08: number;
  kWhM09: number;
  kWhM10: number;
  kWhM11: number;
  kWhM12: number;
  kWhYear: number;
}
