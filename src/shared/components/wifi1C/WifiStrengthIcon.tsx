import React from 'react';
import { View, StyleSheet } from 'react-native';

interface WifiStrengthIconProps {
  rssi: number;
  size?: number;
}

const getLevel = (rssi: number): number => {
  if (rssi > -55) return 4;
  if (rssi > -75) return 3;
  if (rssi > -85) return 2;
  if (rssi > -95) return 1;
  return 0;
};

const getColor = (level: number): string => {
  switch (level) {
    case 4: return '#4CAF50';  // Verde
    case 3: return '#CDDC39';  // Lima
    case 2: return '#FFC107';  // Amarillo
    case 1: return '#FF5722';  // Naranja
    default: return '#BDBDBD'; // Gris
  }
};

const WifiStrengthIcon: React.FC<WifiStrengthIconProps> = ({ rssi, size = 24 }) => {
  const level = getLevel(rssi);
  const barWidth = size / 6;
  const spacing = barWidth / 2;
  const baseHeight = size / 5;

  return (
    <View style={[styles.container, { height: size }]}>
      {[1, 2, 3, 4].map((i) => (
        <View
          key={i}
          style={{
            width: barWidth,
            height: baseHeight * i,
            backgroundColor: level >= i ? getColor(level) : '#E0E0E0',
            marginLeft: spacing,
            borderRadius: 2,
          }}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
});

export default WifiStrengthIcon;
