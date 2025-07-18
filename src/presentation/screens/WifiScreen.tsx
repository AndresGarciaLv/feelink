// src/screens/WifiScreen.tsx
import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';

import Header from '../../shared/components/wifi1C/Header/Header'
import BubbleOverlayWifi from '../../shared/components/wifi1C/BubbleOverlayWifi';
import Colors from '../../shared/components/constants/colors';
import useWifiLogic from '../../shared/hooks/useWifiLogic';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import TabBar from '../layout/TabBar';
import { useWifiRedux } from '../../core/stores/wifi/useWifiRedux';
import { useFocusEffect } from '@react-navigation/native';

const WifiScreen = () => {
  const {
    isScanning,
    closeModal,
    setPassword,
  } = useWifiLogic();

  const { wifi } = useWifiRedux();
  const insets = useSafeAreaInsets();

  useFocusEffect(
    useCallback(() => {
      closeModal();
      setPassword('');
    }, [])
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerWrapper}>
        <Header title="Conexión Wi-Fi" showBackButton />
      </View>

      {/* 🌐 Bubble explicativo WiFi */}
      <BubbleOverlayWifi />

      <Text style={styles.stepText}>
        Paso 2: Conecta tu peluche a una red Wi-Fi para enviar los datos en tiempo real.
      </Text>

      <View style={styles.buttonColumn}>
        <TouchableOpacity
          style={[styles.scanButton, isScanning && { opacity: 0.5 }]}
          disabled={isScanning}
        >
          <Text style={styles.buttonText}>🔍 Buscar Redes</Text>
        </TouchableOpacity>
      </View>
      <View style={[styles.tabBarWrapper, { bottom: insets.bottom || 12 }]}>
        <TabBar />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  headerWrapper: { position: 'relative', zIndex: 2 },
  stepText: {
    fontSize: 13,
    color: Colors.textPrimary,
    fontFamily: 'Inter-Light',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 55,
    marginTop: 50,
  },
  buttonColumn: {
    backgroundColor: Colors.secondary,
    flexDirection: 'column',
    alignItems: 'center',
    width: '90%',
    alignSelf: 'center',
    marginTop: 10,
    gap: 14,
    borderRadius: 15,
  },
  scanButton: {
    backgroundColor: Colors.secondary,
    paddingVertical: 14,
    width: '100%',
    alignItems: 'center',
    borderRadius: 15,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 17,
    fontFamily: 'Inter-Bold',
  },
  disconnectButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 15,
    alignItems: 'center',
  },
  disconnectButtonText: {
    color: Colors.white,
    fontSize: 15,
    fontFamily: 'Inter-SemiBold',
  },
  bottomSection: { flex: 1, marginTop: 30 },
  loadingContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 60,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: Colors.textPrimary,
    fontFamily: 'Inter',
  },
  listContent: { paddingHorizontal: 20, paddingBottom: 20 },
  emptyListText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: Colors.textPrimary,
    fontFamily: 'Inter',
  },
  tabBarWrapper: { position: 'absolute', left: 0, right: 0, zIndex: 10 },
});

export default WifiScreen;
