import { useState, useEffect, useRef } from 'react';

// Definimos los tipos para los datos que esperamos
interface Sensor {
    Value: number;
    Metric: string;
}

interface WebSocketData {
    Message: string;
    Sensors: Sensor[];
}

// La URL de tu WebSocket

const WEBSOCKET_URL = "ws://feelink-api.runasp.net/ws/sensor-data?device=esp32&identifier=F8:B3:B7:30:34:80";

export const useSensorSocket = () => {
    // Estado para almacenar los datos de los sensores ya procesados
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
    const [isConnected, setIsConnected] = useState(false);
    const socket = useRef<WebSocket | null>(null);

    useEffect(() => {
        // Conexión al WebSocket
        socket.current = new WebSocket(WEBSOCKET_URL);

        socket.current.onopen = () => {
            console.log("✅ WebSocket Conectado");
            setIsConnected(true);
        };

        socket.current.onclose = () => {
            console.log("🔌 WebSocket Desconectado");
            setIsConnected(false);
        };

        socket.current.onerror = (error) => {
            console.error("❌ Error en WebSocket:", error);
        };

        socket.current.onmessage = (event) => {
            try {
                        console.log("📥 Datos recibidos:", event.data); // <---- Agrega esto

                const rawData: WebSocketData = JSON.parse(event.data);
                
                // Procesamos los datos para que sean fáciles de usar en los gráficos
                const newAccelValues: number[] = [];
                const newGyroValues: number[] = [];

                const updates: Record<string, number> = {};

                rawData.Sensors.forEach(sensor => {
                    if (sensor.Metric === 'accel') {
                        newAccelValues.push(sensor.Value);
                    } else if (sensor.Metric === 'gyro') {
                        newGyroValues.push(sensor.Value);
                    } else {
                        updates[sensor.Metric] = sensor.Value;
                    }
                });

                // Actualizamos el estado. Guardamos un historial de los últimos 20 valores para las gráficas de línea.
                setSensorData(prevData => ({
                    pressurePercent: [...prevData.pressurePercent.slice(-19), updates.pressurePercent ?? 0],
                    pressureGram: [...prevData.pressureGram.slice(-19), updates.pressureGram ?? 0],
                    battery: [...prevData.battery.slice(-19), updates.battery ?? 0],
                    accelX: [...prevData.accelX.slice(-19), newAccelValues[0] ?? 0],
                    accelY: [...prevData.accelY.slice(-19), newAccelValues[1] ?? 0],
                    accelZ: [...prevData.accelZ.slice(-19), newAccelValues[2] ?? 0],
                    gyroX: [...prevData.gyroX.slice(-19), newGyroValues[0] ?? 0],
                    gyroY: [...prevData.gyroY.slice(-19), newGyroValues[1] ?? 0],
                    gyroZ: [...prevData.gyroZ.slice(-19), newGyroValues[2] ?? 0],
                }));

            } catch (e) {
                console.error("Error al parsear el JSON del WebSocket", e);
            }
        };

        // Limpieza: Cerramos la conexión cuando el componente se desmonte
        return () => {
            socket.current?.close();
        };
    }, []); // El array vacío asegura que esto se ejecute solo una vez

    return { sensorData, isConnected };
};
