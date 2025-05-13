import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Button,
  FlatList,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Device } from 'react-native-ble-plx';
import { manager, requestPermissions } from './BluetoothManager';
import DeviceItem from './components/DeviceItem';
import SensorDataView from './components/SensorDataView';
import { Buffer } from 'buffer';

export default function BluetoothScreen() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);
  const [sensorData, setSensorData] = useState('');
  const [scanning, setScanning] = useState(false);
  const seenDeviceIds = useRef<Set<string>>(new Set());

  useEffect(() => {
    return () => {
      manager.destroy();
    };
  }, []);

  const startScan = async () => {
    seenDeviceIds.current.clear();
    setDevices([]);
    await requestPermissions();
    setScanning(true);

    manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        Alert.alert('Error al escanear', error.message);
        setScanning(false);
        return;
      }

      if (device && !seenDeviceIds.current.has(device.id)) {
        seenDeviceIds.current.add(device.id);
        setDevices((prev) => [...prev, device]);
      }
    });

    setTimeout(() => {
      manager.stopDeviceScan();
      setScanning(false);
    }, 10000);
  };

  const handleConnect = async (device: Device) => {
    try {
      const connected = await device.connect();
      await connected.discoverAllServicesAndCharacteristics();

      connected.monitorCharacteristicForService(
        '12345678-1234-1234-1234-1234567890ab',
        'abcd1234-abcd-1234-abcd-1234567890ab',
        (error, characteristic) => {
          if (error) {
            console.error('Error al recibir datos:', error.message);
            return;
          }

          try {
            const base64 = characteristic?.value ?? '';
            let decoded = Buffer.from(base64, 'base64').toString('utf-8');

            // Sanitizar caracteres no imprimibles
            decoded = decoded.trim().replace(/[\u0000-\u001F\u007F-\u009F]/g, '');

            console.log('JSON recibido:', decoded);
            setSensorData(decoded);
          } catch (err) {
            console.error('Error al decodificar:', err);
          }
        }
      );

      setConnectedDevice(connected);
      Alert.alert('Conectado', `Conectado a ${connected.name ?? connected.id}`);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  const handleDisconnect = async () => {
    if (connectedDevice) {
      await connectedDevice.cancelConnection();
      setConnectedDevice(null);
      setSensorData('');
      Alert.alert('Desconectado', 'El dispositivo ha sido desconectado.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Buscar Peluche</Text>
      <Button title="Buscar Peluche" onPress={startScan} disabled={scanning} />
      {scanning && (
        <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 10 }} />
      )}

      {sensorData && <SensorDataView rawData={sensorData} />}

      <FlatList
        data={devices}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <DeviceItem
            device={item}
            isConnected={connectedDevice?.id === item.id}
            onConnect={() => handleConnect(item)}
            onDisconnect={handleDisconnect}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f4f4f4',
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 40,
    fontWeight: 'bold',
  },
});
