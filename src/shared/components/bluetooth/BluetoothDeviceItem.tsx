import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from './constants/colors';
import CustomButton from './CustomButton/CustomButton';

interface BluetoothDeviceItemProps {
  deviceName: string;
  deviceId: string;
  status: string;
  onConnect: (deviceId: string) => void;
  isConnected: boolean;
}

const BluetoothDeviceItem: React.FC<BluetoothDeviceItemProps> = ({
  deviceName,
  deviceId,
  status,
  onConnect,
  isConnected,
}) => {
  return (
    <View style={styles.itemWrapper}>
      <View style={styles.itemContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.deviceName}>{deviceName || 'Dispositivo sin nombre'}</Text>
          <Text style={styles.deviceStatus}>{deviceId}</Text>
        </View>

        <CustomButton
          title={isConnected ? 'Desconectar' : 'Conectar'}
          onPress={() => onConnect(deviceId)}
          style={isConnected ? styles.connectedButton : styles.connectButton}
          textStyle={styles.buttonText}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  itemWrapper: {
    marginBottom: 12, // Separación entre ítems
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.lightsteelblue,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  textContainer: {
    flex: 1,
    marginRight: 12,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 4,
  },
  deviceStatus: {
    fontSize: 13,
    color: Colors.textSecundary,
    fontFamily: 'Inter-Light',
  },
  connectButton: {
    backgroundColor: Colors.secondary,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  connectedButton: {
    backgroundColor: Colors.softPurple,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
});

export default BluetoothDeviceItem;
