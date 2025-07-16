import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView, Platform, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import TabBar from '../../../presentation/layout/TabBar';
import type { RootStackParamList } from '../../../core/types/common/navigation';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useGetCurrentUserQuery } from '../../../core/http/requests/therapistServerApi';

const TherapistProfile: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();
  
  // Consultar datos del usuario actual
  const {
    data: userProfile,
    isFetching: isLoadingProfile,
    error: profileError
  } = useGetCurrentUserQuery();

  // Función para obtener el texto del tag basado en el rol
  const getRoleDisplayText = (roleName: string): string => {
    switch (roleName) {
      case 'SuperAdmin':
        return 'Super Administrador';
      case 'Therapist':
        return 'Terapeuta Certificado';
      case 'Tutor':
        return 'Tutor Especializado';
      default:
        return 'Profesional Certificado';
    }
  };

  // Función para obtener especialidades basadas en el rol
const getSpecialtiesByRole = (roleName: string): string[] => {
  switch (roleName) {
    case 'SuperAdmin':
        return ['Administración', 'Supervisión', 'Gestión'];
    case 'Therapist':
      return ['Terapia Infantil', 'Intervención en TEA', 'Seguimiento Emocional'];
    case 'Tutor':
      return ['Padre / Madre de Familia', 'Acompañamiento en Casa', 'Colaboración con Terapeutas'];
    default:
      return ['Atención Profesional'];
  }
};


  // Mostrar loading mientras se cargan los datos
  if (isLoadingProfile) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#9BC4E0" />
          <Text style={styles.loadingText}>Cargando perfil...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Mostrar error si no se pudieron cargar los datos
  if (profileError || !userProfile) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={48} color="#FF6B6B" />
          <Text style={styles.errorText}>Error al cargar el perfil</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => {
              // Aquí podrías agregar lógica para refetch
            }}
          >
            <Text style={styles.retryButtonText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const specialties = getSpecialtiesByRole(userProfile.roleName);
  const roleDisplayText = getRoleDisplayText(userProfile.roleName);
    
  return (
    <SafeAreaView style={styles.container}>
      {/* Header con gradiente */}
      <LinearGradient
        colors={['#9bc4e0', '#cbe0f4']} 
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.gradientHeader}
      >
        {/* Header con botón de regreso */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Perfil</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Avatar y tag dentro del gradiente */}
        <View style={styles.avatarContainer}>
          <Image
            source={
              userProfile.picture 
                ? { uri: userProfile.picture }
                : require('../../../shared/assets/img/perfil.png')
            }
            style={styles.avatar}
          />
          <TouchableOpacity style={styles.tagButton}>
            <Text style={styles.tagText}>{roleDisplayText}</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Contenido principal */}
      <View style={styles.content}>
        {/* Información personal del terapeuta */}
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{userProfile.name}</Text>
          <Text style={styles.subText}>{userProfile.email}</Text>
          {userProfile.companyName && (
            <Text style={styles.subTextGray}>{userProfile.companyName}</Text>
          )}
        </View>

        {/* Información adicional */}
        <View style={styles.additionalInfoContainer}>
          <View style={styles.infoRow}>
            <Ionicons name="person" size={20} color="#9BC4E0" />
            <Text style={styles.infoLabel}>Rol:</Text>
            <Text style={styles.infoValue}>{roleDisplayText}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="mail" size={20} color="#9BC4E0" />
            <Text style={styles.infoLabel}>Email:</Text>
            <Text style={styles.infoValue}>{userProfile.email}</Text>
          </View>
          {userProfile.companyName && (
            <View style={styles.infoRow}>
              <Ionicons name="business" size={20} color="#9BC4E0" />
              <Text style={styles.infoLabel}>Empresa:</Text>
              <Text style={styles.infoValue}>{userProfile.companyName}</Text>
            </View>
          )}
        </View>

        {/* Especialidades */}
        <View style={styles.specialtiesContainer}>
          <Text style={styles.sectionTitle}>Especialidades</Text>
          <View style={styles.specialtyTags}>
            {specialties.map((specialty, index) => (
              <View key={index} style={styles.specialtyTag}>
                <Text style={styles.specialtyText}>{specialty}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
            
      {/* Tab Bar Component - Fijo en el fondo */}
      <View style={{ paddingBottom: insets.bottom }}>
        <TabBar activeTab="Profile" />
      </View>
    </SafeAreaView>
  );
};

export default TherapistProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  gradientHeader: {
    paddingTop: Platform.OS === 'android' ? 30 : 40,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFF',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingTop: 15,
  },
  avatarContainer: {
    alignItems: 'center',
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: '#FFF',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  tagButton: {
    borderColor: '#FFF',
    borderWidth: 1,
    borderRadius: 50,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginTop: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  tagText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '600',
  },
  infoContainer: {
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 25,
    paddingHorizontal: 24,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
    textAlign: 'center',
  },
  subText: {
    fontSize: 15,
    color: '#666',
    marginBottom: 6,
    fontWeight: '500',
  },
  subTextGray: {
    fontSize: 13,
    color: '#999',
    textAlign: 'center',
  },
  additionalInfoContainer: {
    marginHorizontal: 24,
    marginBottom: 25,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
    marginRight: 8,
    minWidth: 60,
  },
  infoValue: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  specialtiesContainer: {
    marginHorizontal: 24,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  specialtyTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  specialtyTag: {
    backgroundColor: '#F0F8FF',
    borderColor: '#9BC4E0',
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  specialtyText: {
    color: '#9BC4E0',
    fontSize: 13,
    fontWeight: '500',
  },
  // Estilos para loading
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  // Estilos para error
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: '#FF6B6B',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 16,
    backgroundColor: '#9BC4E0',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});