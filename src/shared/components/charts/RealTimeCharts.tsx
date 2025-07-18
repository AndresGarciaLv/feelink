import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart, BarChart } from "react-native-gifted-charts";
import { useSensorSocket } from '../../hooks/useSensorSocket';

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
};

const { width: screenWidth } = Dimensions.get('window');

const RealTimeCharts: React.FC = () => {
  const { sensorData, isConnected } = useSensorSocket();

  // Función para obtener el color de la batería según el nivel
  const getBatteryColor = (level: number) => {
    if (level > 60) return Colors.secondary;
    if (level > 30) return Colors.palevioletred;
    return '#FF6B6B';
  };

  // Preparamos los datos para la gráfica de acelerómetro
  const accelData = [
    { 
      value: Math.abs(sensorData.accelX[sensorData.accelX.length - 1] ?? 0),
      label: 'X',
      frontColor: Colors.secondary,
      gradientColor: Colors.primary,
      spacing: 15,
      labelTextStyle: { color: Colors.textPrimary, fontSize: 12 }
    },
    { 
      value: Math.abs(sensorData.accelY[sensorData.accelY.length - 1] ?? 0),
      label: 'Y',
      frontColor: Colors.palevioletred,
      gradientColor: Colors.softPurple,
      spacing: 15,
      labelTextStyle: { color: Colors.textPrimary, fontSize: 12 }
    },
    { 
      value: Math.abs(sensorData.accelZ[sensorData.accelZ.length - 1] ?? 0),
      label: 'Z',
      frontColor: Colors.lightsteelblue,
      gradientColor: Colors.lightBlue,
      spacing: 15,
      labelTextStyle: { color: Colors.textPrimary, fontSize: 12 }
    },
  ];

  // Preparamos los datos para la gráfica de línea del giroscopio
  const gyroLineData = sensorData.gyroX.slice(-20).map((value, index) => ({
    value: Math.abs(value),
    label: `${index + 1}`,
    labelTextStyle: { color: Colors.textSecundary, fontSize: 10 }
  }));

  // Datos para gráfica de presión
  const pressureData = sensorData.pressurePercent.slice(-10).map((value, index) => ({
    value: value,
    label: `${index + 1}`,
    frontColor: Colors.primary,
    gradientColor: Colors.lightBlue,
    spacing: 8,
    labelTextStyle: { color: Colors.textSecundary, fontSize: 10 }
  }));

  const currentBattery = sensorData.battery[sensorData.battery.length - 1] ?? 0;
  const currentPressure = sensorData.pressurePercent[sensorData.pressurePercent.length - 1] ?? 0;

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}> Monitor de Actividad del Peluche Terapéutico</Text>
      
      {/* Estado de Conexión */}
      <View style={[styles.statusCard, { backgroundColor: isConnected ? Colors.lightBlue : Colors.softPurple }]}>
        <Text style={styles.statusIcon}>{isConnected ? '🟢' : '🔴'}</Text>
        <Text style={styles.statusText}>
          {isConnected ? 'Conectado y monitoreando' : 'Reconectando...'}
        </Text>
      </View>

      {/* Gráfico de Batería */}
      <View style={styles.chartCard}>
        <View style={styles.chartHeader}>
          {/* <Text style={styles.chartIcon}>🔋</Text> */}
          <Text style={styles.chartTitle}>Nivel de Batería</Text>
        </View>
        <View style={styles.batteryContainer}>
          <View style={styles.batteryWrapper}>
            <Text style={[styles.batteryText, { color: getBatteryColor(currentBattery) }]}>
              {currentBattery}%
            </Text>
            <View style={styles.batteryBar}>
              <View 
                style={[
                  styles.batteryFill,
                  { 
                    width: `${currentBattery}%`,
                    backgroundColor: getBatteryColor(currentBattery)
                  }
                ]}
              />
            </View>
          </View>
        </View>
      </View>

      {/* Gráfico de Presión (Abrazos) */}
      <View style={styles.chartCard}>
        <View style={styles.chartHeader}>
          {/* <Text style={styles.chartIcon}>🤗</Text> */}
          <Text style={styles.chartTitle}>Intensidad de Abrazos</Text>
        </View>
        <View style={styles.pressureInfo}>
          <Text style={styles.pressureValue}>{currentPressure.toFixed(1)}%</Text>
          <Text style={styles.pressureLabel}>Presión actual</Text>
        </View>
        {pressureData.length > 0 && (
          <BarChart
            data={pressureData}
            width={screenWidth - 80}
            height={120}
            barWidth={22}
            spacing={8}
            roundedTop
            roundedBottom
            showGradient
            yAxisThickness={0}
            xAxisThickness={1}
            xAxisColor={Colors.lightsteelblue}
            hideYAxisText
            noOfSections={3}
            maxValue={100}
            isAnimated
            animationDuration={800}
          />
        )}
      </View>

      {/* Gráfico de Barras para Acelerómetro */}
      <View style={styles.chartCard}>
        <View style={styles.chartHeader}>
          {/* <Text style={styles.chartIcon}>📱</Text> */}
          <Text style={styles.chartTitle}>Movimiento del Peluche</Text>
        </View>
        <Text style={styles.chartSubtitle}>Aceleración en tres dimensiones</Text>
        <BarChart
          data={accelData}
          width={screenWidth - 80}
          height={140}
          barWidth={40}
          spacing={20}
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

      {/* Gráfico de Línea para Giroscopio */}
      <View style={styles.chartCard}>
        <View style={styles.chartHeader}>
          {/* <Text style={styles.chartIcon}>🔄</Text> */}
          <Text style={styles.chartTitle}>Rotación del Peluche</Text>
        </View>
        <Text style={styles.chartSubtitle}>Movimiento rotacional (últimas 20 lecturas)</Text>
        {gyroLineData.length > 0 && (
          <LineChart
            data={gyroLineData}
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
        )}
      </View>

      {/* Resumen de Actividad */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}> Resumen de Actividad</Text>
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Abrazos</Text>
            <Text style={styles.summaryValue}>
              {sensorData.pressurePercent.filter(p => p > 10).length}
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Movimientos</Text>
            <Text style={styles.summaryValue}>
              {sensorData.accelX.filter(a => Math.abs(a) > 0.5).length}
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Rotaciones</Text>
            <Text style={styles.summaryValue}>
              {sensorData.gyroX.filter(g => Math.abs(g) > 0.5).length}
            </Text>
          </View>
        </View>
      </View>
    </View>
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
    fontSize: 22,
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
  chartIcon: {
    fontSize: 24,
    marginRight: 12,
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
  batteryContainer: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  batteryWrapper: {
    alignItems: 'center',
  },
  batteryText: {
    fontSize: 36,
    fontWeight: '800',
    marginBottom: 10,
  },
  batteryBar: {
    width: 200,
    height: 12,
    backgroundColor: Colors.lightBlue,
    borderRadius: 6,
    overflow: 'hidden',
  },
  batteryFill: {
    height: '100%',
    borderRadius: 6,
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
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 12,
    color: Colors.textSecundary,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.secondary,
  },
});

export default RealTimeCharts;