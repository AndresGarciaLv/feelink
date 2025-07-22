import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ClinicalColors from '../../constants/clinicalcolors';

interface Indicator {
  label: string;
  value: string;
  color: string;
}

interface Props {
  indicators: Indicator[];
}

const PatientOverviewCard: React.FC<Props> = ({ indicators }) => {
  return (
    <View style={styles.overviewCard}>
      <Text style={styles.overviewTitle}>Estado Actual del Paciente</Text>
      <View style={styles.overviewGrid}>
        {indicators.map((item, index) => (
          <View key={index} style={styles.overviewItem}>
            <View style={[styles.overviewIndicator, { backgroundColor: item.color }]} />
            <Text style={styles.overviewLabel}>{item.label}</Text>
            <Text style={styles.overviewValue}>{item.value}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overviewCard: {
    backgroundColor: ClinicalColors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: ClinicalColors.cardBorder,
  },
  overviewTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: ClinicalColors.textPrimary,
    marginBottom: 16,
    textAlign: 'center',
  },
  overviewGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  overviewItem: {
    alignItems: 'center',
  },
  overviewIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  overviewLabel: {
    fontSize: 12,
    color: ClinicalColors.textSecondary,
    marginBottom: 4,
  },
  overviewValue: {
    fontSize: 14,
    fontWeight: '600',
    color: ClinicalColors.textPrimary,
  },
});

export default PatientOverviewCard;
