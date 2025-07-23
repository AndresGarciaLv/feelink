import { useEffect, useRef, useState } from 'react';

interface PressureData {
  pressurePercent: number;
  pressureGrams: number;
}

export const usePressureSensor = (identifier: string): PressureData => {
  const [pressurePercent, setPressurePercent] = useState(0);
  const [pressureGrams, setPressureGrams] = useState(0);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!identifier) return;

    const WS_BASE_URL = process.env.EXPO_PUBLIC_WS_BASE_URL;
    const wsUrl = `${WS_BASE_URL}?device=esp32&identifier=${identifier}`;
    ws.current = new WebSocket(wsUrl);

    ws.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const pressureData = data.Sensors?.p;
        if (pressureData) {
          const pc = typeof pressureData.pc === 'number' ? pressureData.pc : 0;
          const gr = typeof pressureData.gr === 'number' ? pressureData.gr : 0;

          setPressurePercent(Math.min(Math.max(pc / 100, 0), 1));
          setPressureGrams(gr);
        }
      } catch (error) {
        console.error('❌ Error parseando mensaje WebSocket', error);
      }
    };

    ws.current.onerror = (error) => {
      console.error('🚨 Error en WebSocket:', error);
    };

    return () => {
      ws.current?.close();
    };
  }, [identifier]);

  return { pressurePercent, pressureGrams };
};
