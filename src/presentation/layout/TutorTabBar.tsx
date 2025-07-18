import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../core/types/common/navigation';

interface TabBarProps {
  activeTab?: 'Home' | 'Profile';
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
});

export default TutorTabBar;
