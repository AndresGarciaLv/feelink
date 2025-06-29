// src/shared/components/wifi1C/WifiDeviceItem.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '../constants/colors';
import CustomButton from '../bluetooth/CustomButton/CustomButton';
import Svg, { Path } from 'react-native-svg';
import WifiStrengthIcon from './WifiStrengthIcon';

const LockIcon: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <Svg width={size} height={size} viewBox="0 0 14 14">
    <Path
      fill={color}
      fillRule="evenodd"
      d="M7 0a4.375 4.375 0 0 0-4.375 4.375V5h-.001C1.727 5 .999 5.728.999 6.625v5.752c0 .897.728 1.625 1.625 1.625h8.751c.897 0 1.625-.728 1.625-1.625V6.625C13 5.728 12.272 5 11.375 5v-.625A4.375 4.375 0 0 0 7 0m2.625 5v-.625a2.625 2.625 0 0 0-5.25 0V5zM3.5 6.25h7.875c.207 0 .375.168.375.375v5.752a.375.375 0 0 1-.375.375H2.624a.375.375 0 0 1-.375-.375V6.625c0-.207.168-.375.375-.375zM7 8.375a1.125 1.125 0 1 0 0 2.25a1.125 1.125 0 0 0 0-2.25"
      clipRule="evenodd"
    />
  </Svg>
);

interface WiFiDeviceItemProps {
  networkName: string;
  open: boolean;
  rssi: number;
  onConnect: () => void;
  onDisconnect: () => void;
  isConnected: boolean;
}

const WiFiDeviceItem: React.FC<WiFiDeviceItemProps> = ({
  networkName,
  open,
  rssi,
  onConnect,
  onDisconnect,
  isConnected,
}) => {
  const isSecured = !open;

  return (
    <View style={styles.itemContainer}>
      <View style={styles.iconContainer}>
        <WifiStrengthIcon rssi={rssi} size={24} />
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.networkName}>{networkName}</Text>
        <View style={styles.statusContainer}>
          {isSecured && <LockIcon size={14} color={Colors.textSecundary} />}
          <Text style={styles.networkStatus}>
            {isSecured ? 'Segura' : 'Abierta'}
          </Text>
        </View>
      </View>

      <CustomButton
        title={isConnected ? 'Desconectar' : 'Conectar'}
        onPress={isConnected ? onDisconnect : onConnect}
        style={isConnected ? styles.connectedButton : styles.connectButton}
        textStyle={styles.buttonText}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: Colors.white, paddingHorizontal: 18, paddingVertical: 14,
    borderRadius: 16, borderWidth: 1, borderColor: Colors.lightsteelblue,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08, shadowRadius: 2, elevation: 2, marginBottom: 12,
  },
  iconContainer: { marginRight: 10 },
  textContainer: { flex: 1, marginRight: 10 },
  networkName: {
    fontSize: 16, fontWeight: '600', color: Colors.textPrimary,
    fontFamily: 'Inter-SemiBold', marginBottom: 4,
  },
  statusContainer: { flexDirection: 'row', alignItems: 'center' },
  networkStatus: {
    fontSize: 13, color: Colors.textSecundary,
    fontFamily: 'Inter-Light', marginLeft: 5,
  },
  connectButton: {
    backgroundColor: Colors.secondary,
    paddingVertical: 8, paddingHorizontal: 14, borderRadius: 10,
  },
  connectedButton: {
    backgroundColor: Colors.softPurple,
    paddingVertical: 8, paddingHorizontal: 14, borderRadius: 10,
  },
  buttonText: { color: Colors.white, fontSize: 14, fontWeight: '600' },
});

export default WiFiDeviceItem;
