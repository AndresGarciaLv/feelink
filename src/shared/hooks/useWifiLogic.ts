// src/hooks/useWifiLogic.ts
import { useState, useEffect, useCallback } from 'react';

interface WifiNetwork {
  ssid: string;
  security: boolean; // true if secured, false if open
  isConnected: boolean;
}

interface WifiLogicHook {
  networks: WifiNetwork[];
  isScanning: boolean;
  modalVisible: boolean;
  modalMessage: string;
  modalTitle: string;
  selectedNetwork: WifiNetwork | null;
  triggerSimulatedScan: boolean;
  startScan: () => void;
  handleConnect: (ssid: string) => void;
  confirmConnection: () => void;
  closeModal: () => void;
  handleScanResult: (foundNetworks: WifiNetwork[]) => void;
  handleScanComplete: () => void;
}

export const useWifiLogic = (): WifiLogicHook => {
  const [networks, setNetworks] = useState<WifiNetwork[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  const [selectedNetwork, setSelectedNetwork] = useState<WifiNetwork | null>(null);
  const [triggerSimulatedScan, setTriggerSimulatedScan] = useState(false);

  const handleScanResult = useCallback((foundNetworks: WifiNetwork[]) => {
    setNetworks(foundNetworks);
  }, []);

  const handleScanComplete = useCallback(() => {
    setIsScanning(false);
    setModalVisible(false);
    setTriggerSimulatedScan(false);
  }, []);

  const startScan = () => {
    setIsScanning(true);
    setNetworks([]);
    setModalMessage('Buscando redes Wi-Fi...');
    setModalTitle('Escaneando Wi-Fi');
    setModalVisible(true);
    setTriggerSimulatedScan(true);
  };

  useEffect(() => {
    // Iniciar escaneo al montar el componente (o cuando el hook se inicializa)
    startScan();
  }, []);

  const handleConnect = (ssid: string) => {
    const networkToConnect = networks.find(n => n.ssid === ssid);
    if (networkToConnect) {
      setSelectedNetwork(networkToConnect);
      setModalTitle('Conectar a red Wi-Fi');
      setModalMessage(`¿Deseas conectar con "${networkToConnect.ssid}"?`);
      setModalVisible(true);
    }
  };

  const confirmConnection = () => {
    if (selectedNetwork) {
      setModalVisible(false);
      setNetworks(prevNetworks =>
        prevNetworks.map(n =>
          n.ssid === selectedNetwork.ssid ? { ...n, isConnected: true } : n
        )
      );
      setModalTitle('Conexión Exitosa');
      setModalMessage(`¡Conectado a "${selectedNetwork.ssid}"!`);
      setModalVisible(true);

      setTimeout(() => {
        setModalVisible(false);
        // Aquí podrías añadir una lógica para navegar si es necesario,
        // pero generalmente la navegación se maneja en el componente de UI
        // que tiene acceso a 'navigation'. Podrías pasar una función de callback
        // al hook si la navegación es parte integral de la lógica.
      }, 1500);
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedNetwork(null);
  };

  return {
    networks,
    isScanning,
    modalVisible,
    modalMessage,
    modalTitle,
    selectedNetwork,
    triggerSimulatedScan,
    startScan,
    handleConnect,
    confirmConnection,
    closeModal,
    handleScanResult,
    handleScanComplete,
  };
};