import React from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { LineChart, BarChart } from "react-native-gifted-charts";
import { useSensorSocket } from '../../hooks/useSensorSocket';
import { useListToysQuery } from '../../../core/http/requests/toyServerApi';
import ClinicalColors from '../constants/clinicalcolors';
import ClinicalInfoCard from '../chart-cards/ClinicalInfoCard';
import { getPressureState, getMovementState, getBatteryColor } from '../../../core/utils/clinicalUtils';

const { width: screenWidth } = Dimensions.get('window');

const DashboardCharts: React.FC = () => {
  const { allToysData, isConnected, connectedToys } = useSensorSocket();
  
  // Hook para obtener la lista de peluches con sus nombres
  const { data: toysData } = useListToysQuery({ page: 1, pageSize: 100 });
  const toys = toysData?.items || [];

  // Función para obtener el nombre del peluche por ID
  const getToyName = (toyId: string) => {
    const toy = toys.find(t => t.id === toyId);
    return toy ? toy.name : `Peluche ${toyId.slice(-4)}`;
  };

  // Función para obtener el estado clínico del sistema
  const getSystemClinicalState = () => {
    const totalToys = Object.keys(allToysData).length;
    if (connectedToys === 0) {
      return { state: 'crisis', label: 'Sin Conexión', color: ClinicalColors.crisis };
    }
    if (connectedToys === totalToys && totalToys > 0) {
      return { state: 'stable', label: 'Óptimo', color: ClinicalColors.stable };
    }
    return { state: 'anxious', label: 'Parcial', color: ClinicalColors.anxious };
  };

  // Preparar datos agregados para análisis clínico
  const getAggregatedClinicalData = () => {
    const toyIds = Object.keys(allToysData);
    
    if (toyIds.length === 0) {
      return {
        totalTherapeuticInteractions: 0,
        significantMovements: 0,
        averageBatteryHealth: 0,
        averageTherapeuticIntensity: 0,
        crisisEpisodes: 0,
        anxiousEpisodes: 0,
        stableEpisodes: 0,
      };
    }

    let totalInteractions = 0;
    let significantMovements = 0;
    let totalBattery = 0;
    let totalPressure = 0;
    let activeToys = 0;
    let crisisEpisodes = 0;
    let anxiousEpisodes = 0;
    let stableEpisodes = 0;

    toyIds.forEach(toyId => {
      const toyData = allToysData[toyId];
      if (toyData && toyData.pressurePercent.length > 0) {
        activeToys++;
        
        // Contar interacciones terapéuticas (presión > 10%)
        const interactions = toyData.pressurePercent.filter(p => p > 10).length;
        totalInteractions += interactions;
        
        // Contar movimientos significativos
        significantMovements += toyData.accelX.filter(a => Math.abs(a) > 0.5).length;
        
        // Batería y presión promedio
        totalBattery += toyData.battery[toyData.battery.length - 1] || 0;
        totalPressure += toyData.pressurePercent[toyData.pressurePercent.length - 1] || 0;
        
        // Análisis de episodios por estado clínico
        toyData.pressurePercent.forEach(pressure => {
          if (pressure >= 88) crisisEpisodes++;
          else if (pressure >= 61) anxiousEpisodes++;
          else stableEpisodes++;
        });
      }
    });

    return {
      totalTherapeuticInteractions: totalInteractions,
      significantMovements,
      averageBatteryHealth: activeToys > 0 ? totalBattery / activeToys : 0,
      averageTherapeuticIntensity: activeToys > 0 ? totalPressure / activeToys : 0,
      crisisEpisodes,
      anxiousEpisodes,
      stableEpisodes,
    };
  };

  const aggregatedData = getAggregatedClinicalData();
  const systemState = getSystemClinicalState();

  // Preparar datos clínicos para gráfica de actividad terapéutica por peluche
  const getTherapeuticActivityData = () => {
    return Object.keys(allToysData).map((toyId) => {
      const toyData = allToysData[toyId];
      const interactions = toyData ? toyData.pressurePercent.filter(p => p > 10).length : 0;
      const currentPressure = toyData ? toyData.pressurePercent[toyData.pressurePercent.length - 1] || 0 : 0;
      const pressureState = getPressureState(currentPressure);
      
      return {
        value: interactions,
        label: getToyName(toyId),
        frontColor: pressureState.color,
        spacing: 6,
        labelTextStyle: { color: ClinicalColors.textSecondary, fontSize: 10 }
      };
    });
  };

  // Preparar datos para gráfica de intensidad terapéutica promedio
  const getAverageTherapeuticIntensityData = () => {
    const maxLength = 20;
    const intensityData: number[] = [];
    
    for (let i = 0; i < maxLength; i++) {
      const toyIds = Object.keys(allToysData);
      let totalIntensity = 0;
      let activeToys = 0;
      
      toyIds.forEach(toyId => {
        const toyData = allToysData[toyId];
        if (toyData && toyData.pressurePercent[i] !== undefined) {
          totalIntensity += toyData.pressurePercent[i];
          activeToys++;
        }
      });
      
      intensityData.push(activeToys > 0 ? totalIntensity / activeToys : 0);
    }
    
    return intensityData.map((value, index) => ({
      value: value,
      label: `${index + 1}`,
      labelTextStyle: { color: ClinicalColors.textSecondary, fontSize: 10 }
    }));
  };

  const therapeuticActivityData = getTherapeuticActivityData();
  const averageIntensityData = getAverageTherapeuticIntensityData();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.mainTitle}>Dashboard Terapéutico TEA</Text>
      <Text style={styles.subtitle}>Centro de Control y Monitoreo Multi-Paciente</Text>
      
      {/* Estado de Conexión Clínico */}
      <View style={[styles.connectionCard, { backgroundColor: systemState.color }]}>
        <View style={styles.connectionContent}>
          <Text style={styles.connectionIcon}>{isConnected ? '🏥' : '⚠️'}</Text>
          <View>
            <Text style={styles.connectionStatus}>
              Estado del Sistema: {systemState.label}
            </Text>
            <Text style={styles.connectionSubtext}>
              {connectedToys} de {Object.keys(allToysData).length} peluches terapéuticos activos
            </Text>
          </View>
        </View>
      </View>

      {/* Resumen Clínico General */}
      <View style={styles.overviewCard}>
        <Text style={styles.overviewTitle}>Resumen de Sesiones Terapéuticas</Text>
        <View style={styles.overviewGrid}>
          <View style={styles.overviewItem}>
            <View style={[styles.overviewIndicator, { backgroundColor: ClinicalColors.primary }]} />
            <Text style={styles.overviewLabel}>Peluches</Text>
            <Text style={styles.overviewValue}>{Object.keys(allToysData).length}</Text>
          </View>
          <View style={styles.overviewItem}>
            <View style={[styles.overviewIndicator, { backgroundColor: ClinicalColors.stable }]} />
            <Text style={styles.overviewLabel}>Conectados</Text>
            <Text style={styles.overviewValue}>{connectedToys}</Text>
          </View>
          <View style={styles.overviewItem}>
            <View style={[styles.overviewIndicator, { backgroundColor: ClinicalColors.secondary }]} />
            <Text style={styles.overviewLabel}>Interacciones</Text>
            <Text style={styles.overviewValue}>{aggregatedData.totalTherapeuticInteractions}</Text>
          </View>
          <View style={styles.overviewItem}>
            <View style={[styles.overviewIndicator, { backgroundColor: getBatteryColor(aggregatedData.averageBatteryHealth) }]} />
            <Text style={styles.overviewLabel}>Batería Prom.</Text>
            <Text style={styles.overviewValue}>{aggregatedData.averageBatteryHealth.toFixed(0)}%</Text>
          </View>
        </View>
      </View>

      {/* Gráfica de Actividad Terapéutica por Peluche */}
      {therapeuticActivityData.length > 0 && (
        <ClinicalInfoCard
          title="Actividad Terapéutica por Dispositivo"
          description="Número de interacciones terapéuticas registradas por cada peluche sensorial. Facilita la identificación de preferencias de pacientes y eficacia terapéutica."
          clinicalValue={{
            state: aggregatedData.totalTherapeuticInteractions > 50 ? 'stable' : 
                   aggregatedData.totalTherapeuticInteractions > 20 ? 'anxious' : 'crisis',
            label: aggregatedData.totalTherapeuticInteractions > 50 ? 'Alta Actividad' :
                   aggregatedData.totalTherapeuticInteractions > 20 ? 'Actividad Moderada' : 'Baja Actividad',
            color: aggregatedData.totalTherapeuticInteractions > 50 ? ClinicalColors.stable :
                   aggregatedData.totalTherapeuticInteractions > 20 ? ClinicalColors.anxious : ClinicalColors.crisis
          }}
        >
          <View style={styles.currentValueContainer}>
            <Text style={[styles.currentValue, { color: ClinicalColors.primary }]}>
              {aggregatedData.totalTherapeuticInteractions}
            </Text>
            <Text style={styles.currentLabel}>Interacciones Totales</Text>
          </View>

          <BarChart
            data={therapeuticActivityData}
            width={screenWidth - 80}
            height={140}
            barWidth={25}
            spacing={6}
            roundedTop
            roundedBottom
            yAxisThickness={1}
            xAxisThickness={1}
            xAxisColor={ClinicalColors.cardBorder}
            yAxisColor={ClinicalColors.cardBorder}
            yAxisTextStyle={{ color: ClinicalColors.textSecondary }}
            noOfSections={4}
            isAnimated
            animationDuration={1000}
            showLine
            lineColor={ClinicalColors.anxious}
            lineThickness={2}
          />
        </ClinicalInfoCard>
      )}

      {/* Gráfica de Intensidad Terapéutica Promedio */}
      {averageIntensityData.length > 0 && (
        <ClinicalInfoCard
          title="Intensidad Terapéutica Promedio"
          description="Monitoreo de la intensidad promedio de contacto terapéutico. Permite evaluar patrones de autorregulación y necesidades sensoriales del grupo de pacientes."
          clinicalValue={getPressureState(aggregatedData.averageTherapeuticIntensity)}
        >
          <View style={styles.currentValueContainer}>
            <Text style={[styles.currentValue, { color: getPressureState(aggregatedData.averageTherapeuticIntensity).color }]}>
              {aggregatedData.averageTherapeuticIntensity.toFixed(1)}%
            </Text>
            <Text style={styles.currentLabel}>Intensidad Actual Promedio</Text>
          </View>

          <View style={styles.pressureScale}>
            <View style={styles.scaleItem}>
              <View style={[styles.scaleIndicator, { backgroundColor: ClinicalColors.stable }]} />
              <Text style={styles.scaleText}>0-60% Estable</Text>
            </View>
            <View style={styles.scaleItem}>
              <View style={[styles.scaleIndicator, { backgroundColor: ClinicalColors.anxious }]} />
              <Text style={styles.scaleText}>61-87% Ansioso</Text>
            </View>
            <View style={styles.scaleItem}>
              <View style={[styles.scaleIndicator, { backgroundColor: ClinicalColors.crisis }]} />
              <Text style={styles.scaleText}>88-100% Crisis</Text>
            </View>
          </View>

          <LineChart
            data={averageIntensityData}
            width={screenWidth - 80}
            height={120}
            color={ClinicalColors.primary}
            thickness={3}
            yAxisThickness={1}
            xAxisThickness={1}
            xAxisColor={ClinicalColors.cardBorder}
            yAxisColor={ClinicalColors.cardBorder}
            yAxisTextStyle={{ color: ClinicalColors.textSecondary }}
            isAnimated
            curved
            showDataPoints
            dataPointsColor={ClinicalColors.secondary}
            dataPointsRadius={4}
            focusEnabled
            showStripOnFocus
            stripColor={ClinicalColors.anxious}
            stripOpacity={0.2}
            areaChart
            startFillColor={ClinicalColors.primary}
            endFillColor={ClinicalColors.white}
            startOpacity={0.3}
            endOpacity={0.05}
            maxValue={100}
            noOfSections={4}
          />
        </ClinicalInfoCard>
      )}

      {/* Estado Clínico de Dispositivos */}
      <ClinicalInfoCard
        title="Estado Clínico de Dispositivos Terapéuticos"
        description="Monitoreo en tiempo real del estado operativo y nivel de batería de cada peluche sensorial. Crítico para mantener la continuidad terapéutica."
        clinicalValue={systemState}
      >
        {Object.keys(allToysData).length > 0 ? (
          Object.keys(allToysData).map((toyId) => {
            const toyData = allToysData[toyId];
            const isActive = toyData && toyData.battery.length > 0;
            const batteryLevel = isActive ? toyData.battery[toyData.battery.length - 1] : 0;
            const lastPressure = isActive ? toyData.pressurePercent[toyData.pressurePercent.length - 1] : 0;
            const pressureState = getPressureState(lastPressure);
            const batteryState = {
              color: getBatteryColor(batteryLevel),
              label: batteryLevel > 60 ? 'Óptimo' : batteryLevel > 30 ? 'Medio' : 'Crítico'
            };
            
            return (
              <View key={toyId} style={styles.toyStatusItem}>
                <View style={styles.toyInfo}>
                  <View style={styles.toyHeader}>
                    <Text style={styles.toyName}>{getToyName(toyId)}</Text>
                    <View style={[styles.statusDot, { backgroundColor: isActive ? ClinicalColors.stable : ClinicalColors.crisis }]} />
                  </View>
                  <Text style={styles.toyId}>Dispositivo: {toyId.slice(-8)}</Text>
                  <Text style={styles.toyStatus}>
                    Estado: <Text style={{ color: pressureState.color }}>{pressureState.label}</Text>
                  </Text>
                </View>
                <View style={styles.toyMetrics}>
                  <View style={styles.metric}>
                    <Text style={[styles.metricValue, { color: batteryState.color }]}>
                      {batteryLevel}%
                    </Text>
                    <Text style={styles.metricLabel}>Batería</Text>
                    <Text style={[styles.metricStatus, { color: batteryState.color }]}>
                      {batteryState.label}
                    </Text>
                  </View>
                  <View style={styles.metric}>
                    <Text style={[styles.metricValue, { color: pressureState.color }]}>
                      {lastPressure.toFixed(1)}%
                    </Text>
                    <Text style={styles.metricLabel}>Presión</Text>
                    <Text style={[styles.metricStatus, { color: pressureState.color }]}>
                      {pressureState.label}
                    </Text>
                  </View>
                </View>
              </View>
            );
          })
        ) : (
          <View style={styles.noDataContainer}>
            <Text style={styles.noDataText}>No hay dispositivos terapéuticos registrados</Text>
            <Text style={styles.noDataSubtext}>Conecte al menos un peluche sensorial para comenzar el monitoreo</Text>
          </View>
        )}
      </ClinicalInfoCard>

      {/* Análisis Clínico Detallado */}
      <View style={styles.diagnosticSummary}>
        <Text style={styles.diagnosticTitle}>Análisis Clínico del Sistema</Text>
        <View style={styles.diagnosticGrid}>
          <View style={styles.diagnosticItem}>
            <Text style={styles.diagnosticLabel}>Episodios de Crisis</Text>
            <Text style={[styles.diagnosticNumber, { color: ClinicalColors.crisis }]}>
              {aggregatedData.crisisEpisodes}
            </Text>
            <Text style={styles.diagnosticUnit}>eventos</Text>
          </View>
          <View style={styles.diagnosticItem}>
            <Text style={styles.diagnosticLabel}>Estados de Ansiedad</Text>
            <Text style={[styles.diagnosticNumber, { color: ClinicalColors.anxious }]}>
              {aggregatedData.anxiousEpisodes}
            </Text>
            <Text style={styles.diagnosticUnit}>eventos</Text>
          </View>
          <View style={styles.diagnosticItem}>
            <Text style={styles.diagnosticLabel}>Períodos Estables</Text>
            <Text style={[styles.diagnosticNumber, { color: ClinicalColors.stable }]}>
              {aggregatedData.stableEpisodes}
            </Text>
            <Text style={styles.diagnosticUnit}>eventos</Text>
          </View>
        </View>
        
        {/* Recomendaciones del Sistema */}
        <View style={styles.recommendationsCard}>
          <Text style={styles.recommendationsTitle}>Recomendaciones del Sistema</Text>
          <Text style={styles.recommendationText}>
            {aggregatedData.crisisEpisodes > 10 ? 
              "⚠️ Alto número de episodios de crisis detectados. Considere ajustar protocolos terapéuticos y aumentar supervisión clínica." :
              aggregatedData.anxiousEpisodes > aggregatedData.stableEpisodes ?
              "📊 Se observa predominancia de estados ansiosos. Recomiende técnicas de relajación y revisar plan terapéutico individual." :
              "✅ El sistema muestra un funcionamiento estable. Continúe con el protocolo actual y mantenga monitoreo regular."
            }
            {aggregatedData.averageBatteryHealth < 30 && " 🔋 Atención: Varios dispositivos requieren recarga urgente para mantener continuidad terapéutica."}
          </Text>
        </View>
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
  connectionCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  connectionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  connectionIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  connectionStatus: {
    fontSize: 16,
    fontWeight: '600',
    color: ClinicalColors.white,
  },
  connectionSubtext: {
    fontSize: 14,
    color: ClinicalColors.white,
    opacity: 0.9,
  },
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
  currentValueContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  currentValue: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 4,
  },
  currentLabel: {
    fontSize: 14,
    color: ClinicalColors.textSecondary,
  },
  pressureScale: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
    paddingVertical: 12,
    backgroundColor: ClinicalColors.background,
    borderRadius: 8,
  },
  scaleItem: {
    alignItems: 'center',
  },
  scaleIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginBottom: 4,
  },
  scaleText: {
    fontSize: 10,
    color: ClinicalColors.textSecondary,
    textAlign: 'center',
  },
  toyStatusItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: ClinicalColors.background,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: ClinicalColors.cardBorder,
  },
  toyInfo: {
    flex: 1,
  },
  toyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  toyName: {
    fontSize: 16,
    fontWeight: '600',
    color: ClinicalColors.textPrimary,
    marginRight: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  toyId: {
    fontSize: 12,
    color: ClinicalColors.textSecondary,
    marginBottom: 4,
  },
  toyStatus: {
    fontSize: 12,
    color: ClinicalColors.textSecondary,
  },
  toyMetrics: {
    flexDirection: 'row',
  },
  metric: {
    alignItems: 'center',
    marginLeft: 20,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  metricLabel: {
    fontSize: 10,
    color: ClinicalColors.textSecondary,
    marginTop: 2,
  },
  metricStatus: {
    fontSize: 9,
    fontWeight: '500',
    marginTop: 2,
  },
  noDataContainer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  noDataText: {
    fontSize: 16,
    color: ClinicalColors.textSecondary,
    fontWeight: '500',
    marginBottom: 8,
  },
  noDataSubtext: {
    fontSize: 14,
    color: ClinicalColors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
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
    marginBottom: 4,
  },
  diagnosticUnit: {
    fontSize: 11,
    color: ClinicalColors.textSecondary,
  },
  recommendationsCard: {
    backgroundColor: ClinicalColors.background,
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

export default DashboardCharts;