// types/chartdata.ts
export interface SensorData {
  battery?: number[];
  pressurePercent?: number[];
  accelX?: number[];
  accelY?: number[];
  accelZ?: number[];
  gyroX?: number[];
  gyroY?: number[];
  gyroZ?: number[];
}

export interface ClinicalState {
  state: 'stable' | 'anxious' | 'crisis';
  label: string;
  color: string;
}

export interface ClinicalAnalysis {
  pressure: ClinicalState;
  movement: ClinicalState;
  rotation: ClinicalState;
}

export interface ChartDataPoint {
  value: number;
  label: string;
  frontColor?: string;
  spacing?: number;
  labelTextStyle?: {
    color: string;
    fontSize: number;
  };
}

export interface PreparedChartData {
  pressureData: ChartDataPoint[];
  movementData: ChartDataPoint[];
  rotationData: ChartDataPoint[];
}

export interface UseSensorSocketReturn {
  sensorData: SensorData;
  isConnected: boolean;
}