// ✅ useBluetoothLogic.ts actualizado y corregido
import { useEffect, useRef, useState } from 'react';
import { Device } from 'react-native-ble-plx';
import { Alert } from 'react-native';
import { manager, requestPermissions } from '../../core/services/ble/BluetoothManager';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import { useBleStore } from '../../core/stores/bleStore';

const SERVICE_UUID = '12345678-1234-1234-1234-1234567890ab';
const CHARACTERISTIC_UUID = 'abcd1234-abcd-1234-abcd-1234567890ab';

const SCAN_DURATION = 8000;
const RECONNECT_TIMEOUT = 15000;

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Bluetooth'>;

export default function useBluetoothLogic() {
  const navigation = useNavigation<NavigationProp>();

  const [devices, setDevices] = useState<Device[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);

  const reconnectTimeout = useRef<NodeJS.Timeout | null>(null);
  const seenDeviceIds = useRef<Set<string>>(new Set());
  const isConnectingRef = useRef(false);

  const {
    connectedDevice,
    lastDeviceId,
    setConnectedDevice,
    setLastDeviceId,
    manuallyDisconnected,
    setManuallyDisconnected,
  } = useBleStore();

  const manuallyDisconnectedRef = useRef(manuallyDisconnected);
  const disconnectTriggeredByUser = useRef(false);

  useEffect(() => {
    manuallyDisconnectedRef.current = manuallyDisconnected;
  }, [manuallyDisconnected]);

  // ✅ Reasigna selectedDevice si ya hay un dispositivo conectado al volver a la vista
  useEffect(() => {
    if (connectedDevice) {
      setSelectedDevice(connectedDevice);
    }
  }, [connectedDevice]);

  const startScan = async () => {
    setSelectedDevice(null); // Limpia cualquier selección anterior
    seenDeviceIds.current.clear();
    setDevices([]);
    await requestPermissions();
    setIsScanning(true);
    setModalTitle('Escaneando Bluetooth');
    setModalMessage('Buscando peluches cercanos...');
    setModalVisible(true);

    manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        setModalTitle('Error');
        setModalMessage(error.message);
        setIsScanning(false);
        return;
      }

      if (device && !seenDeviceIds.current.has(device.id)) {
        seenDeviceIds.current.add(device.id);
        setDevices(prev => [...prev, device]);
      }
    });

    setTimeout(() => {
      manager.stopDeviceScan();
      setIsScanning(false);
      setModalVisible(false);
    }, SCAN_DURATION);
  };

  const handleConnect = async (device: Device) => {
    try {
      setModalTitle('Conectando...');
      setModalMessage(`Intentando conectar con ${device.name ?? device.id}`);
      setModalVisible(true);

      try {
        await manager.cancelDeviceConnection(device.id);
      } catch {}

      const connected = await device.connect();
      await connected.discoverAllServicesAndCharacteristics();

      manager.onDeviceDisconnected(connected.id, () => {
        setConnectedDevice(null);

        const shouldReconnect = !disconnectTriggeredByUser.current && !manuallyDisconnectedRef.current;

        if (shouldReconnect) {
          reconnectToDevice();
        } else {
          setManuallyDisconnected(false);
        }

        disconnectTriggeredByUser.current = false;
      });

      setConnectedDevice(connected);
      setLastDeviceId(connected.id);
      setSelectedDevice(connected);
      setModalTitle('✅ ¡Conexión exitosa!');
      setModalMessage('\nAhora puedes conectar el peluche a WiFi!');
      setTimeout(() => setModalVisible(false), 5000);
    } catch (error: any) {
      setModalTitle('Error');
      setModalMessage(error.message || 'Error al conectar');
      setTimeout(() => setModalVisible(false), 2000);
    }
  };

  const reconnectToDevice = () => {
    if (!lastDeviceId || manuallyDisconnectedRef.current || isConnectingRef.current) return;

    isConnectingRef.current = true;
    setModalTitle('Reconectando...');
    setModalMessage('Intentando reconectar con el peluche');
    setModalVisible(true);

    manager.startDeviceScan(null, null, async (error, device) => {
      if (device && device.id === lastDeviceId) {
        manager.stopDeviceScan();
        try {
          await handleConnect(device);
        } finally {
          isConnectingRef.current = false;
        }
      }
    });

    reconnectTimeout.current = setTimeout(() => {
      manager.stopDeviceScan();
      setModalVisible(false);
      isConnectingRef.current = false;
    }, RECONNECT_TIMEOUT);
  };

  const handleDisconnect = async () => {
    setManuallyDisconnected(true);
    disconnectTriggeredByUser.current = true;
    if (connectedDevice) {
      await connectedDevice.cancelConnection();
      setConnectedDevice(null);
    }
  };

  const confirmConnection = () => {
    if (selectedDevice) handleConnect(selectedDevice);
  };

  const closeModal = () => setModalVisible(false);

  const connectToWifi = () => {
    if (!connectedDevice) return;
    navigation.navigate('Wifi1', { device: connectedDevice });
  };

  return {
    devices: connectedDevice ? [connectedDevice] : devices,
    isScanning,
    modalVisible,
    modalMessage,
    modalTitle,
    selectedDevice,
    isConnected: !!connectedDevice,
    connectedDevice,
    startScan,
    handleConnect,
    confirmConnection,
    closeModal,
    connectToWifi,
    handleDisconnect,
    setSelectedDevice,
  };
}
