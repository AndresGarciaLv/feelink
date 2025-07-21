import React from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, StatusBar } from 'react-native';
import { PieChart, BarChart, LineChart } from "react-native-gifted-charts";
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
  criticalAlerts: number;
  averageStressLevel: number;
  deviceReliability: number;
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

  const getSystemState = (): SystemState => {
  const totalToys = toys.length; // Usar el total de pacientes registrados
const connectivityRate = totalToys > 0 ? (connectedToys / totalToys) * 100 : 0;    
    if (connectivityRate >= 95) {
      return { state: 'optimal', label: 'Sistema Operativo', color: '#2E7D57' };
    } else if (connectivityRate >= 80) {
      return { state: 'stable', label: 'Funcionamiento Normal', color: '#4A90E2' };
    } else if (connectivityRate >= 60) {
      return { state: 'warning', label: 'Requiere Atención', color: '#F5A623' };
    } else {
      return { state: 'critical', label: 'Estado Crítico', color: '#D0021B' };
    }
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
        criticalAlerts: 0,
        averageStressLevel: 0,
        deviceReliability: 0,
      };
    }

    let totalInteractions = 0;
    let totalBattery = 0;
    let totalStressLevel = 0;
    let stableChildren = 0;
    let anxiousChildren = 0;
    let crisisChildren = 0;
    let activeChildren = 0;
    let criticalAlerts = 0;
    let reliableDevices = 0;

    toyIds.forEach(toyId => {
      const toyData = allToysData[toyId];
      if (toyData && toyData.pressurePercent.length > 0) {
        activeChildren++;
        
        const interactions = toyData.pressurePercent.filter(p => p > 10).length;
        totalInteractions += interactions;
        
        const currentBattery = toyData.battery[toyData.battery.length - 1] || 0;
        totalBattery += currentBattery;
        
        const currentPressure = toyData.pressurePercent[toyData.pressurePercent.length - 1] || 0;
        totalStressLevel += currentPressure;
        
        // Clasificación clínica basada en rangos médicos
        if (currentPressure >= 85) {
          crisisChildren++;
          criticalAlerts++;
        } else if (currentPressure >= 65) {
          anxiousChildren++;
        } else {
          stableChildren++;
        }

        // Confiabilidad del dispositivo
        if (currentBattery > 20 && interactions > 0) {
          reliableDevices++;
        }
      }
    });

    return {
      totalChildren: toys.length,
      activeChildren,
      stableChildren,
      anxiousChildren,
      crisisChildren,
      averageBatteryHealth: activeChildren > 0 ? totalBattery / activeChildren : 0,
      totalInteractions,
      criticalAlerts,
      averageStressLevel: activeChildren > 0 ? totalStressLevel / activeChildren : 0,
      deviceReliability: toyIds.length > 0 ? (reliableDevices / toyIds.length) * 100 : 0,
    };
  };

  const aggregatedData = getAggregatedData();
  const systemState = getSystemState();

  // Datos para gráfica principal - Estados clínicos
  const getClinicalStatusData = (): PieDataItem[] => {
    const total = aggregatedData.stableChildren + aggregatedData.anxiousChildren + aggregatedData.crisisChildren;
    if (total === 0) return [];

    return [
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
  };

  // Datos para gráfica de barras - Distribución por rangos de estrés
  const getStressDistributionData = () => {
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
      if (toyData && toyData.pressurePercent.length > 0) {
        const currentPressure = toyData.pressurePercent[toyData.pressurePercent.length - 1] || 0;
        const range = ranges.find(r => currentPressure >= r.min && currentPressure <= r.max);
        if (range) range.count++;
      }
    });

    return ranges.map((range, index) => ({
      value: range.count,
      label: range.label,
      frontColor: range.color,
      gradientColor: range.color,
      spacing: 8,
    }));
  };

  // Datos para conectividad de dispositivos
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

      {/* Gráfica Principal - Estado Clínico */}
      {clinicalStatusData.length > 0 && (
        <View style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>ESTADO CLÍNICO ACTUAL</Text>
            <Text style={styles.chartSubtitle}>Distribución por nivel de severidad</Text>
          </View>
          
          <View style={styles.chartContainer}>
            <PieChart
              data={clinicalStatusData}
              donut
              radius={85}
              innerRadius={55}
              strokeColor="white"
              strokeWidth={3}
              showGradient
              gradientCenterColor="#f8f9fa"
              centerLabelComponent={() => (
                <View style={styles.centerLabel}>
                  <Text style={styles.centerMainValue}>
                    {clinicalStatusData.reduce((sum, item) => sum + item.value, 0)}
                  </Text>
                  <Text style={styles.centerSubValue}>PACIENTES</Text>
                  <Text style={styles.centerDescription}>Monitoreados</Text>
                </View>
              )}
            />
            
            <View style={styles.professionalLegend}>
              {clinicalStatusData.map((item, index) => (
                <View key={index} style={styles.legendRow}>
                  <View style={[styles.legendIndicator, { backgroundColor: item.color }]} />
                  <View style={styles.legendContent}>
                    <Text style={styles.legendLabel}>{item.label}</Text>
                    <Text style={styles.legendValue}>{item.value} pacientes</Text>
                    <Text style={styles.legendPercentage}>
                      {Math.round((item.value / clinicalStatusData.reduce((sum, i) => sum + i.value, 0)) * 100)}%
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>
      )}

      {/* Gráfica de Barras - Distribución de Estrés */}
      <View style={styles.chartCard}>
        <View style={styles.chartHeader}>
          <Text style={styles.chartTitle}>DISTRIBUCIÓN DE NIVELES DE ESTRÉS</Text>
          <Text style={styles.chartSubtitle}>Rangos de presión por paciente</Text>
        </View>
        
        <View style={styles.barChartContainer}>
          <BarChart
            data={stressDistributionData}
            width={screenWidth - 80}
            height={200}
            barWidth={35}
            spacing={20}
            roundedTop
            roundedBottom
            hideRules
            yAxisThickness={1}
            xAxisThickness={1}
            yAxisColor="#E1E8ED"
            xAxisColor="#E1E8ED"
            yAxisTextStyle={styles.axisText}
            xAxisLabelTextStyle={styles.axisLabelText}
            noOfSections={4}
            maxValue={Math.max(...stressDistributionData.map(d => d.value)) + 2}
            showGradient
            gradientColor="rgba(255,255,255,0.8)"
          />
        </View>
        
        <View style={styles.rangeDescription}>
          <Text style={styles.rangeText}>
            Rango Normal: 0-40% | Precaución: 41-60% | Crítico: 61-100%
          </Text>
        </View>
      </View>

      {/* Estado de Dispositivos */}
      {deviceStatusData.length > 0 && (
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
                <Text style={[styles.deviceMetricValue, { 
                  color: aggregatedData.averageBatteryHealth > 60 ? '#2E7D57' : 
                        aggregatedData.averageBatteryHealth > 30 ? '#F5A623' : '#D0021B' 
                }]}>
                  {Math.round(aggregatedData.averageBatteryHealth)}%
                </Text>
                <Text style={styles.deviceMetricLabel}>Batería Promedio</Text>
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
      )}

      {/* Panel de Recomendaciones Clínicas */}
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
  chartContainer: {
    alignItems: 'center',
  },
  centerLabel: {
    alignItems: 'center',
  },
  centerMainValue: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A202C',
  },
  centerSubValue: {
    fontSize: 11,
    fontWeight: '600',
    color: '#4A5568',
    letterSpacing: 0.5,
    marginTop: 2,
  },
  centerDescription: {
    fontSize: 10,
    color: '#718096',
    marginTop: 2,
  },
  professionalLegend: {
    marginTop: 24,
    width: '100%',
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#F7FAFC',
    borderRadius: 8,
  },
  legendIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 12,
  },
  legendContent: {
    flex: 1,
  },
  legendLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D3748',
  },
  legendValue: {
    fontSize: 12,
    color: '#4A5568',
    marginTop: 2,
  },
  legendPercentage: {
    fontSize: 11,
    color: '#718096',
    marginTop: 1,
  },
  barChartContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  axisText: {
    fontSize: 10,
    color: '#718096',
  },
  axisLabelText: {
    fontSize: 9,
    color: '#4A5568',
    fontWeight: '500',
  },
  rangeDescription: {
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F7FAFC',
  },
  rangeText: {
    fontSize: 11,
    color: '#718096',
    textAlign: 'center',
    fontStyle: 'italic',
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

export default DashboardCharts;