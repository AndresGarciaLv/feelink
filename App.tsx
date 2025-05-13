import React from 'react';
import { SafeAreaView } from 'react-native';
import BluetoothScreen from './src/BluetoothScreen';

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <BluetoothScreen />
    </SafeAreaView>
  );
}
