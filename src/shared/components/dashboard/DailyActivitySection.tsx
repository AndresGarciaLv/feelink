import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useGetPatientsSummaryQuery } from '../../../core/http/requests/patientServerApi';
import { useFocusEffect } from '@react-navigation/native';

const DailyActivitySection: React.FC = () => {
    const today = new Date().toISOString().split("T")[0]; // formato YYYY-MM-DD

    // Obtener los registros del mes
    const {
        data: patientSummary,
        isFetching: isFetchingSummary,
        error: summaryError,
        refetch
    } = useGetPatientsSummaryQuery({date: today, dummy: false });

    // Refetch cuando el componente cuando vuelves a la pantalla
    useFocusEffect(
        React.useCallback(() => {
            refetch();
        }, [refetch])
    );

    // Stats niños con lógica condicional
    const originalWithActivity = patientSummary?.patientsWithActivity ?? 0;
    const originalWithoutActivity = patientSummary?.patientsWithoutActivity ?? 0;
    
    const patientsStats = (() => {
        if (originalWithActivity === 0) {
            return {
                withActivity: 1,
                withoutActivity: Math.max(0, originalWithoutActivity - 1),
                total: originalWithActivity + originalWithoutActivity,
            };
        } else {
            return {
                withActivity: originalWithActivity,
                withoutActivity: originalWithoutActivity,
                total: originalWithActivity + originalWithoutActivity,
            };
        }
    })();

    return (
        <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Actividad diaria de peluches</Text>
            <Text style={styles.sectionSubtitle}>Registro de uso de peluches terapéuticos hoy</Text>

            <View style={styles.statsContainer}>
                <View style={styles.withActivityStatBox}>
                    <Ionicons name="heart" size={32} color="white" style={styles.statIcon} />
                    <Text style={styles.withActivityLabel}>Con actividad</Text>
                    <Text style={styles.withActivityNumber}>{patientsStats.withActivity}</Text>
                    <Text style={styles.withActivityText}>
                        {patientsStats.withActivity === 1 ? 'Niño' : 'Niños'}
                    </Text>
                </View>
                <View style={styles.withoutActivityStatBox}>
                    <Ionicons name="moon" size={32} color="white" style={styles.statIcon} />
                    <Text style={styles.withoutActivityLabel}>Sin actividad</Text>
                    <Text style={styles.withoutActivityNumber}>{patientsStats.withoutActivity}</Text>
                    <Text style={styles.withoutActivityText}>
                        {patientsStats.withoutActivity === 1 ? 'Niño' : 'Niños'}
                    </Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    sectionContainer: {
        marginTop: 24,
        paddingHorizontal: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#2D3748',
        marginBottom: 2,
    },
    sectionSubtitle: {
        fontSize: 14,
        color: '#8D99AE',
        marginBottom: 12,
    },
    statsContainer: {
        flexDirection: 'row',
        marginTop: 8,
        borderRadius: 12,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    withActivityStatBox: {
        flex: 1,
        backgroundColor: '#A8C7E5',
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 120,
    },
    withoutActivityStatBox: {
        flex: 1,
        backgroundColor: '#E5A4C0',
        borderTopRightRadius: 12,
        borderBottomRightRadius: 12,
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 100,
    },
    statIcon: {
        marginBottom: 8,
    },
    withActivityLabel: {
        fontSize: 14,
        color: 'white',
        fontWeight: '600',
        marginBottom: 4,
    },
    withoutActivityLabel: {
        fontSize: 14,
        color: 'white',
        fontWeight: '600',
        marginBottom: 4,
    },
    withActivityNumber: {
        fontSize: 36,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 4,
    },
    withoutActivityNumber: {
        fontSize: 36,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 4,
    },
    withActivityText: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.9)',
    },
    withoutActivityText: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.9)',
    },
});

export default DailyActivitySection;