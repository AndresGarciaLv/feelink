// feelink/src/screens/BluetoothScreen1.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TextInput, TouchableOpacity, ViewStyle } from 'react-native'; // Importa ViewStyle
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import BluetoothDeviceItem from '../shared/components/Bluetooth1C/BluetoothDeviceItem';
import CustomButton from '../shared/components/CustomButton/CustomButton';
import CustomModal from '../shared/components/CustomModal/CustomModal';
import Header from '../shared/components/Header/Header';
import Colors from '../shared/components/bluetooth/constants/colors';

// Importa SVG para los íconos
import Svg, { Path, Circle } from 'react-native-svg';

// Componente de ícono de búsqueda (simulando Ionicons search)
// AHORA ACEPTA LA PROPIEDAD 'style'
const SearchIcon: React.FC<{ size: number; color: string; style?: ViewStyle }> = ({ size, color, style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <Circle cx="11" cy="11" r="8"/>
    <Path d="M21 21l-4.35-4.35"/>
  </Svg>
);

// Componente de ícono de cerrar (simulando Ionicons close-circle)
// AHORA ACEPTA LA PROPIEDAD 'style'
const CloseIcon: React.FC<{ size: number; color: string; style?: ViewStyle }> = ({ size, color, style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <Circle cx="12" cy="12" r="10"/>
    <Path d="M15 9l-6 6M9 9l6 6"/>
  </Svg>
);

type BluetoothScreen1Props = NativeStackScreenProps<RootStackParamList, 'Bluetooth1'>;

interface SimulatedDevice {
  id: string;
  name: string;
  status: string;
  isConnected: boolean;
}

const BluetoothScreen1: React.FC<BluetoothScreen1Props> = ({ navigation }) => {
  const [devices, setDevices] = useState<SimulatedDevice[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  const [selectedDevice, setSelectedDevice] = useState<SimulatedDevice | null>(null);

  const startScan = () => {
    setIsScanning(true);
    setDevices([]);
    setModalMessage('Buscando dispositivos...');
    setModalTitle('Escaneando Bluetooth');
    setModalVisible(true);

    setTimeout(() => {
      const newDevices: SimulatedDevice[] = [
        { id: 'dev1', name: 'Peluche_Teddy_001', status: 'Disponible', isConnected: false },
        { id: 'dev2', name: 'Peluche_Bear_002', status: 'Disponible', isConnected: false },
      ];
      setDevices(newDevices);
      setIsScanning(false);
      setModalVisible(false);
    }, 3000);
  };

  useEffect(() => {
    startScan();
  }, []);

  const handleConnect = (deviceId: string) => {
    const deviceToConnect = devices.find(d => d.id === deviceId);
    if (deviceToConnect) {
      setSelectedDevice(deviceToConnect);
      setModalTitle('Conectar Dispositivo');
      setModalMessage(`¿Deseas conectar con ${deviceToConnect.name}?`);
      setModalVisible(true);
    }
  };

  const confirmConnection = () => {
    if (selectedDevice) {
      setModalVisible(false);
      setDevices(prevDevices =>
        prevDevices.map(d =>
          d.id === selectedDevice.id ? { ...d, status: 'Conectado', isConnected: true } : d
        )
      );
      setModalTitle('Conexión Exitosa');
      setModalMessage(`¡Conectado a ${selectedDevice.name}! Ahora puedes configurar el WiFi.`);
      setModalVisible(true);

      setTimeout(() => {
        setModalVisible(false);
        navigation.navigate('Wifi1', { device: selectedDevice });
      }, 1500);
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedDevice(null);
  };

  const filteredDevices = devices.filter(device =>
    device.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Header
        title="Buscar Peluche"
        subtitle="CONECTA EL PELUCHE POR BLUETOOTH"
        showBackButton={true}
      />

      <View style={styles.searchContainer}>
        {/* Aquí se pasa el estilo al SearchIcon */}
        <SearchIcon size={20} color={Colors.lightsteelblue} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar dispositivo..."
          placeholderTextColor={Colors.lightsteelblue}
          value={searchText}
          onChangeText={setSearchText}
        />
        {searchText.length > 0 && (
          <TouchableOpacity onPress={() => setSearchText('')} style={styles.clearSearchButton}>
            {/* Aquí se pasa el estilo al CloseIcon */}
            <CloseIcon size={20} color={Colors.lightsteelblue} />
          </TouchableOpacity>
        )}
      </View>

      {isScanning ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.secondary} />
          <Text style={styles.loadingText}>Escaneando dispositivos...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredDevices}
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

      <CustomButton
        title="Re-escanear"
        onPress={startScan}
        style={styles.scanButton}
        disabled={isScanning}
      />

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
    backgroundColor: Colors.primary,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 10,
    marginHorizontal: 20,
    marginVertical: 15,
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1.5,
    elevation: 2,
  },
  searchIcon: { // Este estilo se aplicará al ícono
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: Colors.textPrimary,
    fontFamily: 'Inter',
  },
  clearSearchButton: {
    marginLeft: 10,
    padding: 5,
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
  scanButton: {
    marginHorizontal: 20,
    marginBottom: 20,
    marginTop: 10,
  },
});

export default BluetoothScreen1;
