import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import { LinearGradient } from 'expo-linear-gradient';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Patients'>;

const HeaderPatients = () => {
  const navigation = useNavigation<NavigationProp>();

  const handleGoBack = () => {
    navigation.navigate('Dashboard');
  };

  return (
    <SafeAreaView>
      <LinearGradient
        colors={['#9bc4e0', '#cbe0f4']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.gradientHeader}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={handleGoBack}>
            <Ionicons name="arrow-back" size={28} color="white" />
          </TouchableOpacity>
          <Image
            source={require('../../shared/assets/img/perfil.png')}
            style={styles.avatar}
          />
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Tus pacientes</Text>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default HeaderPatients;

const styles = StyleSheet.create({
  gradientHeader: {
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    width: '100%',
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical: 60,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: '#CBE0F4',
  },
  titleContainer: {
    backgroundColor: '#7FB2D0',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 12,
    flex: 1,
    marginLeft: 10,
    justifyContent: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'left',
  },
});
