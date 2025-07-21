import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions, ActivityIndicator, ScrollView } from 'react-native';
import { LineChart, BarChart } from "react-native-gifted-charts";
import { useSensorSocket } from '../../hooks/useSensorSocket';
import ClinicalColors from '../constants/clinicalcolors';
import RotatingTeddyBear from '../chart-cards/RotatingTeddyBear';
import ClinicalInfoCard from '../chart-cards/ClinicalInfoCard';
import { getPressureState, getMovementState, getTherapeuticRecommendation, getBatteryColor } from '../../../core/utils/clinicalUtils';

const { width: screenWidth } = Dimensions.get('window');

const RealTimeCharts = () => {
    const { sensorData, isConnected } = useSensorSocket();

    const hasData = sensorData.battery?.length > 0;

    // Análisis clínico mejorado con más métricas
    const clinicalAnalysis = useMemo(() => {
        if (!hasData) return null;

        const currentPressure = sensorData.pressurePercent?.at(-1) ?? 0;
        const currentAccelX = sensorData.accelX?.at(-1) ?? 0;
        const currentGyroX = sensorData.gyroX?.at(-1) ?? 0;

        // Calcular promedios de los últimos 5 minutos
        const recentPressure = sensorData.pressurePercent?.slice(-30) ?? [];
        const avgPressure = recentPressure.length > 0 ? 
            recentPressure.reduce((a, b) => a + b, 0) / recentPressure.length : 0;

        const recentMovement = sensorData.accelX?.slice(-30) ?? [];
        const avgMovement = recentMovement.length > 0 ? 
            recentMovement.reduce((a, b) => a + Math.abs(b), 0) / recentMovement.length : 0;

        return {
            pressure: getPressureState(currentPressure),
            movement: getMovementState(currentAccelX),
            rotation: Math.abs(currentGyroX) > 0.5 ? 
                { state: 'anxious', label: 'Activo', color: ClinicalColors.anxious } :
                { state: 'stable', label: 'Estable', color: ClinicalColors.stable },
            averages: {
                pressure: avgPressure,
                movement: avgMovement,
                rotation: Math.abs(currentGyroX)
            }
        };
    }, [hasData, sensorData]);

    // Datos preparados para gráficos con mejor procesamiento
    const chartData = useMemo(() => {
        if (!hasData) return null;

        // Datos de presión con rangos clínicos
        const pressureData = sensorData.pressurePercent?.slice(-20).map((value, index) => {
            const state = getPressureState(value);
            return {
                value: value,
                label: `T${index + 1}`,
                frontColor: state.color,
                spacing: 4,
                labelTextStyle: { 
                    color: ClinicalColors.textSecondary, 
                    fontSize: 9,
                    fontFamily: 'monospace'
                }
            };
        }) ?? [];

        // Datos de movimiento tri-dimensional
        const movementData = sensorData.accelX?.slice(-15).map((x, index) => {
            const y = sensorData.accelY?.[sensorData.accelY.length - 15 + index] ?? 0;
            const z = sensorData.accelZ?.[sensorData.accelZ.length - 15 + index] ?? 0;
            const magnitude = Math.sqrt(x*x + y*y + z*z);
            const state = getMovementState(magnitude);
            
            return {
                value: magnitude,
                label: `${index + 1}m`,
                frontColor: state.color,
                spacing: 5,
                labelTextStyle: { 
                    color: ClinicalColors.textSecondary, 
                    fontSize: 9,
                    fontFamily: 'monospace'
                }
            };
        }) ?? [];

        // Datos de rotación con análisis de tendencias
        const rotationData = sensorData.gyroX?.slice(-20).map((value, index) => ({
            value: Math.abs(value),
            label: `${index + 1}`,
            labelTextStyle: { 
                color: ClinicalColors.textSecondary, 
                fontSize: 9,
                fontFamily: 'monospace'
            }
        })) ?? [];

        // Análisis de variabilidad (últimos 10 puntos)
        const variabilityData = sensorData.pressurePercent?.slice(-10).map((value, index, array) => {
            const prevValue = index > 0 ? array[index - 1] : value;
            const variation = Math.abs(value - prevValue);
            return {
                value: variation,
                label: `V${index + 1}`,
                frontColor: variation > 15 ? ClinicalColors.crisis : 
                           variation > 8 ? ClinicalColors.anxious : ClinicalColors.stable,
                labelTextStyle: { 
                    color: ClinicalColors.textSecondary, 
                    fontSize: 9
                }
            };
        }) ?? [];

        return { pressureData, movementData, rotationData, variabilityData };
    }, [hasData, sensorData]);

    if (!hasData && !isConnected) {
        return (
            <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
                <View style={styles.headerSection}>
                    <Text style={styles.mainTitle}>Sistema de Monitoreo Clínico</Text>
                    <Text style={styles.subtitle}>Análisis Comportamental para Trastorno del Espectro Autista</Text>
                    <View style={styles.institutionBadge}>
                        <Text style={styles.institutionText}>DEPARTAMENTO DE NEUROLOGÍA PEDIÁTRICA</Text>
                    </View>
                </View>
                
                <View style={styles.loadingContainer}>
                    <View style={styles.loadingCard}>
                        <ActivityIndicator size="large" color={ClinicalColors.primary} />
                        <Text style={styles.loadingText}>Iniciando conexión con dispositivo médico</Text>
                        <View style={styles.loadingSteps}>
                            <Text style={styles.loadingStep}>• Verificando protocolos de comunicación</Text>
                            <Text style={styles.loadingStep}>• Estableciendo canal seguro de datos</Text>
                            <Text style={styles.loadingStep}>• Calibrando sensores terapéuticos</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        );
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            {/* Header Profesional */}
            <View style={styles.headerSection}>
                <Text style={styles.mainTitle}>Sistema de Monitoreo Clínico</Text>
                <Text style={styles.subtitle}>Análisis Comportamental para Trastorno del Espectro Autista</Text>
                <View style={styles.institutionBadge}>
                    <Text style={styles.institutionText}>DEPARTAMENTO DE NEUROLOGÍA PEDIÁTRICA</Text>
                </View>
            </View>
            
            {/* Panel de Estado del Sistema */}
            <View style={styles.systemStatusPanel}>
                <View style={styles.statusHeader}>
                    <Text style={styles.statusTitle}>Estado del Sistema</Text>
                    <View style={[styles.statusIndicator, { 
                        backgroundColor: isConnected ? ClinicalColors.stable : ClinicalColors.crisis 
                    }]} />
                </View>
                <View style={styles.statusGrid}>
                    <View style={styles.statusItem}>
                        <Text style={styles.statusLabel}>Conexión</Text>
                        <Text style={[styles.statusValue, { 
                            color: isConnected ? ClinicalColors.stable : ClinicalColors.crisis 
                        }]}>
                            {isConnected ? 'ACTIVA' : 'DESCONECTADA'}
                        </Text>
                    </View>
                    <View style={styles.statusItem}>
                        <Text style={styles.statusLabel}>Muestras</Text>
                        <Text style={styles.statusValue}>
                            {sensorData.pressurePercent?.length ?? 0}
                        </Text>
                    </View>
                    <View style={styles.statusItem}>
                        <Text style={styles.statusLabel}>Frecuencia</Text>
                        <Text style={styles.statusValue}>10 Hz</Text>
                    </View>
                    <View style={styles.statusItem}>
                        <Text style={styles.statusLabel}>Batería</Text>
                        <Text style={[styles.statusValue, { 
                            color: getBatteryColor(sensorData.battery?.at(-1) ?? 0) 
                        }]}>
                            {sensorData.battery?.at(-1)?.toFixed(0) ?? 0}%
                        </Text>
                    </View>
                </View>
            </View>

            {hasData && clinicalAnalysis && chartData && (
                <>
                    {/* Panel de Diagnóstico Instantáneo */}
                    <View style={styles.diagnosticPanel}>
                        <Text style={styles.panelTitle}>Evaluación Clínica Actual</Text>
                        <View style={styles.diagnosticGrid}>
                            <View style={styles.diagnosticCard}>
                                <View style={styles.diagnosticHeader}>
                                    <View style={[styles.diagnosticIndicator, { 
                                        backgroundColor: clinicalAnalysis.pressure.color 
                                    }]} />
                                    <Text style={styles.diagnosticTitle}>PRESIÓN TÁCTIL</Text>
                                </View>
                                <Text style={styles.diagnosticValue}>
                                    {(sensorData.pressurePercent?.at(-1) ?? 0).toFixed(1)}%
                                </Text>
                                <Text style={styles.diagnosticState}>{clinicalAnalysis.pressure.label}</Text>
                                <Text style={styles.diagnosticAverage}>
                                    Promedio: {clinicalAnalysis.averages.pressure.toFixed(1)}%
                                </Text>
                            </View>
                            
                            <View style={styles.diagnosticCard}>
                                <View style={styles.diagnosticHeader}>
                                    <View style={[styles.diagnosticIndicator, { 
                                        backgroundColor: clinicalAnalysis.movement.color 
                                    }]} />
                                    <Text style={styles.diagnosticTitle}>ACTIVIDAD MOTORA</Text>
                                </View>
                                <Text style={styles.diagnosticValue}>
                                    {Math.sqrt(
                                        Math.pow(sensorData.accelX?.at(-1) ?? 0, 2) +
                                        Math.pow(sensorData.accelY?.at(-1) ?? 0, 2) +
                                        Math.pow(sensorData.accelZ?.at(-1) ?? 0, 2)
                                    ).toFixed(2)}G
                                </Text>
                                <Text style={styles.diagnosticState}>{clinicalAnalysis.movement.label}</Text>
                                <Text style={styles.diagnosticAverage}>
                                    Promedio: {clinicalAnalysis.averages.movement.toFixed(2)}G
                                </Text>
                            </View>
                            
                            <View style={styles.diagnosticCard}>
                                <View style={styles.diagnosticHeader}>
                                    <View style={[styles.diagnosticIndicator, { 
                                        backgroundColor: clinicalAnalysis.rotation.color 
                                    }]} />
                                    <Text style={styles.diagnosticTitle}>PATRÓN ROTACIONAL</Text>
                                </View>
                                <Text style={styles.diagnosticValue}>
                                    {Math.abs(sensorData.gyroX?.at(-1) ?? 0).toFixed(2)}
                                </Text>
                                <Text style={styles.diagnosticState}>{clinicalAnalysis.rotation.label}</Text>
                                <Text style={styles.diagnosticAverage}>
                                    rad/s - Giroscopio X
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Gráfico de Presión Táctil Avanzado */}
                    <ClinicalInfoCard
                        title="Análisis de Presión Táctil - Patrón Sensorial"
                        description="Monitoreo continuo de la intensidad del contacto físico. Valores elevados pueden indicar búsqueda sensorial intensa o episodios de desregulación emocional."
                        clinicalValue={clinicalAnalysis.pressure}
                    >
                        <View style={styles.chartMetrics}>
                            <View style={styles.metricItem}>
                                <Text style={styles.metricLabel}>Actual</Text>
                                <Text style={[styles.metricValue, { color: clinicalAnalysis.pressure.color }]}>
                                    {(sensorData.pressurePercent?.at(-1) ?? 0).toFixed(1)}%
                                </Text>
                            </View>
                            <View style={styles.metricItem}>
                                <Text style={styles.metricLabel}>Máximo</Text>
                                <Text style={styles.metricValue}>
                                    {Math.max(...(sensorData.pressurePercent?.slice(-20) ?? [0])).toFixed(1)}%
                                </Text>
                            </View>
                            <View style={styles.metricItem}>
                                <Text style={styles.metricLabel}>Promedio</Text>
                                <Text style={styles.metricValue}>
                                    {clinicalAnalysis.averages.pressure.toFixed(1)}%
                                </Text>
                            </View>
                        </View>

                        <View style={styles.clinicalScale}>
                            <View style={styles.scaleRow}>
                                <View style={[styles.scaleIndicator, { backgroundColor: ClinicalColors.stable }]} />
                                <Text style={styles.scaleText}>0-60%: Rango Normal - Contacto terapéutico estable</Text>
                            </View>
                            <View style={styles.scaleRow}>
                                <View style={[styles.scaleIndicator, { backgroundColor: ClinicalColors.anxious }]} />
                                <Text style={styles.scaleText}>61-87%: Alerta - Posible ansiedad o búsqueda sensorial</Text>
                            </View>
                            <View style={styles.scaleRow}>
                                <View style={[styles.scaleIndicator, { backgroundColor: ClinicalColors.crisis }]} />
                                <Text style={styles.scaleText}>88-100%: Crítico - Intervención inmediata requerida</Text>
                            </View>
                        </View>

                        {chartData.pressureData.length > 0 && (
                            <View style={styles.chartContainer}>
                                <Text style={styles.chartTitle}>Tendencia Temporal (últimos 20 puntos)</Text>
                                <BarChart
                                    data={chartData.pressureData}
                                    width={screenWidth - 60}
                                    height={160}
                                    barWidth={14}
                                    spacing={4}
                                    roundedTop
                                    roundedBottom
                                    yAxisThickness={1}
                                    xAxisThickness={1}
                                    xAxisColor={ClinicalColors.cardBorder}
                                    yAxisColor={ClinicalColors.cardBorder}
                                    yAxisTextStyle={{ 
                                        color: ClinicalColors.textSecondary, 
                                        fontSize: 10, 
                                        fontFamily: 'monospace' 
                                    }}
                                    noOfSections={5}
                                    maxValue={100}
                                    isAnimated
                                    animationDuration={1000}
                                    showLine
                                    lineColor={ClinicalColors.anxious}
                                    lineThickness={1.5}
                                    hideDataPoints={false}
                                    rulesColor={ClinicalColors.cardBorder}
                                    rulesType="solid"
                                    showRules
                                />
                                <View style={styles.chartLegend}>
                                    <Text style={styles.legendText}>
                                        Línea roja: Umbral de alerta (60%) | Barras coloreadas por estado clínico
                                    </Text>
                                </View>
                            </View>
                        )}
                    </ClinicalInfoCard>

                    {/* Gráfico de Actividad Motora */}
                    <ClinicalInfoCard
                        title="Análisis de Actividad Motora - Vector Tri-dimensional"
                        description="Medición de la magnitud del movimiento corporal en los tres ejes espaciales. Esencial para detectar patrones de estimming y evaluar el nivel de activación motora."
                        clinicalValue={clinicalAnalysis.movement}
                    >
                        <View style={styles.motionAnalysis}>
                            <View style={styles.axesData}>
                                <View style={styles.axisItem}>
                                    <Text style={styles.axisLabel}>Eje X</Text>
                                    <Text style={styles.axisValue}>
                                        {(sensorData.accelX?.at(-1) ?? 0).toFixed(3)}G
                                    </Text>
                                </View>
                                <View style={styles.axisItem}>
                                    <Text style={styles.axisLabel}>Eje Y</Text>
                                    <Text style={styles.axisValue}>
                                        {(sensorData.accelY?.at(-1) ?? 0).toFixed(3)}G
                                    </Text>
                                </View>
                                <View style={styles.axisItem}>
                                    <Text style={styles.axisLabel}>Eje Z</Text>
                                    <Text style={styles.axisValue}>
                                        {(sensorData.accelZ?.at(-1) ?? 0).toFixed(3)}G
                                    </Text>
                                </View>
                            </View>
                            
                            <View style={styles.magnitudeDisplay}>
                                <Text style={styles.magnitudeLabel}>Magnitud Vectorial</Text>
                                <Text style={[styles.magnitudeValue, { color: clinicalAnalysis.movement.color }]}>
                                    {Math.sqrt(
                                        Math.pow(sensorData.accelX?.at(-1) ?? 0, 2) +
                                        Math.pow(sensorData.accelY?.at(-1) ?? 0, 2) +
                                        Math.pow(sensorData.accelZ?.at(-1) ?? 0, 2)
                                    ).toFixed(3)} G
                                </Text>
                            </View>
                        </View>

                        {chartData.movementData.length > 0 && (
                            <View style={styles.chartContainer}>
                                <Text style={styles.chartTitle}>Historial de Actividad (últimos 15 minutos)</Text>
                                <BarChart
                                    data={chartData.movementData}
                                    width={screenWidth - 60}
                                    height={150}
                                    barWidth={18}
                                    spacing={5}
                                    roundedTop
                                    roundedBottom
                                    showGradient
                                    yAxisThickness={1}
                                    xAxisThickness={1}
                                    xAxisColor={ClinicalColors.cardBorder}
                                    yAxisColor={ClinicalColors.cardBorder}
                                    yAxisTextStyle={{ 
                                        color: ClinicalColors.textSecondary, 
                                        fontSize: 10,
                                        fontFamily: 'monospace'
                                    }}
                                    noOfSections={4}
                                    isAnimated
                                    animationDuration={800}
                                    rulesColor={ClinicalColors.cardBorder}
                                    showRules
                                />
                            </View>
                        )}
                    </ClinicalInfoCard>

                    {/* Análisis de Variabilidad */}
                    <ClinicalInfoCard
                        title="Análisis de Variabilidad Comportamental"
                        description="Evaluación de la consistencia en los patrones sensoriales. Alta variabilidad puede indicar desregulación o transiciones entre estados emocionales."
                        clinicalValue={clinicalAnalysis.pressure}
                    >
                        {chartData.variabilityData.length > 0 && (
                            <View style={styles.chartContainer}>
                                <Text style={styles.chartTitle}>Variabilidad de Presión (últimos 10 puntos)</Text>
                                <BarChart
                                    data={chartData.variabilityData}
                                    width={screenWidth - 60}
                                    height={140}
                                    barWidth={22}
                                    spacing={8}
                                    roundedTop
                                    roundedBottom
                                    yAxisThickness={1}
                                    xAxisThickness={1}
                                    xAxisColor={ClinicalColors.cardBorder}
                                    yAxisColor={ClinicalColors.cardBorder}
                                    yAxisTextStyle={{ 
                                        color: ClinicalColors.textSecondary, 
                                        fontSize: 10 
                                    }}
                                    noOfSections={3}
                                    isAnimated
                                    animationDuration={600}
                                    showRules
                                    rulesColor={ClinicalColors.cardBorder}
                                />
                                <View style={styles.variabilityLegend}>
                                    <Text style={styles.legendText}>
                                        Verde: Estable | Amarillo: Moderada | Rojo: Alta variabilidad
                                    </Text>
                                </View>
                            </View>
                        )}
                    </ClinicalInfoCard>

                    {/* Gráfico de Rotación con Análisis Temporal */}
                    <ClinicalInfoCard
                        title="Análisis de Patrones Rotacionales - Detección de Stimming"
                        description="Monitoreo de movimientos rotacionales que pueden indicar comportamientos de autoestimulación. Fundamental para evaluar estrategias de autorregulación."
                        clinicalValue={clinicalAnalysis.rotation}
                    >
                        <View style={styles.rotationAnalysis}>
                            <RotatingTeddyBear 
                                rotationValue={sensorData.gyroX?.at(-1) ?? 0}
                                isAnimating={Math.abs(sensorData.gyroX?.at(-1) ?? 0) > 0.3}
                            />
                            <View style={styles.rotationMetrics}>
                                <View style={styles.rotationMetric}>
                                    <Text style={styles.rotationLabel}>Velocidad Angular</Text>
                                    <Text style={[styles.rotationValue, { color: clinicalAnalysis.rotation.color }]}>
                                        {Math.abs(sensorData.gyroX?.at(-1) ?? 0).toFixed(3)} rad/s
                                    </Text>
                                </View>
                                <View style={styles.rotationMetric}>
                                    <Text style={styles.rotationLabel}>Estado Actual</Text>
                                    <Text style={[styles.rotationState, { color: clinicalAnalysis.rotation.color }]}>
                                        {clinicalAnalysis.rotation.label}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        {chartData.rotationData.length > 0 && (
                            <View style={styles.chartContainer}>
                                <Text style={styles.chartTitle}>Evolución Temporal de Rotación</Text>
                                <LineChart
                                    data={chartData.rotationData}
                                    width={screenWidth - 60}
                                    height={140}
                                    color={ClinicalColors.primary}
                                    thickness={2}
                                    yAxisThickness={1}
                                    xAxisThickness={1}
                                    xAxisColor={ClinicalColors.cardBorder}
                                    yAxisColor={ClinicalColors.cardBorder}
                                    yAxisTextStyle={{ 
                                        color: ClinicalColors.textSecondary, 
                                        fontSize: 10,
                                        fontFamily: 'monospace'
                                    }}
                                    isAnimated
                                    curved
                                    showDataPoints
                                    dataPointsColor={ClinicalColors.secondary}
                                    dataPointsRadius={3}
                                    focusEnabled
                                    showStripOnFocus
                                    stripColor={ClinicalColors.anxious}
                                    stripOpacity={0.2}
                                    areaChart
                                    startFillColor={ClinicalColors.primary}
                                    endFillColor={ClinicalColors.white}
                                    startOpacity={0.2}
                                    endOpacity={0.02}
                                    rulesColor={ClinicalColors.cardBorder}
                                    showRules
                                />
                            </View>
                        )}
                    </ClinicalInfoCard>

                    {/* Resumen Clínico Profesional */}
                    <View style={styles.clinicalSummary}>
                        <Text style={styles.summaryTitle}>Informe de Sesión Terapéutica</Text>
                        <Text style={styles.sessionId}>ID Sesión: TEA-{Date.now().toString().slice(-6)}</Text>
                        
                        <View style={styles.summaryMetrics}>
                            <View style={styles.summaryRow}>
                                <View style={styles.summaryItem}>
                                    <Text style={styles.summaryLabel}>Episodios de Presión Elevada</Text>
                                    <Text style={styles.summaryValue}>
                                        {sensorData.pressurePercent?.filter(p => p > 60).length ?? 0}
                                    </Text>
                                    <Text style={styles.summaryUnit}>eventos registrados</Text>
                                </View>
                                <View style={styles.summaryItem}>
                                    <Text style={styles.summaryLabel}>Picos de Actividad Motora</Text>
                                    <Text style={styles.summaryValue}>
                                        {sensorData.accelX?.filter(a => Math.abs(a) > 0.5).length ?? 0}
                                    </Text>
                                    <Text style={styles.summaryUnit}>eventos significativos</Text>
                                </View>
                            </View>
                            <View style={styles.summaryRow}>
                                <View style={styles.summaryItem}>
                                    <Text style={styles.summaryLabel}>Patrones de Autoestimulación</Text>
                                    <Text style={styles.summaryValue}>
                                        {sensorData.gyroX?.filter(g => Math.abs(g) > 0.3).length ?? 0}
                                    </Text>
                                    <Text style={styles.summaryUnit}>episodios detectados</Text>
                                </View>
                                <View style={styles.summaryItem}>
                                    <Text style={styles.summaryLabel}>Duración de Sesión</Text>
                                    <Text style={styles.summaryValue}>
                                        {Math.floor((sensorData.pressurePercent?.length ?? 0) / 10)}
                                    </Text>
                                    <Text style={styles.summaryUnit}>minutos aprox.</Text>
                                </View>
                            </View>
                        </View>
                        
                        {/* Recomendaciones Clínicas */}
                        <View style={styles.recommendationsSection}>
                            <Text style={styles.recommendationsTitle}>Recomendaciones Terapéuticas</Text>
                            <View style={styles.recommendationCard}>
                                <Text style={styles.recommendationText}>
                                    {getTherapeuticRecommendation(clinicalAnalysis)}
                                </Text>
                            </View>
                            <View style={styles.clinicalNotes}>
                                <Text style={styles.notesTitle}>Observaciones Clínicas:</Text>
                                <Text style={styles.notesText}>
                                    • Monitorear patrones de presión para identificar triggers sensoriales
                                </Text>
                                <Text style={styles.notesText}>
                                    • Evaluar efectividad de estrategias de autorregulación implementadas
                                </Text>
                                <Text style={styles.notesText}>
                                    • Considerar ajustes en el entorno terapéutico según datos de actividad motora
                                </Text>
                            </View>
                        </View>
                    </View>
                </>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    contentContainer: {
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 40,
    },
    headerSection: {
        backgroundColor: ClinicalColors.white,
        borderRadius: 12,
        padding: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 3,
        borderLeftWidth: 4,
        borderLeftColor: ClinicalColors.primary,
    },
    mainTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: ClinicalColors.textPrimary,
        textAlign: 'center',
        marginBottom: 6,
        letterSpacing: 0.5,
    },
    subtitle: {
        fontSize: 14,
        color: ClinicalColors.textSecondary,
        textAlign: 'center',
        marginBottom: 12,
        fontWeight: '500',
    },
    institutionBadge: {
        backgroundColor: ClinicalColors.primary,
        borderRadius: 6,
        paddingVertical: 6,
        paddingHorizontal: 12,
        alignSelf: 'center',
    },
    institutionText: {
        color: ClinicalColors.white,
        fontSize: 11,
        fontWeight: '600',
        letterSpacing: 1.2,
    },
    systemStatusPanel: {
        backgroundColor: ClinicalColors.white,
        borderRadius: 12,
        padding: 18,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    statusHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    statusTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: ClinicalColors.textPrimary,
    },
    statusIndicator: {
        width: 12,
        height: 12,
        borderRadius: 6,
    },
    statusGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    statusItem: {
        alignItems: 'center',
        flex: 1,
    },
    statusLabel: {
        fontSize: 11,
        color: ClinicalColors.textSecondary,
        marginBottom: 4,
        fontWeight: '500',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    statusValue: {
        fontSize: 14,
        fontWeight: '700',
        color: ClinicalColors.textPrimary,
        fontFamily: 'monospace',
    },
    diagnosticPanel: {
        backgroundColor: ClinicalColors.white,
        borderRadius: 12,
        padding: 18,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    panelTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: ClinicalColors.textPrimary,
        textAlign: 'center',
        marginBottom: 20,
        textTransform: 'uppercase',
        letterSpacing: 0.8,
    },
    diagnosticGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
    },
    diagnosticCard: {
        flex: 1,
        backgroundColor: '#f8fafc',
        borderRadius: 10,
        padding: 14,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    diagnosticHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    diagnosticIndicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 6,
    },
    diagnosticTitle: {
        fontSize: 10,
        fontWeight: '700',
        color: ClinicalColors.textSecondary,
        textAlign: 'center',
        letterSpacing: 0.5,
    },
    diagnosticValue: {
        fontSize: 20,
        fontWeight: '800',
        color: ClinicalColors.primary,
        marginBottom: 4,
        fontFamily: 'monospace',
    },
    diagnosticState: {
        fontSize: 12,
        fontWeight: '600',
        color: ClinicalColors.textPrimary,
        marginBottom: 4,
    },
    diagnosticAverage: {
        fontSize: 10,
        color: ClinicalColors.textSecondary,
        textAlign: 'center',
    },
    chartMetrics: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#f8fafc',
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    metricItem: {
        alignItems: 'center',
    },
    metricLabel: {
        fontSize: 11,
        color: ClinicalColors.textSecondary,
        marginBottom: 4,
        fontWeight: '500',
        textTransform: 'uppercase',
    },
    metricValue: {
        fontSize: 16,
        fontWeight: '700',
        color: ClinicalColors.textPrimary,
        fontFamily: 'monospace',
    },
    clinicalScale: {
        backgroundColor: '#f1f5f9',
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    scaleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    scaleIndicator: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginRight: 8,
    },
    scaleText: {
        fontSize: 11,
        color: ClinicalColors.textSecondary,
        flex: 1,
        fontWeight: '500',
    },
    chartContainer: {
        marginTop: 8,
    },
    chartTitle: {
        fontSize: 13,
        fontWeight: '600',
        color: ClinicalColors.textPrimary,
        marginBottom: 12,
        textAlign: 'center',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    chartLegend: {
        marginTop: 8,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: '#e2e8f0',
    },
    legendText: {
        fontSize: 10,
        color: ClinicalColors.textSecondary,
        textAlign: 'center',
        fontStyle: 'italic',
    },
    motionAnalysis: {
        marginBottom: 16,
    },
    axesData: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#f8fafc',
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    axisItem: {
        alignItems: 'center',
    },
    axisLabel: {
        fontSize: 11,
        color: ClinicalColors.textSecondary,
        marginBottom: 4,
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    axisValue: {
        fontSize: 14,
        fontWeight: '700',
        color: ClinicalColors.textPrimary,
        fontFamily: 'monospace',
    },
    magnitudeDisplay: {
        alignItems: 'center',
        backgroundColor: '#f1f5f9',
        borderRadius: 8,
        padding: 12,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    magnitudeLabel: {
        fontSize: 12,
        color: ClinicalColors.textSecondary,
        marginBottom: 6,
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    magnitudeValue: {
        fontSize: 18,
        fontWeight: '800',
        fontFamily: 'monospace',
    },
    variabilityLegend: {
        marginTop: 8,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: '#e2e8f0',
    },
    rotationAnalysis: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        padding: 16,
        backgroundColor: '#f8fafc',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    rotationMetrics: {
        marginLeft: 20,
        alignItems: 'center',
    },
    rotationMetric: {
        alignItems: 'center',
        marginBottom: 8,
    },
    rotationLabel: {
        fontSize: 11,
        color: ClinicalColors.textSecondary,
        marginBottom: 4,
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    rotationValue: {
        fontSize: 16,
        fontWeight: '800',
        fontFamily: 'monospace',
    },
    rotationState: {
        fontSize: 14,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    clinicalSummary: {
        backgroundColor: ClinicalColors.white,
        borderRadius: 12,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 8,
        elevation: 6,
        borderWidth: 2,
        borderColor: ClinicalColors.primary,
    },
    summaryTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: ClinicalColors.textPrimary,
        textAlign: 'center',
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    sessionId: {
        fontSize: 12,
        color: ClinicalColors.textSecondary,
        textAlign: 'center',
        marginBottom: 20,
        fontFamily: 'monospace',
        backgroundColor: '#f1f5f9',
        padding: 6,
        borderRadius: 4,
        alignSelf: 'center',
    },
    summaryMetrics: {
        marginBottom: 20,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    summaryItem: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#f8fafc',
        borderRadius: 8,
        padding: 12,
        marginHorizontal: 4,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    summaryLabel: {
        fontSize: 10,
        color: ClinicalColors.textSecondary,
        textAlign: 'center',
        marginBottom: 8,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    summaryValue: {
        fontSize: 24,
        fontWeight: '800',
        color: ClinicalColors.primary,
        marginBottom: 4,
        fontFamily: 'monospace',
    },
    summaryUnit: {
        fontSize: 10,
        color: ClinicalColors.textSecondary,
        textAlign: 'center',
        fontWeight: '500',
    },
    recommendationsSection: {
        borderTopWidth: 2,
        borderTopColor: '#e2e8f0',
        paddingTop: 20,
    },
    recommendationsTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: ClinicalColors.textPrimary,
        marginBottom: 12,
        textTransform: 'uppercase',
        letterSpacing: 0.8,
    },
    recommendationCard: {
        backgroundColor: '#f0f9ff',
        borderRadius: 8,
        padding: 14,
        marginBottom: 16,
        borderLeftWidth: 4,
        borderLeftColor: ClinicalColors.secondary,
        borderWidth: 1,
        borderColor: '#e0f2fe',
    },
    recommendationText: {
        fontSize: 13,
        color: ClinicalColors.textPrimary,
        lineHeight: 20,
        fontWeight: '500',
    },
    clinicalNotes: {
        backgroundColor: '#fffbeb',
        borderRadius: 8,
        padding: 14,
        borderLeftWidth: 4,
        borderLeftColor: '#f59e0b',
        borderWidth: 1,
        borderColor: '#fef3c7',
    },
    notesTitle: {
        fontSize: 13,
        fontWeight: '700',
        color: ClinicalColors.textPrimary,
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    notesText: {
        fontSize: 12,
        color: ClinicalColors.textSecondary,
        lineHeight: 18,
        marginBottom: 4,
        fontWeight: '500',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40,
        marginBottom: 40,
    },
    loadingCard: {
        backgroundColor: ClinicalColors.white,
        borderRadius: 16,
        padding: 30,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 6,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        width: '90%',
        maxWidth: 350,
    },
    loadingText: {
        marginTop: 20,
        fontSize: 16,
        fontWeight: '600',
        color: ClinicalColors.textPrimary,
        textAlign: 'center',
        marginBottom: 16,
    },
    loadingSteps: {
        alignSelf: 'stretch',
    },
    loadingStep: {
        fontSize: 12,
        color: ClinicalColors.textSecondary,
        marginBottom: 6,
        fontWeight: '500',
        paddingLeft: 8,
    },
});

export default RealTimeCharts;