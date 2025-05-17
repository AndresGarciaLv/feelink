// src/components/SensorDataView.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  jsonData: {
    p: number;
    b: number;
    m?: { x: number; y: number; z: number };
  };
}

export default function SensorDataView({ jsonData }: Props) {
  return (
    <View style={styles.box}>
      <Text style={styles.title}>Datos del Peluche</Text>
      <Text style={styles.label}>
        Presión:{' '}
        <Text style={styles.value}>{jsonData.p} Pa</Text>
      </Text>
      <Text style={styles.label}>
        Batería:{' '}
        <Text style={styles.value}>{jsonData.b} %</Text>
      </Text>
      <Text style={styles.label}>Movimiento:</Text>
      <Text style={styles.sub}>X: {jsonData.m?.x ?? '-'}</Text>
      <Text style={styles.sub}>Y: {jsonData.m?.y ?? '-'}</Text>
      <Text style={styles.sub}>Z: {jsonData.m?.z ?? '-'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    padding: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
    marginTop: 20,
    marginBottom: 10,
  },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 12, textAlign: 'center' },
  label: { fontSize: 16, marginBottom: 4 },
  value: { fontWeight: '600' },
  sub: { fontSize: 14, marginLeft: 8 },
});
