import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import ClinicalColors from '../../constants/clinicalcolors';
import ClinicalInfoCard from '../../chart-cards/ClinicalInfoCard';

const { width: screenWidth } = Dimensions.get('window');

interface Props {
  magnitudeValue: number;
  movementState: {
    label: string;
    color: string;
  };
  chartData: any[];
}

const MovementChartCard: React.FC<Props> = ({ magnitudeValue, movementState, chartData }) => {
  return (
    <ClinicalInfoCard
      title="Análisis de Movimiento Corporal"
      description="Registra la magnitud de movimientos tri-dimensionales. Esencial para detectar patrones de estimming y desregulación sensorial."
      clinicalValue={movementState}
    >
      <View style={styles.movementInfo}>
        <Text style={styles.movementTitle}>Magnitud de Movimiento (G)</Text>
        <Text style={[styles.movementValue, { color: movementState.color }]}>
          {magnitudeValue.toFixed(2)}
        </Text>
      </View>

      {chartData.length > 0 && (
        <BarChart
          data={chartData}
          width={screenWidth - 80}
          height={130}
          barWidth={22}
          spacing={8}
          roundedTop
          roundedBottom
          showGradient
          yAxisThickness={1}
          xAxisThickness={1}
          xAxisColor={ClinicalColors.cardBorder}
          yAxisColor={ClinicalColors.cardBorder}
          yAxisTextStyle={{ color: ClinicalColors.textSecondary }}
          noOfSections={3}
          isAnimated
          animationDuration={800}
        />
      )}
    </ClinicalInfoCard>
  );
};

const styles = StyleSheet.create({
  movementInfo: {
    alignItems: 'center',
    marginBottom: 16,
  },
  movementTitle: {
    fontSize: 14,
    color: ClinicalColors.textSecondary,
    marginBottom: 8,
  },
  movementValue: {
    fontSize: 28,
    fontWeight: '700',
  },
});

export default MovementChartCard;
