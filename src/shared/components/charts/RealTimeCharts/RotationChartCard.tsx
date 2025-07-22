import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import ClinicalColors from '../../constants/clinicalcolors';
import RotatingTeddyBear from '../../chart-cards/RotatingTeddyBear';
import ClinicalInfoCard from '../../chart-cards/ClinicalInfoCard';

const { width: screenWidth } = Dimensions.get('window');

interface Props {
  gyroValue: number;
  rotationState: {
    label: string;
    color: string;
  };
  chartData: any[];
}

const RotationChartCard: React.FC<Props> = ({ gyroValue, rotationState, chartData }) => {
  return (
    <ClinicalInfoCard
      title="Patrón de Rotación y Estimming"
      description="Analiza movimientos rotacionales que pueden indicar comportamientos de autoestimulación típicos en TEA. Ayuda a identificar patrones de autorregulación."
      clinicalValue={rotationState}
    >
      <View style={styles.rotationHeader}>
        <RotatingTeddyBear
          rotationValue={gyroValue}
          isAnimating={Math.abs(gyroValue) > 0.3}
        />
        <View style={styles.rotationInfo}>
          <Text style={styles.rotationLabel}>Velocidad Angular</Text>
          <Text style={[styles.rotationValue, { color: rotationState.color }]}>
            {Math.abs(gyroValue).toFixed(2)} rad/s
          </Text>
        </View>
      </View>

      {chartData.length > 0 && (
        <LineChart
          data={chartData}
          width={screenWidth - 80}
          height={120}
          color={ClinicalColors.primary}
          thickness={3}
          yAxisThickness={1}
          xAxisThickness={1}
          xAxisColor={ClinicalColors.cardBorder}
          yAxisColor={ClinicalColors.cardBorder}
          yAxisTextStyle={{ color: ClinicalColors.textSecondary }}
          isAnimated
          curved
          showDataPoints
          dataPointsColor={ClinicalColors.secondary}
          dataPointsRadius={4}
          focusEnabled
          showStripOnFocus
          stripColor={ClinicalColors.anxious}
          stripOpacity={0.2}
          areaChart
          startFillColor={ClinicalColors.primary}
          endFillColor={ClinicalColors.white}
          startOpacity={0.3}
          endOpacity={0.05}
        />
      )}
    </ClinicalInfoCard>
  );
};

const styles = StyleSheet.create({
  rotationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  rotationInfo: {
    alignItems: 'center',
  },
  rotationLabel: {
    fontSize: 14,
    color: ClinicalColors.textSecondary,
    marginBottom: 4,
  },
  rotationValue: {
    fontSize: 24,
    fontWeight: '700',
  },
});

export default RotationChartCard;
