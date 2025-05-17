import { BleManager } from 'react-native-ble-plx';
import { PermissionsAndroid, Platform, Alert } from 'react-native';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import BluetoothStateManager from 'react-native-bluetooth-state-manager';

export const manager = new BleManager();

export const requestPermissions = async () => {
  if (Platform.OS === 'android') {
    // Solicita permisos si son necesarios
    await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
    ]);

    // Verifica si Bluetooth está activado
    const state = await BluetoothStateManager.getState();
    if (state !== 'PoweredOn') {
      await BluetoothStateManager.requestToEnable(); // Pide que lo active
    }
  }
};
