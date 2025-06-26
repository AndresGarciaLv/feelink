import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';

interface Props {
  icon: React.ReactNode;
  connected: boolean;
  ssid?: string;
  onToggle?: () => void;
}

const WifiOffIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24">
    <Path 
      fill="black" 
      d="M2.28 3L1 4.27l1.47 1.47c-.43.26-.86.55-1.27.86L3 9c.53-.4 1.08-.75 1.66-1.07l2.23 2.23c-.74.34-1.45.75-2.09 1.24l1.8 2.4c.78-.58 1.66-1.03 2.6-1.33L11.75 15c-1.25.07-2.41.5-3.35 1.2L12 21l2.46-3.27L17.74 21L19 19.72M12 3c-2.15 0-4.2.38-6.1 1.07l2.39 2.4C9.5 6.16 10.72 6 12 6c3.38 0 6.5 1.11 9 3l1.8-2.4C19.79 4.34 16.06 3 12 3m0 6c-.38 0-.75 0-1.12.05l3.19 3.2c1.22.28 2.36.82 3.33 1.55l1.8-2.4C17.2 9.89 14.7 9 12 9"
    />
  </Svg>
);

export default function WifiStatusCard({
  icon,
  connected,
  ssid = 'MiCasaWiFi',
  onToggle,
}: Props) {
  return (
    <View style={styles.card}>
      {/* Izquierda: Contenido dinámico según estado */}
      <View style={styles.leftSection}>
        <View style={styles.iconContainer}>
          {connected ? icon : <WifiOffIcon />}
        </View>
        
        {connected ? (
          <>
            <Text style={styles.ssidText}>RED: {ssid}</Text>
            <Text style={[styles.statusText, styles.connectedText]}>Conectado</Text>
          </>
        ) : (
          <Text style={[styles.statusText, styles.disconnectedText]}>No conectado</Text>
        )}
      </View>

      {/* Derecha: Toggle + Título (Wi-Fi) */}
      <View style={styles.rightSection}>
        <TouchableOpacity
          style={[styles.toggleContainer, connected && styles.connectedToggle]}
          onPress={onToggle}
        >
          <View style={[styles.toggleCircle, connected && styles.circleActive]} />
        </TouchableOpacity>
        <Text style={styles.cardTitle}>Wi-Fi</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F0F0F0',
    borderRadius: 15,
    padding: 16,
    marginHorizontal: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  leftSection: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 4,
    flex: 1,
    paddingLeft: 35,
    minWidth: 150,
  },
  rightSection: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
  },
  ssidText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  statusText: {
    fontSize: 12,
    minWidth: 100,
  },
  connectedText: {
    color: '#9BC4E0',
    fontWeight: '600',
  },
  disconnectedText: {
    color: '#D8A5C2',
    fontWeight: '600',
    marginTop: 8,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 6,
    color: '#333',
  },
  toggleContainer: {
    width: 40,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#E0C7DB',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  connectedToggle: {
    backgroundColor: '#9BC4E0',
  },
  toggleCircle: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: 'white',
    marginLeft: 0,
  },
  circleActive: {
    marginLeft: 18,
  },
  iconContainer: {
    paddingLeft: 20,
  },

  
});