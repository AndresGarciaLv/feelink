// src/shared/hooks/useWifiLogic.ts
import { useEffect, useRef, useState } from 'react';
import { manager, sendBLECommand } from '../../core/services/ble/BluetoothManager';
import { selectConnectedDevice } from '../../core/stores/ble/bleSlice';
import { useAppSelector } from '../../core/stores/store';
import { Buffer } from 'buffer';
import { useWifiRedux } from '../../core/stores/wifi/useWifiRedux';

global.Buffer = global.Buffer || Buffer;

interface WifiNetwork {
  ssid: string;
  open: boolean;
  rssi: number;
}

export default function useWifiLogic() {
  const connectedDevice = useAppSelector(selectConnectedDevice);
  const [networks, setNetworks] = useState<WifiNetwork[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [selectedNetwork, setSelectedNetwork] = useState<WifiNetwork | null>(null);
  const [password, setPassword] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [showPasswordInput, setShowPasswordInput] = useState(false);

  const fragments = useRef<Map<number, string>>(new Map());
  const assemblyTimeout = useRef<NodeJS.Timeout | null>(null);
  const manualDisconnectRef = useRef(false);
  const hasTriedToConnect = useRef(false); // ✅ NUEVO

  const SERVICE_UUID = '12345678-1234-1234-1234-1234567890ab';
  const CHARACTERISTIC_UUID = 'abcd1234-abcd-1234-abcd-1234567890ab';

  const {
    wifi,
    startConnection,
    connectionSuccess,
    connectionFailure,
    disconnectWifi,
    updateStatusMessage,
    updateSSID
  } = useWifiRedux();

  useEffect(() => {
    if (!connectedDevice) return;

    const subscription = manager.monitorCharacteristicForDevice(
      connectedDevice.id,
      SERVICE_UUID,
      CHARACTERISTIC_UUID,
      (error, characteristic) => {
        if (error || !characteristic?.value) return;

        const raw = Buffer.from(characteristic.value, 'base64').toString('utf-8');
        console.log('📥 Fragmento recibido:', raw);

        if (raw.startsWith('#')) {
          if (raw === '#END') {
            processFragments();
            return;
          }

          const match = raw.match(/^#(\d+)\|(.+)$/);
          if (!match) return;

          const index = parseInt(match[1]);
          const content = match[2];
          fragments.current.set(index, content);

          if (assemblyTimeout.current) clearTimeout(assemblyTimeout.current);
          assemblyTimeout.current = setTimeout(processFragments, 1200);
        }
      }
    );

    checkWiFiStatus();

    return () => subscription?.remove();
  }, [connectedDevice]);

  const processFragments = () => {
    const keys = Array.from(fragments.current.keys()).sort((a, b) => a - b);
    const complete = keys.every((k, i) => k === i + 1);
    if (!complete) {
      console.warn('❌ Fragmentos incompletos, esperando más...');
      return;
    }

    const cleanFragments = keys.map(k => fragments.current.get(k) ?? '');
    const jsonStr = cleanFragments.join('').trim();
    console.log('📦 JSON ensamblado:', jsonStr);

    if (!jsonStr || jsonStr.length < 5) {
      console.warn('⚠️ Fragmentos vacíos o incompletos. No se puede procesar.');
      return;
    }

    if (
      !(jsonStr.startsWith('[') && jsonStr.endsWith(']')) &&
      !(jsonStr.startsWith('{') && jsonStr.endsWith('}'))
    ) {
      console.warn('⚠️ JSON ensamblado no tiene formato esperado:', jsonStr);
      return;
    }

    try {
      const parsed = JSON.parse(jsonStr);

      if (Array.isArray(parsed)) {
        setNetworks(parsed);
        setIsScanning(false);
        setModalVisible(false);
      } else if (parsed?.wifiStatus) {
        const status = parsed.wifiStatus;
        const connected = !!status.connected;
        const ssid = status.ssid ?? '';

        if (connected) {
          connectionSuccess();
          updateSSID(ssid);
          setIsConnecting(false);
          setShowPasswordInput(false);
          setModalTitle('✅ Conexión exitosa');
          setModalMessage(`El peluche se ha conectado correctamente a "${ssid}".`);
          setModalVisible(true);
          setTimeout(() => setModalVisible(false), 2500);
        } else {
          disconnectWifi();
          updateSSID('');
          setIsConnecting(false);

          if (manualDisconnectRef.current) {
            setShowPasswordInput(false);
            setModalTitle('📴 Wi-Fi desconectado');
            setModalMessage('El peluche se ha desconectado de la red Wi-Fi.');
            setModalVisible(true);
            setTimeout(() => setModalVisible(false), 2500);
          } else if (ssid) {
            setShowPasswordInput(true);
            setModalTitle('❌ Error de conexión');
            setModalMessage('No se pudo conectar a la red Wi-Fi. Revisa que la contraseña sea correcta.');
            setModalVisible(true);
          } else if (hasTriedToConnect.current) {
            setModalTitle('⚠️ Error de conexión');
            setModalMessage('No se pudo establecer conexión con ninguna red.');
            setModalVisible(true);
          }

          manualDisconnectRef.current = false;
          hasTriedToConnect.current = false; // ✅ Reset
        }
      }
    } catch (err) {
      console.error('❌ Error al parsear JSON:', err);
    } finally {
      fragments.current.clear();
    }
  };

  const startScan = async () => {
    if (!connectedDevice) return;
    fragments.current.clear();
    setNetworks([]);
    setIsScanning(true);
    setModalVisible(true);
    setModalTitle('Escaneando redes WiFi...');
    setModalMessage('Por favor espera unos segundos...');
    await sendBLECommand(connectedDevice.id, SERVICE_UUID, CHARACTERISTIC_UUID, { scan: true });
  };

  const handleConnect = (network: WifiNetwork) => {
    setSelectedNetwork(network);
    setPassword('');
    setShowPasswordInput(!network.open);
    setModalVisible(true);
    setModalTitle(`Conectar a ${network.ssid}`);
    setModalMessage(network.open ? 'Red abierta, conectando...' : 'Ingresa la contraseña.');
  };

  const confirmConnection = async () => {
    if (!connectedDevice || !selectedNetwork) return;

    hasTriedToConnect.current = true; // ✅ Marcar intento
    startConnection(selectedNetwork.ssid);
    setIsConnecting(true);
    setShowPasswordInput(false);

    await sendBLECommand(connectedDevice.id, SERVICE_UUID, CHARACTERISTIC_UUID, {
      connect: {
        ssid: selectedNetwork.ssid,
        pass: selectedNetwork.open ? '' : password,
      }
    });

    setPassword('');
    setSelectedNetwork(null);
    setModalTitle('Conectando...');
    setModalMessage('Esperando respuesta del peluche...');
  };

  const disconnectFromWiFi = async () => {
    if (!connectedDevice) return;
    manualDisconnectRef.current = true;
    await sendBLECommand(connectedDevice.id, SERVICE_UUID, CHARACTERISTIC_UUID, { disconnect: true });
    setModalTitle('Desconectando...');
    setModalMessage('Esperando confirmación...');
    setModalVisible(true);
    setShowPasswordInput(false);
  };

  const reconnectToLastWiFi = async () => {
    if (!connectedDevice) return;
    await sendBLECommand(connectedDevice.id, SERVICE_UUID, CHARACTERISTIC_UUID, { reconnect: true });
    setModalTitle('Reconectando...');
    setModalMessage('Esperando confirmación del peluche...');
    setModalVisible(true);
  };

  const checkWiFiStatus = async () => {
    if (!connectedDevice) return;
    await sendBLECommand(connectedDevice.id, SERVICE_UUID, CHARACTERISTIC_UUID, { status: true });
  };

  const closeModal = () => {
    setIsConnecting(false);
    setModalVisible(false);
    hasTriedToConnect.current = false; // ✅ Reset al cerrar modal manualmente
  };

  return {
    networks,
    isScanning,
    modalVisible,
    modalMessage,
    modalTitle,
    selectedNetwork,
    password,
    setPassword,
    startScan,
    handleConnect,
    confirmConnection,
    disconnectFromWiFi,
    reconnectToLastWiFi,
    checkWiFiStatus,
    closeModal,
    connectedSSID: wifi.currentSSID,
    isConnecting,
    showPasswordInput
  };
}
