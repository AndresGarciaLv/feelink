import { View, Image, Text, StyleSheet } from 'react-native';
import React, { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { useNavigation } from '@react-navigation/native';
import type {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {RootStackParamList} from "../../core/types/common/navigation";
// @ts-ignore
import BgIcon from "../../shared/assets/img/icon.png";

SplashScreen.preventAutoHideAsync().then(r =>{});

export default function SplashScreenComponent() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  useEffect(() => {
    setTimeout(async () => {
      await SplashScreen.hideAsync();
        navigation.navigate("Auth") ;
    }, 5000);
  }, []);

  return (
    
    <View style={styles.container}>
      <Image source={BgIcon} style={styles.image} resizeMode="contain" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#98C9E6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 250,
    height: 250,
  },
});
