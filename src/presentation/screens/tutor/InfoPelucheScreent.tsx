import React from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useAppSelector } from '../../../core/stores/store';
import { selectUserData, selectAccessToken } from '../../../core/stores/auth/authSlice';
import HeaderTutor from '../../../shared/components/home-tutor/HeaderTutor';
import DetallesPatient from '../../../shared/components/tutor/DetallesPatient';
import ResumenEmocional from '../../../shared/components/tutor/ResumenEmocional';
import TutorTabBar from '../../layout/TutorTabBar';
import { useSensorSocket } from '../../../shared/hooks/useSensorSocket';
import RealTimeCharts from '../../../shared/components/charts/RealTimeCharts';

const InfoPelucheScreen: React.FC = () => {
  const userData = useAppSelector(selectUserData);
  const accessToken = useAppSelector(selectAccessToken);
  const { sensorData, isConnected } = useSensorSocket(); // 👈 Aquí llegan los datos reales del peluche

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.content}>
          <HeaderTutor
            tutorName={`Tutor ${userData?.name}`}
            centerName="Centro terapéutico"
            specialistName="Especialista asignado"
          />

          <DetallesPatient />

          {userData?.id && accessToken && (
            <ResumenEmocional patientId={userData.id} accessToken={accessToken} />
          )}

          {sensorData && <RealTimeCharts/>}
        </ScrollView>

        <TutorTabBar activeTab="InfoPeluche" />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    paddingBottom: 80,
  },
});

export default InfoPelucheScreen;
