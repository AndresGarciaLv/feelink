import { useEffect, useRef, useState } from 'react';

interface WifiAndBatteryState {
  ssid: string;
  battery: number;
}

export const useWifiAndBatterySensor = (device: string, identifier: string): WifiAndBatteryState => {
  const [ssid, setSsid] = useState('');
  const [battery, setBattery] = useState(0);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!identifier || !device) return;

    const WS_BASE_URL = process.env.EXPO_PUBLIC_WS_BASE_URL;
    const wsUrl = `${WS_BASE_URL}?device=${device}&identifier=${identifier}`;
    ws.current = new WebSocket(wsUrl);

    ws.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const sensors = data?.Sensors;

        // 📶 Si está conectado y hay SSID válido
        if (sensors?.w === true && typeof sensors.ssid === 'string') {
          setSsid(sensors.ssid);
        }

        // 🔋 Batería
        if (typeof sensors?.b === 'number') {
          setBattery(sensors.b);
        }

      } catch (error) {
        console.error('❌ Error parseando datos del WebSocket:', error);
      }
    };

    ws.current.onerror = (err) => {
      console.error('🚨 WebSocket error:', err);
    };

    return () => {
      ws.current?.close();
    };
  }, [device, identifier]);

  return { ssid, battery };
};
