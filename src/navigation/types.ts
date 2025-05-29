import { Device } from 'react-native-ble-plx';

export type RootStackParamList = {
  Dashboard: undefined;
  Bluetooth: undefined;
  Bluetooth1: undefined; // NUEVA RUTA para BluetoothScreen1
  WiFi: { device: Device };
  Wifi1: { device: any }; // NUEVA RUTA para WifiScreen1, 'any' temporalmente si Device no es el mismo que en la simulación
  Patients: { openAddModal?: boolean };
   PatientDetail: {
    patientId: string;
    name: string;
    age: number;
    height: number;
    weight: number;
    bmi: number | string;
  };
  TutorProfile: undefined;
  Auth: undefined;
  Profile: undefined;
  TherapistProfile: undefined;
};
