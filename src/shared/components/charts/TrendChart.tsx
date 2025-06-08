import React from 'react';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions, View, Text, StyleSheet } from 'react-native';
import { DetalleEstado } from '../../../core/types/common/PatientChart';

const screenWidth = Dimensions.get('window').width;

interface Props {
  detallado: DetalleEstado[];
}

const estadoToY = (estado: string) => {
  switch (estado) {
    case 'estable':
      return 1;
    case 'ansioso':
      return 2;
    case 'crisis':
      return 3;
    default:
      return 0;
  }
};

const TrendChart: React.FC<Props> = ({ detallado }) => {
  const labels = detallado.map(d => d.fecha.slice(5));
  const data = detallado.map(d => estadoToY(d.estado));

  // Color base para la línea, usando verde transparente
  const lineColor = 'rgba(137, 197, 139, 0.5)'; // #89C58B con opacidad 0.5

  return (
    <View>
      <Text style={{ textAlign: 'center', fontSize: 16, fontWeight: 'bold', marginBottom: 8 }}>Tendencia emocional</Text>

      <LineChart
        data={{
          labels,
          datasets: [
            {
              data,
              color: () => lineColor,
              strokeWidth: 3,
            },
          ],
        }}
        width={screenWidth - 20}
        height={220}
        chartConfig={{
          backgroundGradientFrom: '#fff',
          backgroundGradientTo: '#fff',
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          labelColor: () => '#666',
          propsForDots: {
            r: '5',
            strokeWidth: '1',
            stroke: '#fff',
            fill: lineColor,
          },
        }}
        bezier
        style={{ marginVertical: 8, borderRadius: 8 }}
      />

      {/* Leyenda */}
      <View style={styles.legendContainer}>
        <View style={[styles.tag, { backgroundColor: 'rgba(137, 197, 139, 0.5)' }]}>
          <Text style={styles.tagText}>Estable</Text>
        </View>
        <View style={[styles.tag, { backgroundColor: 'rgba(216, 219, 86, 0.5)' }]}>
          <Text style={styles.tagText}>Ansioso</Text>
        </View>
        <View style={[styles.tag, { backgroundColor: 'rgba(210, 115, 115, 0.5)' }]}>
          <Text style={styles.tagText}>Crisis</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 12,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  tagText: {
    color: '#333',
    fontWeight: '600',
  },
});

export default TrendChart;
