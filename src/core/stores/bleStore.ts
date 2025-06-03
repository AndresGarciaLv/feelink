// ✅ Zustand Store: useBleStore.ts
import { Device } from 'react-native-ble-plx';
import { create } from 'zustand';

interface BleState {
  connectedDevice: Device | null;
  lastDeviceId: string | null;
  manuallyDisconnected: boolean;

  setConnectedDevice: (device: Device | null) => void;
  setLastDeviceId: (id: string | null) => void;
  setManuallyDisconnected: (value: boolean) => void;
}

export const useBleStore = create<BleState>((set) => ({
  connectedDevice: null,
  lastDeviceId: null,
  manuallyDisconnected: false,

  setConnectedDevice: (device) => set({ connectedDevice: device }),
  setLastDeviceId: (id) => set({ lastDeviceId: id }),
  setManuallyDisconnected: (value) => set({ manuallyDisconnected: value }),
}));