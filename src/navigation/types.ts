import { Device } from 'react-native-ble-plx';

export type RootStackParamList = {
  Bluetooth: undefined;
  WiFi: { device: Device };
  Patients: undefined
};
