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

import Header from '../../shared/components/bluetooth/Header/Header';
import BubbleOverlayWifi from '../../shared/components/wifi1C/BubbleOverlayWifi';
import Colors from '../../shared/components/constants/colors';
import WiFiDeviceItem from '../../shared/components/wifi1C/WifiDeviceItem';
import CustomModal from '../../shared/components/wifi1C/CustomModal';
import useWifiLogic from '../../shared/hooks/useWifiLogic';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import TabBar from '../layout/TabBar';
import { useWifiRedux } from '../../core/stores/wifi/useWifiRedux';
import { useFocusEffect } from '@react-navigation/native';

const WifiScreen = () => {
  const {
    networks,
    isScanning,
    modalVisible,
    modalTitle,
    modalMessage,
    selectedNetwork,
    startScan,
    handleConnect,
    confirmConnection,
    closeModal,
    password,
    setPassword,
    disconnectFromWiFi,
    isConnecting,
    showPasswordInput,
  } = useWifiLogic();

  const { wifi } = useWifiRedux();
  const insets = useSafeAreaInsets();

  useFocusEffect(
    useCallback(() => {
      startScan();
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
          onPress={startScan}
          disabled={isScanning}
        >
          <Text style={styles.buttonText}>🔍 Buscar Redes</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomSection}>
        {isScanning ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.secondary} />
            <Text style={styles.loadingText}>Escaneando redes...</Text>
          </View>
        ) : (
          <FlatList
            data={networks}
            keyExtractor={(item) => item.ssid}
            renderItem={({ item }) => {
              const isThisConnected = wifi.currentSSID === item.ssid && wifi.connected;
              return (
                <WiFiDeviceItem
                  networkName={item.ssid}
                  open={item.open}
                  rssi={item.rssi}
                  onConnect={() => handleConnect(item)}
                  onDisconnect={disconnectFromWiFi}
                  isConnected={isThisConnected}
                />
              );
            }}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={() => (
              <Text style={styles.emptyListText}>No se encontraron redes Wi-Fi.</Text>
            )}
          />
        )}
      </View>

      <CustomModal
  isVisible={modalVisible}
  title={modalTitle}
  message={isConnecting ? 'Conectando...' : modalMessage}
  onConfirm={selectedNetwork ? confirmConnection : closeModal}
  onCancel={
  isConnecting || selectedNetwork || modalTitle.startsWith('Conectar')
    ? closeModal
    : undefined
}

  confirmText={selectedNetwork ? 'Conectar' : 'OK'}
  cancelText="Cancelar"
  showInput={selectedNetwork ? showPasswordInput : false}
  password={password}
  setPassword={setPassword}
  isLoading={isConnecting}
/>


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
