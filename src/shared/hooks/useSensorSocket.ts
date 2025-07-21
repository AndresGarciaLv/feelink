import { useState, useEffect, useRef, useCallback } from 'react';

// --- JSON de entrada ---
interface PressureData {
    pc: number; // Pressure Percent
    gr: number; // Pressure Gram
}

interface AxisData {
    x: number;
    y: number;
    z: number;
}

interface SensorsData {
    p: PressureData; // Pressure
    b: number;       // Battery
    m: AxisData;     // Accelerometer
    g: AxisData;     // Gyroscope
    w: boolean;      // Unknown boolean, potentially a status
    ssid: string;    // WiFi SSID
}

interface WebSocketResponse {
    Message: string;
    Sensors: SensorsData;
}

// --- Types para los datos procesados que el hook devolverá ---
interface ProcessedSensorData {
    pressurePercent: number[];
    pressureGram: number[];
    battery: number[];
    accelX: number[];
    accelY: number[];
    accelZ: number[];
    gyroX: number[];
    gyroY: number[];
    gyroZ: number[];
    lastWifiSsid: string | null; 
    lastMessage: string | null; 
}

const MAX_HISTORY_LENGTH = 600; // Constante para la longitud del historial, fácil de ajustar

export const useSensorSocket = () => {
    const [sensorData, setSensorData] = useState<ProcessedSensorData>({
        pressurePercent: [],
        pressureGram: [],
        battery: [],
        accelX: [],
        accelY: [],
        accelZ: [],
        gyroX: [],
        gyroY: [],
        gyroZ: [],
        lastWifiSsid: null,
        lastMessage: null,
    });

    // Estados para datos de todos los juguetes
    const [allToysData, setAllToysData] = useState<Record<string, ToyData>>({});
    const [connectedToys, setConnectedToys] = useState(0);
    const [isConnected, setIsConnected] = useState(false);
    const socket = useRef<WebSocket | null>(null);

    // Construimos la URL del WebSocket de forma dinámica
    const websocketUrl = `${process.env.EXPO_PUBLIC_WS_BASE_URL}?device=esp32&identifier=${process.env.EXPO_PUBLIC_DEVICE_MAC_ADDRESS}`;

    // Usamos useCallback para memoizar la función de procesamiento,
    const processWebSocketMessage = useCallback((event: MessageEvent) => {
        try {
            // console.log("📥 Datos recibidos:", event.data);
            const rawData: WebSocketResponse = JSON.parse(event.data);

            setSensorData(prevData => ({
                // Actualizamos los valores de presión, limitando el historial
                pressurePercent: [...prevData.pressurePercent.slice(-(MAX_HISTORY_LENGTH - 1)), rawData.Sensors.p.pc],
                pressureGram: [...prevData.pressureGram.slice(-(MAX_HISTORY_LENGTH - 1)), rawData.Sensors.p.gr],
                // Actualizamos la batería
                battery: [...prevData.battery.slice(-(MAX_HISTORY_LENGTH - 1)), rawData.Sensors.b],
                // Actualizamos los valores del acelerómetro
                accelX: [...prevData.accelX.slice(-(MAX_HISTORY_LENGTH - 1)), rawData.Sensors.m.x],
                accelY: [...prevData.accelY.slice(-(MAX_HISTORY_LENGTH - 1)), rawData.Sensors.m.y],
                accelZ: [...prevData.accelZ.slice(-(MAX_HISTORY_LENGTH - 1)), rawData.Sensors.m.z],
                // Actualizamos los valores del giroscopio
                gyroX: [...prevData.gyroX.slice(-(MAX_HISTORY_LENGTH - 1)), rawData.Sensors.g.x],
                gyroY: [...prevData.gyroY.slice(-(MAX_HISTORY_LENGTH - 1)), rawData.Sensors.g.y],
                gyroZ: [...prevData.gyroZ.slice(-(MAX_HISTORY_LENGTH - 1)), rawData.Sensors.g.z],
                // Guardamos el último SSID y mensaje
                lastWifiSsid: rawData.Sensors.ssid,
                lastMessage: rawData.Message,
            }));

        } catch (e) {
            // console.error("❌ Error al parsear o procesar JSON del WebSocket:", e);
        }
    }, []); 

    useEffect(() => {
        // Aseguramos que solo haya una instancia del socket
        if (socket.current) {
            socket.current.close();
        }

        // Conexión al WebSocket
        socket.current = new WebSocket(websocketUrl);

        socket.current.onopen = () => {
            console.log(`✅ WebSocket Conectado a: ${websocketUrl}`);
            setIsConnected(true);
        };

        socket.current.onclose = () => {
            console.log("🔌 WebSocket Desconectado");
            setIsConnected(false);
        };

        socket.current.onerror = (error) => {
            console.error("❌ Error en WebSocket:", error);
            setIsConnected(false); // Asumimos desconexión o estado de error
        };

        // Asignamos el handler memoizado
        socket.current.onmessage = processWebSocketMessage;

        // Limpieza: Cerramos la conexión cuando el componente se desmonte o el hook se re-ejecute
        return () => {
            // console.log("🧹 Limpiando conexión WebSocket...");
            socket.current?.close();
            socket.current = null; // Limpiamos la referencia
        };
    }, [websocketUrl, processWebSocketMessage]); // Re-ejecutar si la URL o el handler cambian (aunque el handler está memoizado)

    return { sensorData, isConnected };
};