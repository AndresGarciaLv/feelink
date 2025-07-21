import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions, ActivityIndicator, ScrollView } from 'react-native';
import { LineChart, BarChart } from "react-native-gifted-charts";
import Svg, { Path, Circle, G } from 'react-native-svg';
import { useSensorSocket } from '../../hooks/useSensorSocket';

// Colores específicos para estados clínicos
const ClinicalColors = {
    stable: '#4CAF50',      // Verde - Estado estable
    anxious: '#FF9800',     // Naranja - Estado ansioso  
    crisis: '#F44336',      // Rojo - Estado de crisis
    primary: '#2196F3',     // Azul primario
    secondary: '#00BCD4',   // Cian
    white: '#FFFFFF',
    textPrimary: '#212121',
    textSecondary: '#757575',
    cardBorder: '#E0E0E0',
    warning: '#FFC107',
};

const { width: screenWidth } = Dimensions.get('window');

// Componente SVG animado para rotación del peluche
const RotatingTeddyBear = ({ rotationValue, isAnimating }) => {
    const rotation = Math.abs(rotationValue) * 10; // Escala la rotación
    
    return (
        <View style={styles.svgContainer}>
            <Svg 
                width={60} 
                height={60} 
                viewBox="0 0 24 24"
                style={{ 
                    transform: [{ rotate: `${rotation}deg` }],
                    opacity: isAnimating ? 1 : 0.7
                }}
            >
                <Path 
                    fill={ClinicalColors.secondary}
                    stroke={ClinicalColors.primary}
                    strokeWidth="0.5"
                    d="M15.75 19.13c-.83 0-1.5-.84-1.5-1.88c0-1.03.67-1.87 1.5-1.87s1.5.84 1.5 1.87c0 1.04-.67 1.88-1.5 1.88M12 11.25c-1.24 0-2.25-.84-2.25-1.87c0-1.04 1.01-1.88 2.25-1.88s2.25.84 2.25 1.88c0 1.03-1.01 1.87-2.25 1.87m-3.75 7.88c-.83 0-1.5-.84-1.5-1.88c0-1.03.67-1.87 1.5-1.87s1.5.84 1.5 1.87c0 1.04-.67 1.88-1.5 1.88M12 8.25c.41 0 .75.34.75.75s-.34.75-.75.75s-.75-.34-.75-.75s.34-.75.75-.75M18.75 12c-.32 0-.63.07-.91.2c-.48-.61-1.13-1.13-1.91-1.53c.57-.8.91-1.77.91-2.82v-.06c1.09-.23 1.91-1.2 1.91-2.37c0-1.33-1.09-2.42-2.42-2.42c-.69 0-1.33.29-1.75.75a4.81 4.81 0 0 0-5.16 0C9 3.29 8.36 3 7.67 3C6.34 3 5.25 4.09 5.25 5.42c0 1.16.82 2.13 1.9 2.37v.06c0 1.05.35 2.03.91 2.82c-.77.4-1.42.92-1.9 1.53A2.24 2.24 0 0 0 3 14.25c0 1.25 1 2.25 2.25 2.25h.06c-.04.24-.06.5-.06.75c0 2.07 1.34 3.75 3 3.75c1.01 0 1.9-.63 2.45-1.59c.42.06.85.09 1.3.09s.88-.03 1.3-.09c.55.96 1.44 1.59 2.45 1.59c1.66 0 3-1.68 3-3.75c0-.25-.02-.51-.06-.75h.06c1.25 0 2.25-1 2.25-2.25S20 12 18.75 12"
                />
                {/* Indicador de movimiento - círculos pulsantes */}
                {isAnimating && (
                    <G>
                        <Circle cx="12" cy="12" r="1" fill={ClinicalColors.warning} opacity="0.6" />
                        <Circle cx="12" cy="12" r="2" fill="none" stroke={ClinicalColors.warning} strokeWidth="0.5" opacity="0.4" />
                    </G>
                )}
            </Svg>
        </View>
    );
};

// Función para determinar el estado clínico basado en presión
const getPressureState = (pressure) => {
    if (pressure >= 0 && pressure <= 60) {
        return { state: 'stable', label: 'Estable', color: ClinicalColors.stable };
    } else if (pressure > 60 && pressure <= 87) {
        return { state: 'anxious', label: 'Ansioso', color: ClinicalColors.anxious };
    } else {
        return { state: 'crisis', label: 'Crisis', color: ClinicalColors.crisis };
    }
};

// Función para determinar el estado de movimiento
const getMovementState = (accelValue) => {
    const magnitude = Math.abs(accelValue);
    if (magnitude <= 0.3) {
        return { state: 'stable', label: 'Calmo', color: ClinicalColors.stable };
    } else if (magnitude <= 0.8) {
        return { state: 'anxious', label: 'Inquieto', color: ClinicalColors.anxious };
    } else {
        return { state: 'crisis', label: 'Agitado', color: ClinicalColors.crisis };
    }
};

// Componente de información clínica
const ClinicalInfoCard = ({ title, description, clinicalValue, children }) => (
    <View style={styles.clinicalCard}>
        <View style={styles.clinicalHeader}>
            <Text style={styles.clinicalTitle}>{title}</Text>
            <View style={[styles.statusBadge, { backgroundColor: clinicalValue.color }]}>
                <Text style={styles.statusBadgeText}>{clinicalValue.label}</Text>
            </View>
        </View>
        <Text style={styles.clinicalDescription}>{description}</Text>
        <View style={styles.clinicalContent}>
            {children}
        </View>
        <View style={styles.clinicalInterpretation}>
            <Text style={styles.interpretationTitle}>Interpretación Clínica:</Text>
            <Text style={styles.interpretationText}>
                {getInterpretationText(title, clinicalValue.state)}
            </Text>
        </View>
    </View>
);

// Función para obtener interpretación clínica
const getInterpretationText = (chartType, state) => {
    const interpretations = {
        'Monitoreo de Presión Táctil': {
            stable: 'El niño muestra un nivel de contacto físico normal y calmado. Indica regulación emocional adecuada.',
            anxious: 'Se observa incremento en la necesidad de estimulación táctil, sugiriendo posible estado de ansiedad leve.',
            crisis: 'Presión táctil intensa indica posible estado de crisis sensorial o emocional. Requiere intervención inmediata.'
        },
        'Análisis de Movimiento Corporal': {
            stable: 'Movimientos corporales dentro de rangos típicos, indicando estado de calma y autorregulación.',
            anxious: 'Incremento en la actividad motora, posiblemente relacionado con estimming o búsqueda sensorial.',
            crisis: 'Movimientos intensos o repetitivos que pueden indicar desregulación sensorial o crisis autística.'
        },
        'Patrón de Rotación y Estimming': {
            stable: 'Sin patrones rotacionales significativos, comportamiento motor típico.',
            anxious: 'Presencia de movimientos rotacionales que pueden indicar autoestimulación o procesamiento sensorial.',
            crisis: 'Rotaciones intensas características de episodios de desregulación o crisis autística.'
        }
    };
    
    return interpretations[chartType]?.[state] || 'Evaluando patrones de comportamiento...';
};

const RealTimeCharts = () => {
    const { sensorData, isConnected } = useSensorSocket();

    const hasData = sensorData.battery?.length > 0;

    // Memoización para optimizar rendimiento
    const clinicalAnalysis = useMemo(() => {
        if (!hasData) return null;

        const currentPressure = sensorData.pressurePercent?.at(-1) ?? 0;
        const currentAccelX = sensorData.accelX?.at(-1) ?? 0;
        const currentGyroX = sensorData.gyroX?.at(-1) ?? 0;

        return {
            pressure: getPressureState(currentPressure),
            movement: getMovementState(currentAccelX),
            rotation: Math.abs(currentGyroX) > 0.5 ? 
                { state: 'anxious', label: 'Activo', color: ClinicalColors.anxious } :
                { state: 'stable', label: 'Calmo', color: ClinicalColors.stable }
        };
    }, [hasData, sensorData]);

    // Datos preparados para gráficos
    const chartData = useMemo(() => {
        if (!hasData) return null;

        const pressureData = sensorData.pressurePercent?.slice(-20).map((value, index) => {
            const state = getPressureState(value);
            return {
                value: value,
                label: `${index + 1}`,
                frontColor: state.color,
                spacing: 6,
                labelTextStyle: { color: ClinicalColors.textSecondary, fontSize: 10 }
            };
        }) ?? [];

        const movementData = sensorData.accelX?.slice(-10).map((x, index) => {
            const y = sensorData.accelY?.[index] ?? 0;
            const z = sensorData.accelZ?.[index] ?? 0;
            const magnitude = Math.sqrt(x*x + y*y + z*z);
            const state = getMovementState(magnitude);
            
            return {
                value: magnitude,
                label: `${index + 1}`,
                frontColor: state.color,
                spacing: 8,
                labelTextStyle: { color: ClinicalColors.textSecondary, fontSize: 10 }
            };
        }) ?? [];

        const rotationData = sensorData.gyroX?.slice(-15).map((value, index) => ({
            value: Math.abs(value),
            label: `${index + 1}`,
            labelTextStyle: { color: ClinicalColors.textSecondary, fontSize: 10 }
        })) ?? [];

        return { pressureData, movementData, rotationData };
    }, [hasData, sensorData]);

    if (!hasData && !isConnected) {
        return (
            <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
                <Text style={styles.mainTitle}>Monitor Terapéutico TEA</Text>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={ClinicalColors.primary} />
                    <Text style={styles.loadingText}>Conectando con dispositivo terapéutico...</Text>
                    <Text style={styles.loadingSubtext}>
                        Estableciendo comunicación con el peluche sensorial
                    </Text>
                </View>
            </ScrollView>
        );
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <Text style={styles.mainTitle}>Monitor Terapéutico TEA</Text>
            <Text style={styles.subtitle}>Sistema de Monitoreo Sensorial para Niños con Autismo</Text>
            
            {/* Estado de Conexión */}
            <View style={[styles.connectionCard, { 
                backgroundColor: isConnected ? ClinicalColors.stable : ClinicalColors.crisis 
            }]}>
                <View style={styles.connectionContent}>
                    <Text style={styles.connectionIcon}>{isConnected ? '🟢' : '🔴'}</Text>
                    <View>
                        <Text style={styles.connectionStatus}>
                            {isConnected ? 'Sistema Activo' : 'Desconectado'}
                        </Text>
                        <Text style={styles.connectionSubtext}>
                            {isConnected ? 'Recopilando datos sensoriales' : 'Intentando reconectar...'}
                        </Text>
                    </View>
                </View>
            </View>

            {hasData && clinicalAnalysis && chartData && (
                <>
                    {/* Estado General del Paciente */}
                    <View style={styles.overviewCard}>
                        <Text style={styles.overviewTitle}>Estado Actual del Paciente</Text>
                        <View style={styles.overviewGrid}>
                            <View style={styles.overviewItem}>
                                <View style={[styles.overviewIndicator, { backgroundColor: clinicalAnalysis.pressure.color }]} />
                                <Text style={styles.overviewLabel}>Presión</Text>
                                <Text style={styles.overviewValue}>{clinicalAnalysis.pressure.label}</Text>
                            </View>
                            <View style={styles.overviewItem}>
                                <View style={[styles.overviewIndicator, { backgroundColor: clinicalAnalysis.movement.color }]} />
                                <Text style={styles.overviewLabel}>Movimiento</Text>
                                <Text style={styles.overviewValue}>{clinicalAnalysis.movement.label}</Text>
                            </View>
                            <View style={styles.overviewItem}>
                                <View style={[styles.overviewIndicator, { backgroundColor: clinicalAnalysis.rotation.color }]} />
                                <Text style={styles.overviewLabel}>Rotación</Text>
                                <Text style={styles.overviewValue}>{clinicalAnalysis.rotation.label}</Text>
                            </View>
                        </View>
                    </View>

                    {/* Gráfico de Presión Táctil */}
                    <ClinicalInfoCard
                        title="Monitoreo de Presión Táctil"
                        description="Mide la intensidad del contacto físico con el peluche terapéutico. Ayuda a identificar patrones de búsqueda sensorial y estados emocionales."
                        clinicalValue={clinicalAnalysis.pressure}
                    >
                        <View style={styles.currentValueContainer}>
                            <Text style={[styles.currentValue, { color: clinicalAnalysis.pressure.color }]}>
                                {(sensorData.pressurePercent?.at(-1) ?? 0).toFixed(1)}%
                            </Text>
                            <Text style={styles.currentLabel}>Presión Actual</Text>
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

                        {chartData.pressureData.length > 0 && (
                            <BarChart
                                data={chartData.pressureData}
                                width={screenWidth - 80}
                                height={140}
                                barWidth={18}
                                spacing={6}
                                roundedTop
                                roundedBottom
                                yAxisThickness={1}
                                xAxisThickness={1}
                                xAxisColor={ClinicalColors.cardBorder}
                                yAxisColor={ClinicalColors.cardBorder}
                                yAxisTextStyle={{ color: ClinicalColors.textSecondary }}
                                noOfSections={4}
                                maxValue={100}
                                isAnimated
                                animationDuration={1000}
                                showLine
                                lineColor={ClinicalColors.anxious}
                                lineThickness={2}
                                hideDataPoints={false}
                            />
                        )}
                    </ClinicalInfoCard>

                    {/* Gráfico de Movimiento Corporal */}
                    <ClinicalInfoCard
                        title="Análisis de Movimiento Corporal"
                        description="Registra la magnitud de movimientos tri-dimensionales. Esencial para detectar patrones de estimming y desregulación sensorial."
                        clinicalValue={clinicalAnalysis.movement}
                    >
                        <View style={styles.movementInfo}>
                            <Text style={styles.movementTitle}>Magnitud de Movimiento (G)</Text>
                            <Text style={[styles.movementValue, { color: clinicalAnalysis.movement.color }]}>
                                {Math.sqrt(
                                    Math.pow(sensorData.accelX?.at(-1) ?? 0, 2) +
                                    Math.pow(sensorData.accelY?.at(-1) ?? 0, 2) +
                                    Math.pow(sensorData.accelZ?.at(-1) ?? 0, 2)
                                ).toFixed(2)}
                            </Text>
                        </View>

                        {chartData.movementData.length > 0 && (
                            <BarChart
                                data={chartData.movementData}
                                width={screenWidth - 80}
                                height={130}
                                barWidth={22}
                                spacing={8}
                                roundedTop
                                roundedBottom
                                showGradient
                                yAxisThickness={1}
                                xAxisThickness={1}
                                xAxisColor={ClinicalColors.cardBorder}
                                yAxisColor={ClinicalColors.cardBorder}
                                yAxisTextStyle={{ color: ClinicalColors.textSecondary }}
                                noOfSections={3}
                                isAnimated
                                animationDuration={800}
                            />
                        )}
                    </ClinicalInfoCard>

                    {/* Gráfico de Rotación con SVG animado */}
                    <ClinicalInfoCard
                        title="Patrón de Rotación y Estimming"
                        description="Analiza movimientos rotacionales que pueden indicar comportamientos de autoestimulación típicos en TEA. Ayuda a identificar patrones de autorregulación."
                        clinicalValue={clinicalAnalysis.rotation}
                    >
                        <View style={styles.rotationHeader}>
                            <RotatingTeddyBear 
                                rotationValue={sensorData.gyroX?.at(-1) ?? 0}
                                isAnimating={Math.abs(sensorData.gyroX?.at(-1) ?? 0) > 0.3}
                            />
                            <View style={styles.rotationInfo}>
                                <Text style={styles.rotationLabel}>Velocidad Angular</Text>
                                <Text style={[styles.rotationValue, { color: clinicalAnalysis.rotation.color }]}>
                                    {Math.abs(sensorData.gyroX?.at(-1) ?? 0).toFixed(2)} rad/s
                                </Text>
                            </View>
                        </View>

                        {chartData.rotationData.length > 0 && (
                            <LineChart
                                data={chartData.rotationData}
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
                            />
                        )}
                    </ClinicalInfoCard>

                    {/* Resumen Diagnóstico */}
                    <View style={styles.diagnosticSummary}>
                        <Text style={styles.diagnosticTitle}>📊 Resumen de Sesión Terapéutica</Text>
                        <View style={styles.diagnosticGrid}>
                            <View style={styles.diagnosticItem}>
                                <Text style={styles.diagnosticLabel}>Episodios de Presión Alta</Text>
                                <Text style={styles.diagnosticNumber}>
                                    {sensorData.pressurePercent?.filter(p => p > 60).length ?? 0}
                                </Text>
                                <Text style={styles.diagnosticUnit}>eventos</Text>
                            </View>
                            <View style={styles.diagnosticItem}>
                                <Text style={styles.diagnosticLabel}>Movimientos Significativos</Text>
                                <Text style={styles.diagnosticNumber}>
                                    {sensorData.accelX?.filter(a => Math.abs(a) > 0.5).length ?? 0}
                                </Text>
                                <Text style={styles.diagnosticUnit}>eventos</Text>
                            </View>
                            <View style={styles.diagnosticItem}>
                                <Text style={styles.diagnosticLabel}>Patrones de Stimming</Text>
                                <Text style={styles.diagnosticNumber}>
                                    {sensorData.gyroX?.filter(g => Math.abs(g) > 0.3).length ?? 0}
                                </Text>
                                <Text style={styles.diagnosticUnit}>eventos</Text>
                            </View>
                        </View>
                        
                        {/* Recomendaciones */}
                        <View style={styles.recommendationsCard}>
                            <Text style={styles.recommendationsTitle}>💡 Recomendaciones Terapéuticas</Text>
                            <Text style={styles.recommendationText}>
                                {getTherapeuticRecommendation(clinicalAnalysis)}
                            </Text>
                        </View>
                    </View>

                    {/* Nivel de Batería */}
                    <View style={styles.batteryCard}>
                        <Text style={styles.batteryTitle}>🔋 Estado del Dispositivo</Text>
                        <View style={styles.batteryContainer}>
                            <Text style={styles.batteryPercentage}>
                                {(sensorData.battery?.at(-1) ?? 0).toFixed(0)}%
                            </Text>
                            <View style={styles.batteryBarContainer}>
                                <View 
                                    style={[
                                        styles.batteryBar,
                                        { 
                                            width: `${sensorData.battery?.at(-1) ?? 0}%`,
                                            backgroundColor: getBatteryColor(sensorData.battery?.at(-1) ?? 0)
                                        }
                                    ]}
                                />
                            </View>
                        </View>
                    </View>
                </>
            )}
        </ScrollView>
    );
};

// Función para obtener recomendaciones terapéuticas
const getTherapeuticRecommendation = (analysis) => {
    const { pressure, movement, rotation } = analysis;
    
    if (pressure.state === 'crisis' || movement.state === 'crisis') {
        return "Se detectan signos de crisis sensorial. Considere implementar estrategias de regulación inmediatas: ambiente calmado, reducir estímulos, ofrecer objetos sensoriales preferidos.";
    } else if (pressure.state === 'anxious' || movement.state === 'anxious') {
        return "El paciente muestra signos de ansiedad. Recomiende actividades de autorregulación: respiración profunda, presión profunda, actividades proprioceptivas.";
    } else {
        return "Estado estable observado. Continúe con las actividades terapéuticas actuales y mantenga el ambiente estructurado para promover la regulación.";
    }
};

// Función para color de batería
const getBatteryColor = (level) => {
    if (level > 60) return ClinicalColors.stable;
    if (level > 30) return ClinicalColors.anxious;
    return ClinicalColors.crisis;
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
    clinicalCard: {
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
        borderColor: ClinicalColors.cardBorder,
    },
    clinicalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    clinicalTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: ClinicalColors.textPrimary,
        flex: 1,
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    statusBadgeText: {
        color: ClinicalColors.white,
        fontSize: 12,
        fontWeight: '600',
    },
    clinicalDescription: {
        fontSize: 14,
        color: ClinicalColors.textSecondary,
        marginBottom: 16,
        lineHeight: 20,
    },
    clinicalContent: {
        marginBottom: 16,
    },
    clinicalInterpretation: {
        backgroundColor: ClinicalColors.background,
        borderRadius: 12,
        padding: 16,
        borderLeftWidth: 4,
        borderLeftColor: ClinicalColors.primary,
    },
    interpretationTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: ClinicalColors.textPrimary,
        marginBottom: 8,
    },
    interpretationText: {
        fontSize: 13,
        color: ClinicalColors.textSecondary,
        lineHeight: 18,
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
    movementInfo: {
        alignItems: 'center',
        marginBottom: 16,
    },
    movementTitle: {
        fontSize: 14,
        color: ClinicalColors.textSecondary,
        marginBottom: 8,
    },
    movementValue: {
        fontSize: 28,
        fontWeight: '700',
    },
    rotationHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    svgContainer: {
        marginRight: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    rotationInfo: {
        alignItems: 'center',
    },
    rotationLabel: {
        fontSize: 14,
        color: ClinicalColors.textSecondary,
        marginBottom: 4,
    },
    rotationValue: {
        fontSize: 24,
        fontWeight: '700',
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
        color: ClinicalColors.primary,
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
    batteryCard: {
        backgroundColor: ClinicalColors.white,
        borderRadius: 16,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        borderWidth: 1,
        borderColor: ClinicalColors.cardBorder,
    },
    batteryTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: ClinicalColors.textPrimary,
        textAlign: 'center',
        marginBottom: 16,
    },
    batteryContainer: {
        alignItems: 'center',
    },
    batteryPercentage: {
        fontSize: 32,
        fontWeight: '800',
        color: ClinicalColors.textPrimary,
        marginBottom: 12,
    },
    batteryBarContainer: {
        width: 200,
        height: 8,
        backgroundColor: ClinicalColors.background,
        borderRadius: 4,
        overflow: 'hidden',
    },
    batteryBar: {
        height: '100%',
        borderRadius: 4,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 60,
        marginBottom: 60,
    },
    loadingText: {
        marginTop: 20,
        fontSize: 18,
        fontWeight: '600',
        color: ClinicalColors.textPrimary,
        textAlign: 'center',
    },
    loadingSubtext: {
        marginTop: 8,
        fontSize: 14,
        color: ClinicalColors.textSecondary,
        textAlign: 'center',
    },
});

export default RealTimeCharts;