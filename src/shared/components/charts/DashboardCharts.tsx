import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, StatusBar } from 'react-native';
import { PieChart, BarChart, LineChart } from "react-native-gifted-charts";
import { useSensorSocket } from '../../hooks/useSensorSocket';
import { useListToysQuery } from '../../../core/http/requests/toyServerApi';
import ClinicalColors from '../constants/clinicalcolors';
import ClinicalInfoCard from '../chart-cards/ClinicalInfoCard';
import { getPressureState, getBatteryColor } from '../../../core/utils/clinicalUtils';
import MetricsCards from './DashboardCharts/MetricsCards';
import ClinicalStatusChart from './DashboardCharts/ClinicalStatusChart';
import StressDistributionChart from './DashboardCharts/StressDistributionChart';
import DeviceStatusChart from './DashboardCharts/DeviceStatusChart';
import ClinicalEvaluation from './DashboardCharts/ClinicalEvaluation';
import { ToyData, AllToysData } from '../../../core/types/common/toyTypes';
import { AggregatedData } from '../../../core/types/common/AggregatedData';

const { width: screenWidth } = Dimensions.get('window');

interface SystemState {
  state: string;
  label: string;
  color: string;
}

interface PieDataItem {
  value: number;
  color: string;
  text: string;
  label?: string;
  gradientCenterColor?: string;
  focused?: boolean;
}

const DashboardCharts: React.FC = () => {
  const { allToysData, isConnected, connectedToys } = useSensorSocket();
  const { data: toysData } = useListToysQuery({ page: 1, pageSize: 100 });
  const toys = toysData?.items || [];

  const getToyName = (toyId: string): string => {
    const toy = toys.find(t => t.id === toyId);
    return toy ? toy.name : `Paciente ${toyId.slice(-4)}`;
  };

  const getSystemState = useMemo((): SystemState => {
    const totalToys = toys.length;
    const connectivityRate = totalToys > 0 ? (connectedToys / totalToys) * 100 : 0;
    
    if (connectivityRate >= 80) {
      return { state: 'optimal', label: 'Sistema Operativo', color: '#2E7D57' };
    } else if (connectivityRate >= 60) {
      return { state: 'stable', label: 'Funcionamiento Normal', color: '#4A90E2' };
    } else if (connectivityRate >= 30) {
      return { state: 'warning', label: 'Requiere Atención', color: '#F5A623' };
    } else {
      return { state: 'critical', label: 'Estado Crítico', color: '#D0021B' };
    }
  }, [toys.length, connectedToys]);

  // Memoizar getAggregatedData para optimizar performance
  const getAggregatedData = useMemo((): AggregatedData => {
    // Si no hay datos de sensores, retornar estado inicial con valores en 0
    if (!allToysData || Object.keys(allToysData).length === 0) {
      const emptyData: AggregatedData = {
        totalChildren: toys.length,
        activeChildren: 0,
        stableChildren: 0,
        anxiousChildren: 0,
        crisisChildren: 0,
        averageBatteryHealth: 0,
        totalInteractions: 0,
        criticalAlerts: 0,
        averageStressLevel: 0,
        deviceReliability: 0,
      };
      
      return emptyData;
    }

    const toyIds = Object.keys(allToysData);

    // Inicializar contadores
    let totalInteractions = 0;
    let totalBattery = 0;
    let totalStressLevel = 0;
    let stableChildren = 0;
    let anxiousChildren = 0;
    let crisisChildren = 0;
    let activeChildren = 0;
    let criticalAlerts = 0;
    let reliableDevices = 0;

    toyIds.forEach((toyId) => {
      const toyData = allToysData[toyId];

      // Validación de los datos
      if (!toyData) {
        return;
      }

      // Verificar que existan los arrays necesarios
      const pressureData = toyData.pressurePercent;
      const batteryData = toyData.battery;

      if (!Array.isArray(pressureData) || pressureData.length === 0) {
        return;
      }

      // Obtener los últimos valores válidos
      const currentPressure = Number(pressureData[pressureData.length - 1]) || 0;
      const currentBattery = Array.isArray(batteryData) && batteryData.length > 0 
        ? Number(batteryData[batteryData.length - 1]) || 0 
        : 0;

      // Contar interacciones (presión > 10%)
      const interactions = pressureData.filter(p => Number(p) > 10).length;
      totalInteractions += interactions;
      totalBattery += currentBattery;
      totalStressLevel += currentPressure;

      // Clasificar según nivel de estrés/presión
      if (currentPressure >= 85) {
        crisisChildren++;
        criticalAlerts++;
      } else if (currentPressure >= 65) {
        anxiousChildren++;
      } else {
        stableChildren++;
      }

      // Verificar confiabilidad del dispositivo
      if (currentBattery > 20 && interactions > 0) {
        reliableDevices++;
      }

      activeChildren++;
    });

    const aggregatedData: AggregatedData = {
      totalChildren: toys.length,
      activeChildren,
      stableChildren,
      anxiousChildren,
      crisisChildren,
      averageBatteryHealth: activeChildren > 0 ? Math.round(totalBattery / activeChildren) : 0,
      totalInteractions,
      criticalAlerts,
      averageStressLevel: activeChildren > 0 ? Math.round(totalStressLevel / activeChildren) : 0,
      deviceReliability: toyIds.length > 0 ? Math.round((reliableDevices / toyIds.length) * 100) : 0,
    };

    return aggregatedData;
  }, [allToysData, toys.length]); // Dependencias para useMemo

  const aggregatedData = getAggregatedData;
  const systemState = getSystemState;

  // Datos para gráfica principal - Estados clínicos
  const getClinicalStatusData = (): PieDataItem[] => {
    const total = aggregatedData.stableChildren + aggregatedData.anxiousChildren + aggregatedData.crisisChildren;
    if (total === 0) return [];

    const data = [
      {
        value: aggregatedData.stableChildren,
        color: '#2E7D57',
        gradientCenterColor: '#4A9B6B',
        text: `${aggregatedData.stableChildren}`,
        label: 'Estable',
        focused: aggregatedData.stableChildren === Math.max(aggregatedData.stableChildren, aggregatedData.anxiousChildren, aggregatedData.crisisChildren)
      },
      {
        value: aggregatedData.anxiousChildren,
        color: '#F5A623',
        gradientCenterColor: '#F7BC47',
        text: `${aggregatedData.anxiousChildren}`,
        label: 'Moderado',
      },
      {
        value: aggregatedData.crisisChildren,
        color: '#D0021B',
        gradientCenterColor: '#E53E3E',
        text: `${aggregatedData.crisisChildren}`,
        label: 'Crítico',
      }
    ].filter(item => item.value > 0);

    return data;
  };

  // Datos para gráfica de barras - Distribución por rangos de estrés
  const getStressDistributionData = () => {
    if (!allToysData || Object.keys(allToysData).length === 0) {
      return [];
    }

    const toyIds = Object.keys(allToysData);
    const ranges = [
      { label: '0-20%', min: 0, max: 20, count: 0, color: '#2E7D57' },
      { label: '21-40%', min: 21, max: 40, count: 0, color: '#4A90E2' },
      { label: '41-60%', min: 41, max: 60, count: 0, color: '#F5A623' },
      { label: '61-80%', min: 61, max: 80, count: 0, color: '#FF8C00' },
      { label: '81-100%', min: 81, max: 100, count: 0, color: '#D0021B' }
    ];

    toyIds.forEach(toyId => {
      const toyData = allToysData[toyId];
      if (toyData && Array.isArray(toyData.pressurePercent) && toyData.pressurePercent.length > 0) {
        const currentPressure = Number(toyData.pressurePercent[toyData.pressurePercent.length - 1]) || 0;
        const range = ranges.find(r => currentPressure >= r.min && currentPressure <= r.max);
        if (range) range.count++;
      }
    });

    return ranges.map((range) => ({
      value: range.count,
      label: range.label,
      frontColor: range.color,
      gradientColor: range.color,
      spacing: 8,
    }));
  };

  // Datos para conectividad de dispositivos
  const getDeviceStatusData = (): PieDataItem[] => {
    const disconnected = Math.max(0, aggregatedData.totalChildren - aggregatedData.activeChildren);
    
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

  const clinicalStatusData = getClinicalStatusData();
  const deviceStatusData = getDeviceStatusData();
  const stressDistributionData = getStressDistributionData();

  const getCurrentDateTime = () => {
    const now = new Date();
    return now.toLocaleString('es-ES', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      
      {/* Header Médico */}
      <View style={styles.headerContainer}>
        <View style={styles.headerContent}>
          <Text style={styles.hospitalName}>CENTRO MÉDICO TEA</Text>
          <Text style={styles.departmentName}>Unidad de Monitoreo Pediátrico</Text>
          <Text style={styles.timestamp}>{getCurrentDateTime()}</Text>
        </View>
        <View style={[styles.statusIndicator, { backgroundColor: systemState.color }]}>
          <View style={styles.statusDot} />
        </View>
      </View>

      {/* Panel de Control Principal */}
      <View style={styles.controlPanel}>
        <Text style={styles.panelTitle}>DASHBOARD CLÍNICO</Text>
        <View style={styles.systemStatus}>
          <Text style={[styles.systemLabel, { color: systemState.color }]}>
            {systemState.label.toUpperCase()}
          </Text>
          <Text style={styles.systemSubtext}>
            Conectividad: {Math.round((aggregatedData.activeChildren / Math.max(aggregatedData.totalChildren, 1)) * 100)}%
          </Text>
        </View>
      </View>

      {/* Métricas Vitales */}
      <MetricsCards aggregatedData={aggregatedData} />

      {/* Gráfica Principal - Estado Clínico */}
      <ClinicalStatusChart aggregatedData={aggregatedData} />

      {/* Gráfica de Barras - Distribución de Estrés */}
      <StressDistributionChart allToysData={allToysData} />

      {/* Estado de Dispositivos */}
      <DeviceStatusChart aggregatedData={aggregatedData} />

      {/* Panel de Recomendaciones Clínicas */}
      <ClinicalEvaluation aggregatedData={aggregatedData} />

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  contentContainer: {
    paddingBottom: 40,
  },
  headerContainer: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E1E8ED',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  headerContent: {
    flex: 1,
  },
  hospitalName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A202C',
    letterSpacing: 1,
  },
  departmentName: {
    fontSize: 14,
    color: '#4A5568',
    marginTop: 2,
    fontWeight: '500',
  },
  timestamp: {
    fontSize: 12,
    color: '#718096',
    marginTop: 4,
  },
  statusIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  statusDot: {
    width: 8,
    height: 8,
    backgroundColor: 'white',
    borderRadius: 4,
  },
  controlPanel: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E1E8ED',
  },
  panelTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  systemStatus: {
    alignItems: 'center',
    marginTop: 12,
  },
  systemLabel: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
  },
  systemSubtext: {
    fontSize: 12,
    color: '#718096',
    marginTop: 4,
  },
});

export default DashboardCharts;