
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RootStackParamList } from './types';

import HomeTutor from '../screens/tutor/HomeTutor';
import TutorProfile from '../shared/components/profiles/TutorProfile';
import BluetoothScreen from '../screens/BluetoothScreen';   
import WifiScreen1 from '../screens/WifiScreen';
import ChartsProfileScreen from '../screens/ChartsProfileScreen';
import DetallesPelucheScreen from '../screens/DetallesPelucheScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function TutorNavigator() {
  return (
    <Stack.Navigator initialRouteName="HomeTutor" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeTutor" component={HomeTutor} />
      <Stack.Screen name="TutorProfile" component={TutorProfile} />
      <Stack.Screen name="Bluetooth" component={BluetoothScreen} />
      <Stack.Screen name="Wifi1" component={WifiScreen1} />
      <Stack.Screen name="ProfileChart" component={ChartsProfileScreen} />
      <Stack.Screen name="DetallesPeluche" component={DetallesPelucheScreen} />
    </Stack.Navigator>
  );
}
