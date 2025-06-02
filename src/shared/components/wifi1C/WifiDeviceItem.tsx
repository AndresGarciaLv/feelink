import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Colors from '../bluetooth/constants/colors';
import CustomButton from '../bluetooth/CustomButton/CustomButton';
import Svg, { Path } from 'react-native-svg';

// Icono de candado para redes seguras
const LockIcon: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <Svg width={size} height={size} viewBox="0 0 14 14">
    <Path fill={color} fillRule="evenodd" d="M7 0a4.375 4.375 0 0 0-4.375 4.375V5h-.001C1.727 5 .999 5.728.999 6.625v5.752c0 .897.728 1.625 1.625 1.625h8.751c.897 0 1.625-.728 1.625-1.625V6.625C13 5.728 12.272 5 11.375 5v-.625A4.375 4.375 0 0 0 7 0m2.625 5v-.625a2.625 2.625 0 0 0-5.25 0V5zM3.5 6.25h7.875c.207 0 .375.168.375.375v5.752a.375.375 0 0 1-.375.375H2.624a.375.375 0 0 1-.375-.375V6.625c0-.207.168-.375.375-.375zM7 8.375a1.125 1.125 0 1 0 0 2.25a1.125 1.125 0 0 0 0-2.25" clipRule="evenodd" />
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

interface WiFiDeviceItemProps {
  networkName: string;
  security: boolean; // true if secured, false if open
  onConnect: (ssid: string) => void;
  isConnected: boolean;
}

const WiFiDeviceItem: React.FC<WiFiDeviceItemProps> = ({
  networkName,
  security,
  onConnect,
  isConnected,
}) => {
  return (
    <View style={styles.itemContainer}>
      <View style={styles.iconContainer}>
        <WifiIcon size={20} color={Colors.textPrimary} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.networkName}>{networkName}</Text>
        <View style={styles.statusContainer}>
          {security && <LockIcon size={14} color={Colors.textSecundary} />}
          <Text style={styles.networkStatus}>
            {security ? 'Segura' : 'Abierta'}
          </Text>
        </View>
      </View>
      <CustomButton
        title={isConnected ? 'Conectado' : 'Conectar'}
        onPress={() => onConnect(networkName)}
        style={isConnected ? styles.connectedButton : styles.connectButton}
        disabled={isConnected}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.background,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.11,
    elevation: 3,
    borderWidth: 1,
    borderColor: Colors.lightsteelblue,
    marginBottom: 10,
  },
  iconContainer: {
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
    marginRight: 10,
  },
  networkName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    fontFamily: 'Inter',
    lineHeight: 22,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  networkStatus: {
    fontSize: 14,
    color: Colors.textSecundary,
    fontFamily: 'Inter',
    lineHeight: 18,
    marginLeft: 5,
  },
  connectButton: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    backgroundColor: Colors.secondary,
  },
  connectedButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: Colors.softPurple,
  },
});

export default WiFiDeviceItem;