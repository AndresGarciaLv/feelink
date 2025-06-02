import React from 'react';
import Svg, { Path } from 'react-native-svg';

type IconProps = {
  size: number;
  color?: string;
};

const BluetoothIcon: React.FC<IconProps> = ({ size, color = '#E0C7DB' }) => (
  <Svg width={size} height={size} viewBox="0 0 14 14" fill="none" stroke={color} strokeWidth="1.25">
    <Path d="m2.625 9.5l8.75-5.375l-4.75-3.5v12.75l4.75-3.5L2.625 4.5" />
  </Svg>
);

export default BluetoothIcon;
