import React, { ReactNode } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ClinicalState } from '../../../data/chartdata';
import { getInterpretationText } from '../../../core/utils/clinicalUtils';
import ClinicalColors from '../constants/clinicalcolors';

interface ClinicalInfoCardProps {
  title: string;
  description: string;
  clinicalValue: ClinicalState;
  children: ReactNode;
}

const ClinicalInfoCard: React.FC<ClinicalInfoCardProps> = ({ 
  title, 
  description, 
  clinicalValue, 
  children 
}) => (
  <View style={styles.clinicalCard}>
    <View style={styles.clinicalHeader}>
      <Text style={styles.clinicalTitle}>{title}</Text>
      <View style={[styles.statusBadge, { backgroundColor: clinicalValue.color }]}>
        <Text style={styles.statusBadgeText}>{clinicalValue.label}</Text>
      </View>
    </View>
    <Text style={styles.clinicalDescription}>{description}</Text>
    <View style={styles.clinicalContent}>
      {children}
    </View>
    <View style={styles.clinicalInterpretation}>
      <Text style={styles.interpretationTitle}>Interpretación Clínica:</Text>
      <Text style={styles.interpretationText}>
        {getInterpretationText(title, clinicalValue.state)}
      </Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  clinicalCard: {
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
    borderColor: ClinicalColors.cardBorder,
  },
  clinicalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  clinicalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: ClinicalColors.textPrimary,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusBadgeText: {
    color: ClinicalColors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  clinicalDescription: {
    fontSize: 14,
    color: ClinicalColors.textSecondary,
    marginBottom: 16,
    lineHeight: 20,
  },
  clinicalContent: {
    marginBottom: 16,
    overflow: 'hidden', // Asegura que el contenido no se salga
  },
  clinicalInterpretation: {
    backgroundColor: ClinicalColors.background,
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: ClinicalColors.primary,
  },
  interpretationTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: ClinicalColors.textPrimary,
    marginBottom: 8,
  },
  interpretationText: {
    fontSize: 13,
    color: ClinicalColors.textSecondary,
    lineHeight: 18,
  },
});

export default ClinicalInfoCard;