// src/components/icons/PlushIcon.tsx

import React from 'react';
import Svg, { Path } from 'react-native-svg';

type IconProps = {
  size: number;
  color?: string;
};

const PlushIcon: React.FC<IconProps> = ({ size, color = '#E0C7DB' }) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 448 512"
    fill="none"
  >
    <Path
      fill={color}
      d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32v144H48c-17.7 0-32 14.3-32 32s14.3 32 32 32h144v144c0 17.7 14.3 32 32 32s32-14.3 32-32V288h144c17.7 0 32-14.3 32-32s-14.3-32-32-32H256z"
    />
  </Svg>
);

export default PlushIcon;
