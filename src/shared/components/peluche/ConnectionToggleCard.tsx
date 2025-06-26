import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';

interface Props {
  title: string; // "Bluetooth"
  icon: React.ReactNode;
  connected: boolean;
  onToggle: () => void;
}

const BluetoothOffIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24">
    <Path 
      fill="black"
      d="m13 5.83l1.88 1.88l-1.6 1.6l1.41 1.41l3.02-3.02L12 2h-1v5.03l2 2M5.41 4L4 5.41L10.59 12L5 17.59L6.41 19L11 14.41V22h1l4.29-4.29l2.3 2.29L20 18.59m-7-.42v-3.76l1.88 1.88"
    />
  </Svg>
);

export default function ConnectionToggleCard({
  title,
  icon,
  connected,
  onToggle,
}: Props) {
  return (
    <View style={styles.card}>
      {/* Izquierda: Contenido dinámico según estado */}
      <View style={styles.leftSection}>
        <View style={styles.iconContainer}>
          {connected ? icon : <BluetoothOffIcon />}
        </View>
        
        {connected ? (
          <>
            <Text style={styles.ssidText}>Peluchin</Text>
            <Text style={[styles.statusText, styles.connectedText]}>Conectado</Text>
          </>
        ) : (
          <Text style={[styles.statusText, styles.disconnectedText]}>No conectado</Text>
        )}
      </View>

      {/* Derecha: Toggle + Título */}
      <View style={styles.rightSection}>
        <TouchableOpacity
          style={[styles.toggleContainer, connected && styles.connectedToggle]}
          onPress={onToggle}
        >
          <View style={[styles.toggleCircle, connected && styles.circleActive]} />
        </TouchableOpacity>
        <Text style={styles.cardTitle}>{title}</Text>
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
    paddingLeft: 35,
    minWidth: 100,
    flex: 1,
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
    alignSelf: 'flex-start',
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