// src/screens/peluche/DetallesPelucheScreen.tsx
import React from 'react';
import {
  View,
  ScrollView,
  SafeAreaView,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../core/types/common/navigation';

// Componentes
import PelucheHeader from '../../shared/components/peluche/PelucheHeader';
import WifiStatusCard from '../../shared/components/peluche/WifiStatusCard';
import PelucheConnectionCard from '../../shared/components/peluche/PelucheConnectionCard';
import MessageCarousel from '../../shared/components/peluche/MessageCarousel';
import BubbleContainer from '../../shared/components/peluche/BlubbleContainer';
import TabBar from '../layout/TabBar';
import PressureProgressBar from '../../shared/components/PressureProgressBar';

// Iconos
import BluetoothIcon from '../../shared/components/peluche/BluetootIcon';
import PelucheIcon from '../../shared/components/peluche/PelucheIcon';
import WifiIcon from '../../shared/components/peluche/WifiIcon';

// Hook WebSocket centralizado
import { useToyWebSocket } from '../../shared/hooks/useToyWebSocket';
import { styles as pelucheStyles } from '../../shared/components/peluche/styles/PelucheStyles';

type DetallesPelucheRouteProp = RouteProp<RootStackParamList, 'DetallesPeluche'>;

export default function DetallesPelucheScreen() {
const route = useRoute<DetallesPelucheRouteProp>();
const { patientId, macAddress } = route.params;

  console.log('🧸 MAC Address recibida:', macAddress);
  console.log('paciente recibido:', patientId);

  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();

const wsData = macAddress ? useToyWebSocket('esp32', macAddress) : null;


  return (
    <SafeAreaView style={pelucheStyles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 80 }}
      >
        <PelucheHeader title="Detalles del Peluche" />

        <BubbleContainer
          bluetooth={<BluetoothIcon size={35} color="#D8A5C2" />}
          peluche={<PelucheIcon size={38} />}
          wifi={<WifiIcon size={35} color="#9BC4E0" />}
        />

        <View style={pelucheStyles.cardsContainer}>
          {wsData && (
  <>
    <PressureProgressBar pressure={wsData.pressure} />

 {/*    <WifiStatusCard
      icon={<WifiIcon size={24} color="black" />}
      ssid={wsData.ssid}
      macAddress={macAddress}
    /> */}

    <PelucheConnectionCard ssid={wsData.ssid} battery={wsData.battery} />
  </>
)}

        </View>

        <MessageCarousel
          pelucheIcon={<PelucheIcon size={60} />}
          messages={[
            '“Recuerda cargarme”',
            '¡Qué bueno verte de nuevo!',
            '"Un toque puede decir más que mil palabras."',
            '"El peluche no es solo un juguete, es su voz emocional."',
          ]}
        />
      </ScrollView>

      <View style={[pelucheStyles.tabBarWrapper, { bottom: insets.bottom || 12 }]}>
        <TabBar />
      </View>
    </SafeAreaView>
  );
}
