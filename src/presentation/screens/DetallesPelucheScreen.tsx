import React from 'react';
import {
  View,
  ScrollView,
  SafeAreaView,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRoute, RouteProp } from '@react-navigation/native';

// Tipado de navegación
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

// Hooks
import { useWebSocketSensor } from '../../shared/hooks/useWebSocketSensor';

// Estilos
import { styles as pelucheStyles } from '../../shared/components/peluche/styles/PelucheStyles';

// Tipado de ruta
type DetallesPelucheRouteProp = RouteProp<RootStackParamList, 'DetallesPeluche'>;

export default function DetallesPelucheScreen() {
  const route = useRoute<DetallesPelucheRouteProp>();
  const { patientId } = route.params;

  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();

  // ✅ Datos en tiempo real desde WebSocket
  const { ssid, battery } = useWebSocketSensor('esp32', 'F8:B3:B7:30:34:80');

  return (
    <SafeAreaView style={pelucheStyles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 80 }}
      >
        {/* Header */}
        <PelucheHeader title="Detalles del Peluche" />

        {/* Burbujas de estado */}
        <BubbleContainer
          bluetooth={<BluetoothIcon size={35} color="#D8A5C2" />}
          peluche={<PelucheIcon size={38} />}
          wifi={<WifiIcon size={35} color="#9BC4E0" />}
        />

        {/* Cards de información */}
        <View style={pelucheStyles.cardsContainer}>
          {/* Presión en tiempo real */}
          <PressureProgressBar identifier="F8:B3:B7:30:34:80" />

          {/* 🟢 Conexión Wi-Fi con botón toggle funcional */}
          <WifiStatusCard
            icon={<WifiIcon size={24} color="black" />}
            ssid={ssid}
            macAddress="F8:B3:B7:30:34:80"
          />

          {/* Estado de batería y red */}
          <PelucheConnectionCard ssid={ssid} battery={battery} />
        </View>

        {/* Carrusel de mensajes */}
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

      {/* TabBar al fondo */}
      <View style={[pelucheStyles.tabBarWrapper, { bottom: insets.bottom || 12 }]}>
        <TabBar />
      </View>
    </SafeAreaView>
  );
}
