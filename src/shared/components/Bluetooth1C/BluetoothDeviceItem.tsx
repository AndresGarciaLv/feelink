// feelink/src/shared/components/Bluetooth1C/BluetoothDeviceItem.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Colors from '../bluetooth/constants/colors'; // Importa tus colores
import CustomButton from '../CustomButton/CustomButton'; // Importa el botón personalizado

interface BluetoothDeviceItemProps {
  deviceName: string;
  deviceId: string; // Para identificar el dispositivo
  status: string; // Ej: "Disponible", "Conectado"
  onConnect: (deviceId: string) => void;
  isConnected: boolean; // Para saber si ya está conectado
}

const BluetoothDeviceItem: React.FC<BluetoothDeviceItemProps> = ({
  deviceName,
  deviceId,
  status,
  onConnect,
  isConnected,
}) => {
  return (
    <View style={styles.itemContainer}>
      <View style={styles.textContainer}>
        <Text style={styles.deviceName}>{deviceName}</Text>
        <Text style={styles.deviceStatus}>{status}</Text>
      </View>
      <CustomButton
        title={isConnected ? 'Conectado' : 'Conectar'}
        onPress={() => onConnect(deviceId)}
        style={isConnected ? styles.connectedButton : styles.connectButton}
        disabled={isConnected} // Deshabilita si ya está conectado
      />
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.lightBlue, // Fondo del ítem
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    borderWidth: 1,
    borderColor: Colors.lightsteelblue,
  },
  textContainer: {
    flex: 1,
    marginRight: 10,
  },
  deviceName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    fontFamily: 'Inter',
  },
  deviceStatus: {
    fontSize: 14,
    color: Colors.textPrimary,
    marginTop: 4,
    fontFamily: 'Inter',
  },
  connectButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: Colors.secondary, // Color de conexión
  },
  connectedButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: Colors.softPurple, // Color para estado conectado
  },
});

export default BluetoothDeviceItem;
