import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import ClinicalColors from '../../constants/clinicalcolors';
import ClinicalInfoCard from '../../chart-cards/ClinicalInfoCard';

const { width: screenWidth } = Dimensions.get('window');

interface Props {
  pressureValue: number;
  pressureState: {
    label: string;
    color: string;
  };
  chartData: any[];
}

const PressureChartCard: React.FC<Props> = ({ pressureValue, pressureState, chartData }) => {
  return (
    <ClinicalInfoCard
      title="Monitoreo de Presión"
      description="Mide la intensidad del contacto físico con el peluche terapéutico. Ayuda a identificar patrones de búsqueda sensorial y estados emocionales."
      clinicalValue={pressureState}
    >
      <View style={styles.currentValueContainer}>
        <Text style={[styles.currentValue, { color: pressureState.color }]}>
          {pressureValue.toFixed(1)}%
        </Text>
        <Text style={styles.currentLabel}>Presión Actual</Text>
      </View>

      <View style={styles.pressureScale}>
        <View style={styles.scaleItem}>
          <View style={[styles.scaleIndicator, { backgroundColor: ClinicalColors.stable }]} />
          <Text style={styles.scaleText}>0-60% Estable</Text>
        </View>
        <View style={styles.scaleItem}>
          <View style={[styles.scaleIndicator, { backgroundColor: ClinicalColors.anxious }]} />
          <Text style={styles.scaleText}>61-87% Ansioso</Text>
        </View>
        <View style={styles.scaleItem}>
          <View style={[styles.scaleIndicator, { backgroundColor: ClinicalColors.crisis }]} />
          <Text style={styles.scaleText}>88-100% Crisis</Text>
        </View>
      </View>

      {chartData.length > 0 && (
        <BarChart
          data={chartData}
          width={screenWidth - 80}
          height={140}
          barWidth={18}
          spacing={6}
          roundedTop
          roundedBottom
          yAxisThickness={1}
          xAxisThickness={1}
          xAxisColor={ClinicalColors.cardBorder}
          yAxisColor={ClinicalColors.cardBorder}
          yAxisTextStyle={{ color: ClinicalColors.textSecondary }}
          noOfSections={4}
          maxValue={100}
          isAnimated
          animationDuration={1000}
          showLine
          lineColor={ClinicalColors.anxious}
          lineThickness={2}
          hideDataPoints={false}
        />
      )}
    </ClinicalInfoCard>
  );
};

const styles = StyleSheet.create({
  currentValueContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  currentValue: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 4,
  },
  currentLabel: {
    fontSize: 14,
    color: ClinicalColors.textSecondary,
  },
  pressureScale: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
    paddingVertical: 12,
    backgroundColor: ClinicalColors.white,
    borderRadius: 8,
  },
  scaleItem: {
    alignItems: 'center',
  },
  scaleIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginBottom: 4,
  },
  scaleText: {
    fontSize: 10,
    color: ClinicalColors.textSecondary,
    textAlign: 'center',
  },
});

export default PressureChartCard;
