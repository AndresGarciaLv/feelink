// ✅ App.tsx con navegación entre BluetoothScreen y WiFiConfigScreen
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BluetoothScreen from './src/screens/BluetoothScreen';
import WiFiConfigScreen from './src/screens/WifiConfigScreen';
import type { RootStackParamList } from './src/navigation/types';
import PatientsScreen from './src/screens/PatientsScreen';
const Stack = createNativeStackNavigator<RootStackParamList>();
import AuthForm from './src/views/loginView';


export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Bluetooth">
        <Stack.Screen name="Bluetooth" component={BluetoothScreen} options={{ title: 'Buscar Peluche' }} />
        <Stack.Screen name="WiFi" component={WiFiConfigScreen} options={{ title: 'Conectar a WiFi' }} />
        <Stack.Screen name="Patients" component={PatientsScreen} options={{headerShown: false}} />
        <Stack.Screen name="Auth" component={AuthForm} options={{headerShown: false}} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}