// feelink/src/screens/BluetoothScreen1.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TextInput, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types'; // Importa tus tipos de navegación
import BluetoothDeviceItem from '../shared/components/Bluetooth1C/BluetoothDeviceItem';
import CustomButton from '../shared/components/CustomButton/CustomButton';
import CustomModal from '../shared/components/CustomModal/CustomModal';
import Header from '../shared/components/Header/Header';
import Colors from '../shared/components/bluetooth/constants/colors'; // Importa tus colores
// import Icon from 'react-native-vector-icons/Ionicons';

// Define el tipo de la ruta para esta pantalla
type BluetoothScreen1Props = NativeStackScreenProps<RootStackParamList, 'Bluetooth1'>;

// Simulación de un dispositivo BLE
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

  // Simula la búsqueda de dispositivos
  const startScan = () => {
    setIsScanning(true);
    setDevices([]); // Limpia la lista anterior
    setModalMessage('Buscando dispositivos...');
    setModalTitle('Escaneando Bluetooth');
    setModalVisible(true);

    setTimeout(() => {
      const newDevices: SimulatedDevice[] = [
        { id: 'dev1', name: 'Peluche_Teddy_001', status: 'Disponible', isConnected: false },
        { id: 'dev2', name: 'Peluche_Bear_002', status: 'Disponible', isConnected: false },
        { id: 'dev3', name: 'Peluche_Rabbit_003', status: 'Disponible', isConnected: false },
        { id: 'dev4', name: 'Otro_Dispositivo', status: 'No Compatible', isConnected: false },
      ];
      setDevices(newDevices);
      setIsScanning(false);
      setModalVisible(false); // Cierra el modal después de la búsqueda
    }, 3000); // Simula 3 segundos de escaneo
  };

  useEffect(() => {
    startScan(); // Inicia el escaneo al montar la pantalla
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
      // Simula la conexión
      setDevices(prevDevices =>
        prevDevices.map(d =>
          d.id === selectedDevice.id ? { ...d, status: 'Conectado', isConnected: true } : d
        )
      );
      setModalTitle('Conexión Exitosa');
      setModalMessage(`¡Conectado a ${selectedDevice.name}! Ahora puedes configurar el WiFi.`);
      setModalVisible(true);

      // Navega a la pantalla de WiFi después de un breve retraso
      setTimeout(() => {
        setModalVisible(false); // Cierra el modal antes de navegar
        navigation.navigate('Wifi1', { device: selectedDevice as any }); // 'as any' para evitar problemas de tipo con la simulación
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
      <Header title="Buscar Peluche" showBackButton={false} /> {/* No mostrar botón de retroceso en la pantalla inicial */}

      <View style={styles.searchContainer}>
        {/* <Icon name="search" size={20} color={Colors.lightsteelblue} style={styles.searchIcon} /> */}
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar dispositivo..."
          placeholderTextColor={Colors.lightsteelblue}
          value={searchText}
          onChangeText={setSearchText}
        />
        {searchText.length > 0 && (
          <TouchableOpacity onPress={() => setSearchText('')} style={styles.clearSearchButton}>
            {/* <Icon name="close-circle" size={20} color={Colors.lightsteelblue} /> */}
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
        onConfirm={selectedDevice ? confirmConnection : closeModal} // Si hay un dispositivo seleccionado, es una confirmación de conexión
        onCancel={selectedDevice ? closeModal : undefined} // Si hay un dispositivo, permite cancelar
        confirmText={selectedDevice ? 'Conectar' : 'OK'}
        cancelText="Cancelar"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary, // Color de fondo de la pantalla
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
  searchIcon: {
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
    paddingBottom: 20, // Espacio al final de la lista
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
