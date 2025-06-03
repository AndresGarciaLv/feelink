// ✅ App.tsx con navegación entre BluetoothScreen y WiFiConfigScreen
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BleScreen from './src/screens/BleScreen';
import WiFiConfigScreen from './src/screens/WifiConfigScreen';
import type { RootStackParamList } from './src/navigation/types';
import PatientsScreen from './src/screens/PatientsScreen';
 import ProfileScreen from './src/screens/ProfileScreen';
import DashboardScreen from './src/screens/DashboardScrean';
const Stack = createNativeStackNavigator<RootStackParamList>();
import AuthForm from './src/screens/loginScreen';
import TutorProfile from './src/shared/components/profiles/TutorProfile'
import TherapistProfile from './src/shared/components/profiles/TherapistProfile';
import HomeTutor from './src/screens/tutor/HomeTutorScreen';
import BluetoothScreen from './src/screens/BluetoothScreen';
import WifiScreen1 from './src/screens/WifiScreen1';
import ChartsProfileScreen from './src/screens/ChartsProfileScreen';


export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Auth">
        <Stack.Screen name="BleScreen" component={BleScreen} options={{ title: 'LISTA DE PANTALLAS' }} />
        <Stack.Screen name="WiFi" component={WiFiConfigScreen} options={{ title: 'Conectar a WiFi' }} />
        <Stack.Screen name="Patients" component={PatientsScreen} options={{headerShown: false}} />
        <Stack.Screen name="TutorProfile" component={TutorProfile} options={{ headerShown: false}} />
        <Stack.Screen name="TherapistProfile" component={TherapistProfile} options={{ headerShown: false}} />
        <Stack.Screen name="Auth" component={AuthForm} options={{headerShown: false}} />
        <Stack.Screen name="Profile" component={ProfileScreen} options={{headerShown: false}} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} options={{headerShown: false}}  />
        <Stack.Screen name="HomeTutor" component={HomeTutor} options={{headerShown: false}} />
        <Stack.Screen name="Bluetooth" component={BluetoothScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Wifi1" component={WifiScreen1} options={{ headerShown: false }} />



        <Stack.Screen name="ProfileChart" component={ChartsProfileScreen} options={{headerShown: false}} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}