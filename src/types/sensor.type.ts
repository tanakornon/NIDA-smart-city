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
