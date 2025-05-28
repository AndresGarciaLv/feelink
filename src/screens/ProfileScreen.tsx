import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image
} from 'react-native';
import HeaderProfile from '../shared/components/profile/HeaderProfile';

// Importar colores del sistema (asumiendo que existe este archivo)
// import Colors from '../shared/components/bluetooth/constants/colors';

// Colores basados en la referencia visual
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

};

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
                    emotions: ['Feliz', 'Neutro']
                }
            ]
        },
        'Marzo': {
            summary: {
                title: 'Estado emocional del niño',
                date: 'Marzo 2025',
                age: '3 Años 9 Meses 2 Días',
                emotions: ['Feliz', 'Neutro']
            },
            dailyData: [
                {
                    day: 31,
                    date: '31 Marzo 2025',
                    subtitle: 'Horas diarias cambio de estado',
                    name: 'Álvaro Díaz',
                    hours: 'Hora 7 a 12',
                    emotions: ['Feliz', 'Neutro']
                },
                {
                    day: 30,
                    date: '30 Marzo 2025',
                    subtitle: 'Horas diarias cambio de estado',
                    name: 'Álvaro Díaz',
                    hours: 'Hora 8 a 15',
                    emotions: ['Feliz']
                }
            ]
        },
        'Febrero': {
            summary: {
                title: 'Estado emocional del niño',
                date: 'Febrero 2025',
                age: '3 Años 8 Meses 2 Días',
                emotions: ['Neutro', 'Triste']
            },
            dailyData: [
                {
                    day: 28,
                    date: '28 Febrero 2025',
                    subtitle: 'Horas diarias cambio de estado',
                    name: 'Álvaro Díaz',
                    hours: 'Hora 9 a 13',
                    emotions: ['Neutro', 'Triste']
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
        <ScrollView style={styles.container}>
            {/* HEADER - Encabezado con botón de regreso y título */}
            {/* <View style={styles.header}>
                <TouchableOpacity style={styles.backButton}>
                    <Text style={styles.backText}>{"<"}</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Perfil - Niño</Text>
            </View> */}

            <HeaderProfile/>

            {/* DATOS PERSONALES - Card principal con información del niño */}
            <View style={styles.profileCard}>
                {/* Avatar del niño */}
                <Image
                    source={require('../../assets/perfil.png')}
                    style={styles.avatar}
                />

                {/* Información básica */}
                <Text style={styles.name}>Álvaro Díaz</Text>
                <Text style={styles.age}>3 Años</Text>
                <Text style={styles.id}>32100008723913 - Niño</Text>

                {/* Botones de acción */}
                <TouchableOpacity style={styles.updateButton}>
                    <Text style={styles.updateText}>Actualizar datos</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.emotionButton}>
                    <Text style={styles.emotionText}>Gráfica de emociones</Text>
                </TouchableOpacity>

                {/* Estadísticas físicas del niño */}
                <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>73</Text>
                        <Text style={styles.statLabel}>cm</Text>
                        <Text style={styles.statDescription}>Altura</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>12</Text>
                        <Text style={styles.statLabel}>kg</Text>
                        <Text style={styles.statDescription}>Peso</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>12</Text>
                        <Text style={styles.statLabel}>IMC</Text>
                        <Text style={styles.statDescription}>IMC</Text>
                    </View>
                </View>
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
                    <Text style={styles.cardTitle}>
                        {monthlyData[selectedMonth].summary.title}
                    </Text>
                    <Text style={styles.cardDate}>
                        {monthlyData[selectedMonth].summary.date}
                    </Text>
                    <Text style={styles.cardSubtitle}>
                        Edad: {monthlyData[selectedMonth].summary.age}
                    </Text>

                    {/* Etiquetas de emociones del resumen mensual */}
                    <View style={styles.cardTags}>
                        {renderEmotionTags(monthlyData[selectedMonth].summary.emotions)}
                    </View>
                </View>

                {/* EVENTOS DIARIOS - Cards con información día por día */}
                {monthlyData[selectedMonth].dailyData.map((dayData, index) => (
                    <View key={index} style={styles.timelineCardSecundary}>
                        <Text style={styles.cardDate}>{dayData.date}</Text>
                        <Text style={styles.cardSubtitle}>{dayData.subtitle}</Text>
                        <Text style={styles.cardSubtitle}>{dayData.name}</Text>
                        <Text style={styles.cardSubtitle}>{dayData.hours}</Text>

                        {/* Etiquetas de emociones del día */}
                        <View style={styles.cardTags}>
                            {renderEmotionTags(dayData.emotions)}
                        </View>
                    </View>
                ))}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    // CONTENEDOR PRINCIPAL
    container: {
        flex: 1,
        backgroundColor: Colors.white,
        padding: 16,
    },

    // ESTILOS DEL HEADER
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        paddingTop: 10,
    },
    backButton: {
        marginRight: 8,
        padding: 8,
    },
    backText: {
        fontSize: 24,
        color: Colors.textPrimary,
        fontWeight: 'bold',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.textPrimary,
    },

    // ESTILOS DE LA CARD DE PERFIL
    profileCard: {
        backgroundColor: Colors.cardBackground,
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
        marginBottom: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    avatar: {
        width: 70,
        height: 70,
        borderRadius: 35,
        marginBottom: 10,
        backgroundColor: Colors.lightBlue,
    },
    name: {
        fontWeight: 'bold',
        fontSize: 18,
        color: Colors.textPrimary,
        marginBottom: 4,
    },
    age: {
        fontSize: 16,
        color: Colors.textSecondary,
        marginBottom: 2,
    },
    id: {
        fontSize: 12,
        color: Colors.textSecondary,
        marginBottom: 15,
    },

    // ESTILOS DE LOS BOTONES
    updateButton: {
        backgroundColor: Colors.lightBlue,
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 10,
        marginBottom: 8,
    },
    updateText: {
        color: Colors.textPrimary,
        fontWeight: 'bold',
        fontSize: 14,
    },
    emotionButton: {
        borderWidth: 1,
        borderColor: Colors.textPrimary,
        borderRadius: 10,
        paddingVertical: 8,
        paddingHorizontal: 20,
        marginBottom: 16,
    },
    emotionText: {
        color: Colors.textPrimary,
        fontSize: 14,
    },

    // ESTILOS DE LAS ESTADÍSTICAS
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginTop: 10,
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
    },
    statNumber: {
        fontWeight: 'bold',
        fontSize: 18,
        color: Colors.textPrimary,
    },
    statLabel: {
        fontSize: 14,
        color: Colors.textPrimary,
        fontWeight: '600',
    },
    statDescription: {
        fontSize: 12,
        color: Colors.textSecondary,
        marginTop: 2,
    },

    // ESTILOS DE LA NAVEGACIÓN MENSUAL
    monthTabs: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 16,
        backgroundColor: Colors.background,
        borderRadius: 12,
        padding: 4,
    },
    monthButton: {
        backgroundColor: 'transparent',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        flex: 1,
        alignItems: 'center',
    },
    monthButtonActive: {
        backgroundColor: Colors.primary,
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

    // ESTILOS DE LA LÍNEA DE TIEMPO
    timeline: {
        marginBottom: 60,
    },
    timelineCardPrimary: {
        backgroundColor: Colors.timelineBackgroundPrimary,
        borderRadius: 15,
        padding: 16,
        marginBottom: 12,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    timelineCardSecundary: {
        backgroundColor: Colors.timelineBackgroundSecundary,
        borderRadius: 15,
        padding: 16,
        marginBottom: 12,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    cardTitle: {
        fontWeight: 'bold',
        fontSize: 16,
        color: Colors.textPrimary,
        marginBottom: 6,
    },
    cardDate: {
        fontSize: 14,
        fontWeight: 'bold',
        color: Colors.textPrimary,
        marginBottom: 4,
    },
    cardSubtitle: {
        fontSize: 12,
        color: Colors.textSecondary,
        marginVertical: 2,
        lineHeight: 16,
    },

    // ESTILOS DE LAS ETIQUETAS DE EMOCIONES
    cardTags: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 12,
        gap: 8,
    },
    tag: {
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 6,
        fontSize: 12,
        color: Colors.white,
        fontWeight: '600',
        textAlign: 'center',
    },
    greenTag: {
        backgroundColor: '#3CC57D',
    },
    yellowTag: {
        backgroundColor: '#F1C232',
    },
    redTag: {
        backgroundColor: '#E06666',
    },
});