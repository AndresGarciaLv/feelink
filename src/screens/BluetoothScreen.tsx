// src/BluetoothScreen.tsx
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
import { manager, requestPermissions } from '../core/services/ble/BluetoothManager';
import DeviceItem from '../shared/components/bluetooth/DeviceItem';
import SensorDataView from '../shared/components/bluetooth/SensorDataView';
import { Buffer } from 'buffer';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import TabBar from '../shared/navigation/TabBar';

const SERVICE_UUID = '12345678-1234-1234-1234-1234567890ab';
const CHARACTERISTIC_UUID = 'abcd1234-abcd-1234-abcd-1234567890ab';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Bluetooth'>;

export default function BluetoothScreen() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);
  const [sensorData, setSensorData] = useState<{
    p: number;
    b: number;
    m?: { x: number; y: number; z: number };
  } | null>(null);
  const [scanning, setScanning] = useState(false);

  const seenDeviceIds = useRef<Set<string>>(new Set());
  const buffer = useRef<string[]>([]);
  const isParsing = useRef(false);
  const parseTimeout = useRef<NodeJS.Timeout | null>(null);

  const navigation = useNavigation<NavigationProp>();

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
        setDevices(prev => [...prev, device]);
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
        SERVICE_UUID,
        CHARACTERISTIC_UUID,
        (error, characteristic) => {
          if (error || !characteristic?.value) return;
          const fragment = Buffer.from(characteristic.value, 'base64').toString('utf-8');
          console.log('Fragmento sensor:', fragment);

          // Inicia ensamblaje de fragmentos
          if (fragment.startsWith('#1')) {
            buffer.current = [];
            isParsing.current = true;
          }
          if (!isParsing.current) return;

          const match = fragment.match(/^#(\d+)/);
          if (!match) return;
          const index = parseInt(match[1], 10);
          const prefix = match[0];
          const payload = fragment.slice(prefix.length);

          buffer.current[index - 1] = payload;

          const assembled = buffer.current.join('').trim();
          if (assembled.startsWith('{') && assembled.endsWith('}')) {
            try {
              const obj = JSON.parse(assembled);
              setSensorData(obj);
            } catch (e) {
              console.error('Error al parsear JSON sensor:', e, assembled);
            }
            isParsing.current = false;
          } else {
            clearTimeout(parseTimeout.current!);
            parseTimeout.current = setTimeout(() => {
              const assembledTimeout = buffer.current.join('').trim();
              if (assembledTimeout.startsWith('{') && assembledTimeout.endsWith('}')) {
                try { setSensorData(JSON.parse(assembledTimeout)); } catch {}
              }
              isParsing.current = false;
            }, 1000);
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
      setSensorData(null);
      Alert.alert('Desconectado', 'El dispositivo ha sido desconectado.');
    }
  };

  const goToWiFi = () => {
    if (!connectedDevice) {
      Alert.alert('Advertencia', 'Conéctate a un peluche primero.');
      return;
    }
    navigation.navigate('WiFi', { device: connectedDevice });
  };

  return (
    <View style={styles.container}>
      
      <View style={styles.headerRow}>
        <Text style={styles.title}>Buscar Peluche</Text>
        <Button
          title="Conectar a WiFi"
          onPress={goToWiFi}
          disabled={!connectedDevice}
          color="#007AFF"
        />
         <Button 
         title="Ver Pacientes" 
         onPress={() => navigation.navigate('Patients', { openAddModal: false })} 
         />
      </View>

        <Button 
         title="Ver Perfil" 
         onPress={() => navigation.navigate('Profile')} 
         />

      <Button title="Buscar Peluches" onPress={startScan} disabled={scanning} />
      <Button title="Tutor Profile" onPress={() => navigation.navigate('TutorProfile')} />
               <Button 
         title="Ir al dashboard" 
         onPress={() => navigation.navigate('Dashboard')} 
         />
      {scanning && <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 10 }} />}

      {sensorData && <SensorDataView jsonData={sensorData} />}

      <FlatList
        data={devices}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <DeviceItem
            device={item}
            isConnected={connectedDevice?.id === item.id}
            onConnect={() => handleConnect(item)}
            onDisconnect={handleDisconnect}
          />
        )}
      />
      <TabBar activeTab="Bluetooth" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f4f4f4' },
  title: { fontSize: 24, fontWeight: 'bold' },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 40,
  },
});

