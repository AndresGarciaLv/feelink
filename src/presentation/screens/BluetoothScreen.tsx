// BluetoothScreen.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';

import BluetoothDeviceItem from '../../shared/components/bluetooth/BluetoothDeviceItem';
import CustomModal from '../../shared/components/bluetooth/CustomModal/CustomModal';
import Header from '../../shared/components/bluetooth/Header/Header';
import BubbleOverlay from '../../shared/components/bluetooth/BubbleOverlay';
import Colors from '../../shared/components/constants/colors';
import useBluetoothLogic from '../../shared/hooks/useBluetoothLogic';
import TabBar from '../layout/TabBar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Device } from 'react-native-ble-plx';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../core/types/common/navigation'; 
import { StackNavigationProp } from '@react-navigation/stack';
type BluetoothScreenNavigationProp = StackNavigationProp<RootStackParamList>;


const BluetoothScreen = () => {
  const navigation = useNavigation<BluetoothScreenNavigationProp>();

  const {
    devices,
    isScanning,
    modalVisible,
    modalMessage,
    modalTitle,
    selectedDevice,
    isConnected,
    connectedDevice,
    startScan,
    handleConnect,
    confirmConnection,
    closeModal,
    
    handleDisconnect,
    setSelectedDevice,
  } = useBluetoothLogic();

  const insets = useSafeAreaInsets();
  const connectToWifi = () => {
    const deviceId = '1234'; // tu lógica real aquí
    navigation.navigate('Wifi1', { deviceId });
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerWrapper}>
        <Header title="Conexión por Bluetooth" showBackButton />
      </View>

      <BubbleOverlay />

      <Text style={styles.stepText}>
        Paso 1: Asegúrate de que el peluche esté encendido y se encuentre cerca.
      </Text>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.leftButton, isScanning && { opacity: 0.5 }]}
          onPress={startScan}
          disabled={isScanning}
        >
          <Text style={styles.buttonText}>Buscar Peluches</Text>
        </TouchableOpacity>

         <TouchableOpacity
         style={[styles.rightButton]}
         onPress={connectToWifi}
        >
      <Text style={styles.buttonText}>Conectar Wifi</Text>
    </TouchableOpacity>


      </View>

      <View style={styles.bottomSection}>
        {isScanning ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.secondary} />
            <Text style={styles.loadingText}>Escaneando dispositivos...</Text>
          </View>
        ) : (
         <FlatList
  data={devices.filter((item): item is Device & { name: string } => !!item.name)}
  keyExtractor={(item) => item.id}
  renderItem={({ item }) => (
    <BluetoothDeviceItem
      deviceName={item.name}
      deviceId={item.id}
      status={item.id}
      onConnect={() => {
        if (connectedDevice?.id === item.id) {
          handleDisconnect();
        } else {
          setSelectedDevice(item as Device);
          handleConnect(item as Device);
        }
      }}
      isConnected={connectedDevice?.id === item.id}
    />
  )}
  contentContainerStyle={styles.listContent}
  ListEmptyComponent={() => (
    <Text style={styles.emptyListText}>No se encontraron dispositivos.</Text>
  )}
/>

        )}
      </View>

     
      <CustomModal
  isVisible={modalVisible}
  title={modalTitle}
  message={modalMessage}
  onConfirm={isScanning || !selectedDevice ? closeModal : confirmConnection}
  onCancel={!isScanning && selectedDevice ? closeModal : undefined}
  confirmText={isScanning || !selectedDevice ? 'OK' : 'Conectar WiFi'}
  cancelText="Cancelar"
/>


      {/* TabBar Posicionado correctamente */}
      <View style={[styles.tabBarWrapper, { bottom: insets.bottom || 12 }]}>
        <TabBar activeTab="Bluetooth" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  headerWrapper: {
    position: 'relative',
    zIndex: 2,
  },
  stepText: {
    fontSize: 13,
    color: Colors.textPrimary,
    fontFamily: 'Inter-Light',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 55,
    marginTop: 50,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '90%',
    alignSelf: 'center',
    marginTop: 10,
    gap: 16,
  },
  leftButton: {
    backgroundColor: '#9BC4E0',
    paddingVertical: 10,
    borderRadius: 15,
    flex: 1,
    alignItems: 'center',
  },
  rightButton: {
    backgroundColor: '#9BC4E0',
    paddingVertical: 10,
    borderRadius: 15,
    flex: 1,
    alignItems: 'center',
  },
  buttonText: {
    color: Colors.white,
    fontSize: 15,
    fontFamily: 'Inter-SemiBold',
  },
  bottomSection: {
    flex: 1,
    marginTop: 30,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 60,
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
  tabBarWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 10,
  },
});

export default BluetoothScreen;
