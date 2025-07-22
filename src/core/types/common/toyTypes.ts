export interface ToyData {
  pressurePercent: number[];
  pressureGram: number[];
  battery: number[];
  accelX: number[];
  accelY: number[];
  accelZ: number[];
  gyroX: number[];
  gyroY: number[];
  gyroZ: number[];
  lastUpdate: Date;
    [key: string]: number[] | Date; // ← Agregar esta línea
}

export interface AllToysData {
  [toyId: string]: ToyData;
}
