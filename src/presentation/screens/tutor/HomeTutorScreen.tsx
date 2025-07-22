import React, { useState, useEffect, useMemo } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useAppSelector } from '../../../core/stores/store';
import { selectUserData, selectAccessToken } from '../../../core/stores/auth/authSlice';
import { TutorData } from '../../../core/types/tutor';
import { PatientData } from '../../../core/types/patient';
import HeaderTutor from '../../../shared/components/home-tutor/HeaderTutor';
import TutorTabBar from '../../../presentation/layout/TutorTabBar';
import DetallesPatient from '../../../shared/components/tutor/DetallesPatient';
import ResumenEmocional from '../../../shared/components/tutor/ResumenEmocional';
import ClinicalColors from '../../../shared/components/constants/clinicalcolors';
import { getPressureState } from '../../../core/utils/clinicalUtils';
import PressureChartCard from '../../../shared/components/charts/RealTimeCharts/PressureChartCard';
import { UseSensorSocketReturn } from '../../../data/chartdata';

interface InfoPelucheProps {
  socketData?: UseSensorSocketReturn;
}

const Colors = {
  white: '#FFFFFF',
  textPrimary: '#2C3E50',
  textSecondary: '#7F8C8D',
  primary: '#3498DB',
  background: '#F8FAFC',
  cardBackground: '#FFFFFF',
  lightBlue: '#BFDDFB',
  bluePrimary: '#5DADE2',
  blueSecondary: '#AED6F1',
};

const HomeTutor: React.FC<InfoPelucheProps> = ({ socketData }) => {
  const userData = useAppSelector(selectUserData);
  const accessToken = useAppSelector(selectAccessToken);
  const [tutorData, setTutorData] = useState<TutorData | null>(null);
  const [patientData, setPatientData] = useState<PatientData | null>(null);
  const navigation = useNavigation();

  // Procesamiento de datos para el gráfico de presión
  const { pressureValue, pressureState, pressureChartData } = useMemo(() => {
    const lastValue = socketData?.sensorData.pressurePercent?.[socketData.sensorData.pressurePercent.length - 1] || 0;
    const state = getPressureState(lastValue);
    
    const chartData = socketData?.sensorData.pressurePercent?.slice(-6).map((value, index) => ({
      value,
      label: `${index + 1}`,
      frontColor: state.color,
      labelTextStyle: {
        color: ClinicalColors.textSecondary,
        fontSize: 10,
      },
    })) || [];

    return {
      pressureValue: lastValue,
      pressureState: state,
      pressureChartData: chartData
    };
  }, [socketData]);

  useEffect(() => {
    if (!accessToken || !userData || !userData.id) {
      console.warn('ID del usuario no definido');
      return;
    }

    const fetchTutorData = async () => {
      try {
        const res = await fetch(
          `http://feelink-api.runasp.net/api/Users/${userData.id}/data`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );

        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        setTutorData(await res.json());
      } catch (err) {
        console.error('Error al obtener datos del tutor:', err);
      }
    };

    fetchTutorData();
  }, [accessToken, userData]);

  useEffect(() => {
    if (!tutorData?.patientId || !accessToken) return;

    const fetchPatientData = async () => {
      try {
        const res = await fetch(
          `http://feelink-api.runasp.net/api/Patients/${tutorData.patientId}`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );

        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        setPatientData(await res.json());
      } catch (err) {
        console.error('Error al obtener datos del paciente:', err);
      }
    };

    fetchPatientData();
  }, [tutorData, accessToken]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <View style={{ flex: 1 }}>
        <ScrollView 
          style={styles.container}
          contentContainerStyle={styles.scrollContent}
        >
          <HeaderTutor
            tutorName={`Tutor ${userData?.name}`}
            centerName={tutorData?.companyName || 'Centro no disponible'}
            specialistName={tutorData?.therapistName || 'Especialista no disponible'}
          />

          <DetallesPatient />

          {tutorData?.patientId && accessToken && (
            <ResumenEmocional 
              patientId={tutorData.patientId} 
              accessToken={accessToken} 
            />
          )}

          {/* Sección del gráfico de presión */}
          {socketData && pressureChartData.length > 0 && (
            <View style={styles.chartContainer}>
              <PressureChartCard
                pressureValue={pressureValue}
                pressureState={pressureState}
                chartData={pressureChartData}
              />
            </View>
          )}

          {/* Espacio adicional al final para evitar que el tab bar tape contenido */}
          <View style={styles.bottomSpacer} />
        </ScrollView>

        <TutorTabBar activeTab="Home" />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
    // CONTENEDOR PRINCIPAL
    container: {
        flex: 1,
        backgroundColor: Colors.background,
        padding: 16,
        paddingHorizontal: 0,
        paddingTop: 0,
    },

    // TÍTULOS DE SECCIÓN
    mainSectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.textPrimary,
        marginBottom: 12,
        marginTop: 8,
        padding: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.textPrimary,
        marginBottom: 12,
    },

    // ESTILOS DE LA CARD DE PERFIL PRINCIPAL
    profileCard: {
        marginHorizontal: 16,
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
        marginHorizontal: 16,
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
        marginHorizontal: 16,
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
        marginHorizontal: 16,
        fontSize: 14,
        fontWeight: '600',
        color: Colors.textPrimary,
        marginBottom: 4,
    },
    emotionalPercentage: {
        marginHorizontal: 16,
        fontSize: 12,
        color: Colors.textSecondary,
    },

    // ESTILOS DE LA NAVEGACIÓN MENSUAL
    monthTabs: {
        marginHorizontal: 16,
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
        marginHorizontal: 16,
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
        display: 'flex',
        marginHorizontal: 16,
        marginBottom: 20,
    },
    recommendationsCarousel: {
        paddingVertical: 8,
        display: 'flex',
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
        marginHorizontal: 16,
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
export default HomeTutor;


