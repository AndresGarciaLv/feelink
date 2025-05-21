import React from 'react';
import { SafeAreaView } from 'react-native';
import BluetoothScreen from './src/BluetoothScreen';
import AuthForm from './src/views/loginView';

export default function App() {
  return (
    <>
    <SafeAreaView style={{ flex: 1 }}>
      <AuthForm/>  
    </SafeAreaView>
    
    </>
  );
}
