// ✅ App.tsx con navegación entre BluetoothScreen y WiFiConfigScreen
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BluetoothScreen from './src/screens/BluetoothScreen';
import WiFiConfigScreen from './src/screens/WifiConfigScreen';
import type { RootStackParamList } from './src/navigation/types';
import PatientsScreen
 from './src/screens/PatientsScreen';
 import ProfileScreen from './src/screens/ProfileScreen';
import DashboardScreen from './src/screens/DashboardScrean';
const Stack = createNativeStackNavigator<RootStackParamList>();
import AuthForm from './src/views/loginView';
import TutorProfile from './src/shared/components/profiles/TutorProfile'
import HomeTutor from './src/screens/tutor/HomeTutorScreen';


export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Bluetooth">
        <Stack.Screen name="Bluetooth" component={BluetoothScreen} options={{ title: 'Buscar Peluche' }} />
        <Stack.Screen name="WiFi" component={WiFiConfigScreen} options={{ title: 'Conectar a WiFi' }} />
        <Stack.Screen name="Patients" component={PatientsScreen} options={{headerShown: false}} />
        <Stack.Screen name="TutorProfile" component={TutorProfile} options={{ headerShown: false}} />
        <Stack.Screen name="Auth" component={AuthForm} options={{headerShown: false}} />
        <Stack.Screen name="Profile" component={ProfileScreen} options={{headerShown: false}} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} options={{ title: 'Dashboard' }} />

        <Stack.Screen name="HomeTutor" component={HomeTutor} options={{headerShown: false}} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}