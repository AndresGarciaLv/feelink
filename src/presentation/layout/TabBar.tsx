import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';

interface TabBarProps {
  activeTab?: 'Home' | 'Patients' | 'Bluetooth' | 'Profile' | 'TherapistProfile';
  role: 'Therapist' | 'Tutor';
}

const TabBar: React.FC<TabBarProps> = ({ activeTab = 'Home', role }) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.tabBar}>
      {/* Home */}
      <TouchableOpacity
        style={styles.tabButton}
        onPress={() =>
          navigation.navigate(role === 'Tutor' ? 'HomeTutor' : 'Dashboard')
        }
      >
        <Ionicons
          name="home"
          size={24}
          color={activeTab === 'Home' ? '#4A90E2' : '#ADB5BD'}
        />
        <Text style={[styles.tabLabel, activeTab === 'Home' && styles.activeTabLabel]}>
          Home
        </Text>
      </TouchableOpacity>

      {/* Si es terapeuta, mostramos "Niños" */}
      {role === 'Therapist' && (
        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => navigation.navigate('Patients', { openAddModal: false })}
        >
          <Ionicons
            name="people"
            size={24}
            color={activeTab === 'Patients' ? '#4A90E2' : '#ADB5BD'}
          />
          <Text style={[styles.tabLabel, activeTab === 'Patients' && styles.activeTabLabel]}>
            Niños
          </Text>
        </TouchableOpacity>
      )}

      {/* Botón central */}
      <TouchableOpacity
        style={styles.centerButton}
        onPress={() =>
          role === 'Therapist'
            ? navigation.navigate('Patients', { openAddModal: true })
            : navigation.navigate('Bluetooth')
        }
      >
        <Ionicons
          name={role === 'Therapist' ? 'add' : 'bluetooth'}
          size={28}
          color="white"
        />
      </TouchableOpacity>

      {/* Si es terapeuta, muestra Bluetooth también */}
      {role === 'Therapist' && (
        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => navigation.navigate('Bluetooth')}
        >
          <Ionicons
            name="bluetooth"
            size={24}
            color={activeTab === 'Bluetooth' ? '#4A90E2' : '#ADB5BD'}
          />
          <Text style={[styles.tabLabel, activeTab === 'Bluetooth' && styles.activeTabLabel]}>
            Bluetooth
          </Text>
        </TouchableOpacity>
      )}

      {/* Perfil */}
      <TouchableOpacity
        style={styles.tabButton}
        onPress={() =>
          navigation.navigate(role === 'Tutor' ? 'TutorProfile' : 'TherapistProfile')
        }
      >
        <Ionicons
          name="person"
          size={24}
          color={
            activeTab === 'Profile' || activeTab === 'TherapistProfile'
              ? '#4A90E2'
              : '#ADB5BD'
          }
        />
        <Text
          style={[
            styles.tabLabel,
            (activeTab === 'Profile' || activeTab === 'TherapistProfile') &&
              styles.activeTabLabel,
          ]}
        >
          Perfil
        </Text>
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
    justifyContent: 'space-between',
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
  centerButton: {
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
