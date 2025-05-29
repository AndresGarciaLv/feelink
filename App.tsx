// ✅ App.tsx con navegación entre BluetoothScreen y WiFiConfigScreen
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BluetoothScreen1 from './src/screens/BluetoothScreen1';
import WifiScreen1 from './src/screens/WifiScreen1';
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
import EmotionGraphs from './src/shared/components/EmotionGraphs';
import PatientDetailScreen from './src/screens/PatientDetailScreen'; // Detalles de paciente grafica de cada uno de los pacientes FGT



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
        <Stack.Screen name="EmotionGraphs"component={EmotionGraphs as React.FC} options={{ title: 'Gráficas' }} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} options={{ title: 'Dashboard' }} />
        <Stack.Screen name="Bluetooth1" component={BluetoothScreen1} options={{ headerShown: false }} />
        <Stack.Screen name="Wifi1" component={WifiScreen1} options={{ headerShown: false }} />
        <Stack.Screen name="PatientDetail" component={PatientDetailScreen} options={{ title: 'Detalle del Niño' }} /> 

      </Stack.Navigator>
    </NavigationContainer>
  );
}