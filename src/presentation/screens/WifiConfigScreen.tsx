// src/WifiConfigScreen.tsx
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  StyleSheet,
  Alert,
  Modal,
  Pressable,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Buffer } from 'buffer';
// @ts-ignore
import Icon from 'react-native-vector-icons/Ionicons';
import { Device } from 'react-native-ble-plx';

interface Props {
  device: Device;
}

interface WiFiNetwork {
  ssid: string;
}

export default function WifiConfigScreen({ route }: any) {
  const { device }: Props = route.params;
  const [networks, setNetworks] = useState<WiFiNetwork[]>([]);
  const [selectedSSID, setSelectedSSID] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [connectionStatus, setConnectionStatus] = useState<'pending' | 'connected' | 'error' | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [formVisible, setFormVisible] = useState<boolean>(false);

  const buffer = useRef<string[]>([]);
  const isParsingScan = useRef<boolean>(false);
  const parseTimeout = useRef<NodeJS.Timeout | null>(null);

  const SERVICE_UUID = '12345678-1234-1234-1234-1234567890ab';
  const CHARACTERISTIC_UUID = 'abcd1234-abcd-1234-abcd-1234567890ab';

  // Monitor BLE characteristic for scan results and wifi status
  useEffect(() => {
    const subscription = device.monitorCharacteristicForService(
      SERVICE_UUID,
      CHARACTERISTIC_UUID,
      (error, characteristic) => {
        if (error || !characteristic?.value) return;
        const fragment = Buffer.from(characteristic.value, 'base64').toString('utf-8');

        // Handle WiFi status messages
        if (fragment.startsWith('{') && fragment.includes('wifiStatus')) {
          try {
            const obj = JSON.parse(fragment);
            setConnectionStatus(obj.wifiStatus === 'ok' ? 'connected' : 'error');
            setModalVisible(true);
            setFormVisible(false);
          } catch (e) {
           /*  console.error('Error parsing wifiStatus:', e); */
          }
          return;
        }

        // Begin assembling scan fragments
        if (fragment.match(/^#1\[/)) {
          buffer.current = [];
          isParsingScan.current = true;
        }
        if (!isParsingScan.current) return;

        const match = fragment.match(/^#(\d+)/);
        if (!match) return;
        const idx = parseInt(match[1], 10) - 1;
        const payload = fragment.slice(match[0].length);
        buffer.current[idx] = payload;

        const assembled = buffer.current.join('');
        const start = assembled.indexOf('[');
        const end = assembled.lastIndexOf(']');
        if (start !== -1 && end !== -1 && end > start) {
          const jsonArr = assembled.slice(start, end + 1);
          try {
            const parsedStrings = JSON.parse(jsonArr) as string[];
            const parsed = parsedStrings.map(ssid => ({ ssid }));
            setNetworks(parsed);
          } catch (e) {
           /*  console.error('Error parsing scan JSON:', e, jsonArr); */
          }
          isParsingScan.current = false;
          setLoading(false);
        } else {
          if (parseTimeout.current) clearTimeout(parseTimeout.current);
          parseTimeout.current = setTimeout(() => {
            const tmp = buffer.current.join('');
            const s = tmp.indexOf('[');
            const e = tmp.lastIndexOf(']');
            if (s !== -1 && e !== -1 && e > s) {
              try {
                const parsedStrings = JSON.parse(tmp.slice(s, e + 1)) as string[];
                const parsed = parsedStrings.map(ssid => ({ ssid }));
                setNetworks(parsed);
              } catch (err) {
                console.warn('Timeout parse error:', err);
              }
            }
            isParsingScan.current = false;
            setLoading(false);
          }, 1500);
        }
      }
    );
    return () => subscription.remove();
  }, [device]);

  // Send scan request to ESP32
  const requestNetworks = async () => {
    setLoading(true);
    setNetworks([]);
    const cmd = JSON.stringify({ scan: true });
    await device.writeCharacteristicWithResponseForService(
      SERVICE_UUID,
      CHARACTERISTIC_UUID,
      Buffer.from(cmd).toString('base64')
    );
    setTimeout(() => {
      if (isParsingScan.current) {
        console.warn('Scan timeout, cancelling');
        isParsingScan.current = false;
        setLoading(false);
      }
    }, 8000);
  };

  // Send WiFi credentials
  const sendWiFiCredentials = async () => {
    setConnectionStatus('pending');
    setModalVisible(true);
    const payload = JSON.stringify({ ssid: selectedSSID, pass: password });
    await device.writeCharacteristicWithResponseForService(
      SERVICE_UUID,
      CHARACTERISTIC_UUID,
      Buffer.from(payload).toString('base64')
    );
    setPassword('');
  };

  // Disconnect from WiFi
  const disconnectWiFi = async () => {
    const cmd = JSON.stringify({ disconnect: true });
    await device.writeCharacteristicWithResponseForService(
      SERVICE_UUID,
      CHARACTERISTIC_UUID,
      Buffer.from(cmd).toString('base64')
    );
    setConnectionStatus(null);
    Alert.alert('Desconectado', `Desconectado de ${selectedSSID}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Configuración WiFi</Text>
      <Pressable onPress={requestNetworks} style={styles.refreshButton}>
        <Icon name="wifi" size={24} color="#fff" />
        <Text style={styles.refreshText}>Buscar redes</Text>
      </Pressable>
      {loading && <ActivityIndicator size="large" style={{ marginVertical: 12 }} />}

      <View style={styles.listContainer}>
        <FlatList
          data={networks}
          keyExtractor={(item, idx) => `${item.ssid}_${idx}`}
          renderItem={({ item }) => (
            <Pressable
              style={({ pressed }) => [
                styles.networkRow,
                pressed && styles.networkRowPressed,
              ]}
              onPress={() => { setSelectedSSID(item.ssid); setFormVisible(true); }}
            >
              <Text style={styles.networkText}>{item.ssid}</Text>
              {connectionStatus === 'connected' && selectedSSID === item.ssid && (
                <Pressable onPress={disconnectWiFi} style={styles.disconnectButton}>
                  <Text style={styles.disconnectText}>Desconectar</Text>
                </Pressable>
              )}
            </Pressable>
          )}
          contentContainerStyle={styles.listContent}
          style={styles.flatList}
        />
      </View>

      {/* Modal de contraseña */}
      <Modal visible={formVisible} transparent animationType="fade">
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalBackground}
        >
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>{selectedSSID}</Text>
            <TextInput
              placeholder="Contraseña"
              secureTextEntry
              style={styles.input}
              value={password}
              onChangeText={setPassword}
            />
            <View style={styles.modalActions}>
              <Pressable style={styles.submitButton} onPress={sendWiFiCredentials}>
                <Text style={styles.submitText}>Conectar</Text>
              </Pressable>
              <Pressable style={styles.cancelButton} onPress={() => setFormVisible(false)}>
                <Text style={styles.cancelText}>Cerrar</Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Modal de estado */}
      <Modal transparent animationType="slide" visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalBackground}>
          <View style={styles.modalBox}>
            {connectionStatus === 'pending' ? (
              <>
                <ActivityIndicator size="large" color="#007AFF" style={{ marginBottom: 16 }} />
                <Text style={styles.modalText}>Conectando...</Text>
              </>
            ) : (
              <>
                <Icon
                  name={connectionStatus === 'connected' ? 'checkmark-circle' : 'close-circle'}
                  size={64}
                  color={connectionStatus === 'connected' ? 'green' : 'red'}
                />
                <Text style={styles.modalText}>
                  {connectionStatus === 'connected' ? '¡Conexión exitosa!' : 'Error al conectar'}
                </Text>
                <Pressable onPress={() => setModalVisible(false)} style={styles.closeButton}>
                  <Text style={styles.closeText}>Aceptar</Text>
                </Pressable>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 16 },
  refreshButton: { backgroundColor: '#007AFF', padding: 12, borderRadius: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  refreshText: { color: '#fff', fontSize: 16, marginLeft: 8 },
  listContainer: { flex: 1, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, overflow: 'hidden' },
  flatList: { flex: 1 },
  listContent: { paddingVertical: 4 },
  networkRow: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#eee', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  networkRowPressed: { backgroundColor: '#f0f8ff' },
  networkText: { fontSize: 16 },
  disconnectButton: { backgroundColor: '#ff3b30', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6 },
  disconnectText: { color: '#fff', fontWeight: '600' },
  modalBackground: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  modalBox: { width: '85%', padding: 24, backgroundColor: '#fff', borderRadius: 16, alignItems: 'center' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  input: { width: '100%', borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 8, marginBottom: 16 },
  modalActions: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
  submitButton: { backgroundColor: '#34C759', padding: 12, borderRadius: 8, flex: 1, marginRight: 8, alignItems: 'center' },
  submitText: { color: '#fff', fontWeight: '600' },
  cancelButton: { backgroundColor: '#ccc', padding: 12, borderRadius: 8, flex: 1, alignItems: 'center' },
  cancelText: { color: '#333', fontWeight: '600' },
  modalText: { fontSize: 18, marginVertical: 16, textAlign: 'center' },
  closeButton: { backgroundColor: '#007AFF', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8, marginTop: 12 },
   closeText: { color: '#fff', fontSize: 16, textAlign: 'center' },
});
