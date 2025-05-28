import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../navigation/types'; 

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Patients'>;

const HeaderProfile = () => {
  const navigation = useNavigation<NavigationProp>();
  const handleGoBack = () => {
  navigation.navigate('Patients');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleGoBack}>
        <Ionicons name="arrow-back" size={28} color="black" />
      </TouchableOpacity>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Perfil del paciente</Text>
      </View>
    </View>
  );
};
export default HeaderProfile;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    width: '100%',
  },
  titleContainer: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 12,
    flex: 1,
    marginLeft: 10,
    justifyContent: 'center',
  },
  title: {
    color: '#black',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'left',
  },
});
