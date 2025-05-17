// ✅ components/DeviceItem.tsx
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { Device } from 'react-native-ble-plx';

interface Props {
  device: Device;
  isConnected: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
}

export default function DeviceItem({ device, isConnected, onConnect, onDisconnect }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.name}>{device.name ?? device.localName ?? 'Sin nombre'}</Text>
      <Text style={styles.id}>{device.id}</Text>
      <Button
        title={isConnected ? 'Desconectar' : 'Conectar'}
        onPress={isConnected ? onDisconnect : onConnect}
        color={isConnected ? '#c0392b' : '#27ae60'}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 14,
    marginBottom: 12,
    borderRadius: 10,
    elevation: 2,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
  },
  id: {
    fontSize: 12,
    color: '#555',
    marginBottom: 0,
  },
});