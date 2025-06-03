import React, { useEffect } from 'react';

interface WifiNetwork {
  ssid: string;
  security: boolean; // true if secured, false if open
  isConnected: boolean;
}

interface SimulatedDeviceScannerWifiProps {
  triggerScan: boolean;
  onScanResult: (networks: WifiNetwork[]) => void;
  onScanComplete: () => void;
}

const SimulatedDeviceScannerWifi: React.FC<SimulatedDeviceScannerWifiProps> = ({
  triggerScan,
  onScanResult,
  onScanComplete,
}) => {
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (triggerScan) {
      timer = setTimeout(() => {
        const newNetworks: WifiNetwork[] = [
          { ssid: 'MiCasa', security: true, isConnected: false }, // Red segura
          { ssid: 'BibliotecaGratis', security: false, isConnected: false }, // Red abierta
          { ssid: 'CafeWiFi', security: true, isConnected: false },
          { ssid: 'GuestNetwork', security: false, isConnected: false },
        ];

        onScanResult(newNetworks);
        onScanComplete();
      }, 3000);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [triggerScan, onScanResult, onScanComplete]);

  return null;
};

export default SimulatedDeviceScannerWifi;