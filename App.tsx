
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WiFiConfigScreen from './src/presentation/screens/WifiConfigScreen';
import type { RootStackParamList } from './src/core/types/common/navigation';
import PatientsScreen from './src/presentation/screens/PatientsScreen';
import ProfileScreen from './src/presentation/screens/ProfileScreen';
import DashboardScreen from './src/presentation/screens/DashboardScreen';
const Stack = createNativeStackNavigator<RootStackParamList>();
import AuthScreen from './src/presentation/screens/auth/AuthScreen';
import TutorProfile from './src/shared/components/profiles/TutorProfile'
import TherapistProfile from './src/shared/components/profiles/TherapistProfile';
import HomeTutor from './src/presentation/screens/tutor/HomeTutorScreen';
import WifiScreen1 from './src/presentation/screens/WifiScreen';
import ChartsProfileScreen from './src/presentation/screens/ChartsProfileScreen';
import {Provider} from "react-redux";
import store from "./src/core/stores/store";
import * as SplashScreen from 'expo-splash-screen';
import SplashScreenComponent from './src/presentation/screens/SplashScreen';
import { Buffer } from 'buffer';
global.Buffer = Buffer;
import DetallesPelucheScreen from './src/presentation/screens/DetallesPelucheScreen';
import InfoPeluche from './src/presentation/screens/tutor/InfoPelucheScreent';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function App() {
  return (
      <Provider store={store} >
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Splash">
            <Stack.Screen name="Splash" component={SplashScreenComponent} options={{ headerShown: false }} />
            <Stack.Screen name="WiFi" component={WiFiConfigScreen} options={{title: 'Conectar a WiFi'}}/>
            <Stack.Screen name="Patients" component={PatientsScreen} options={{headerShown: false}}/>
            <Stack.Screen name="TutorProfile" component={TutorProfile} options={{headerShown: false}}/>
            <Stack.Screen name="TherapistProfile" component={TherapistProfile} options={{headerShown: false}}/>
            <Stack.Screen name="Auth" component={AuthScreen} options={{headerShown: false}}/>
            <Stack.Screen name="Profile" component={ProfileScreen} options={{headerShown: false}}/>
            <Stack.Screen name="Dashboard" component={DashboardScreen} options={{headerShown: false}}/>
            <Stack.Screen name="HomeTutor" component={HomeTutor} options={{headerShown: false}}/>
            <Stack.Screen name="Wifi1" component={WifiScreen1} options={{headerShown: false}}/>
            <Stack.Screen name="ChartsProfile" component={ChartsProfileScreen} options={{headerShown: false}}/>
            <Stack.Screen name="DetallesPeluche" component={DetallesPelucheScreen} options={{ headerShown: false }} />
            <Stack.Screen name="InfoPeluche" component={InfoPeluche} options={{ headerShown: false }} />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
  );
}