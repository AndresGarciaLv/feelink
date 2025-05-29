import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from './bluetooth/constants/colors';
import mockData from '../mocks/mockEmotionData.json'; // Ruta corregida

type EmotionGraphsProps = {
  patientId?: string;
  showGraph?: boolean;
};

// Función para generar valores aleatorios entre 1-100
const getRandomValue = () => Math.floor(Math.random() * 100) + 1;

// Función que randomiza los valores del JSON manteniendo su estructura
const generateRandomData = () => ({
  ...mockData, // Mantiene el patientId original
  emotions: mockData.emotions.map(item => ({
    day: item.day, // Conserva los días originales
    value: getRandomValue() // Asigna un valor aleatorio
  }))
});

const EmotionGraphs: React.FC<EmotionGraphsProps> = () => {
  const { patientId, emotions } = generateRandomData(); // 👈 Datos frescos

  // Formatea los días a 3 caracteres (Lun, Mar, Mié...)
  const formatDay = (day: string) => day.substring(0, 3);

  return (
    <View style={styles.graphSection}>
      <Text style={styles.sectionTitle}>Estrés del último semana</Text>
      <View style={styles.graphContainer}>
        {emotions.map((item, index) => (
          <View key={`${patientId}-${index}`} style={styles.graphBarContainer}>
            <View
              style={[
                styles.graphBar,
                { height: item.value } // Altura dinámica basada en el valor
              ]}
            />
            <Text style={styles.graphLabel}>{formatDay(item.day)}</Text>
            <Text style={styles.graphValue}>{item.value}%</Text>
          </View>
        ))}
      </View>
      <Text style={styles.footer}>
        ID: {patientId} • Actualizado: {new Date().toLocaleTimeString()}
      </Text>
    </View>
  );
};

// Tus estilos originales (sin cambios)
const styles = StyleSheet.create({
  graphSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    color: Colors.textPrimary,
    marginBottom: 15,
    textAlign: 'center',
  },
  graphContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 180,
    marginTop: 10,
  },
  graphBarContainer: {
    alignItems: 'center',
    width: 40,
  },
  graphBar: {
    width: 25,
    backgroundColor: Colors.secondary,
    borderRadius: 5,
    marginBottom: 5,
  },
  graphLabel: {
    fontSize: 14,
    color: Colors.textPrimary,
    marginTop: 8,
  },
  graphValue: {
    fontSize: 12,
    color: 'gray',
    marginTop: 4,
  },
  footer: {
    fontSize: 12,
    color: Colors.palevioletred,
    textAlign: 'center',
    marginTop: 10,
  },
});

export default EmotionGraphs;