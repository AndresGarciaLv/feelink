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

// Interfaces para los datos de todos los juguetes
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

    // Estados para datos de todos los juguetes
    const [allToysData, setAllToysData] = useState<Record<string, ToyData>>({});
    const [connectedToys, setConnectedToys] = useState(0);
    const [isConnected, setIsConnected] = useState(false);
    const socket = useRef<WebSocket | null>(null);

    // Función para obtener datos del endpoint general
    const fetchAllToysData = async () => {
        try {
            const response = await fetch('http://feelink-api.runasp.net/api/Readings');
            const data: ReadingsResponse = await response.json();
            
            // Agrupar datos por toyId
            const toyDataMap: Record<string, ToyData> = {};
            
            data.items.forEach(item => {
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
                        lastUpdate: new Date(item.createDate)
                    };
                }
                
                const toyData = toyDataMap[item.toyId];
                
                // Clasificar los datos según el métrico
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
                        // Para acelerómetro, necesitarías implementar lógica para X, Y, Z
                        // Por simplicidad, agregamos a X por ahora
                        toyData.accelX.unshift(item.value);
                        break;
                    case 'gyro':
                        // Similar para giroscopio
                        toyData.gyroX.unshift(item.value);
                        break;
                }
                
                // Mantener solo los últimos 20 valores
                Object.keys(toyData).forEach(key => {
                    if (key !== 'lastUpdate' && Array.isArray(toyData[key as keyof ToyData])) {
                        (toyData[key as keyof ToyData] as number[]).splice(20);
                    }
                });
            });
            
            setAllToysData(toyDataMap);
            setConnectedToys(Object.keys(toyDataMap).length);
        } catch (error) {
            console.error('Error fetching toys data:', error);
        }
    };

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
                console.log("📥 Datos recibidos:", event.data);

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

    // useEffect para obtener datos periódicamente
    useEffect(() => {
        // Obtener datos iniciales
        fetchAllToysData();
        
        // Obtener datos cada 30 segundos
        const interval = setInterval(fetchAllToysData, 30000);
        
        return () => clearInterval(interval);
    }, []);

    // Modificar el return del hook para incluir los nuevos datos
    return { 
        sensorData, 
        isConnected, 
        allToysData, 
        connectedToys 
    };
};