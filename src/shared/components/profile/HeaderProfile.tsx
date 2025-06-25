import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../core/types/common/navigation'; 

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'TutorProfile'>;

const HeaderProfile = () => {
  const navigation = useNavigation<NavigationProp>();
  const handleGoBack = () => {
  navigation.navigate('Bluetooth');
  };

  return (
    
    <View style={styles.container}>
      <TouchableOpacity onPress={handleGoBack}>
        <Ionicons name="arrow-back" size={28} color="white" />
      </TouchableOpacity>
      
      
    </View>
  );
};
export default HeaderProfile;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#9BC4E0',
    paddingHorizontal: 20,
    paddingVertical: 45,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    width: '100%',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15
  }
});
