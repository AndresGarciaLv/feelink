import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';

interface TabBarProps {
  activeTab?: 'Home' | 'Bluetooth' | 'Profile';
}

const TutorTabBar: React.FC<TabBarProps> = ({ activeTab = 'Home' }) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

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

      {/* Bluetooth central button azul */}
      <TouchableOpacity 
        style={styles.bluetoothButton}
        onPress={() => navigation.navigate('Bluetooth')}
      >
        <Ionicons 
          name="bluetooth" 
          size={28} 
          color="white" 
        />
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
    </View>
  );
};

const styles = StyleSheet.create({
  tabBar: {
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
  bluetoothButton: {
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

export default TutorTabBar;
