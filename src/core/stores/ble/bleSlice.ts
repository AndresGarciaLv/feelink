// 📁 src/store/slices/bleSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { SerializableDevice } from "../../types/bleTypes";

interface BleState {
  connectedDevice: SerializableDevice | null;
  lastDeviceId: string | null;
  manuallyDisconnected: boolean;
}

const initialState: BleState = {
  connectedDevice: null,
  lastDeviceId: null,
  manuallyDisconnected: false,
};

const bleSlice = createSlice({
  name: "ble",
  initialState,
  reducers: {
    setConnectedDevice: (state, action: PayloadAction<SerializableDevice | null>) => {
      state.connectedDevice = action.payload;
    },
    setLastDeviceId: (state, action: PayloadAction<string | null>) => {
      state.lastDeviceId = action.payload;
    },
    setManuallyDisconnected: (state, action: PayloadAction<boolean>) => {
      state.manuallyDisconnected = action.payload;
    },
  },
});

export const {
  setConnectedDevice,
  setLastDeviceId,
  setManuallyDisconnected,
} = bleSlice.actions;

// Selectores
export const selectConnectedDevice = (state: RootState) => state.ble.connectedDevice;
export const selectLastDeviceId = (state: RootState) => state.ble.lastDeviceId;
export const selectManuallyDisconnected = (state: RootState) => state.ble.manuallyDisconnected;

export default bleSlice.reducer;
