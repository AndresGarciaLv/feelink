import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Image, SafeAreaView, Platform, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';
import Colors from '../shared/components/bluetooth/constants/colors';
import HeaderTutor from '../../src/shared/components/HeaderTutor';

export default function PatientDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RootStackParamList, 'PatientDetail'>>();
  const { patientId, name, age, height, weight, bmi } = route.params;

  const [showGraph, setShowGraph] = useState(false);

  const generateMockEmotionData = (id: string) => {
    const seed = parseInt(id, 10);
    const labels = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
    return labels.map((label, index) => ({
      label,
      value: ((seed + index * 7) % 100) + 1,
    }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <HeaderTutor />
      
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Sección de perfil */}
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: 'https://thecodingclub.org/wp-content/uploads/2022/10/testimonial_8.png' }}
            style={styles.avatar}
          />
          <TouchableOpacity style={styles.tagButton}>
            <Text style={styles.tagText}>{name.split(' ')[0]}</Text>
          </TouchableOpacity>
        </View>

        {/* Información personal */}
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.subText}>{age} Años</Text>
          <Text style={styles.subTextGray}>{patientId} • Niño</Text>
        </View>

        {/* Datos físicos con divisores */}
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statValueWithUnit}>{height}
              <Text style={styles.statUnit}>cm</Text>
            </Text>
            <Text style={styles.statLabel}>Altura</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.statBox}>
            <Text style={styles.statValueWithUnit}>{weight}
              <Text style={styles.statUnit}>kg</Text>
            </Text>
            <Text style={styles.statLabel}>Peso</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.statBox}>
            <Text style={styles.statValue}>{bmi}</Text>
            <Text style={styles.statLabel}>IMC</Text>
          </View>
        </View>

        {/* Botones de acciones */}
        <View style={styles.actionsContainer}>
          <Pressable 
            style={[styles.actionButton, { backgroundColor: Colors.secondary }]}
            onPress={() => {/* Lógica para actualizar datos */}}
          >
            <Text style={styles.actionButtonText}>Actualizar datos</Text>
          </Pressable>

          <Pressable
            style={[styles.actionButton, { backgroundColor: Colors.primary, marginTop: 10 }]}
            onPress={() => setShowGraph(!showGraph)}
          >
            <Text style={styles.actionButtonText}>Gráficas de emociones</Text>
          </Pressable>
        </View>

        {/* Gráficas (condicional) */}
        {showGraph && (
          <View style={styles.graphSection}>
            <Text style={styles.sectionTitle}>Estrés del último mes</Text>
            <View style={styles.graphContainer}>
              {generateMockEmotionData(patientId).map((item, index) => (
                <View key={index} style={styles.graphBarContainer}>
                  <View
                    style={[
                      styles.graphBar,
                      { height: item.value }
                    ]}
                  />
                  <Text style={styles.graphLabel}>{item.label}</Text>
                  <Text style={styles.graphValue}>{item.value}%</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Botón de volver */}
        <Pressable
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Volver</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  avatarContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: Colors.primary,
  },
  tagButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 15,
    marginTop: 10,
  },
  tagText: {
    color: Colors.white,
    fontWeight: 'bold',
  },
  infoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 5,
  },
  subText: {
    fontSize: 16,
    color: Colors.textPrimary,
    marginBottom: 3,
  },
  subTextGray: {
    fontSize: 14,
    color: 'gray',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 10,
    paddingVertical: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statValueWithUnit: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  statUnit: {
    fontSize: 16,
    color: 'gray',
  },
  statLabel: {
    fontSize: 14,
    color: 'gray',
    marginTop: 5,
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: '#e0e0e0',
  },
  actionsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  actionButton: {
    borderRadius: 20,
    paddingVertical: 12,
    alignItems: 'center',
  },
  actionButtonText: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
  graphSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    color: Colors.textPrimary,
    marginBottom: 15,
  },
  graphContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 150,
    marginTop: 10,
  },
  graphBarContainer: {
    alignItems: 'center',
    width: 40,
  },
  graphBar: {
    width: 20,
    backgroundColor: Colors.secondary,
    borderRadius: 4,
  },
  graphLabel: {
    fontSize: 12,
    marginTop: 8,
    color: Colors.textPrimary,
  },
  graphValue: {
    fontSize: 10,
    color: 'gray',
    marginTop: 4,
  },
  backButton: {
    backgroundColor: '#f8c1e0',
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  backButtonText: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
});
