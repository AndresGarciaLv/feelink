import React from 'react'; // Solo React, los hooks ya los usa el custom hook
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import WiFiDeviceItem from '../shared/components/wifi1C/WifiDeviceItem';
import CustomModal from '../shared/components/wifi1C/CustomModal1';
import Header from '../shared/components/Bluetooth1C/Header/Header';
import Colors from '../shared/components/bluetooth/constants/colors';
import SimulatedDeviceScannerWifi from '../shared/components/wifi1C/SimulatedDeviceScannerWifi';

// Import SVG for the icons
import Svg, { Path, Circle, Rect } from 'react-native-svg';
// Import PelucheIcon
import PelucheIcon from '../shared/components/PelucheIcon';

// Importar el custom hook
import { useWifiLogic } from '../shared/hooks/useWifiLogic'; // Asegúrate de que la ruta sea correcta

// Icono de Osito (Teddy Bear)
const GenericTeddyBearIcon: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="9" cy="7" r="4"></Circle>
    <Circle cx="15" cy="7" r="4"></Circle>
    <Path d="M12 16c-2 0-3.5 2-4.5 3.5S6 22 12 22s6-2.5 5.5-3.5S14 16 12 16z"></Path>
  </Svg>
);

// Icono de Más (Plus)
const PlusIcon: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M11 11V2h2v9h9v2h-9v9h-2v-9H2v-2z" />
  </Svg>
);

// Icono de Wi-Fi (Estático - sin animación SVG directa)
const WifiIcon: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path fill={color} d="M12,21L15.6,16.2C14.6,15.45 13.35,15 12,15C10.65,15 9.4,15.45 8.4,16.2L12,21" />
    <Path fill={color} d="M12,9C9.3,9 6.81,9.89 4.8,11.4L6.6,13.8C8.1,12.67 9.97,12 12,12C14.03,12 15.9,12.67 17.4,13.8L19.2,11.4C17.19,9.89 14.7,9 12,9Z" />
    <Path fill={color} d="M12,3C7.95,3 4.21,4.34 1.2,6.6L3,9C5.5,7.12 8.62,6 12,6C15.38,6 18.5,7.12 21,9L22.8,6.6C19.79,4.34 16.05,3 12,3" />
  </Svg>
);

type WifiScreen1Props = NativeStackScreenProps<RootStackParamList, 'Wifi1'>;

// La interfaz WifiNetwork se mantiene aquí si es usada solo por este componente,
// o se podría mover a un archivo de tipos compartidos si es usada en más lugares.
// Como ya la tenías definida en el hook, la puedes eliminar de aquí si solo la usas ahí.
// Pero la dejaremos para que el componente sepa el tipo de `item` en la FlatList.
interface WifiNetwork {
  ssid: string;
  security: boolean; // true if secured, false if open
  isConnected: boolean;
}


const WifiScreen1: React.FC<WifiScreen1Props> = ({ navigation }) => {
  // Consumir el custom hook y obtener todos los estados y funciones
  const {
    networks,
    isScanning,
    modalVisible,
    modalMessage,
    modalTitle,
    selectedNetwork,
    triggerSimulatedScan,
    startScan,
    handleConnect,
    confirmConnection,
    closeModal,
    handleScanResult,
    handleScanComplete,
  } = useWifiLogic(); // No pasamos 'navigation' al hook a menos que la lógica de navegación sea intrínseca al hook.

  return (
    <View style={styles.container}>
      <Header
        title="Conexión Wi-Fi"
        showBackButton={true}
      />

      <SimulatedDeviceScannerWifi
        triggerScan={triggerSimulatedScan}
        onScanResult={handleScanResult}
        onScanComplete={handleScanComplete}
      />

      {/* Contenedor para las burbujas */}
      <View style={styles.overlappingIconContainer}>
        <View style={[styles.iconBubbleBase, styles.pelucheIconPosition]}>
          <PelucheIcon size={40} />
        </View>
        <View style={styles.centerIconBubble}>
          <PlusIcon size={45} color={'#E0C7DB'} />
        </View>
        <View style={[styles.iconBubbleBase, styles.wifiIconPosition]}>
          <WifiIcon size={40} color={'#9BC4E0'} />
        </View>
      </View>

      {/* El texto y el botón ahora están directamente en el contenedor principal */}
      <Text style={styles.stepTextNoCard}>Paso 2: Conecta tu peluche a una red Wi-Fi para enviar los datos en tiempo real.</Text>

      <TouchableOpacity style={styles.singleButtonNoCard} onPress={startScan}>
        <Text style={styles.buttonText}>Buscar Redes</Text>
      </TouchableOpacity>

      <View style={styles.bottomSection}>
        {isScanning ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.secondary} />
            <Text style={styles.loadingText}>Escaneando redes...</Text>
          </View>
        ) : (
          <FlatList
            data={networks}
            keyExtractor={(item) => item.ssid}
            renderItem={({ item }) => (
              <WiFiDeviceItem
                networkName={item.ssid}
                security={item.security}
                onConnect={handleConnect}
                isConnected={item.isConnected}
              />
            )}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={() => (
              <Text style={styles.emptyListText}>No se encontraron redes Wi-Fi.</Text>
            )}
          />
        )}
      </View>

      <CustomModal
        isVisible={modalVisible}
        title={modalTitle}
        message={modalMessage}
        onConfirm={selectedNetwork ? confirmConnection : closeModal}
        onCancel={selectedNetwork ? closeModal : undefined}
        confirmText={selectedNetwork ? 'Conectar' : 'OK'}
        cancelText="Cancelar"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  
  overlappingIconContainer: {
    width: 200,
    height: 60,
    position: 'absolute',
    top: 110,
    alignSelf: 'center',
    zIndex: 3,
  },
  iconBubbleBase: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D3D3D3',
    backgroundColor: Colors.white,
    position: 'absolute',
  },
  centerIconBubble: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D3D3D3',
    backgroundColor: Colors.white,
    position: 'absolute',
    left: '50%',
    transform: [{ translateX: -30 }],
    zIndex: 3,
  },
  pelucheIconPosition: {
    left: '50%',
    transform: [{ translateX: -80 }],
    zIndex: 2,
  },
  wifiIconPosition: {
    left: '50%',
    transform: [{ translateX: 20 }],
    zIndex: 2,
  },

  stepTextNoCard: {
    fontSize: 12,
    color: Colors.textPrimary,
    fontFamily: 'Inter-Light',
    textAlign: 'center',
    marginTop: 55,
    marginBottom: 20,
    marginHorizontal: 40,
    paddingHorizontal: 10,
  },
  singleButtonNoCard: {
    backgroundColor: '#9BC4E0',
    paddingVertical: 11,
    paddingHorizontal: 35,
    borderRadius: 10,
    width: '40%',
    alignSelf: 'center',
    marginBottom: 40,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },

  bottomSection: {
    flex: 1,
    marginTop: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: Colors.textPrimary,
    fontFamily: 'Inter',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  emptyListText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: Colors.textPrimary,
    fontFamily: 'Inter',
  },
});

export default WifiScreen1;