// src/shared/hooks/useWifiLogic.ts
import { useEffect, useRef, useState } from 'react';
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
  const manualDisconnectRef = useRef(false);
  const hasTriedToConnect = useRef(false); // ✅ NUEVO

  const {
    wifi,
    startConnection,
    connectionSuccess,
    connectionFailure,
    disconnectWifi,
    updateStatusMessage,
    updateSSID
  } = useWifiRedux();

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



  const handleConnect = (network: WifiNetwork) => {
    setSelectedNetwork(network);
    setPassword('');
    setShowPasswordInput(!network.open);
    setModalVisible(true);
    setModalTitle(`Conectar a ${network.ssid}`);
    setModalMessage(network.open ? 'Red abierta, conectando...' : 'Ingresa la contraseña.');
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
    handleConnect,
    closeModal,
    connectedSSID: wifi.currentSSID,
    isConnecting,
    showPasswordInput
  };
}
