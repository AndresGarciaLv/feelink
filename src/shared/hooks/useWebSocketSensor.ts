// src/hooks/useWebSocketSensor.ts
import { useEffect, useRef, useState } from 'react';

interface SensorData {
  ssid: string;
  battery: number;
}

export function useWebSocketSensor(device: string, identifier: string) {
  const [sensorData, setSensorData] = useState<SensorData>({
    ssid: '',
    battery: 0,
  });

  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const wsUrl = `ws://feelink-api.runasp.net/ws/sensor-data?device=${device}&identifier=${identifier}`;
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('✅ WebSocket conectado para datos de SSID y batería');
    };

    ws.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data);
        console.log('📡 Payload recibido:', parsed);

        const sensors = parsed?.Sensors;

        // Validamos que Sensors exista y sea un objeto
        if (sensors && typeof sensors === 'object') {
          const ssid = sensors.ssid;
          const battery = sensors.b;

          if (typeof ssid === 'string' && typeof battery === 'number') {
            setSensorData({ ssid, battery });
          } else {
            console.warn('⚠️ Estructura inesperada en Sensors:', sensors);
          }
        } else {
          console.warn('⚠️ No se encontró Sensors en el payload:', parsed);
        }
      } catch (e) {
        console.error('❌ Error al parsear datos de WebSocket:', e);
      }
    };

    ws.onerror = (e) => {
      console.error('🚨 Error en WebSocket:', e);
    };

    ws.onclose = () => {
      console.warn('🔌 WebSocket cerrado.');
    };

    return () => {
      ws.close();
    };
  }, [device, identifier]);

  return sensorData;
}
