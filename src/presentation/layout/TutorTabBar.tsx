import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../core/types/common/navigation';
import AsyncStorage from '@react-native-async-storage/async-storage'; // <-- Importa AsyncStorage

interface TabBarProps {
  activeTab?: 'Home' | 'Profile' | 'InfoPeluche';
}

const TutorTabBar: React.FC<TabBarProps> = ({ activeTab = 'Home' }) => {
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
      {/* Home */}
      <TouchableOpacity
        style={styles.tabButton}
        onPress={() => navigation.navigate('HomeTutor')}
      >
        <Ionicons
          name="home"
          size={22}
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
        onPress={() => navigation.navigate('InfoPeluche')}
      >
        <Ionicons
          name="information-circle"
          size={22}
          color={activeTab === 'InfoPeluche' ? '#4A90E2' : '#ADB5BD'}
        />
        <Text style={[
          styles.tabLabel,
          activeTab === 'InfoPeluche' && styles.activeTabLabel
        ]}>
          Peluche
        </Text>
      </TouchableOpacity>

      {/* Perfil */}
      <TouchableOpacity
        style={styles.tabButton}
        onPress={() => navigation.navigate('TutorProfile')}
      >
        <Ionicons
          name="person"
          size={22}
          color={activeTab === 'Profile' ? '#4A90E2' : '#ADB5BD'}
        />
        <Text style={[
          styles.tabLabel,
          activeTab === 'Profile' && styles.activeTabLabel
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
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 60,
    width: '100%',
  },
  tabButton: {
    alignItems: 'center',
    flex: 1,
  },
  tabLabel: {
    fontSize: 11,
    color: '#ADB5BD',
    marginTop: 2,
  },
  activeTabLabel: {
    color: '#4A90E2',
  },
});

export default TutorTabBar;
