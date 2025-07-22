import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ClinicalColors from '../../constants/clinicalcolors';
import { getTherapeuticRecommendation } from '../../../../core/utils/clinicalUtils';

interface Props {
  pressurePercent: number[];
  accelX: number[];
  gyroX: number[];
  clinicalAnalysis: {
    pressure: { label: string; color: string };
    movement: { label: string; color: string };
    rotation: { label: string; color: string };
  };
}

const TherapySummaryCard: React.FC<Props> = ({
  pressurePercent,
  accelX,
  gyroX,
  clinicalAnalysis,
}) => {
  const pressureEvents = pressurePercent.filter((p) => p > 60).length;
  const movementEvents = accelX.filter((a) => Math.abs(a) > 0.5).length;
  const stimmingEvents = gyroX.filter((g) => Math.abs(g) > 0.3).length;

  return (
    <View style={styles.diagnosticSummary}>
      <Text style={styles.diagnosticTitle}>Resumen de Sesión Terapéutica</Text>
      <View style={styles.diagnosticGrid}>
        <View style={styles.diagnosticItem}>
          <Text style={styles.diagnosticLabel}>Episodios de Presión Alta</Text>
          <Text style={styles.diagnosticNumber}>{pressureEvents}</Text>
          <Text style={styles.diagnosticUnit}>eventos</Text>
        </View>
        <View style={styles.diagnosticItem}>
          <Text style={styles.diagnosticLabel}>Movimientos Significativos</Text>
          <Text style={styles.diagnosticNumber}>{movementEvents}</Text>
          <Text style={styles.diagnosticUnit}>eventos</Text>
        </View>
        <View style={styles.diagnosticItem}>
          <Text style={styles.diagnosticLabel}>Patrones de Stimming</Text>
          <Text style={styles.diagnosticNumber}>{stimmingEvents}</Text>
          <Text style={styles.diagnosticUnit}>eventos</Text>
        </View>
      </View>

      <View style={styles.recommendationsCard}>
        <Text style={styles.recommendationsTitle}>Recomendaciones Terapéuticas</Text>
        <Text style={styles.recommendationText}>
          {getTherapeuticRecommendation(clinicalAnalysis)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  diagnosticSummary: {
    backgroundColor: ClinicalColors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 1,
    borderColor: ClinicalColors.primary,
  },
  diagnosticTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: ClinicalColors.textPrimary,
    textAlign: 'center',
    marginBottom: 20,
  },
  diagnosticGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  diagnosticItem: {
    alignItems: 'center',
    flex: 1,
  },
  diagnosticLabel: {
    fontSize: 12,
    color: ClinicalColors.textSecondary,
    textAlign: 'center',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  diagnosticNumber: {
    fontSize: 28,
    fontWeight: '800',
    color: ClinicalColors.primary,
    marginBottom: 4,
  },
  diagnosticUnit: {
    fontSize: 11,
    color: ClinicalColors.textSecondary,
  },
  recommendationsCard: {
    backgroundColor: ClinicalColors.white,
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: ClinicalColors.secondary,
  },
  recommendationsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: ClinicalColors.textPrimary,
    marginBottom: 12,
  },
  recommendationText: {
    fontSize: 14,
    color: ClinicalColors.textSecondary,
    lineHeight: 20,
  },
});

export default TherapySummaryCard;
