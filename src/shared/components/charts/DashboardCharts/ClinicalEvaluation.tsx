import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface AggregatedData {
  crisisChildren: number;
  averageBatteryHealth: number;
}

interface ClinicalEvaluationProps {
  aggregatedData: AggregatedData;
}

const ClinicalEvaluation: React.FC<ClinicalEvaluationProps> = ({ aggregatedData }) => {
  return (
    <View style={styles.recommendationsPanel}>
      <Text style={styles.recommendationsTitle}>EVALUACIÓN CLÍNICA</Text>
      <View style={styles.recommendationItem}>
        <View style={[styles.alertLevel, { 
          backgroundColor: aggregatedData.crisisChildren > 0 ? '#FFE6E6' : '#E8F5E8',
          borderLeftColor: aggregatedData.crisisChildren > 0 ? '#D0021B' : '#2E7D57'
        }]}>
          <Text style={[styles.alertText, {
            color: aggregatedData.crisisChildren > 0 ? '#D0021B' : '#2E7D57'
          }]}>
            {aggregatedData.crisisChildren > 0 ? 
              `ATENCIÓN: ${aggregatedData.crisisChildren} paciente(s) en estado crítico requieren intervención inmediata.` :
              'Sistema estable. Continuar con protocolos de monitoreo estándar.'
            }
          </Text>
        </View>
      </View>
      
      {aggregatedData.averageBatteryHealth < 30 && (
        <View style={styles.recommendationItem}>
          <View style={[styles.alertLevel, { backgroundColor: '#FFF5E6', borderLeftColor: '#F5A623' }]}>
            <Text style={[styles.alertText, { color: '#F5A623' }]}>
              MANTENIMIENTO: Batería promedio baja. Programar reemplazo de dispositivos.
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  recommendationsPanel: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 20,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E1E8ED',
  },
  recommendationsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  recommendationItem: {
    marginBottom: 12,
  },
  alertLevel: {
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
  },
  alertText: {
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
  },
});

export default ClinicalEvaluation;