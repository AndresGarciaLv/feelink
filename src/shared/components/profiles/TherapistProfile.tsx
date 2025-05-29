import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import TabBar from '../../../shared/navigation/TabBar';
import type { RootStackParamList } from '../../../navigation/types';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

const TherapistProfile: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    
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
            source={require('../../../../assets/perfil.png')}
            style={styles.avatar}
          />
          <TouchableOpacity style={styles.tagButton}>
            <Text style={styles.tagText}>Terapeuta Certificado</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Contenido principal */}
      <View style={styles.content}>
        {/* Información personal del terapeuta */}
        <View style={styles.infoContainer}>
          <Text style={styles.name}>Dr. Diego Aleman Mena</Text>
          <Text style={styles.subText}>Fisioterapeuta Especializado</Text>
          <Text style={styles.subTextGray}>8 años de experiencia</Text>
        </View>

        {/* Especialidades */}
        <View style={styles.specialtiesContainer}>
          <Text style={styles.sectionTitle}>Especialidades</Text>
          <View style={styles.specialtyTags}>
            <View style={styles.specialtyTag}>
              <Text style={styles.specialtyText}>Rehabilitación</Text>
            </View>
            <View style={styles.specialtyTag}>
              <Text style={styles.specialtyText}>Fisioterapia</Text>
            </View>
            <View style={styles.specialtyTag}>
              <Text style={styles.specialtyText}>Traumatología</Text>
            </View>
          </View>
        </View>
      </View>
            
      {/* Tab Bar Component - Fijo en el fondo */}
      <TabBar activeTab="Profile" />
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
    paddingTop: Platform.OS === 'android' ? 50 : 60,
    paddingBottom: 30,
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
    marginBottom: 20,
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
    width: 40, // Para balancear el header
  },
  content: {
    flex: 1,
    paddingTop: 20,
  },
  avatarContainer: {
    alignItems: 'center',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
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
    marginTop: 20,
    marginBottom: 30,
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
});