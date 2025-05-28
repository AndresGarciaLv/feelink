import { Device } from 'react-native-ble-plx';

export type RootStackParamList = {
  Dashboard: undefined;
  Bluetooth: undefined;
  WiFi: { device: Device };
  Patients: { openAddModal?: boolean };
  Auth: undefined;
};
