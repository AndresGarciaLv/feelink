import React from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import BluetoothDeviceItem from '../shared/components/Bluetooth1C/BluetoothDeviceItem';
import CustomModal from '../shared/components/Bluetooth1C/CustomModal/CustomModal';
import Header from '../shared/components/Bluetooth1C/Header/Header';
import Colors from '../shared/components/bluetooth/constants/colors';
import SimulatedDeviceScanner from '../shared/components/Bluetooth1C/SimulatedDeviceScanner/SimulatedDeviceScanner';
import OsitoIcon from '../shared/components/Bluetooth1C/Osito/OsitoIcon';
import useBluetoothLogic from '../shared/hooks/useBluetoothLogic';
import Svg, { Path, Rect } from 'react-native-svg';

const PhoneIcon = ({ size, color }: any) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <Rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
    <Path d="M12 18h.01" />
  </Svg>
);

const BluetoothIcon = ({ size, color }: any) => (
  <Svg width={size} height={size} viewBox="0 0 14 14" fill="none" stroke={color} strokeWidth="1.25">
    <Path d="m2.625 9.5l8.75-5.375l-4.75-3.5v12.75l4.75-3.5L2.625 4.5" />
  </Svg>
);

const BluetoothScreen1 = () => {
  const {
    devices,
    isScanning,
    modalVisible,
    modalMessage,
    modalTitle,
    selectedDevice,
    triggerSimulatedScan,
    handleScanResult,
    handleScanComplete,
    startScan,
    handleConnect,
    confirmConnection,
    closeModal,
    connectToWifi,
  } = useBluetoothLogic();

  return (
    <View style={styles.container}>
      <View style={styles.headerWrapper}>
        <Header title="Conexión por Bluetooth" showBackButton={true} />
      </View>

      <View style={styles.bubbleOverlay}>
        <View style={[styles.iconBubble, { zIndex: 2 }]}>
          <PhoneIcon size={30} color={'#9BC4E0'} />
        </View>
        <View style={[styles.iconBubble, { marginLeft: -15, zIndex: 3 }]}>
          <BluetoothIcon size={30} color={'#E0C7DB'} />
        </View>
        <View style={[styles.iconBubble, { marginLeft: -15, zIndex: 2 }]}>
          <OsitoIcon size={40} />
        </View>
      </View>

      <SimulatedDeviceScanner
        triggerScan={triggerSimulatedScan}
        onScanResult={handleScanResult}
        onScanComplete={handleScanComplete}
      />

      <Text style={styles.stepText}>Paso1: Asegúrate de que el peluche esté encendido y se encuentre cerca.</Text>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.leftButton} onPress={startScan}>
          <Text style={styles.buttonText}>Buscar Peluches</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.rightButton} onPress={connectToWifi}>
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
            data={devices}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <BluetoothDeviceItem
                deviceName={item.name}
                deviceId={item.id}
                status={item.status}
                onConnect={handleConnect}
                isConnected={item.isConnected}
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
        onConfirm={selectedDevice ? confirmConnection : closeModal}
        onCancel={selectedDevice ? closeModal : undefined}
        confirmText={selectedDevice ? 'Conectar' : 'OK'}
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
  headerWrapper: {
    position: 'relative',
    zIndex: 2,
  },
  bubbleOverlay: {
    position: 'absolute',
    top: 110, // Ajusta este valor para controlar la superposición
    left: 0,
    right: 0,
    zIndex: 2,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  iconBubble: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D3D3D3',
    backgroundColor: 'white',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  stepText: {
    fontSize: 13,
    color: Colors.textPrimary,
    fontFamily: 'Inter-Light',
    textAlign: 'center',
    marginBottom: 40,
    paddingHorizontal: 55,
    marginTop:70
  },
  buttonRow: {
  flexDirection: 'row',
  justifyContent: 'center', // Cambiado de 'space-between'
  width: '90%', // Reducido del 100%
  alignSelf: 'center', // Centrado horizontal
  marginTop: 10,
  gap: 16, // Espacio interno entre botones
},
  leftButton: {
    backgroundColor: '#9BC4E0',
    paddingVertical: 7,
    paddingHorizontal: 2,
    borderRadius: 13,
    flex: 1,
    marginRight: 50,
    alignItems: 'center',
  },
  rightButton: {
    backgroundColor: '#9BC4E0',
    paddingVertical: 7,
    paddingHorizontal: 2,
    borderRadius: 13,
    flex: 1,
    marginLeft: 50,
    alignItems: 'center',
  },
  buttonText: {
    color: Colors.white,
    fontSize: 15,
    fontFamily: 'Inter-SemiBold',
  },
  bottomSection: {
    flex: 1,
    marginTop: 30, // Hacer que la lista se separe
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

export default BluetoothScreen1;