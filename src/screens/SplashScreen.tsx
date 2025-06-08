import { View, Image, Text, StyleSheet } from 'react-native';
import React, { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { useNavigation } from '@react-navigation/native';

SplashScreen.preventAutoHideAsync();

export default function SplashScreenComponent() {
  const navigation = useNavigation();

  useEffect(() => {
    setTimeout(async () => {
      await SplashScreen.hideAsync();
        navigation.navigate('Auth'); 
    }, 5000);
  }, []);

  return (
    
    <View style={styles.container}>
      <Image source={require('../../assets/icon.png')} style={styles.image} resizeMode="contain" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#9BC4E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 250,
    height: 250,
  },
});
