// feelink/src/shared/components/Bluetooth1C/BluetoothDeviceItem.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Colors from '../bluetooth/constants/colors'; // Importa tus colores
import CustomButton from '../Bluetooth1C/CustomButton/CustomButton'; // Importa el botón personalizado

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
    backgroundColor: Colors. background, // Fondo del ítem
   paddingHorizontal: 20, // Espacio izquierda/derecha
  paddingVertical: 12,   // Espacio arriba/abajo
    borderRadius: 18, // Borde redondiado
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.11,
    elevation: 3,
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
  lineHeight: 22, // Controla espacio entre líneas
},
deviceStatus: {
  fontSize: 14,
  color: Colors.textSecundary,
  fontFamily: 'Inter',
  lineHeight: 18, // Debe ser menor que el fontSize del deviceName
},
connectButton: {
  paddingVertical: 4,
  paddingHorizontal: 10,
  backgroundColor: Colors.secondary,
},
  connectedButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: Colors.softPurple, // '#E0C7DB'
  },
});

export default BluetoothDeviceItem;
