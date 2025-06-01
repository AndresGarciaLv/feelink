import { Device } from 'react-native-ble-plx';

export type RootStackParamList = {
  Dashboard: undefined;
  Bluetooth: undefined;
  WiFi: { device: Device };
  Patients: { openAddModal?: boolean };
  TutorProfile: undefined;
  Auth: undefined;
  Profile: undefined;
  TherapistProfile: undefined;
  HomeTutor:undefined;
  Bluetooth1: undefined; // Nueva Ruta para BluetoothScreen1
};
