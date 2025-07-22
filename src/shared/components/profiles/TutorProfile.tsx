import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../core/types/common/navigation'; 
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import HeaderTutor from '../../components/HeaderTutor';
import PelucheIcon from '../../components/PelucheIcon';
import TutorTabBar from '../../../presentation/layout/TutorTabBar';
import { useAppSelector } from '../../../core/stores/store';
import { selectAccessToken, selectUserData } from '../../../core/stores/auth/authSlice';
import { TutorData } from '../../../core/types/tutor';
import { PatientData } from '../../../core/types/patient';
import { useSensorSocket } from '../../hooks/useSensorSocket';

type Navigation = NativeStackNavigationProp<RootStackParamList, 'TutorProfile'>;

const ProfileTutor: React.FC = () => {
  const navigation = useNavigation<Navigation>();
  // const insets = useSafeAreaInsets();

  // const handleIconPress = () => {
  //   navigation.navigate('DetallesPeluche');
  // };

  const userData = useAppSelector(selectUserData);
  const accessToken = useAppSelector(selectAccessToken);
  const { sensorData, isConnected } = useSensorSocket();
  const [tutorData, setTutorData] = useState<TutorData | null>(null);
  const [patientData, setPatientData] = useState<PatientData | null>(null);
  const battery = sensorData.battery.at(-1) ?? 100;

  useEffect(() => {
    const fetchTutorData = async () => {
      if (!userData?.id || !accessToken) return;

      try {
        const res = await fetch(`http://feelink-api.runasp.net/api/Users/${userData.id}/data`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const data: TutorData = await res.json();
        console.log(' Tutor cargado:', data);
        setTutorData(data);
      } catch (error) {
        console.error(' Error al obtener datos del tutor:', error);
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
        console.log(' Paciente cargado:', data);

        setPatientData(data);
      } catch (error) {
        console.error(' Error al obtener datos del paciente:', error);
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
          {patientData ? `${patientData.gender}` : ''}
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
        <PelucheIcon battery={battery} />
      </View>
      <Text style={styles.batteryStatus}>
        {battery !== undefined
          ? `${battery}% de carga`
          : isConnected
            ? 'Obteniendo batería...'
            : 'Desconectado'}
      </Text>


      <TutorTabBar activeTab="Perfil" />
    </View>
  );
};

export default ProfileTutor;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
        fontFamily: 'sans-serif',
    },
    content: {
        flex: 1,
    },
    avatarContainer: {
        alignItems: 'center',
        marginTop: 20,
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
    buttonGroup: {
        marginTop: 24,
        marginHorizontal: 24,
        gap: 12,
    },
    wifiButton: {
        backgroundColor: '#9BC4E0',
        padding: 12,
        borderRadius: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    wifiText: {
        color: '#FFF',
        fontWeight: '500',
        fontSize: 16,
    },
    batteryTitle: {
        textAlign: 'left',
        marginTop: 24,
        marginLeft: 24,
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
    },
    iconWrapper: {
        alignItems: 'center',
        marginTop: 16,    
    },
    batteryStatus: {
        textAlign: 'center',
        fontSize: 18,
        fontWeight: '600',
        color: '#4BA6F0',
        marginTop: 8,
    },
});