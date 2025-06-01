import { useCallback, useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';

export interface SimulatedDevice {
  id: string;
  name: string;
  status: string;
  isConnected: boolean;
}

const useBluetoothLogic = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [devices, setDevices] = useState<SimulatedDevice[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  const [selectedDevice, setSelectedDevice] = useState<SimulatedDevice | null>(null);
  const [triggerSimulatedScan, setTriggerSimulatedScan] = useState(false);

  const handleScanResult = useCallback((foundDevices: SimulatedDevice[]) => {
    setDevices(foundDevices);
  }, []);

  const handleScanComplete = useCallback(() => {
    setIsScanning(false);
    setModalVisible(false);
    setTriggerSimulatedScan(false);
  }, []);

  const startScan = () => {
    setIsScanning(true);
    setDevices([]);
    setModalMessage('Buscando dispositivos..');
    setModalTitle('Escaneando Bluetooth');
    setModalVisible(true);
    setTriggerSimulatedScan(true);
  };

  const handleConnect = (deviceId: string) => {
    const deviceToConnect = devices.find(d => d.id === deviceId);
    if (deviceToConnect) {
      setSelectedDevice(deviceToConnect);
      setModalTitle('Conectar Dispositivo');
      setModalMessage(`¿Deseas conectar con ${deviceToConnect.name}?`);
      setModalVisible(true);
    }
  };

  const confirmConnection = () => {
    if (selectedDevice) {
      setModalVisible(false);
      setDevices(prevDevices =>
        prevDevices.map(d =>
          d.id === selectedDevice.id ? { ...d, status: 'Conectado', isConnected: true } : d
        )
      );
      setModalTitle('Conexión Exitosa');
      setModalMessage(`¡Conectado a ${selectedDevice.name}! Ahora puedes configurar el WiFi.`);
      setModalVisible(true);

      setTimeout(() => {
        setModalVisible(false);
        // navigation.navigate('Wifi1', { device: selectedDevice });   // Navegacion a vista de WIFI
      }, 1500);
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedDevice(null);
  };

  const connectToWifi = () => {
    if (selectedDevice) {
    //   navigation.navigate('Wifi1', { device: selectedDevice }); // Navegacion a vista de WIFI
    } else {
      setModalTitle('Error');
      setModalMessage('Por favor, conecta un peluche primero para configurar el WiFi.');
      setModalVisible(true);
    }
  };

  useEffect(() => {
    startScan();
  }, []);

  return {
    devices,
    isScanning,
    modalVisible,
    modalMessage,
    modalTitle,
    selectedDevice,
    triggerSimulatedScan,
    handleScanResult,
    handleScanComplete,
    startScan,
    handleConnect,
    confirmConnection,
    closeModal,
    connectToWifi,
  };
};

export default useBluetoothLogic;