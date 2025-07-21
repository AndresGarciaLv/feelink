import { useState, useEffect, useRef } from 'react';

interface ToyData {
  pressurePercent: number[];
  pressureGram: number[];
  battery: number[];
  accelX: number[];
  accelY: number[];
  accelZ: number[];
  gyroX: number[];
  gyroY: number[];
  gyroZ: number[];
  lastUpdate: Date;
}

interface ReadingItem {
  id: string;
  toyId: string;
  createDate: string;
  value: number;
  metric: string;
}

interface ReadingsResponse {
  items: ReadingItem[];
  totalItems: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Variables de entorno
const API_URL = process.env.EXPO_PUBLIC_API_URL;
const WS_BASE_URL = process.env.EXPO_PUBLIC_WS_BASE_URL;
const MAC_ADDRESS = process.env.EXPO_PUBLIC_DEVICE_MAC_ADDRESS;

// Construcción de la URL completa del WebSocket
const WEBSOCKET_URL = `${WS_BASE_URL}?device=esp32&identifier=${MAC_ADDRESS}`;

export const useSensorSocket = () => {
  const [sensorData, setSensorData] = useState<Record<string, number[]>>({
    pressurePercent: [],
    pressureGram: [],
    battery: [],
    accelX: [],
    accelY: [],
    accelZ: [],
    gyroX: [],
    gyroY: [],
    gyroZ: [],
  });

  const [allToysData, setAllToysData] = useState<Record<string, ToyData>>({});
  const [connectedToys, setConnectedToys] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const socket = useRef<WebSocket | null>(null);

  const fetchAllToysData = async () => {
    try {
      const response = await fetch(`${API_URL}Readings`);
      const data: ReadingsResponse = await response.json();

      const toyDataMap: Record<string, ToyData> = {};

      data.items.forEach((item) => {
        if (!toyDataMap[item.toyId]) {
          toyDataMap[item.toyId] = {
            pressurePercent: [],
            pressureGram: [],
            battery: [],
            accelX: [],
            accelY: [],
            accelZ: [],
            gyroX: [],
            gyroY: [],
            gyroZ: [],
            lastUpdate: new Date(item.createDate),
          };
        }

        const toyData = toyDataMap[item.toyId];

        switch (item.metric.toLowerCase()) {
          case 'pressurepercent':
            toyData.pressurePercent.unshift(item.value);
            break;
          case 'pressuregram':
            toyData.pressureGram.unshift(item.value);
            break;
          case 'battery':
            toyData.battery.unshift(item.value);
            break;
          case 'accel':
            toyData.accelX.unshift(item.value);
            break;
          case 'gyro':
            toyData.gyroX.unshift(item.value);
            break;
        }

        // Limita a 20 lecturas por métrica
        Object.keys(toyData).forEach((key) => {
          if (key !== 'lastUpdate' && Array.isArray(toyData[key as keyof ToyData])) {
            (toyData[key as keyof ToyData] as number[]).splice(20);
          }
        });
      });

      setAllToysData(toyDataMap);
      setConnectedToys(Object.keys(toyDataMap).length);
    } catch (error) {
      console.log('Error fetching toys data:', error);
    }
  };

  useEffect(() => {
    socket.current = new WebSocket(WEBSOCKET_URL);

    socket.current.onopen = () => {
      setIsConnected(true);
    };

    socket.current.onclose = () => {
      setIsConnected(false);
    };

    socket.current.onerror = (error) => {
      console.log('❌ Error en WebSocket:', error);
    };

    socket.current.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data);
        const sensors = parsed.Sensors;

        if (sensors && typeof sensors === 'object') {
          setSensorData((prevData) => ({
            pressurePercent: [...prevData.pressurePercent.slice(-19), sensors.p?.pc ?? 0],
            pressureGram: [...prevData.pressureGram.slice(-19), sensors.p?.gr ?? 0],
            battery: [...prevData.battery.slice(-19), sensors.b ?? 0],
            accelX: [...prevData.accelX.slice(-19), sensors.m?.x ?? 0],
            accelY: [...prevData.accelY.slice(-19), sensors.m?.y ?? 0],
            accelZ: [...prevData.accelZ.slice(-19), sensors.m?.z ?? 0],
            gyroX: [...prevData.gyroX.slice(-19), sensors.g?.x ?? 0],
            gyroY: [...prevData.gyroY.slice(-19), sensors.g?.y ?? 0],
            gyroZ: [...prevData.gyroZ.slice(-19), sensors.g?.z ?? 0],
          }));
        } else {
          console.log('⚠️ Formato inesperado de Sensors:', sensors);
        }
      } catch (e) {
        console.log('❌ Error al parsear el JSON del WebSocket', e);
      }
    };

    return () => {
      socket.current?.close();
    };
  }, []);

  useEffect(() => {
    fetchAllToysData();
    const interval = setInterval(fetchAllToysData, 30000);
    return () => clearInterval(interval);
  }, []);

  return {
    sensorData,
    isConnected,
    allToysData,
    connectedToys,
  };
};
