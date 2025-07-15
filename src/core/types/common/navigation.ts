import { Device } from 'react-native-ble-plx';

export type RootStackParamList = {
    Dashboard: undefined;
    BleScreen: undefined;
    Patients: { openAddModal?: boolean };
    TutorProfile: undefined;
    Auth: undefined;
    Profile: undefined;
    TherapistProfile: undefined;
    HomeTutor:undefined;
    Bluetooth: undefined;
    Splash: undefined;
    Wifi1: { deviceId: string };
    ProfileChart:undefined;
    DetallesPeluche: undefined;
    RoleBased: undefined;
};
