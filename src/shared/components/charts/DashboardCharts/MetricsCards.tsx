import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

interface AggregatedData {
  totalChildren: number;
  activeChildren: number;
  criticalAlerts: number;
  averageStressLevel: number;
}

interface MetricsCardsProps {
  aggregatedData: AggregatedData;
}

const MetricsCards: React.FC<MetricsCardsProps> = ({ aggregatedData }) => {
  return (
    <View style={styles.metricsGrid}>
      <View style={[styles.metricCard, styles.primaryMetric]}>
        <Text style={styles.metricValue}>{aggregatedData.totalChildren}</Text>
        <Text style={styles.metricLabel}>PELUCHES</Text>
        <Text style={styles.metricSublabel}>Registrados</Text>
      </View>
      
      <View style={[styles.metricCard, styles.successMetric]}>
        <Text style={styles.metricValue}>{aggregatedData.activeChildren}</Text>
        <Text style={styles.metricLabel}>ACTIVOS</Text>
        <Text style={styles.metricSublabel}>Monitoreando</Text>
      </View>
      
      <View style={[styles.metricCard, styles.warningMetric]}>
        <Text style={styles.metricValue}>{aggregatedData.criticalAlerts}</Text>
        <Text style={styles.metricLabel}>ALERTAS</Text>
        <Text style={styles.metricSublabel}>Críticas</Text>
      </View>
      
      <View style={[styles.metricCard, styles.infoMetric]}>
        <Text style={styles.metricValue}>{Math.round(aggregatedData.averageStressLevel)}%</Text>
        <Text style={styles.metricLabel}>ESTRÉS PROM.</Text>
        <Text style={styles.metricSublabel}>General</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: 16,
    marginTop: 16,
    gap: 12,
  },
  metricCard: {
    flex: 1,
    minWidth: (screenWidth - 56) / 2,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E1E8ED',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  primaryMetric: {
    borderLeftWidth: 4,
    borderLeftColor: '#4A90E2',
  },
  successMetric: {
    borderLeftWidth: 4,
    borderLeftColor: '#2E7D57',
  },
  warningMetric: {
    borderLeftWidth: 4,
    borderLeftColor: '#D0021B',
  },
  infoMetric: {
    borderLeftWidth: 4,
    borderLeftColor: '#F5A623',
  },
  metricValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A202C',
  },
  metricLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#4A5568',
    marginTop: 4,
    letterSpacing: 0.5,
  },
  metricSublabel: {
    fontSize: 10,
    color: '#718096',
    marginTop: 2,
  },
});

export default MetricsCards;