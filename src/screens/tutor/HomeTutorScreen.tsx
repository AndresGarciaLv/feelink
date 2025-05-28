import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image
} from 'react-native';
import HeaderProfile from '../../shared/components/profile/HeaderProfile';
import Navbar from '../../shared/navigation/Navbar';
import HeaderTutor from '../../shared/components/home-tutor/HeaderTutor';

// PALETA DE COLORES - Basada en el diseño de referencia
const Colors = {
    white: '#FFFFFF',
    textPrimary: '#2C3E50',
    textSecondary: '#7F8C8D',
    primary: '#3498DB',
    background: '#F8FAFC',
    cardBackground: '#FFFFFF',
    lightBlue: '#BFDDFB',
    timelineBackgroundPrimary: '#BFDDFB',
    timelineBackgroundSecundary: '#F3F6FB',
    // Colores para estados emocionales
    emotionGreen: '#4CAF50',
    emotionYellow: '#FFC107',
    emotionRed: '#F44336',
    // Colores adicionales para las cards
    cardShadow: 'rgba(0, 0, 0, 0.1)',
    borderLight: '#E5E5E5',
    bluePrimary: '#5DADE2',
    blueSecondary: '#AED6F1',
};

export default function HomeTutor() {
    // ESTADO - Control del mes seleccionado en la navegación mensual
    const [selectedMonth, setSelectedMonth] = useState('Abril');

    // DATOS MOCK - Información simulada para cada mes del año
    const monthlyData = {
        'Abril': {
            summary: {
                title: 'Estado emocional del último mes',
                date: 'Abril 2025',
                child: 'Álvaro Díaz',
                age: '3 Años',
                status: 'Normal',
                days: {
                    estable: 12,
                    ansioso: 8,
                    crisis: 8
                }
            },
            recommendations: [
                {
                    title: 'Jugar a imitar gestos frente al espejo',
                    icon: '🪞'
                },
                {
                    title: 'Leer un cuento con imágenes grandes',
                    icon: '📚'
                }
            ],
            dailyQuote: "Tu paciencia hoy es el camino a su confianza mañana."
        },
        'Marzo': {
            summary: {
                title: 'Estado emocional del último mes',
                date: 'Marzo 2025',
                child: 'Álvaro Díaz',
                age: '3 Años',
                status: 'Normal',
                days: {
                    estable: 15,
                    ansioso: 10,
                    crisis: 6
                }
            },
            recommendations: [
                {
                    title: 'Actividades sensoriales con texturas',
                    icon: '✋'
                },
                {
                    title: 'Música relajante durante las comidas',
                    icon: '🎵'
                }
            ],
            dailyQuote: "Cada pequeño paso es un gran logro."
        },
        'Febrero': {
            summary: {
                title: 'Estado emocional del último mes',
                date: 'Febrero 2025',
                child: 'Álvaro Díaz',
                age: '3 Años',
                status: 'Observación',
                days: {
                    estable: 8,
                    ansioso: 12,
                    crisis: 8
                }
            },
            recommendations: [
                {
                    title: 'Rutinas visuales con pictogramas',
                    icon: '📋'
                },
                {
                    title: 'Ejercicios de respiración juntos',
                    icon: '🫁'
                }
            ],
            dailyQuote: "La constancia es el secreto del progreso."
        },
        'Enero': {
            summary: {
                title: 'Estado emocional del último mes',
                date: 'Enero 2025',
                child: 'Álvaro Díaz',
                age: '3 Años',
                status: 'Normal',
                days: {
                    estable: 14,
                    ansioso: 9,
                    crisis: 8
                }
            },
            recommendations: [
                {
                    title: 'Juegos de construcción simples',
                    icon: '🧱'
                },
                {
                    title: 'Tiempo de juego estructurado',
                    icon: '⏰'
                }
            ],
            dailyQuote: "Celebra cada momento de conexión."
        }
    };

    // FUNCIONES - Manejadores de eventos y utilidades

    // Función para manejar la selección de mes en la navegación
    const handleMonthSelect = (month) => {
        setSelectedMonth(month);
    };

    // Función para obtener el estilo de color según el tipo de emoción
    const getEmotionColor = (type) => {
        switch (type) {
            case 'estable':
                return Colors.emotionGreen;
            case 'ansioso':
                return Colors.emotionYellow;
            case 'crisis':
                return Colors.emotionRed;
            default:
                return Colors.emotionGreen;
        }
    };

    // Función para obtener el icono según el tipo de emoción
    const getEmotionIcon = (type) => {
        switch (type) {
            case 'estable':
                return '😊';
            case 'ansioso':
                return '😐';
            case 'crisis':
                return '😰';
            default:
                return '😊';
        }
    };

    // COMPONENTES DE RENDERIZADO

    // Renderiza las estadísticas emocionales del día actual
    const renderEmotionalStats = () => {
        const todayStats = [
            { type: 'estable', label: 'Estable', percentage: '60%' },
            { type: 'ansioso', label: 'Ansioso', percentage: '30%' },
            { type: 'crisis', label: 'Crisis', percentage: '10%' }
        ];

        return (
            <View style={styles.emotionalStatsCard}>
                <Text style={styles.sectionTitle}>Estados emocionales del día</Text>
                <View style={styles.emotionalStatsContainer}>
                    {todayStats.map((stat, index) => (
                        <View key={index} style={styles.emotionalStatItem}>
                            <View style={[
                                styles.emotionalIcon,
                                { backgroundColor: getEmotionColor(stat.type) }
                            ]}>
                                <Text style={styles.emotionalIconText}>
                                    {getEmotionIcon(stat.type)}
                                </Text>
                            </View>
                            <Text style={styles.emotionalLabel}>{stat.label}</Text>
                            <Text style={styles.emotionalPercentage}>{stat.percentage}</Text>
                        </View>
                    ))}
                </View>
            </View>
        );
    };

    // Renderiza el resumen mensual con información detallada
    const renderMonthlySummary = () => {
        const currentData = monthlyData[selectedMonth];
        
        return (
            <View style={styles.monthlySummaryCard}>
                <View style={styles.summaryHeader}>
                    <View style={styles.summaryTitleContainer}>
                        <Text style={styles.summaryTitle}>{currentData.summary.title}</Text>
                        <Text style={styles.summaryDate}>{currentData.summary.date}</Text>
                        <Text style={styles.summaryChild}>{currentData.summary.child}</Text>
                        <Text style={styles.summaryAge}>Edad: {currentData.summary.age}</Text>
                    </View>
                    <View style={styles.statusBadge}>
                        <Text style={styles.statusText}>{currentData.summary.status}</Text>
                    </View>
                </View>
                
                {/* Estadísticas mensuales detalladas */}
                <View style={styles.monthlySummaryStats}>
                    <View style={styles.monthlyStatItem}>
                        <Text style={styles.monthlyStatNumber}>Días {currentData.summary.days.estable}</Text>
                        <View style={[styles.monthlyStatTag, { backgroundColor: Colors.emotionGreen }]}>
                            <Text style={styles.monthlyStatLabel}>Estable</Text>
                        </View>
                    </View>
                    <View style={styles.monthlyStatItem}>
                        <Text style={styles.monthlyStatNumber}>Días {currentData.summary.days.ansioso}</Text>
                        <View style={[styles.monthlyStatTag, { backgroundColor: Colors.emotionYellow }]}>
                            <Text style={styles.monthlyStatLabel}>Ansioso</Text>
                        </View>
                    </View>
                    <View style={styles.monthlyStatItem}>
                        <Text style={styles.monthlyStatNumber}>Días {currentData.summary.days.crisis}</Text>
                        <View style={[styles.monthlyStatTag, { backgroundColor: Colors.emotionRed }]}>
                            <Text style={styles.monthlyStatLabel}>Crisis</Text>
                        </View>
                    </View>
                </View>
            </View>
        );
    };

    // Renderiza las recomendaciones en formato carrusel
    const renderRecommendations = () => {
        const recommendations = monthlyData[selectedMonth].recommendations;
        
        return (
            <View style={styles.recommendationsSection}>
                <Text style={styles.sectionTitle}>Recomendaciones</Text>
                <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false}
                    style={styles.recommendationsCarousel}
                >
                    {recommendations.map((recommendation, index) => (
                        <View key={index} style={styles.recommendationCard}>
                            <Text style={styles.recommendationIcon}>{recommendation.icon}</Text>
                            <Text style={styles.recommendationText}>{recommendation.title}</Text>
                        </View>
                    ))}
                </ScrollView>
            </View>
        );
    };

    // Renderiza la frase motivacional del día
    const renderDailyQuote = () => {
        const quote = monthlyData[selectedMonth].dailyQuote;
        
        return (
            <View style={styles.dailyQuoteSection}>
                <Text style={styles.sectionTitle}>Frase del día</Text>
                <View style={styles.dailyQuoteCard}>
                    <Text style={styles.dailyQuoteText}>"{quote}"</Text>
                </View>
            </View>
        );
    };

    // COMPONENTE PRINCIPAL - Estructura completa de la pantalla
    return (
        <ScrollView style={styles.container}>
            
            {/* NAVIGATION - Barra de navegación principal */}
            <HeaderTutor />

            {/* SECCIÓN: MI PEQUEÑO - Información personal del niño */}
            <Text style={styles.mainSectionTitle}>Mi pequeño</Text>
            <View style={styles.profileCard}>
                {/* Avatar del niño */}
                <Image
                    source={require('../../img/Home-tutor.png')}
                    style={styles.avatar}
                />

                {/* Información básica del perfil */}
                <Text style={styles.childName}>Álvaro Díaz</Text>
                <Text style={styles.childAge}>3 Años</Text>
                <Text style={styles.childId}>321000218739812 • Niño</Text>
            </View>

            {/* SECCIÓN: ESTADOS EMOCIONALES DEL DÍA */}
            {renderEmotionalStats()}

            {/* SECCIÓN: REGISTRO MENSUAL */}
            <Text style={styles.mainSectionTitle}>Registro mensual</Text>
            
            {/* NAVEGACIÓN MENSUAL - Tabs para seleccionar meses */}
            <View style={styles.monthTabs}>
                {['Abril', 'Marzo', 'Febrero', 'Enero'].map((mes, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[
                            styles.monthButton,
                            selectedMonth === mes && styles.monthButtonActive
                        ]}
                        onPress={() => handleMonthSelect(mes)}
                    >
                        <Text style={[
                            styles.monthText,
                            selectedMonth === mes && styles.monthTextActive
                        ]}>
                            {mes}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* RESUMEN MENSUAL DETALLADO */}
            {renderMonthlySummary()}

            {/* RECOMENDACIONES PERSONALIZADAS */}
            {renderRecommendations()}

            {/* FRASE MOTIVACIONAL DEL DÍA */}
            {renderDailyQuote()}

            {/* Espacio adicional para scroll */}
            <View style={styles.bottomPadding} />
        </ScrollView>
    );
}

// ESTILOS - Definición completa de todos los estilos del componente
const styles = StyleSheet.create({
    // CONTENEDOR PRINCIPAL
    container: {
        flex: 1,
        backgroundColor: Colors.background,
        padding: 16,
    },

    // TÍTULOS DE SECCIÓN
    mainSectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.textPrimary,
        marginBottom: 12,
        marginTop: 8,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.textPrimary,
        marginBottom: 12,
    },

    // ESTILOS DE LA CARD DE PERFIL PRINCIPAL
    profileCard: {
        backgroundColor: Colors.cardBackground,
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
        marginBottom: 20,
        elevation: 3,
        shadowColor: Colors.cardShadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginBottom: 12,
        backgroundColor: Colors.lightBlue,
    },
    childName: {
        fontWeight: 'bold',
        fontSize: 20,
        color: Colors.textPrimary,
        marginBottom: 4,
    },
    childAge: {
        fontSize: 16,
        color: Colors.textSecondary,
        marginBottom: 2,
    },
    childId: {
        fontSize: 12,
        color: Colors.textSecondary,
        marginBottom: 20,
    },

    // ESTILOS DE LAS ESTADÍSTICAS FÍSICAS
    physicalStatsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginTop: 10,
    },
    physicalStatItem: {
        alignItems: 'center',
        flex: 1,
    },
    physicalStatNumber: {
        fontWeight: 'bold',
        fontSize: 20,
        color: Colors.textPrimary,
    },
    physicalStatUnit: {
        fontSize: 14,
        color: Colors.textPrimary,
        fontWeight: '600',
    },
    physicalStatLabel: {
        fontSize: 12,
        color: Colors.textSecondary,
        marginTop: 2,
    },

    // ESTILOS PARA ESTADOS EMOCIONALES DEL DÍA
    emotionalStatsCard: {
        backgroundColor: Colors.cardBackground,
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
        elevation: 3,
        shadowColor: Colors.cardShadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    emotionalStatsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    emotionalStatItem: {
        alignItems: 'center',
        flex: 1,
    },
    emotionalIcon: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    emotionalIconText: {
        fontSize: 24,
    },
    emotionalLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.textPrimary,
        marginBottom: 4,
    },
    emotionalPercentage: {
        fontSize: 12,
        color: Colors.textSecondary,
    },

    // ESTILOS DE LA NAVEGACIÓN MENSUAL
    monthTabs: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 16,
        backgroundColor: Colors.cardBackground,
        borderRadius: 12,
        padding: 4,
        elevation: 2,
        shadowColor: Colors.cardShadow,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    monthButton: {
        backgroundColor: 'transparent',
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 8,
        flex: 1,
        alignItems: 'center',
    },
    monthButtonActive: {
        backgroundColor: Colors.bluePrimary,
    },
    monthText: {
        color: Colors.textPrimary,
        fontSize: 14,
        fontWeight: '500',
    },
    monthTextActive: {
        color: Colors.white,
        fontWeight: 'bold',
    },

    // ESTILOS DEL RESUMEN MENSUAL
    monthlySummaryCard: {
        backgroundColor: Colors.blueSecondary,
        borderRadius: 15,
        padding: 16,
        marginBottom: 20,
        borderWidth: 2,
        borderColor: Colors.bluePrimary,
        borderStyle: 'dashed',
    },
    summaryHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    summaryTitleContainer: {
        flex: 1,
    },
    summaryTitle: {
        fontSize: 14,
        color: Colors.textSecondary,
        marginBottom: 4,
    },
    summaryDate: {
        fontWeight: 'bold',
        fontSize: 18,
        color: Colors.textPrimary,
        marginBottom: 2,
    },
    summaryChild: {
        fontSize: 14,
        color: Colors.textPrimary,
        marginBottom: 2,
    },
    summaryAge: {
        fontSize: 12,
        color: Colors.textSecondary,
    },
    statusBadge: {
        backgroundColor: Colors.cardBackground,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
        color: Colors.textPrimary,
    },
    monthlySummaryStats: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: Colors.cardBackground,
        borderRadius: 12,
        padding: 12,
        borderWidth: 2,
        borderColor: Colors.bluePrimary,
        borderStyle: 'dashed',
    },
    monthlyStatItem: {
        alignItems: 'center',
        flex: 1,
    },
    monthlyStatNumber: {
        fontSize: 14,
        fontWeight: 'bold',
        color: Colors.textPrimary,
        marginBottom: 6,
    },
    monthlyStatTag: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    monthlyStatLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: Colors.white,
    },

    // ESTILOS DE LAS RECOMENDACIONES
    recommendationsSection: {
        marginBottom: 20,
    },
    recommendationsCarousel: {
        paddingVertical: 8,
    },
    recommendationCard: {
        backgroundColor: Colors.cardBackground,
        borderRadius: 15,
        padding: 16,
        marginRight: 12,
        width: 160,
        alignItems: 'center',
        elevation: 2,
        shadowColor: Colors.cardShadow,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        borderWidth: 1,
        borderColor: '#E8D5E8',
    },
    recommendationIcon: {
        fontSize: 24,
        marginBottom: 8,
    },
    recommendationText: {
        fontSize: 14,
        color: Colors.textPrimary,
        textAlign: 'center',
        lineHeight: 18,
    },

    // ESTILOS DE LA FRASE DEL DÍA
    dailyQuoteSection: {
        marginBottom: 20,
    },
    dailyQuoteCard: {
        backgroundColor: Colors.cardBackground,
        borderRadius: 15,
        padding: 20,
        elevation: 2,
        shadowColor: Colors.cardShadow,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    dailyQuoteText: {
        fontSize: 16,
        color: Colors.bluePrimary,
        fontStyle: 'italic',
        textAlign: 'center',
        lineHeight: 22,
    },

    // ESPACIADO FINAL
    bottomPadding: {
        height: 60,
    },
});