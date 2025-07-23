import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';

interface Props {
  size?: number;
  color?: string;
}

const SmartphoneIcon: React.FC<Props> = ({ size = 28, color = 'black' }) => (
  <MaterialIcons name="smartphone" size={size} color={color} />
);

export default SmartphoneIcon;
