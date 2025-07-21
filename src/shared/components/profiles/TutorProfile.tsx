import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import HeaderTutor from '../../components/HeaderTutor';
import PelucheIcon from '../../components/PelucheIcon';
import TutorTabBar from '../../../presentation/layout/TutorTabBar';
import { useAppSelector } from '../../../core/stores/store';
import { selectAccessToken, selectUserData } from '../../../core/stores/auth/authSlice';
import { TutorData } from '../../../core/types/tutor';
import { PatientData } from '../../../core/types/patient';

const ProfileTutor: React.FC = () => {
  const userData = useAppSelector(selectUserData);
  const accessToken = useAppSelector(selectAccessToken);

  const [tutorData, setTutorData] = useState<TutorData | null>(null);
  const [patientData, setPatientData] = useState<PatientData | null>(null);

useEffect(() => {
  const fetchTutorData = async () => {
    if (!userData?.id || !accessToken) return;

    try {
      const res = await fetch(`http://feelink-api.runasp.net/api/Users/${userData.id}/data`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data: TutorData = await res.json();
      console.log('👤 Tutor cargado:', data);
      setTutorData(data);
    } catch (error) {
      console.error('❌ Error al obtener datos del tutor:', error);
    }
  };

  fetchTutorData();
}, [userData?.id, accessToken]);

useEffect(() => {
  const fetchPatient = async () => {
    if (!tutorData?.patientId || !accessToken) return;

    try {
      const res = await fetch(`http://feelink-api.runasp.net/api/Patients/${tutorData.patientId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data: PatientData = await res.json();
      console.log('🧒 Paciente cargado:', data);
      
      setPatientData(data);
    } catch (error) {
      console.error('❌ Error al obtener datos del paciente:', error);
    }
  };

  fetchPatient();
}, [tutorData?.patientId, accessToken]);


  const calculateIMC = () => {
    if (!patientData?.height || !patientData?.weight) return '--';
    const imc = patientData.weight / (patientData.height / 100) ** 2;
    return imc.toFixed(1);
  };

  return (
    <View style={styles.container}>
      <HeaderTutor />

      <View style={styles.avatarContainer}>
        <Image source={require('../../assets/img/perfil.png')} style={styles.avatar} />
        <TouchableOpacity style={styles.tagButton}>
          <Text style={styles.tagText}>
            {patientData?.stuffedToyName ?? 'Peluchín'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.name}>
          {`Tutor ${userData?.name}`}
        </Text>
        <Text style={styles.subText}>
          {patientData ? `${patientData.name} ${patientData.lastName}` : 'Cargando...'} • {patientData ? `${patientData.age} Años` : ''}
        </Text>
        <Text style={styles.subTextGray}>
          {patientData ? `${tutorData?.patientId} • ${patientData.gender}` : ''}
        </Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statValueWithUnit}>
            {patientData?.height ?? '--'} <Text style={styles.statUnit}>cm</Text>
          </Text>
          <Text style={styles.statLabel}>Altura</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.statBox}>
          <Text style={styles.statValueWithUnit}>
            {patientData?.weight ?? '--'} <Text style={styles.statUnit}>kg</Text>
          </Text>
          <Text style={styles.statLabel}>Peso</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.statBox}>
          <Text style={styles.statValue}>{calculateIMC()}</Text>
          <Text style={styles.statUnit}>IMC</Text>
        </View>
      </View>

      <Text style={styles.batteryTitle}>Batería del peluche</Text>

      <View style={styles.iconWrapper}>
        <PelucheIcon />
      </View>

      <Text style={styles.batteryStatus}>80% de carga</Text>
      <TutorTabBar activeTab="Perfil" />
    </View>
  );
};


export default ProfileTutor;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F8FC',
  },
  avatarContainer: {
    alignItems: 'center',
    marginTop: 24,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  tagButton: {
    backgroundColor: '#D1E7DD',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 8,
  },
  tagText: {
    color: '#0F5132',
    fontWeight: 'bold',
  },
  infoContainer: {
    alignItems: 'center',
    marginTop: 12,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  subText: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
  subTextGray: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 24,
    marginHorizontal: 20,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    elevation: 2,
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
  },
  statValueWithUnit: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
  },
  statUnit: {
    fontSize: 12,
    color: '#666',
  },
  statLabel: {
    fontSize: 12,
    color: '#777',
    marginTop: 4,
  },
  divider: {
    width: 1,
    backgroundColor: '#ccc',
    marginHorizontal: 8,
  },
  batteryTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 24,
    textAlign: 'center',
    color: '#333',
  },
  iconWrapper: {
    alignItems: 'center',
    marginVertical: 16,
  },
  batteryStatus: {
    textAlign: 'center',
    fontSize: 14,
    color: '#555',
  },
});
