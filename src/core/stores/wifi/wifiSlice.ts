// src/core/stores/wifi/wifiSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface WifiState {
  connected: boolean;
  connecting: boolean;
  currentSSID: string | null;
  statusMessage: string;
}

const initialState: WifiState = {
  connected: false,
  connecting: false,
  currentSSID: null,
  statusMessage: '',
};

const wifiSlice = createSlice({
  name: 'wifi',
  initialState,
  reducers: {
    connectStart(state, action: PayloadAction<{ ssid: string }>) {
      state.connecting = true;
      state.connected = false;
      state.currentSSID = action.payload.ssid;
      state.statusMessage = `Conectando a ${action.payload.ssid}...`;
    },
    connectSuccess(state) {
      state.connecting = false;
      state.connected = true;
      state.statusMessage = 'Conexión WiFi exitosa ✅';
    },
    connectFailure(state, action: PayloadAction<string>) {
      state.connecting = false;
      state.connected = false;
      state.statusMessage = `Error de conexión ❌: ${action.payload}`;
    },
    disconnect(state) {
      state.connected = false;
      state.connecting = false;
      state.currentSSID = null;
      state.statusMessage = 'Desconectado de la red WiFi';
    },
    setStatusMessage(state, action: PayloadAction<string>) {
      state.statusMessage = action.payload;
    },
    forceUpdateSSID(state, action: PayloadAction<string>) {
      state.currentSSID = action.payload;
    }
  },
});

export const {
  connectStart,
  connectSuccess,
  connectFailure,
  disconnect,
  setStatusMessage,
  forceUpdateSSID,
} = wifiSlice.actions;

export default wifiSlice.reducer;
