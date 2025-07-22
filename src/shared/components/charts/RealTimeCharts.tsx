import React, { useMemo } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../../../core/stores/store";
import { UseSensorSocketReturn } from "../../../data/chartdata";
import {
  getPressureState,
  getMovementState,
  getInterpretationText,
  getTherapeuticRecommendation,
} from "../../../core/utils/clinicalUtils";
import PressureChartCard from "./RealTimeCharts/PressureChartCard";
import MovementChartCard from "./RealTimeCharts/MovementChartCard";
import RotationChartCard from "./RealTimeCharts/RotationChartCard";
import TherapySummaryCard from "./RealTimeCharts/TherapySummaryCard";
import ConnectionStatusCard from "./RealTimeCharts/ConnectionStatusCard";
import ClinicalColors from "../../../shared/components/constants/clinicalcolors";

interface Props {
  socketData: UseSensorSocketReturn;
}

const RealTimeCharts: React.FC<Props> = ({ socketData }) => {
  const { pressurePercent, accelX, accelY, accelZ, gyroX, gyroY } =
    socketData.sensorData;

  const { isConnected } = socketData;

  const pressureValue = useMemo(
    () => pressurePercent?.[pressurePercent.length - 1] || 0,
    [pressurePercent]
  );
  const movementValue = useMemo(() => {
    const x = accelX?.[accelX.length - 1] || 0;
    const y = accelY?.[accelY.length - 1] || 0;
    const z = accelZ?.[accelZ.length - 1] || 0;
    const rawMagnitude = Math.sqrt(x * x + y * y + z * z);
    return Math.abs(rawMagnitude - 1);
  }, [accelX, accelY, accelZ]);

  const rotationValue = useMemo(() => {
    const x = gyroX?.[gyroX.length - 1] || 0;
    const y = gyroY?.[gyroY.length - 1] || 0;
    return Math.sqrt(x * x + y * y);
  }, [gyroX, gyroY]);

  const safePressure = pressurePercent ?? [];
  const safeAccelX = accelX ?? [];
  const safeGyroX = gyroX ?? [];

  const pressureState = getPressureState(pressureValue);
  const movementState = getMovementState(movementValue);
  const rotationState = getMovementState(rotationValue); // Se reutiliza para simplificar, puede hacerse función aparte

  const isReceivingData = useMemo(() => {
    return !!(
      pressurePercent &&
      pressurePercent.length > 0 &&
      accelX &&
      accelX.length > 0 &&
      gyroX &&
      gyroX.length > 0
    );
  }, [pressurePercent, accelX, gyroX]);

  

  const pressureChartData =
    pressurePercent?.slice(-6).map((value, index) => ({
      value,
      label: `${index + 1}`,
      frontColor: pressureState.color,
      labelTextStyle: {
        color: ClinicalColors.textSecondary,
        fontSize: 10,
      },
    })) || [];

  const movementChartData =
    accelX?.slice(-6).map((_, index) => {
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

  const rotationChartData =
    gyroX?.slice(-6).map((_, index) => {
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
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <Text style={styles.mainTitle}>Monitor Terapéutico TEA</Text>

      {/* <ConnectionStatusCard isConnected={isConnected} /> */}
      <ConnectionStatusCard
  isConnected={isConnected}
  isReceivingData={isReceivingData}
/>


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

      <TherapySummaryCard
        pressurePercent={safePressure}
        accelX={safeAccelX}
        gyroX={safeGyroX}
        clinicalAnalysis={clinicalAnalysis}
      />
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
    fontWeight: "bold",
    color: ClinicalColors.primary,
    marginBottom: 20,
    textAlign: "center",
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
    fontWeight: "600",
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
    fontWeight: "600",
    color: ClinicalColors.primary,
    marginBottom: 6,
  },
  recommendationText: {
    fontSize: 14,
    color: ClinicalColors.textSecondary,
  },
});

export default RealTimeCharts;
