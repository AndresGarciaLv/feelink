import React from 'react';
import { StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../core/types/common/navigation';
import { LinearGradient } from 'expo-linear-gradient';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'TutorProfile'>;

const HeaderPatients = () => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={['#9bc4e0', '#cbe0f4']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.container}
      >
        {/* Aquí puedes agregar contenido, íconos o texto si quieres */}
      </LinearGradient>
    </SafeAreaView>
  );
};

export default HeaderPatients;

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: 'transparent', // o el color que desees, para evitar blanco
  },
  container: {
    paddingHorizontal: 20,
    paddingVertical: 60,
    marginTop: 0,
    top: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    width: '100%',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    zIndex: 1,
  },
});
