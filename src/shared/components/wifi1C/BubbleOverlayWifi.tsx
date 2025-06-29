import React from 'react';
import { View, StyleSheet } from 'react-native';
import OsitoIcon from '../../assets/icons/OsitoIcon';
import WifiIcon from '../../assets/icons/WifiIcon';
import PlushIcon from '../../assets/icons/PlushIcon';
import BluetoothIcon from '../../assets/icons/BluetoothIcon';

const BubbleOverlayWifi = () => (
 <View style={styles.container}>
    <View style={[styles.iconBubble, { zIndex: 2 }]}>
      <OsitoIcon size={40} />
    </View>
    <View style={[styles.iconBubble, { marginLeft: -15, zIndex: 3 }]}>
      <PlushIcon size={30} />
    </View>
    <View style={[styles.iconBubble, { marginLeft: -15, zIndex: 2 }]}>
      <WifiIcon size={30} />
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 110,
    left: 0,
    right: 0,
    zIndex: 2,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  iconBubble: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D3D3D3',
    backgroundColor: 'white',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
});

export default BubbleOverlayWifi;
