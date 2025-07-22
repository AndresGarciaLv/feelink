import React, { useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../../core/stores/store';
import { UseSensorSocketReturn } from '../../../data/chartdata';
import { getPressureState, getMovementState, getInterpretationText, getTherapeuticRecommendation } from '../../../core/utils/clinicalUtils';
import PressureChartCard from './RealTimeCharts/PressureChartCard';
import MovementChartCard from './RealTimeCharts/MovementChartCard';
import RotationChartCard from './RealTimeCharts/RotationChartCard';
import ClinicalColors from '../../../shared/components/constants/clinicalcolors';

interface Props {
  socketData: UseSensorSocketReturn;
}

const RealTimeCharts: React.FC<Props> = ({ socketData }) => {
  const { pressurePercent, accelX, accelY, accelZ, gyroX, gyroY } = socketData.sensorData;

  const pressureValue = useMemo(() => pressurePercent?.[pressurePercent.length - 1] || 0, [pressurePercent]);
  const movementValue = useMemo(() => {
    const x = accelX?.[accelX.length - 1] || 0;
    const y = accelY?.[accelY.length - 1] || 0;
    const z = accelZ?.[accelZ.length - 1] || 0;
    return Math.sqrt(x * x + y * y + z * z);
  }, [accelX, accelY, accelZ]);

  const rotationValue = useMemo(() => {
    const x = gyroX?.[gyroX.length - 1] || 0;
    const y = gyroY?.[gyroY.length - 1] || 0;
    return Math.sqrt(x * x + y * y);
  }, [gyroX, gyroY]);

  const pressureState = getPressureState(pressureValue);
  const movementState = getMovementState(movementValue);
  const rotationState = getMovementState(rotationValue); // Se reutiliza para simplificar, puede hacerse función aparte

  const pressureChartData = pressurePercent?.slice(-6).map((value, index) => ({
    value,
    label: `${index + 1}`,
    frontColor: pressureState.color,
    labelTextStyle: {
      color: ClinicalColors.textSecondary,
      fontSize: 10,
    },
  })) || [];

  const movementChartData = accelX?.slice(-6).map((_, index) => {
    const x = accelX?.[index] || 0;
    const y = accelY?.[index] || 0;
    const z = accelZ?.[index] || 0;
    const magnitude = Math.sqrt(x * x + y * y + z * z);

    return {
      value: magnitude,
      label: `${index + 1}`,
      frontColor: movementState.color,
      labelTextStyle: {
        color: ClinicalColors.textSecondary,
        fontSize: 10,
      },
    };
  }) || [];

  const rotationChartData = gyroX?.slice(-6).map((_, index) => {
    const x = gyroX?.[index] || 0;
    const y = gyroY?.[index] || 0;
    const magnitude = Math.sqrt(x * x + y * y);

    return {
      value: magnitude,
      label: `${index + 1}`,
      frontColor: rotationState.color,
      labelTextStyle: {
        color: ClinicalColors.textSecondary,
        fontSize: 10,
      },
    };
  }) || [];

  const clinicalAnalysis = {
    pressure: pressureState,
    movement: movementState,
    rotation: rotationState,
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.mainTitle}>Monitor Terapéutico TEA</Text>

      <PressureChartCard
        pressureValue={pressureValue}
        pressureState={pressureState}
        chartData={pressureChartData}
      />

      <MovementChartCard
        magnitudeValue={movementValue}
        movementState={movementState}
        chartData={movementChartData}
      />

      <RotationChartCard
        gyroValue={rotationValue}
        rotationState={rotationState}
        chartData={rotationChartData}
      />

      <View style={styles.diagnosticSummary}>
        <Text style={styles.summaryTitle}>Resumen Clínico</Text>

        <Text style={styles.interpretationText}>
          🧠 {getInterpretationText('Monitoreo de Presión Táctil', pressureState.state)}
        </Text>
        <Text style={styles.interpretationText}>
          🏃 {getInterpretationText('Análisis de Movimiento Corporal', movementState.state)}
        </Text>
        <Text style={styles.interpretationText}>
          🌀 {getInterpretationText('Patrón de Rotación y Estimming', rotationState.state)}
        </Text>

        <View style={styles.recommendationsCard}>
          <Text style={styles.recommendationsTitle}>Recomendaciones Terapéuticas</Text>
          <Text style={styles.recommendationText}>
            {getTherapeuticRecommendation(clinicalAnalysis)}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ClinicalColors.white,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  mainTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: ClinicalColors.primary,
    marginBottom: 20,
    textAlign: 'center',
  },
  diagnosticSummary: {
    backgroundColor: ClinicalColors.white,
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    marginBottom: 20,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: ClinicalColors.primary,
  },
  interpretationText: {
    fontSize: 14,
    marginBottom: 10,
    color: ClinicalColors.textSecondary,
  },
  recommendationsCard: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: ClinicalColors.cardBorder,
  },
  recommendationsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: ClinicalColors.primary,
    marginBottom: 6,
  },
  recommendationText: {
    fontSize: 14,
    color: ClinicalColors.textSecondary,
  },
});

export default RealTimeCharts;
