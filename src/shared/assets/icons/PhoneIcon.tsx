import React from 'react';
import Svg, { Path } from 'react-native-svg';

type IconProps = {
  size: number;
  color?: string;
};

const PhoneIcon: React.FC<IconProps> = ({ size, color = '#9BC4E4' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path fill={color} d="M11 17.5a.75.75 0 0 0 0 1.5h2a.75.75 0 0 0 0-1.5z" />
    <Path
      fill={color}
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8 2a2.25 2.25 0 0 0-2.25 2.25v15.5A2.25 2.25 0 0 0 8 22h8a2.25 2.25 0 0 0 2.25-2.25V4.25A2.25 2.25 0 0 0 16 2zm-.75 2.25A.75.75 0 0 1 8 3.5h8a.75.75 0 0 1 .75.75v15.5a.75.75 0 0 1-.75.75H8a.75.75 0 0 1-.75-.75z"
    />
  </Svg>
);

export default PhoneIcon;
