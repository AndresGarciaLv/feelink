import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import PelucheIcon from './PelucheIconCard';
import PelucheIconN from './PelucheIconN';

const { width } = Dimensions.get('window');

interface Props {
  connected: boolean;
  name?: string;
  batteryLevel?: number;
  batteryPosition?: number;
}

const BatteryIcon = ({ size = 24, color = '#fff' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path fill={color} fillOpacity={0.3} d="M17 5.33C17 4.6 16.4 4 15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33V9h10z" />
    <Path fill={color} d="M7 9v11.67C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V9z" />
  </Svg>
);

export default function PelucheConnectionCard({
  connected,
  name = 'Peluchin',
  batteryLevel = 80,
  batteryPosition = 10,
}: Props) {
  return (
    <View style={[styles.card, !connected && styles.disconnectedCard]}>
      {!connected ? (
        <View style={styles.centered}>
          <PelucheIconN size={40} />
          <Text style={styles.disconnectedText}>
            No conectado
          </Text>
        </View>
      ) : (
        <>
          <View style={styles.leftSection}>
            <PelucheIcon size={40} />
            <View style={styles.textContainer}>
              <Text style={styles.name} numberOfLines={1}>{name}</Text>
              <Text style={styles.status}>Conectado</Text>
            </View>
          </View>
          <View style={[styles.rightSection, { right: `${batteryPosition}%` }]}>
            <BatteryIcon size={24} color="#fff" />
            <Text style={styles.batteryText}>{batteryLevel}%</Text>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#9BC4E0',
    borderRadius: 15,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    position: 'relative',
    height: 80,
    width: width * 0.87,
  },
  disconnectedCard: {
    backgroundColor: '#f0f0f0',
    height: 70,
    paddingVertical: 8,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    paddingLeft: 8,
    maxWidth: '80%',
  },
  textContainer: {
    flex: 1,
  },
  rightSection: {
    alignItems: 'center',
    gap: 4,
    position: 'absolute',
    top: '50%',
    transform: [{ translateY: -12 }],
  },
  name: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  status: {
    color: '#fff',
    fontSize: 13,
  },
  batteryText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  disconnectedText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    width: '100%',
    paddingHorizontal: 10,
    includeFontPadding: false,
  },
  
});