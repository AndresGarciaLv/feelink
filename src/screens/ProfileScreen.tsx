import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image
} from 'react-native';
import Colors from '../shared/components/bluetooth/constants/colors';
import HeaderProfile from '../shared/components/profile/HeaderProfile';

export default function ProfileScreen() {
    // Estado para controlar el mes seleccionado
    const [selectedMonth, setSelectedMonth] = useState('Abril');

    // Datos de ejemplo para cada mes
    const monthlyData = {
        'Abril': {
            summary: {
                title: 'Estado emocional del niño',
                date: 'Abril 2025',
                age: '3 Años 10 Meses 2 Días',
                emotions: ['Feliz', 'Neutro', 'Triste']
            },
            dailyData: [
                {
                    day: 28,
                    date: '28 Abril 2025',
                    subtitle: 'Horas diarias cambio de estado',
                    name: 'Álvaro Díaz',
                    hours: 'Hora 8 a 13',
                    emotions: ['Feliz', 'Neutro', 'Triste']
                },
                {
                    day: 27,
                    date: '27 Abril 2025',
                    subtitle: 'Horas diarias cambio de estado',
                    name: 'Álvaro Díaz',
                    hours: 'Hora 9 a 14',
                    emotions: ['Feliz', 'Neutro', 'Triste']
                },
                {
                    day: 26,
                    date: '26 Abril 2025',
                    subtitle: 'Horas diarias cambio de estado',
                    name: 'Álvaro Díaz',
                    hours: 'Hora 8 a 13',
                    emotions: ['Feliz', 'Neutro', 'Triste']
                },
            ]
        },
        'Marzo': {
            summary: {
                title: 'Estado emocional del niño',
                date: 'Marzo 2025',
                age: '3 Años 9 Meses 2 Días',
                emotions: ['Feliz', 'Neutro', 'Triste']
            },
            dailyData: [
                {
                    day: 31,
                    date: '31 Marzo 2025',
                    subtitle: 'Horas diarias cambio de estado',
                    name: 'Álvaro Díaz',
                    hours: 'Hora 7 a 12',
                    emotions: ['Feliz', 'Neutro', 'Triste']
                },
                {
                    day: 30,
                    date: '30 Marzo 2025',
                    subtitle: 'Horas diarias cambio de estado',
                    name: 'Álvaro Díaz',
                    hours: 'Hora 8 a 15',
                    emotions: ['Feliz', 'Neutro', 'Triste']
                }
            ]
        },
        'Febrero': {
            summary: {
                title: 'Estado emocional del niño',
                date: 'Febrero 2025',
                age: '3 Años 8 Meses 2 Días',
                emotions: ['Feliz', 'Neutro', 'Triste']
            },
            dailyData: [
                {
                    day: 28,
                    date: '28 Febrero 2025',
                    subtitle: 'Horas diarias cambio de estado',
                    name: 'Álvaro Díaz',
                    hours: 'Hora 9 a 13',
                    emotions: ['Feliz', 'Neutro', 'Triste']
                }
            ]
        },
        'Enero': {
            summary: {
                title: 'Estado emocional del niño',
                date: 'Enero 2025',
                age: '3 Años 7 Meses 2 Días',
                emotions: ['Feliz', 'Neutro', 'Triste']
            },
            dailyData: [
                {
                    day: 31,
                    date: '31 Enero 2025',
                    subtitle: 'Horas diarias cambio de estado',
                    name: 'Álvaro Díaz',
                    hours: 'Hora 8 a 14',
                    emotions: ['Feliz', 'Neutro', 'Triste']
                }
            ]
        }
    };

    // Función para obtener el color de cada etiqueta de emoción
    const getEmotionStyle = (emotion) => {
        switch (emotion) {
            case 'Feliz':
                return styles.greenTag;
            case 'Neutro':
                return styles.yellowTag;
            case 'Triste':
                return styles.redTag;
            default:
                return styles.greenTag;
        }
    };

    // Función para manejar la selección de mes
    const handleMonthSelect = (month) => {
        setSelectedMonth(month);
    };

    // Renderizar las etiquetas de emociones
    const renderEmotionTags = (emotions) => {
        return emotions.map((emotion, index) => (
            <Text key={index} style={[styles.tag, getEmotionStyle(emotion)]}>
                {emotion}
            </Text>
        ));
    };

    return (
        <ScrollView>

            <View style={styles.container}>
                {/* HEADER - Encabezado con botón de regreso y título */}
                <HeaderProfile />

                <View style={styles.avatarContainer}>
                    <Image
                        source={require('../../assets/perfil.png')}
                        style={styles.avatar}
                    />
                    <TouchableOpacity style={styles.tagButton}>
                        <Text style={styles.tagText}>peluchin</Text>
                    </TouchableOpacity>
                </View>

                {/* Información personal */}
                <View style={styles.infoContainer}>
                    <Text style={styles.name}>Álvaro Díaz</Text>
                    <Text style={styles.subText}>3 Años</Text>
                    <Text style={styles.subTextGray}>321000218739812 • Niño</Text>
                </View>

                {/* Datos físicos con divisores */}
                <View style={styles.statsContainer}>
                    <View style={styles.statBox}>
                        <Text style={styles.statValueWithUnit}>73
                            <Text style={styles.statUnit}>cm</Text>
                        </Text>
                        <Text style={styles.statLabel}>Altura</Text>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.statBox}>
                        <Text style={styles.statValueWithUnit}>12
                            <Text style={styles.statUnit}>kg</Text>
                        </Text>
                        <Text style={styles.statLabel}>Peso</Text>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.statBox}>
                        <Text style={styles.statValue}>12</Text>
                        <Text style={styles.statUnit}>IMC</Text>
                    </View>
                </View>

                {/* Botones */}
                <View style={styles.buttonGroup}>
                    <TouchableOpacity style={styles.stressButton}>
                        <Text style={styles.stressText}>Grafica de estrés</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.emotionsButton}>
                        <Text style={styles.emotionsText}>Gráfica de emociones</Text>
                    </TouchableOpacity>
                </View>

                {/* NAVEGACIÓN MENSUAL - Navbar tipo calendario para seleccionar meses */}
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

                {/* LÍNEA DE TIEMPO - Cards con información del mes seleccionado */}
                <View style={styles.timeline}>
                    {/* RESUMEN MENSUAL - Card principal del mes */}
                    <View style={styles.timelineCardPrimary}>
                        <View style={styles.cardHeader}>
                            <View>
                                <Text style={styles.cardTitle}>
                                    {monthlyData[selectedMonth].summary.title}
                                </Text>
                                <Text style={styles.cardDate}>
                                    {monthlyData[selectedMonth].summary.date}
                                </Text>
                                <Text style={styles.cardSubtitle}>
                                    {monthlyData[selectedMonth].summary.age}
                                </Text>
                            </View>
                            <View style={styles.statusBadge}>
                                <Text style={styles.statusText}>Normal</Text>
                            </View>
                        </View>

                        {/* Estadísticas del mes */}
                        <View style={styles.monthStats}>
                            <View style={styles.statItem}>
                                <Text style={styles.statNumber}>12</Text>
                                <Text style={styles.statLabel}>Días</Text>
                            </View>
                            <View style={styles.statItem}>
                                <Text style={styles.statNumber}>10</Text>
                                <Text style={styles.statLabel}>Días</Text>
                            </View>
                            <View style={styles.statItem}>
                                <Text style={styles.statNumber}>8</Text>
                                <Text style={styles.statLabel}>Días</Text>
                            </View>
                        </View>

                        {/* Etiquetas de emociones del resumen mensual */}
                        <View style={styles.cardTags}>
                            {renderEmotionTags(monthlyData[selectedMonth].summary.emotions)}
                        </View>
                    </View>

                    {/* EVENTOS DIARIOS - Cards con información día por día */}
                    {monthlyData[selectedMonth].dailyData.map((dayData, index) => (
                        <View key={index} style={styles.timelineCardSecundary}>
                            <View style={styles.timelineConnector} />

                            <View style={styles.cardHeader}>
                                <View>
                                    <Text style={styles.cardDateSecondary}>{dayData.date}</Text>
                                    <Text style={styles.cardSubtitle}>{dayData.subtitle}</Text>
                                    <Text style={styles.cardSubtitle}>{dayData.name}</Text>
                                </View>
                                <View style={styles.statusBadgeSecondary}>
                                    <Text style={styles.statusTextSecondary}>Normal</Text>
                                </View>
                            </View>

                            {/* Estadísticas del día */}
                            <View style={styles.dayStats}>
                                <View style={styles.statItemSmall}>
                                    <Text style={styles.statNumberSmall}>12</Text>
                                    <Text style={styles.statLabelSmall}>Horas</Text>
                                </View>
                                <View style={styles.statItemSmall}>
                                    <Text style={styles.statNumberSmall}>8</Text>
                                    <Text style={styles.statLabelSmall}>Horas</Text>
                                </View>
                                <View style={styles.statItemSmall}>
                                    <Text style={styles.statNumberSmall}>4</Text>
                                    <Text style={styles.statLabelSmall}>Horas</Text>
                                </View>
                            </View>

                            {/* Etiquetas de emociones del día */}
                            <View style={styles.cardTags}>
                                {renderEmotionTags(dayData.emotions)}
                            </View>
                        </View>
                    ))}
                </View>

            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    // CONTENEDOR PRINCIPAL
    container: {
        flex: 1,
        backgroundColor: '#FFF',
        fontFamily: 'sans-serif',
    },
    // ESTILOS DE LA CARD DE PERFIL
    avatarContainer: {
        alignItems: 'center',
        marginTop: -45,
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
    },
    tagButton: {
        borderColor: '#9BC4E0',
        borderWidth: 1,
        borderRadius: 50,
        paddingHorizontal: 12,
        paddingVertical: 4,
    },
    subTextGray: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
        textAlign: 'center',
    },
    tagText: {
        color: '#9BC4E0',
        fontSize: 12,
    },
    infoContainer: {
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 20,
        color: '#333',
    },
    name: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 6,
    },
    subText: {
        fontSize: 14,
        color: '#333',
        marginBottom: 6,
    },
    statValueWithUnit: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
    },
    verticalDivider: {
        width: 1,
        backgroundColor: '#CCC',
        marginHorizontal: 8,
        height: '100%',
        alignSelf: 'center',
    },
    subTextSpacer: {
        fontSize: 14,
        color: '#333',
        marginTop: 6,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginHorizontal: 24,
        marginTop: 24,
        backgroundColor: '#FFF',
        padding: 16,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
        alignItems: 'center',
    },
    statBox: {
        alignItems: 'center',
        flex: 1,
        backgroundColor: '#FFFF',
    },
    divider: {
        width: 1,
        height: '100%',
        backgroundColor: '#DDD',
        marginHorizontal: 8,
    },
    statValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    statUnit: {
        fontSize: 14,
        color: '#666',
    },
    statLabel: {
        fontSize: 12,
        marginTop: 4,
    },
    // ESTILOS DE LOS BOTONES
    buttonGroup: {
        marginTop: 24,
        marginHorizontal: 24,
        gap: 12,
    },
    stressButton: {
        backgroundColor: '#9BC4E0',
        padding: 12,
        borderRadius: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    stressText: {
        color: '#FFF',
        fontWeight: '500',
        fontSize: 16,
    },
    emotionsButton: {
        borderColor: '#9BC4E0',
        borderWidth: 1,
        padding: 12,
        borderRadius: 16,
        alignItems: 'center',
    },
    emotionsText: {
        color: '#9BC4E0',
        fontWeight: '500',
        fontSize: 16,
    },


    // ESTILOS DE LA NAVEGACIÓN MENSUAL
    monthTabs: {
        flexDirection: 'row',
        marginHorizontal: 20,
        marginVertical: 16,
        backgroundColor: Colors.white,
        borderRadius: 12,
        padding: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
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
        backgroundColor: Colors.primary,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    monthText: {
        color: Colors.textPrimary,
        fontSize: 14,
        fontWeight: '500',
    },
    monthTextActive: {
        color: Colors.white,
        fontWeight: '600',
    },

    // ESTILOS DE LA LÍNEA DE TIEMPO
    timeline: {
        marginHorizontal: 20,
        marginBottom: 80,
        position: 'relative',
    },
    timelineCardPrimary: {
        backgroundColor: Colors.primary,
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    timelineCardSecundary: {
        backgroundColor: Colors.white,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        marginLeft: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
        elevation: 3,
        borderLeftWidth: 3,
        borderLeftColor: Colors.primary,
        position: 'relative',
    },
    timelineConnector: {
        position: 'absolute',
        left: -18,
        top: 20,
        width: 12,
        height: 12,
        backgroundColor: Colors.primary,
        borderRadius: 6,
        borderWidth: 3,
        borderColor: Colors.white,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    cardTitle: {
        fontWeight: '400',
        fontSize: 14,
        color: Colors.textSecundary,
        marginBottom: 4,
        opacity: 0.9,
    },
    cardDate: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.textPrimary,
        marginBottom: 6,
    },
    cardDateSecondary: {
        fontSize: 15,
        fontWeight: '600',
        color: Colors.textPrimary,
        marginBottom: 4,
    },
    cardSubtitle: {
        fontSize: 13,
        color: Colors.textSecundary,
        opacity: 0.8,
        lineHeight: 18,
    },
    statusBadge: {
        backgroundColor: Colors.secondary,
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 6,
    },
    statusText: {
        color: Colors.white,
        fontSize: 12,
        fontWeight: '600',
    },
    statusBadgeSecondary: {
        backgroundColor: Colors.secondary,
        borderRadius: 12,
        paddingHorizontal: 10,
        paddingVertical: 6,
    },
    statusTextSecondary: {
        color: Colors.white,
        fontSize: 12,
        fontWeight: '600',
    },

    // ESTILOS DE LAS ESTADÍSTICAS
    monthStats: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
        borderRadius: 12,
        padding: 12,
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
    },
    statNumber: {
        fontSize: 18,
        fontWeight: '500',
        color: Colors.textPrimary,
    },
    statLabel: {
        fontSize: 12,
        color: Colors.textSecundary,
        opacity: 0.8,
        marginTop: 2,
    },
    dayStats: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
        backgroundColor: Colors.white,
        borderRadius: 8,
        padding: 10,
    },
    statItemSmall: {
        alignItems: 'center',
        flex: 1,
    },
    statNumberSmall: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.textPrimary,
    },
    statLabelSmall: {
        fontSize: 10,
        color: Colors.textSecundary,
        marginTop: 2,
    },

    // ESTILOS DE LAS ETIQUETAS DE EMOCIONES
    cardTags: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        rowGap: 16, // Si estás usando React Native 0.71+ o con soporte de `rowGap`
        marginHorizontal: 35,
        marginTop: 4,
    },
    tag: {
        borderRadius: 14,
        paddingHorizontal: 14,
        paddingVertical: 6,
        fontSize: 13,
        color: Colors.white,
        fontWeight: '600',
        textAlign: 'center',
        minWidth: 60,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    greenTag: {
        backgroundColor: '#89C58B',
    },
    yellowTag: {
        backgroundColor: '#D8DB56',
    },
    redTag: {
        backgroundColor: '#D27373',
    },
});