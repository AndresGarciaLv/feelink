// src/core/stores/wifi/useWifiRedux.ts

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import {
  connectStart,
  connectSuccess,
  connectFailure,
  disconnect,
  setStatusMessage,
  forceUpdateSSID,
} from './wifiSlice';

export const useWifiRedux = () => {
  const dispatch = useDispatch();
  const wifi = useSelector((state: RootState) => state.wifi);

  const startConnection = (ssid: string) => dispatch(connectStart({ ssid }));
  const connectionSuccess = () => dispatch(connectSuccess());
  const connectionFailure = (error: string) => dispatch(connectFailure(error));
  const disconnectWifi = () => dispatch(disconnect());
  const updateStatusMessage = (message: string) => dispatch(setStatusMessage(message));
  const updateSSID = (ssid: string) => dispatch(forceUpdateSSID(ssid));

  return {
    wifi,
    startConnection,
    connectionSuccess,
    connectionFailure,
    disconnectWifi,
    updateStatusMessage,
    updateSSID,
  };
};
