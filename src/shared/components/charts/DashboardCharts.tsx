import React from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { PieChart } from "react-native-gifted-charts";
import { useSensorSocket } from '../../hooks/useSensorSocket';
import { useListToysQuery } from '../../../core/http/requests/toyServerApi';
import ClinicalColors from '../constants/clinicalcolors';
import ClinicalInfoCard from '../chart-cards/ClinicalInfoCard';
import { getPressureState, getBatteryColor } from '../../../core/utils/clinicalUtils';

const { width: screenWidth } = Dimensions.get('window');

interface ToyData {
  pressurePercent: number[];
  accelX: number[];
  battery: number[];
  [key: string]: number[];
}

interface AllToysData {
  [toyId: string]: ToyData;
}

interface SystemState {
  state: string;
  label: string;
  color: string;
}

interface AggregatedData {
  totalChildren: number;
  activeChildren: number;
  stableChildren: number;
  anxiousChildren: number;
  crisisChildren: number;
  averageBatteryHealth: number;
  totalInteractions: number;
}

interface PieDataItem {
  value: number;
  color: string;
  text: string;
  label?: string;
}

const DashboardCharts: React.FC = () => {
  const { allToysData, isConnected, connectedToys } = useSensorSocket();
  
  const { data: toysData } = useListToysQuery({ page: 1, pageSize: 100 });
  const toys = toysData?.items || [];

  const getToyName = (toyId: string): string => {
    const toy = toys.find(t => t.id === toyId);
    return toy ? toy.name : `Niño ${toyId.slice(-4)}`;
  };

  const getSystemState = (): SystemState => {
    const totalToys = Object.keys(allToysData).length;
    if (connectedToys === 0) {
      return { state: 'crisis', label: 'Sin Conexión', color: ClinicalColors.crisis };
    }
    if (connectedToys === totalToys && totalToys > 0) {
      return { state: 'stable', label: 'Óptimo', color: ClinicalColors.stable };
    }
    return { state: 'anxious', label: 'Parcial', color: ClinicalColors.anxious };
  };

  const getAggregatedData = (): AggregatedData => {
    const toyIds = Object.keys(allToysData);
    
    if (toyIds.length === 0) {
      return {
        totalChildren: 0,
        activeChildren: 0,
        stableChildren: 0,
        anxiousChildren: 0,
        crisisChildren: 0,
        averageBatteryHealth: 0,
        totalInteractions: 0,
      };
    }

    let totalInteractions = 0;
    let totalBattery = 0;
    let stableChildren = 0;
    let anxiousChildren = 0;
    let crisisChildren = 0;
    let activeChildren = 0;

    toyIds.forEach(toyId => {
      const toyData = allToysData[toyId];
      if (toyData && toyData.pressurePercent.length > 0) {
        activeChildren++;
        
        const interactions = toyData.pressurePercent.filter(p => p > 10).length;
        totalInteractions += interactions;
        
        totalBattery += toyData.battery[toyData.battery.length - 1] || 0;
        
        const currentPressure = toyData.pressurePercent[toyData.pressurePercent.length - 1] || 0;
        if (currentPressure >= 88) crisisChildren++;
        else if (currentPressure >= 61) anxiousChildren++;
        else stableChildren++;
      }
    });

    return {
      totalChildren: toyIds.length,
      activeChildren,
      stableChildren,
      anxiousChildren,
      crisisChildren,
      averageBatteryHealth: activeChildren > 0 ? totalBattery / activeChildren : 0,
      totalInteractions,
    };
  };

  const aggregatedData = getAggregatedData();
  const systemState = getSystemState();

  // Datos para gráfica de donas - Estados de los niños
  const getChildrenStatusData = (): PieDataItem[] => {
    const total = aggregatedData.stableChildren + aggregatedData.anxiousChildren + aggregatedData.crisisChildren;
    if (total === 0) return [];

    return [
      {
        value: aggregatedData.stableChildren,
        color: ClinicalColors.stable,
        text: `${aggregatedData.stableChildren}`,
        label: 'Estables'
      },
      {
        value: aggregatedData.anxiousChildren,
        color: ClinicalColors.anxious,
        text: `${aggregatedData.anxiousChildren}`,
        label: 'Ansiosos'
      },
      {
        value: aggregatedData.crisisChildren,
        color: ClinicalColors.crisis,
        text: `${aggregatedData.crisisChildren}`,
        label: 'En Crisis'
      }
    ].filter(item => item.value > 0);
  };

  // Datos para gráfica de donas - Conectividad
  const getConnectivityData = (): PieDataItem[] => {
    const disconnected = aggregatedData.totalChildren - aggregatedData.activeChildren;
    
    if (aggregatedData.totalChildren === 0) return [];

    return [
      {
        value: aggregatedData.activeChildren,
        color: ClinicalColors.stable,
        text: `${aggregatedData.activeChildren}`,
        label: 'Conectados'
      },
      {
        value: disconnected,
        color: ClinicalColors.crisis,
        text: `${disconnected}`,
        label: 'Desconectados'
      }
    ].filter(item => item.value > 0);
  };

  // Datos para gráfica de donas - Nivel de batería
  const getBatteryStatusData = (): PieDataItem[] => {
    const toyIds = Object.keys(allToysData);
    let highBattery = 0;
    let mediumBattery = 0;
    let lowBattery = 0;

    toyIds.forEach(toyId => {
      const toyData = allToysData[toyId];
      if (toyData && toyData.battery.length > 0) {
        const batteryLevel = toyData.battery[toyData.battery.length - 1];
        if (batteryLevel > 60) highBattery++;
        else if (batteryLevel > 30) mediumBattery++;
        else lowBattery++;
      }
    });

    return [
      {
        value: highBattery,
        color: ClinicalColors.stable,
        text: `${highBattery}`,
        label: 'Batería Alta'
      },
      {
        value: mediumBattery,
        color: ClinicalColors.anxious,
        text: `${mediumBattery}`,
        label: 'Batería Media'
      },
      {
        value: lowBattery,
        color: ClinicalColors.crisis,
        text: `${lowBattery}`,
        label: 'Batería Baja'
      }
    ].filter(item => item.value > 0);
  };

  const childrenStatusData = getChildrenStatusData();
  const connectivityData = getConnectivityData();
  const batteryStatusData = getBatteryStatusData();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.mainTitle}>Dashboard TEA - Resumen General</Text>
      <Text style={styles.subtitle}>Monitoreo Integral de Pacientes</Text>
      
      {/* Estado del Sistema */}
      <View style={[styles.systemCard, { backgroundColor: systemState.color }]}>
        <Text style={styles.systemStatus}>Estado: {systemState.label}</Text>
        <Text style={styles.systemSubtext}>
          {aggregatedData.activeChildren} de {aggregatedData.totalChildren} niños monitoreados
        </Text>
      </View>

      {/* Resumen Numérico */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Resumen del Sistema</Text>
        <View style={styles.summaryGrid}>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryValue, { color: ClinicalColors.primary }]}>
              {aggregatedData.totalChildren}
            </Text>
            <Text style={styles.summaryLabel}>Total Niños</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryValue, { color: ClinicalColors.stable }]}>
              {aggregatedData.activeChildren}
            </Text>
            <Text style={styles.summaryLabel}>Conectados</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryValue, { color: ClinicalColors.secondary }]}>
              {aggregatedData.totalInteractions}
            </Text>
            <Text style={styles.summaryLabel}>Interacciones</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryValue, { color: getBatteryColor(aggregatedData.averageBatteryHealth) }]}>
              {aggregatedData.averageBatteryHealth.toFixed(0)}%
            </Text>
            <Text style={styles.summaryLabel}>Batería Prom.</Text>
          </View>
        </View>
      </View>

      {/* Gráfica de Estados de los Niños */}
      {childrenStatusData.length > 0 && (
        <ClinicalInfoCard
          title="Estado Emocional de los Niños"
          description="Distribución del estado emocional actual de todos los niños monitoreados en tiempo real."
          clinicalValue={{
            state: aggregatedData.stableChildren > aggregatedData.crisisChildren ? 'stable' : 'crisis',
            label: aggregatedData.stableChildren > aggregatedData.crisisChildren ? 'Mayoría Estable' : 'Requiere Atención',
            color: aggregatedData.stableChildren > aggregatedData.crisisChildren ? ClinicalColors.stable : ClinicalColors.crisis
          }}
        >
          <View style={styles.chartContainer}>
            <PieChart
              data={childrenStatusData}
              donut
              radius={70}
              innerRadius={40}
              centerLabelComponent={() => (
                <View style={styles.centerLabel}>
                  <Text style={styles.centerValue}>{childrenStatusData.reduce((sum, item) => sum + item.value, 0)}</Text>
                  <Text style={styles.centerText}>Niños</Text>
                </View>
              )}
            />
            <View style={styles.legend}>
              {childrenStatusData.map((item, index) => (
                <View key={index} style={styles.legendItem}>
                  <View style={[styles.legendColor, { backgroundColor: item.color }]} />
                  <Text style={styles.legendText}>{item.label}: {item.value}</Text>
                </View>
              ))}
            </View>
          </View>
        </ClinicalInfoCard>
      )}

      {/* Gráfica de Conectividad */}
      {connectivityData.length > 0 && (
        <ClinicalInfoCard
          title="Estado de Conectividad"
          description="Distribución de dispositivos conectados vs desconectados para monitoreo continuo."
          clinicalValue={systemState}
        >
          <View style={styles.chartContainer}>
            <PieChart
              data={connectivityData}
              donut
              radius={70}
              innerRadius={40}
              centerLabelComponent={() => (
                <View style={styles.centerLabel}>
                  <Text style={styles.centerValue}>{aggregatedData.totalChildren}</Text>
                  <Text style={styles.centerText}>Total</Text>
                </View>
              )}
            />
            <View style={styles.legend}>
              {connectivityData.map((item, index) => (
                <View key={index} style={styles.legendItem}>
                  <View style={[styles.legendColor, { backgroundColor: item.color }]} />
                  <Text style={styles.legendText}>{item.label}: {item.value}</Text>
                </View>
              ))}
            </View>
          </View>
        </ClinicalInfoCard>
      )}

      {/* Gráfica de Estado de Batería */}
      {batteryStatusData.length > 0 && (
        <ClinicalInfoCard
          title="Estado de Batería de Dispositivos"
          description="Distribución del nivel de batería de todos los dispositivos terapéuticos."
          clinicalValue={{
            state: aggregatedData.averageBatteryHealth > 60 ? 'stable' : 
                   aggregatedData.averageBatteryHealth > 30 ? 'anxious' : 'crisis',
            label: aggregatedData.averageBatteryHealth > 60 ? 'Batería Óptima' :
                   aggregatedData.averageBatteryHealth > 30 ? 'Batería Media' : 'Batería Crítica',
            color: aggregatedData.averageBatteryHealth > 60 ? ClinicalColors.stable :
                   aggregatedData.averageBatteryHealth > 30 ? ClinicalColors.anxious : ClinicalColors.crisis
          }}
        >
          <View style={styles.chartContainer}>
            <PieChart
              data={batteryStatusData}
              donut
              radius={70}
              innerRadius={40}
              centerLabelComponent={() => (
                <View style={styles.centerLabel}>
                  <Text style={styles.centerValue}>{aggregatedData.averageBatteryHealth.toFixed(0)}%</Text>
                  <Text style={styles.centerText}>Promedio</Text>
                </View>
              )}
            />
            <View style={styles.legend}>
              {batteryStatusData.map((item, index) => (
                <View key={index} style={styles.legendItem}>
                  <View style={[styles.legendColor, { backgroundColor: item.color }]} />
                  <Text style={styles.legendText}>{item.label}: {item.value}</Text>
                </View>
              ))}
            </View>
          </View>
        </ClinicalInfoCard>
      )}

      {/* Recomendaciones */}
      <View style={styles.recommendationsCard}>
        <Text style={styles.recommendationsTitle}>Recomendaciones del Sistema</Text>
        <Text style={styles.recommendationText}>
          {aggregatedData.crisisChildren > aggregatedData.stableChildren ? 
            "Se detecta un alto número de niños en estado de crisis. Se recomienda intervención inmediata y revisión de protocolos terapéuticos." :
            aggregatedData.anxiousChildren > aggregatedData.stableChildren ?
            "Predominan estados de ansiedad. Considere implementar técnicas de relajación adicionales." :
            "El sistema muestra estabilidad general. Continúe con el monitoreo regular."
          }
          {aggregatedData.averageBatteryHealth < 30 && " Atención: Múltiples dispositivos requieren recarga urgente."}
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 40,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: ClinicalColors.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: ClinicalColors.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
    fontStyle: 'italic',
  },
  systemCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  systemStatus: {
    fontSize: 18,
    fontWeight: '600',
    color: ClinicalColors.white,
    textAlign: 'center',
  },
  systemSubtext: {
    fontSize: 14,
    color: ClinicalColors.white,
    textAlign: 'center',
    opacity: 0.9,
    marginTop: 4,
  },
  summaryCard: {
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
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: ClinicalColors.textPrimary,
    marginBottom: 16,
    textAlign: 'center',
  },
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    color: ClinicalColors.textSecondary,
  },
  chartContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  centerLabel: {
    alignItems: 'center',
  },
  centerValue: {
    fontSize: 18,
    fontWeight: '700',
    color: ClinicalColors.textPrimary,
  },
  centerText: {
    fontSize: 12,
    color: ClinicalColors.textSecondary,
  },
  legend: {
    marginTop: 20,
    alignItems: 'flex-start',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
    color: ClinicalColors.textSecondary,
  },
  recommendationsCard: {
    backgroundColor: ClinicalColors.background,
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: ClinicalColors.secondary,
    marginTop: 10,
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

export default DashboardCharts;