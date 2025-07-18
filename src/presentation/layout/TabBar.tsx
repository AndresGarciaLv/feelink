import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // <-- Importa AsyncStorage
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../core/types/common/navigation';

interface TabBarProps {
  activeTab?: 'Home' | 'Patients' | 'Profile' | 'TherapistProfile';
}

const TabBar: React.FC<TabBarProps> = ({ activeTab = 'Home' }) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleLogout = async () => {
    Alert.alert('Cerrar sesión', '¿Estás seguro que quieres cerrar sesión?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Cerrar sesión',
        style: 'destructive',
        onPress: async () => {
          try {
            // Borra tokens o cualquier dato de sesión guardado
            await AsyncStorage.removeItem('accessToken');
            await AsyncStorage.removeItem('refreshToken');
            // También puedes limpiar todo si quieres:
            // await AsyncStorage.clear();

            // Navega a login y limpia historial para que no pueda volver
            navigation.reset({
              index: 0,
              routes: [{ name: 'Auth' }], // Cambia 'Login' si tu pantalla tiene otro nombre
            });
          } catch (e) {
            console.error('Error limpiando sesión:', e);
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.tabBar}>
      <TouchableOpacity 
        style={styles.tabButton}
        onPress={() => navigation.navigate('Dashboard')}
      >
        <Ionicons 
          name="home" 
          size={24} 
          color={activeTab === 'Home' ? '#4A90E2' : '#ADB5BD'} 
        />
        <Text style={[
          styles.tabLabel, 
          activeTab === 'Home' && styles.activeTabLabel
        ]}>
          Home
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.tabButton} 
        onPress={() => navigation.navigate('Patients', { openAddModal: false })}
      >
        <Ionicons 
          name="people" 
          size={24} 
          color={activeTab === 'Patients' ? '#4A90E2' : '#ADB5BD'} 
        />
        <Text style={[
          styles.tabLabel,
          activeTab === 'Patients' && styles.activeTabLabel
        ]}>
          Niños
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => navigation.navigate('Patients', { openAddModal: true })}
      >
        <Ionicons name="add" size={28} color="white" />
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.tabButton}
        onPress={() => navigation.navigate('TherapistProfile')}
      >
        <Ionicons 
          name="person" 
          size={24} 
          color={activeTab === 'Profile' || activeTab === 'TherapistProfile' ? '#4A90E2' : '#ADB5BD'} 
        />
        <Text style={[
          styles.tabLabel,
          (activeTab === 'Profile' || activeTab === 'TherapistProfile') && styles.activeTabLabel
        ]}>
          Perfil
        </Text>
      </TouchableOpacity>

      {/* Botón cerrar sesión */}
      <TouchableOpacity 
        style={styles.tabButton}
        onPress={handleLogout}
      >
        <Ionicons 
          name="log-out-outline" 
          size={24} 
          color="#ADB5BD" 
        />
        <Text style={styles.tabLabel}>Cerrar sesión</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 10,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  tabButton: {
    alignItems: 'center',
    flex: 1,
  },
  tabLabel: {
    fontSize: 12,
    color: '#ADB5BD',
    marginTop: 4,
  },
  activeTabLabel: {
    color: '#4A90E2',
  },
  addButton: {
    backgroundColor: '#4A90E2',
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
});

export default TabBar;
