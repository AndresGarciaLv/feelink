// src/shared/hooks/useToyWebSocket.ts
import { useEffect, useRef, useState } from 'react';

interface PressureData {
  pressurePercent: number;
  pressureGrams: number;
}

interface ToyWebSocketData {
  pressure: PressureData;
  battery: number;
  ssid: string;
}

export const useToyWebSocket = (device: string, identifier: string): ToyWebSocketData => {
  const [ssid, setSsid] = useState('');
  const [battery, setBattery] = useState(0);
  const [pressurePercent, setPressurePercent] = useState(0);
  const [pressureGrams, setPressureGrams] = useState(0);

  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    const WS_BASE_URL = process.env.EXPO_PUBLIC_WS_BASE_URL;
    const wsUrl = `${WS_BASE_URL}?device=${device}&identifier=${identifier}`;
    ws.current = new WebSocket(wsUrl);

    ws.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const sensors = data?.Sensors;

        // Presión
        const p = sensors?.p;
        if (p && typeof p.pc === 'number' && typeof p.gr === 'number') {
          setPressurePercent(p.pc); // Ya viene en porcentaje del 0–100
          setPressureGrams(p.gr);
        }

        // WiFi
        if (sensors?.w === true && typeof sensors.ssid === 'string') {
          setSsid(sensors.ssid);
        }

        // Batería
        if (typeof sensors?.b === 'number') {
          setBattery(sensors.b);
        }

      } catch (err) {
        console.error('❌ Error al parsear WebSocket:', err);
      }
    };

    ws.current.onerror = (e) => {
      console.error('❌ WebSocket error:', e);
    };

    return () => {
      ws.current?.close();
    };
  }, [device, identifier]);

  return {
    ssid,
    battery,
    pressure: {
      pressurePercent,
      pressureGrams,
    },
  };
};
