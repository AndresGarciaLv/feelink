import React, { useState, useMemo } from 'react';
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
import {
  getPressureState,
  getMovementState,
  getInterpretationText,
  getTherapeuticRecommendation
} from '../../../core/utils/clinicalUtils';
import PressureChartCard from '../../../shared/components/charts/RealTimeCharts/PressureChartCard';
import MovementChartCard from '../../../shared/components/charts/RealTimeCharts/MovementChartCard';
import RotationChartCard from '../../../shared/components/charts/RealTimeCharts/RotationChartCard';
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

const InfoPeluche: React.FC<InfoPelucheProps> = ({ socketData }) => {
  const userData = useAppSelector(selectUserData);
  const accessToken = useAppSelector(selectAccessToken);
  const [tutorData, setTutorData] = useState<TutorData | null>(null);
  const [patientData, setPatientData] = useState<PatientData | null>(null);
  const navigation = useNavigation();

  // Datos clínicos procesados
  const {
    pressureValue,
    pressureState,
    pressureChartData,
    movementValue,
    movementState,
    movementChartData,
    rotationValue,
    rotationState,
    rotationChartData,
    clinicalAnalysis
  } = useMemo(() => {
    const lastPressure = socketData?.sensorData.pressurePercent?.at(-1) || 0;
    const pState = getPressureState(lastPressure);

    const pChartData = socketData?.sensorData.pressurePercent?.slice(-6).map((value, index) => ({
      value,
      label: `${index + 1}`,
      frontColor: pState.color,
      labelTextStyle: {
        color: ClinicalColors.textSecondary,
        fontSize: 10,
      },
    })) || [];

    const lastX = socketData?.sensorData.accelX?.at(-1) || 0;
    const lastY = socketData?.sensorData.accelY?.at(-1) || 0;
    const lastZ = socketData?.sensorData.accelZ?.at(-1) || 0;
    const mValue = Math.sqrt(lastX ** 2 + lastY ** 2 + lastZ ** 2);
    const mState = getMovementState(mValue);

    const mChartData = socketData?.sensorData.accelX?.slice(-6).map((_, index) => {
      const x = socketData.sensorData.accelX?.[index] || 0;
      const y = socketData.sensorData.accelY?.[index] || 0;
      const z = socketData.sensorData.accelZ?.[index] || 0;
      const magnitude = Math.sqrt(x ** 2 + y ** 2 + z ** 2);

      return {
        value: magnitude,
        label: `${index + 1}`,
        frontColor: mState.color,
        labelTextStyle: {
          color: ClinicalColors.textSecondary,
          fontSize: 10,
        },
      };
    }) || [];

    const lastGX = socketData?.sensorData.gyroX?.at(-1) || 0;
    const lastGY = socketData?.sensorData.gyroY?.at(-1) || 0;
    const rValue = Math.sqrt(lastGX ** 2 + lastGY ** 2);
    const rState = getMovementState(rValue);

    const rChartData = socketData?.sensorData.gyroX?.slice(-6).map((_, index) => {
      const x = socketData.sensorData.gyroX?.[index] || 0;
      const y = socketData.sensorData.gyroY?.[index] || 0;
      const magnitude = Math.sqrt(x ** 2 + y ** 2);

      return {
        value: magnitude,
        label: `${index + 1}`,
        frontColor: rState.color,
        labelTextStyle: {
          color: ClinicalColors.textSecondary,
          fontSize: 10,
        },
      };
    }) || [];

    const analysis = {
      pressure: pState,
      movement: mState,
      rotation: rState,
    };

    return {
      pressureValue: lastPressure,
      pressureState: pState,
      pressureChartData: pChartData,
      movementValue: mValue,
      movementState: mState,
      movementChartData: mChartData,
      rotationValue: rValue,
      rotationState: rState,
      rotationChartData: rChartData,
      clinicalAnalysis: analysis,
    };
  }, [socketData]);

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

          {/* Sección de Monitoreo */}
          {socketData && (
            <View style={styles.monitoringSection}>
              <Text style={styles.monitoringTitle}>Monitor Terapéutico</Text>

              <View style={styles.chartContainer}>
                <PressureChartCard
                  pressureValue={pressureValue}
                  pressureState={pressureState}
                  chartData={pressureChartData}
                />
              </View>

              <View style={styles.chartContainer}>
                <MovementChartCard
                  magnitudeValue={movementValue}
                  movementState={movementState}
                  chartData={movementChartData}
                />
              </View>

              <View style={styles.chartContainer}>
                <RotationChartCard
                  gyroValue={rotationValue}
                  rotationState={rotationState}
                  chartData={rotationChartData}
                />
              </View>

              <View style={styles.diagnosticSummary}>
                <Text style={styles.summaryTitle}>Resumen Clínico</Text>

                <Text style={styles.interpretationText}>
                  🧠 {getInterpretationText('Monitoreo de Presión Táctil', pressureState.state)}
                </Text>
                <Text style={styles.interpretationText}>
                  🏃 {getInterpretationText('Análisis de Movimiento Corporal', movementState.state)}
                </Text>
                <Text style={styles.interpretationText}>
                  🌀 {getInterpretationText('Patrón de Rotación y Estimming', rotationState.state)}
                </Text>

                <View style={styles.recommendationsCard}>
                  <Text style={styles.recommendationsTitle}>Recomendaciones Terapéuticas</Text>
                  <Text style={styles.recommendationText}>
                    {getTherapeuticRecommendation(clinicalAnalysis)}
                  </Text>
                </View>
              </View>
            </View>
          )}

          <View style={styles.bottomSpacer} />
        </ScrollView>

        <TutorTabBar activeTab="InfoPeluche" />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 80,
  },
  monitoringSection: {
    marginTop: 20,
  },
  monitoringTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: ClinicalColors.primary,
    marginBottom: 20,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  chartContainer: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginVertical: 10,
    marginHorizontal: 16,
    elevation: 3,
    shadowColor: Colors.textSecondary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  diagnosticSummary: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: 20,
    margin: 16,
    marginTop: 20,
    marginBottom: 20,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: ClinicalColors.primary,
  },
  interpretationText: {
    fontSize: 14,
    marginBottom: 10,
    color: ClinicalColors.textSecondary,
  },
  recommendationsCard: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: ClinicalColors.cardBorder,
  },
  recommendationsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: ClinicalColors.primary,
    marginBottom: 6,
  },
  recommendationText: {
    fontSize: 14,
    color: ClinicalColors.textSecondary,
  },
  bottomSpacer: {
    height: 60,
  },
});

export default InfoPeluche;
