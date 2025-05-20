import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Ya viene con Expo

const HeaderPatients = () => {
  return (
    <View style={styles.container}>
      <TouchableOpacity>
        <Ionicons name="arrow-back" size={28} color="white" />
      </TouchableOpacity>
      <Image
        source={require('../../../assets/perfil.png')} // Ajusta la ruta si estás en otra carpeta
        style={styles.avatar}
      />
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Tus pacientes</Text>
      </View>
    </View>
  );
};

export default HeaderPatients;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#9BC4E0',
    paddingHorizontal: 16,
    paddingVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
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
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
