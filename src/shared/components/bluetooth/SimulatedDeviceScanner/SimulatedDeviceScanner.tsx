// feelink/src/shared/components/SimulatedDeviceScanner/SimulatedDeviceScanner.tsx
import React, { useEffect } from 'react';

// Define la interfaz para SimulatedDevice.
// Idealmente, esta interfaz debería estar en un archivo de tipos compartido (ej. types.ts).
interface SimulatedDevice {
  id: string;
  name: string;
  status: string;
  isConnected: boolean;
}

interface SimulatedDeviceScannerProps {
  // Una prop booleana que, cuando cambia a 'true', activa la simulación de escaneo.
  triggerScan: boolean;
  // Callback que se llama cuando la simulación de escaneo ha encontrado dispositivos.
  // Pasa un array de dispositivos simulados al componente padre.
  onScanResult: (devices: SimulatedDevice[]) => void;
  // Callback que se llama cuando la simulación de escaneo ha finalizado.
  // Se utiliza para notificar al padre que el proceso de escaneo ha terminado.
  onScanComplete: () => void;
}

const SimulatedDeviceScanner: React.FC<SimulatedDeviceScannerProps> = ({
  triggerScan,
  onScanResult,
  onScanComplete,
}) => {
  useEffect(() => {
    let timer: NodeJS.Timeout;

    // Si 'triggerScan' es verdadero, iniciamos la simulación del escaneo.
    if (triggerScan) {
      // Configuramos un temporizador para simular un proceso de escaneo de 3 segundos.
      timer = setTimeout(() => {
        // Definimos los dispositivos simulados que se "encontrarían" durante el escaneo.
        const newDevices: SimulatedDevice[] = [
          { id: 'dev1', name: 'Peluche BLE', status: 'FF:23:D3:F3:42:4F', isConnected: false },
        ];
        
        // Llamamos al callback 'onScanResult' para pasar los dispositivos encontrados al padre.
        onScanResult(newDevices);
        // Llamamos al callback 'onScanComplete' para notificar al padre que el escaneo ha terminado.
        onScanComplete();
      }, 3000);
    }

    // Función de limpieza para asegurar que el temporizador se detenga
    // si el componente se desmonta o si 'triggerScan' cambia a falso antes de que termine el temporizador.
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [triggerScan, onScanResult, onScanComplete]); // Las dependencias aseguran que el efecto se re-ejecute
                                                  // solo cuando 'triggerScan' o las funciones de callback cambien.

  // Este componente no renderiza ninguna UI visible; su propósito es solo manejar la lógica.
  return null;
};

export default SimulatedDeviceScanner;
