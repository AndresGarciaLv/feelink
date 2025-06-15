export interface SerializableDevice {
  id: string;
  name: string | null;
  localName: string | null;
  mtu: number;
  rssi: number | null;
}
