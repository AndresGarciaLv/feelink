// ✅ Código React Native para reconstruir JSON BLE fragmentado
import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  rawData: string; // se va actualizando con cada fragmento
}

export default function SensorDataView({ rawData }: Props) {
  const [jsonData, setJsonData] = useState<any>(null);
  const buffer = useRef<string[]>([]);

  useEffect(() => {
    if (!rawData.startsWith('#')) return;

    const index = parseInt(rawData.charAt(1));
    const content = rawData.slice(2);
    buffer.current[index - 1] = content;

    const assembled = buffer.current.join('');

    if (assembled.endsWith('}')) {
     try {
  const parsed = JSON.parse(assembled);
  setJsonData(parsed);
  buffer.current = [];
} catch (e) {
  setJsonData(null);
  buffer.current = []; // <- LIMPIEZA aquí también
}

    }
  }, [rawData]);

  if (!jsonData) {
    return (
      <View style={styles.box}>
        <Text style={styles.error}>Esperando datos completos del peluche...</Text>
      </View>
    );
  }

  return (
    <View style={styles.box}>
      <Text style={styles.title}>Datos del Peluche</Text>
      <Text style={styles.label}>Presión: <Text style={styles.value}>{jsonData.p} Pa</Text></Text>
      <Text style={styles.label}>Batería: <Text style={styles.value}>{jsonData.b} %</Text></Text>
      <Text style={styles.label}>Movimiento:</Text>
      <Text style={styles.sub}>X: {jsonData.m?.x}</Text>
      <Text style={styles.sub}>Y: {jsonData.m?.y}</Text>
      <Text style={styles.sub}>Z: {jsonData.m?.z}</Text>
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
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 4,
  },
  value: {
    fontWeight: '600',
  },
  sub: {
    fontSize: 14,
    marginLeft: 8,
  },
  error: {
    color: 'orange',
    textAlign: 'center',
    fontSize: 16,
  },
});
