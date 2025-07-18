import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../core/types/common/navigation';

interface TabBarProps {
  activeTab?: 'Home' | 'Patients' | 'Profile' | 'TherapistProfile';
}

const TabBar: React.FC<TabBarProps> = ({ activeTab = 'Home' }) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  
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