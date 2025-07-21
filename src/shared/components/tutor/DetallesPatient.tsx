import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppSelector } from '../../../core/stores/store';
import { selectAccessToken, selectUserData } from '../../../core/stores/auth/authSlice';

interface TutorData {
  patientId: string;
  patientName: string;
  patientAge: number;
  therapistName: string;
  companyName: string;
}

interface PatientData {
  id: string;
  name: string;
  lastName: string;
  age: number;
  gender: string;
  height: number;
  weight: number;
}

const DetallesPatient: React.FC = () => {
  const navigation = useNavigation();
  const userData = useAppSelector(selectUserData);
  const accessToken = useAppSelector(selectAccessToken);
  const [tutorData, setTutorData] = useState<TutorData | null>(null);
  const [patientData, setPatientData] = useState<PatientData | null>(null);

  useEffect(() => {
    const fetchTutorData = async () => {
      if (!userData?.id || !accessToken) return;

      try {
        const res = await fetch(`http://feelink-api.runasp.net/api/Users/${userData.id}/data`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const data: TutorData = await res.json();
        setTutorData(data);
      } catch (error) {
        console.error('Error al obtener los datos del tutor:', error);
      }
    };

    fetchTutorData();
  }, [userData?.id, accessToken]);

  useEffect(() => {
    const fetchPatient = async () => {
      if (!tutorData?.patientId || !accessToken) return;

      try {
        const res = await fetch(`http://feelink-api.runasp.net/api/Patients/${tutorData.patientId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const data: PatientData = await res.json();
        setPatientData(data);
      } catch (error) {
        console.error('Error al obtener los datos del paciente:', error);
      }
    };

    fetchPatient();
  }, [tutorData?.patientId, accessToken]);

  return (
    <View>
      <Text style={styles.mainSectionTitle}>Mi pequeño</Text>
      <TouchableOpacity onPress={() => navigation.navigate('TutorProfile' as never)}>
        <View style={styles.profileCard}>
          <Image
            source={require('../../../shared/assets/img/Home-tutor.png')}
            style={styles.avatar}
          />
          <Text style={styles.childName}>
            {patientData ? `${patientData.name} ${patientData.lastName}` : 'Cargando...'}
          </Text>
          <Text style={styles.childAge}>
            {patientData ? `${patientData.age} Años` : ''}
          </Text>
          <Text style={styles.childId}>
            {patientData ? `${tutorData?.patientId} • ${patientData.gender}` : ''}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  mainSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    margin: 16,
    color: '#333',
  },
  profileCard: {
    backgroundColor: '#fff',
    margin: 16,
    padding:16,
    borderRadius: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 2, height: 2 },
    shadowRadius: 4,
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 100,
    marginBottom: 12,
  },
  childName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#444',
  },
  childAge: {
    fontSize: 14,
    color: '#666',
  },
  childId: {
    fontSize: 12,
    color: '#999',
  },
});

export default DetallesPatient;
