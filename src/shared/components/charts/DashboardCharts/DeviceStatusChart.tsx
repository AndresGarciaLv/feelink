import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PieChart } from "react-native-gifted-charts";
import { AggregatedData } from '../../../../core/types/common/AggregatedData';

// interface AggregatedData {
//   totalChildren: number;
//   activeChildren: number;
//   deviceReliability: number;
//   averageBatteryHealth: number;
//   totalInteractions: number;
// }

interface PieDataItem {
  value: number;
  color: string;
  text: string;
  label?: string;
  gradientCenterColor?: string;
}

interface DeviceStatusChartProps {
  aggregatedData: AggregatedData;
}

const DeviceStatusChart: React.FC<DeviceStatusChartProps> = ({ aggregatedData }) => {
  const getDeviceStatusData = (): PieDataItem[] => {
    const disconnected = aggregatedData.totalChildren - aggregatedData.activeChildren;
    
    if (aggregatedData.totalChildren === 0) return [];

    return [
      {
        value: aggregatedData.activeChildren,
        color: '#2E7D57',
        gradientCenterColor: '#4A9B6B',
        text: `${aggregatedData.activeChildren}`,
        label: 'Conectados'
      },
      {
        value: disconnected,
        color: '#E53E3E',
        gradientCenterColor: '#FF6B6B',
        text: `${disconnected}`,
        label: 'Desconectados'
      }
    ].filter(item => item.value > 0);
  };

  const deviceStatusData = getDeviceStatusData();

  if (deviceStatusData.length === 0) return null;

  return (
    <View style={styles.chartCard}>
      <View style={styles.chartHeader}>
        <Text style={styles.chartTitle}>ESTADO DE DISPOSITIVOS</Text>
        <Text style={styles.chartSubtitle}>Conectividad del sistema de monitoreo</Text>
      </View>
      
      <View style={styles.deviceStatusContainer}>
        <PieChart
          data={deviceStatusData}
          donut
          radius={70}
          innerRadius={45}
          strokeColor="white"
          strokeWidth={2}
          showGradient
          centerLabelComponent={() => (
            <View style={styles.centerLabel}>
              <Text style={styles.centerMainValue}>
                {Math.round((aggregatedData.activeChildren / aggregatedData.totalChildren) * 100)}%
              </Text>
              <Text style={styles.centerDescription}>Conectividad</Text>
            </View>
          )}
        />
        
        <View style={styles.deviceMetrics}>
          <View style={styles.deviceMetric}>
            <Text style={styles.deviceMetricValue}>
              {Math.round(aggregatedData.deviceReliability)}%
            </Text>
            <Text style={styles.deviceMetricLabel}>Confiabilidad</Text>
          </View>
          
          <View style={styles.deviceMetric}>
            <Text style={styles.deviceMetricValue}>
              {aggregatedData.totalInteractions}
            </Text>
            <Text style={styles.deviceMetricLabel}>Interacciones</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  chartCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 20,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E1E8ED',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  chartHeader: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F7FAFC',
    paddingBottom: 12,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
    letterSpacing: 0.5,
  },
  chartSubtitle: {
    fontSize: 13,
    color: '#718096',
    marginTop: 4,
  },
  centerLabel: {
    alignItems: 'center',
  },
  centerMainValue: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A202C',
  },
  centerDescription: {
    fontSize: 10,
    color: '#718096',
    marginTop: 2,
  },
  deviceStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  deviceMetrics: {
    flex: 1,
    marginLeft: 20,
  },
  deviceMetric: {
    alignItems: 'center',
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#F7FAFC',
    borderRadius: 8,
  },
  deviceMetricValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A202C',
  },
  deviceMetricLabel: {
    fontSize: 11,
    color: '#4A5568',
    marginTop: 4,
    fontWeight: '500',
  },
});

export default DeviceStatusChart;