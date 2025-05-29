// feelink/src/screens/WifiScreen1.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types'; // Importa tus tipos de navegación
import WifiInput from '../shared/components/Wifi1C/WifiInput';
import CustomButton from '../shared/components/CustomButton/CustomButton';
import CustomModal from '../shared/components/CustomModal/CustomModal';
// import Header from '../shared/components/Header/Header';
import Colors from '../shared/components/bluetooth/constants/colors'; // Importa tus colores

// Define el tipo de la ruta para esta pantalla
type WifiScreen1Props = NativeStackScreenProps<RootStackParamList, 'Wifi1'>;

const WifiScreen1: React.FC<WifiScreen1Props> = ({ route, navigation }) => {
  const { device } = route.params; // Obtiene el dispositivo Bluetooth de los parámetros de navegación

  const [ssid, setSsid] = useState('');
  const [password, setPassword] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');

  const handleConnectWifi = () => {
    if (!ssid.trim()) {
      setModalTitle('Error');
      setModalMessage('Por favor, ingresa el nombre de la red (SSID).');
      setModalVisible(true);
      return;
    }
    if (!password.trim()) {
      setModalTitle('Error');
      setModalMessage('Por favor, ingresa la contraseña de la red.');
      setModalVisible(true);
      return;
    }

    setModalTitle('Conectando a WiFi');
    setModalMessage(`Intentando conectar ${device.name} a la red ${ssid}...`);
    setModalVisible(true);

    // Simula el proceso de conexión a WiFi
    setTimeout(() => {
      setModalTitle('Conexión WiFi Exitosa');
      setModalMessage(`¡${device.name} se ha conectado a la red ${ssid} exitosamente!`);
      setModalVisible(true);
      // Opcional: navegar a otra pantalla o resetear el estado
      // navigation.navigate('Dashboard');
    }, 3000);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>

      {/* <Header title="Conectar a WiFi" showBackButton={true} /> */}

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.deviceInfoText}>
          Configurando WiFi para: <Text style={styles.deviceNameText}>{device.name}</Text>
        </Text>

        <WifiInput
          label="Nombre de la red (SSID)"
          placeholder="Ej: MiRedWiFi"
          value={ssid}
          onChangeText={setSsid}
          autoCapitalize="none"
        />

        <WifiInput
          label="Contraseña"
          placeholder="Ingresa la contraseña de la red"
          value={password}
          onChangeText={setPassword}
          secureTextEntry // Para ocultar la contraseña
        />

        <CustomButton
          title="Conectar WiFi"
          onPress={handleConnectWifi}
          style={styles.connectButton}
        />
      </ScrollView>

      <CustomModal
        isVisible={modalVisible}
        title={modalTitle}
        message={modalMessage}
        onConfirm={closeModal}
        confirmText="OK"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center', // Centra el contenido verticalmente
  },
  deviceInfoText: {
    fontSize: 18,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 30,
    fontFamily: 'Inter',
  },
  deviceNameText: {
    fontWeight: 'bold',
    color: Colors.secondary,
  },
  connectButton: {
    marginTop: 30,
  },
});

export default WifiScreen1;
