// src/shared/components/PressureProgressBar.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import * as Progress from "react-native-progress";

interface Props {
  pressure: {
    pressurePercent: number;
    pressureGrams: number;
  };
}

const PressureProgressBar: React.FC<Props> = ({ pressure }) => {
  const pressurePercent = pressure?.pressurePercent ?? 0;
  const pressureGrams = pressure?.pressureGrams ?? 0;

  const getBarColor = (value: number) => {
    if (value <= 60) return "#4CAF50";
    if (value <= 87) return "#FFB300";
    return "#E53935";
  };

  const getStatusText = (value: number) => {
    if (value <= 60) return "Estable";
    if (value <= 87) return "Ansioso";
    return "Crisis";
  };

  const statusText = getStatusText(pressurePercent);
  const barColor = getBarColor(pressurePercent);

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Presión Detectada</Text>

      <View style={styles.statusContainer}>
        <Text style={[styles.statusBadge, { backgroundColor: barColor }]}>
          {statusText}
        </Text>
      </View>

      <Progress.Bar
        progress={pressurePercent / 100}
        width={null}
        color={barColor}
        unfilledColor="#eee"
        borderRadius={10}
        height={18}
      />
      <Text style={[styles.percentage, { color: barColor }]}>
        {Math.round(pressurePercent)}%
      </Text>

      <View style={styles.forceContainer}>
        <Text style={styles.forceIcon}>💪</Text>
        <Text style={styles.forceText}>Fuerza aplicada:</Text>
        <Text style={styles.forceValue}>{pressureGrams} g</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    padding: 16,
    marginHorizontal: 20,
    borderRadius: 14,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    textAlign: "center",
    color: "#333",
  },
  statusContainer: {
    alignItems: "center",
    marginBottom: 6,
  },
  statusBadge: {
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 20,
    color: "white",
    fontWeight: "600",
    fontSize: 13,
    overflow: "hidden",
  },
  percentage: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },
  forceContainer: {
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F5F8FA",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    gap: 6,
  },
  forceIcon: {
    fontSize: 18,
  },
  forceText: {
    fontSize: 14,
    color: "#666",
  },
  forceValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
  },
});

export default PressureProgressBar;
