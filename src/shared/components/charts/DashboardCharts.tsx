import React from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { LineChart, BarChart } from "react-native-gifted-charts";
import { useSensorSocket } from '../../hooks/useSensorSocket';
import { useListToysQuery } from '../../../core/http/requests/toyServerApi'; // Agregar import

const Colors = {
  primary: '#CBE0F4',
  secondary: '#9BC4E0',
  background: '#F8FAFC',
  lightBlue: '#E8F3F7',
  lightsteelblue: '#B0C4DE',
  palevioletred: '#DB7093',
  lightPurple: '#E3D7E6',
  softPurple: '#E0C7DB',
  textPrimary: '#333',
  textSecundary: '#868C95',
  white: '#FFF',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
};

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

  // Función para obtener el color según el estado del juguete
  const getToyStatusColor = (isActive: boolean) => {
    return isActive ? Colors.success : Colors.danger;
  };

  // Función para obtener el color de la batería según el nivel
  const getBatteryColor = (level: number) => {
    if (level > 60) return Colors.success;
    if (level > 30) return Colors.warning;
    return Colors.danger;
  };

  // Preparar datos agregados para gráficas generales
  const getAggregatedData = () => {
    const toyIds = Object.keys(allToysData);
    
    if (toyIds.length === 0) {
      return {
        totalHugs: 0,
        totalMovements: 0,
        averageBattery: 0,
        averagePressure: 0,
      };
    }

    let totalHugs = 0;
    let totalMovements = 0;
    let totalBattery = 0;
    let totalPressure = 0;
    let activeToys = 0;

    toyIds.forEach(toyId => {
      const toyData = allToysData[toyId];
      if (toyData && toyData.pressurePercent.length > 0) {
        activeToys++;
        totalHugs += toyData.pressurePercent.filter(p => p > 10).length;
        totalMovements += toyData.accelX.filter(a => Math.abs(a) > 0.5).length;
        totalBattery += toyData.battery[toyData.battery.length - 1] || 0;
        totalPressure += toyData.pressurePercent[toyData.pressurePercent.length - 1] || 0;
      }
    });

    return {
      totalHugs,
      totalMovements,
      averageBattery: activeToys > 0 ? totalBattery / activeToys : 0,
      averagePressure: activeToys > 0 ? totalPressure / activeToys : 0,
    };
  };

  const aggregatedData = getAggregatedData();

  // Preparar datos para gráfica de actividad por juguete
  const getToyActivityData = () => {
    return Object.keys(allToysData).map((toyId, index) => {
      const toyData = allToysData[toyId];
      const hugs = toyData ? toyData.pressurePercent.filter(p => p > 10).length : 0;
      
      return {
        value: hugs,
        label: getToyName(toyId), // Usar el nombre real del peluche
        frontColor: Colors.secondary,
        gradientColor: Colors.primary,
        spacing: 10,
        labelTextStyle: { color: Colors.textPrimary, fontSize: 10 }
      };
    });
  };

  // Preparar datos para gráfica de línea de presión promedio
  const getAveragePressureData = () => {
    const maxLength = 20;
    const pressureData: number[] = [];
    
    for (let i = 0; i < maxLength; i++) {
      const toyIds = Object.keys(allToysData);
      let totalPressure = 0;
      let activeToys = 0;
      
      toyIds.forEach(toyId => {
        const toyData = allToysData[toyId];
        if (toyData && toyData.pressurePercent[i] !== undefined) {
          totalPressure += toyData.pressurePercent[i];
          activeToys++;
        }
      });
      
      pressureData.push(activeToys > 0 ? totalPressure / activeToys : 0);
    }
    
    return pressureData.map((value, index) => ({
      value: value,
      label: `${index + 1}`,
      labelTextStyle: { color: Colors.textSecundary, fontSize: 10 }
    }));
  };

  const toyActivityData = getToyActivityData();
  const averagePressureData = getAveragePressureData();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.sectionTitle}>Dashboard del Terapeuta</Text>
      
      {/* Estado General del Sistema */}
      <View style={[styles.statusCard, { backgroundColor: isConnected ? Colors.lightBlue : Colors.softPurple }]}>
        <Text style={styles.statusIcon}>{isConnected ? '🟢' : '🔴'}</Text>
        <Text style={styles.statusText}>
          {isConnected ? `Sistema Activo - ${connectedToys} peluches conectados` : 'Sistema Desconectado'}
        </Text>
      </View>

      {/* Resumen General */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Resumen General de Actividad</Text>
        <View style={styles.summaryGrid}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{Object.keys(allToysData).length}</Text>
            <Text style={styles.summaryLabel}>Peluches Registrados</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{connectedToys}</Text>
            <Text style={styles.summaryLabel}>Conectados</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{aggregatedData.totalHugs}</Text>
            <Text style={styles.summaryLabel}>Abrazos Totales</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{aggregatedData.averageBattery.toFixed(0)}%</Text>
            <Text style={styles.summaryLabel}>Batería Promedio</Text>
          </View>
        </View>
      </View>

      {/* Gráfica de Actividad por Peluche */}
      {toyActivityData.length > 0 && (
        <View style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>Actividad por Peluche</Text>
          </View>
          <Text style={styles.chartSubtitle}>Número de abrazos detectados por cada peluche</Text>
          <BarChart
            data={toyActivityData}
            width={screenWidth - 80}
            height={140}
            barWidth={35}
            spacing={15}
            roundedTop
            roundedBottom
            showGradient
            yAxisThickness={0}
            xAxisThickness={1}
            xAxisColor={Colors.lightsteelblue}
            hideYAxisText
            noOfSections={4}
            isAnimated
            animationDuration={1000}
          />
        </View>
      )}

      {/* Gráfica de Presión Promedio */}
      {averagePressureData.length > 0 && (
        <View style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>Intensidad Promedio de Abrazos</Text>
          </View>
          <Text style={styles.chartSubtitle}>Presión promedio de todos los peluches (últimas 20 lecturas)</Text>
          <View style={styles.pressureInfo}>
            <Text style={styles.pressureValue}>{aggregatedData.averagePressure.toFixed(1)}%</Text>
            <Text style={styles.pressureLabel}>Presión actual promedio</Text>
          </View>
          <LineChart
            data={averagePressureData}
            width={screenWidth - 80}
            height={120}
            color={Colors.secondary}
            thickness={3}
            yAxisThickness={0}
            xAxisThickness={1}
            xAxisColor={Colors.lightsteelblue}
            hideYAxisText
            isAnimated
            curved
            showDataPoints
            dataPointsColor={Colors.palevioletred}
            dataPointsRadius={4}
            focusEnabled
            showStripOnFocus
            stripColor={Colors.lightPurple}
            stripOpacity={0.3}
            areaChart
            startFillColor={Colors.primary}
            endFillColor={Colors.white}
            startOpacity={0.4}
            endOpacity={0.1}
          />
        </View>
      )}

      {/* Lista de Estado de Peluches */}
      <View style={styles.chartCard}>
        <View style={styles.chartHeader}>
          <Text style={styles.chartTitle}>Estado de Peluches</Text>
        </View>
        {Object.keys(allToysData).length > 0 ? (
          Object.keys(allToysData).map((toyId) => {
            const toyData = allToysData[toyId];
            const isActive = toyData && toyData.battery.length > 0;
            const batteryLevel = isActive ? toyData.battery[toyData.battery.length - 1] : 0;
            const lastPressure = isActive ? toyData.pressurePercent[toyData.pressurePercent.length - 1] : 0;
            
            return (
              <View key={toyId} style={styles.toyStatusItem}>
                <View style={styles.toyInfo}>
                  <View style={styles.toyHeader}>
                    <Text style={styles.toyName}>{getToyName(toyId)}</Text>
                    <View style={[styles.statusDot, { backgroundColor: getToyStatusColor(isActive) }]} />
                  </View>
                  <Text style={styles.toyId}>ID: {toyId.slice(-8)}</Text>
                </View>
                <View style={styles.toyMetrics}>
                  <View style={styles.metric}>
                    <Text style={[styles.metricValue, { color: getBatteryColor(batteryLevel) }]}>
                      {batteryLevel}%
                    </Text>
                    <Text style={styles.metricLabel}>Batería</Text>
                  </View>
                  <View style={styles.metric}>
                    <Text style={styles.metricValue}>{lastPressure.toFixed(1)}%</Text>
                    <Text style={styles.metricLabel}>Presión</Text>
                  </View>
                </View>
              </View>
            );
          })
        ) : (
          <Text style={styles.noDataText}>No hay peluches registrados</Text>
        )}
      </View>

      {/* Estadísticas Detalladas */}
      <View style={styles.statsCard}>
        <Text style={styles.statsTitle}>Estadísticas Detalladas</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{aggregatedData.totalMovements}</Text>
            <Text style={styles.statLabel}>Movimientos{'\n'}Detectados</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{aggregatedData.totalHugs}</Text>
            <Text style={styles.statLabel}>Interacciones{'\n'}de Abrazo</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {Object.keys(allToysData).filter(toyId => {
                const toyData = allToysData[toyId];
                return toyData && toyData.battery[toyData.battery.length - 1] > 30;
              }).length}
            </Text>
            <Text style={styles.statLabel}>Batería{'\n'}OK (>30%)</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 16,
    textAlign: 'center',
  },
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 20,
    marginBottom: 20,
  },
  statusIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  chartCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: Colors.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  chartHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  chartSubtitle: {
    fontSize: 14,
    color: Colors.textSecundary,
    marginBottom: 16,
    fontStyle: 'italic',
  },
  summaryCard: {
    backgroundColor: Colors.lightBlue,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 16,
    textAlign: 'center',
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  summaryItem: {
    alignItems: 'center',
    width: '48%',
    marginBottom: 12,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.secondary,
  },
  summaryLabel: {
    fontSize: 12,
    color: Colors.textSecundary,
    marginTop: 4,
    textAlign: 'center',
  },
  pressureInfo: {
    alignItems: 'center',
    marginBottom: 16,
  },
  pressureValue: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.secondary,
  },
  pressureLabel: {
    fontSize: 14,
    color: Colors.textSecundary,
    marginTop: 4,
  },
  toyStatusItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: Colors.background,
    borderRadius: 12,
    marginBottom: 8,
  },
  toyInfo: {
    flex: 1,
  },
  toyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toyName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginRight: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  toyId: {
    fontSize: 12,
    color: Colors.textSecundary,
    marginTop: 2,
  },
  toyMetrics: {
    flexDirection: 'row',
  },
  metric: {
    alignItems: 'center',
    marginLeft: 16,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  metricLabel: {
    fontSize: 10,
    color: Colors.textSecundary,
    marginTop: 2,
  },
  noDataText: {
    textAlign: 'center',
    color: Colors.textSecundary,
    fontStyle: 'italic',
    paddingVertical: 20,
  },
  statsCard: {
    backgroundColor: Colors.softPurple,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 16,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
statsContainer: { 
  flexDirection: 'row',
  justifyContent: 'space-between', 
  alignItems: 'flex-start', 
  paddingHorizontal: 10, 
},
  statItem: {
    alignItems: 'center',
      flex: 1,
  paddingHorizontal: 5, 
  },
statValue: {
  fontSize: 22,
  fontWeight: '700',
  color: Colors.palevioletred,
  marginBottom: 4, 
},
statLabel: {
  fontSize: 11, 
  color: Colors.textSecundary,
  textAlign: 'center',
  lineHeight: 14,
  paddingHorizontal: 2, 
  },
});

export default DashboardCharts;