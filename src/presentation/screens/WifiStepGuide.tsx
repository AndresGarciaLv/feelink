import React from 'react';
import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Colors from '../../shared/components/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'react-native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {RootStackParamList} from '../../core/types/common/navigation';
type WifiGuideNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'WifiStepGuide'
>;
const steps = [
  {
    title: 'Paso 1: Enciende el peluche',
    description: 'Asegúrate de que el peluche esté encendido y con la luz de configuración visible.',
    image: require('../../../src/shared/assets/img/paso1.jpg'),
  },
  {
    title: 'Paso 2: Abre la configuración Wi-Fi',
    description: 'Ve a los ajustes de Wi-Fi en tu celular.',
    image: require('../../../src/shared/assets/img/paso3.jpg'),
  },
  {
    title: 'Paso 3: Selecciona “Peluche Setup”',
    description:
      'Toca la red llamada “Peluche Setup”. Aparecerá una ventana emergente, da clic en “Acceder desde la red”.',
    image: require('../../../src/shared/assets/img/paso3.jpg'),
  },
  {
    title: 'Paso 4: Presiona “Configurar Wi-Fi”',
    description: 'Una vez conectado a la red del peluche, vuelve a la app y toca “Configurar Wi-Fi”.',
    image: require('../../../src/shared/assets/img/paso4.jpg'),
  },
  {
    title: 'Paso 5: Elige tu red Wi-Fi',
    description: 'Selecciona la red a la que deseas conectar el peluche.',
    image: require('../../../src/shared/assets/img/paso5.jpg'),
  },
  {
    title: 'Paso 6: Ingresa la contraseña',
    description:
      'El nombre de la red se llenará automáticamente. Escribe la contraseña y presiona “Guardar”.',
    image: require('../../../src/shared/assets/img/paso6.jpg'),
  },
  {
    title: 'Paso 7: Espera la conexión',
    description:
      'Si la contraseña es correcta, saldrás automáticamente de esta pantalla. Si no, vuelve a intentarlo.',
    image: require('../../../src/shared/assets/img/paso7.jpg'),
  },
];

const WifiStepGuide = () => {
    const navigation = useNavigation<WifiGuideNavigationProp>();

  const handleGoToDashboard = () => {
    navigation.navigate('Dashboard'); // ✅ Navegación correcta
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <StatusBar barStyle="light-content" />

      <View style={[styles.header, { backgroundColor: Colors.primary }]}>
        <TouchableOpacity
          onPress={handleGoToDashboard}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Guia de Conexión</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {steps.map((step, index) => (
          <View key={index} style={styles.stepContainer}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>{index + 1}</Text>
            </View>

            <Image source={step.image} resizeMode="contain" style={styles.stepImage} />
            <Text style={styles.stepTitle}>{step.title}</Text>
            <Text style={styles.stepDescription}>{step.description}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 16,
    paddingHorizontal: 16,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 16,
    top: '50%',
    transform: [{ translateY: -14 }],
    zIndex: 10,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
  container: {
    paddingTop: 20,
    paddingBottom: 32,
    paddingHorizontal: 16,
  },
  stepContainer: {
    backgroundColor: Colors.white,
    marginBottom: 12,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    paddingVertical: 12,
    paddingHorizontal: 14,
    alignItems: 'center',
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepNumberText: {
    color: Colors.white,
    fontWeight: '600',
    fontSize: 14,
  },
  stepImage: {
    width: '90%',
    maxWidth: 280,
    height: 160,
    marginBottom: 12,
    borderRadius: 12,
    alignSelf: 'center',
    resizeMode: 'contain',
  },
  stepTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 6,
    textAlign: 'center',
  },
  stepDescription: {
    fontSize: 14,
    color: Colors.textSecundary,
    textAlign: 'center',
    lineHeight: 19,
  },
});

export default WifiStepGuide;