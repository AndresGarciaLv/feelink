// feelink/src/shared/components/Header/Header.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Colors from '../../bluetooth/constants/colors'; // Asegúrate de que esta ruta sea correcta y Colors contenga los colores necesarios.

// Importa SVG para los íconos
import Svg, { Path } from 'react-native-svg';

interface HeaderProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
}

// Componente de ícono de flecha hacia atrás (simulando Ionicons arrow-back)
// Se ajusta el tamaño y color para que coincida con la imagen de referencia.
const BackIcon: React.FC<{ size: number; color: string; style?: ViewStyle }> = ({ size, color, style }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <Path d="M19 12H5M12 19l-7-7 7-7"/>
  </Svg>
);

const Header: React.FC<HeaderProps> = ({ title, subtitle, showBackButton = true }) => {
  const navigation = useNavigation();

  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.headerContainer}>
      {showBackButton && (
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          {/* Se usa size={28} y color="white" para que coincida con la imagen de referencia */}
          <BackIcon size={28} color="white" />
        </TouchableOpacity>
      )}
      <View style={styles.titleContainer}>
        <Text style={styles.headerTitle}>{title}</Text>
        {subtitle && <Text style={styles.headerSubtitle}>{subtitle}</Text>}
      </View>
      {/* Este placeholder asegura que el título se mantenga centrado incluso si el botón de retroceso no está presente */}
      {!showBackButton && <View style={styles.backButtonPlaceholder} />}
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    // El justifyContent se mantiene 'center' para que el título se centre si no hay botón,
    // pero el flex: 1 del titleContainer y el position: 'absolute' del backButton
    // aseguran el centrado del título con el botón presente.
    justifyContent: 'center',
    paddingHorizontal: 10, // Ajustado según la imagen de referencia
    paddingVertical: 60,   // Ajustado según la imagen de referencia para un header más alto
    backgroundColor: '#9BC4E0', // Color de fondo del nuevo header
    borderBottomLeftRadius: 15, // Bordes redondeados del nuevo header
    borderBottomRightRadius: 15, // Bordes redondeados del nuevo header
    // Se eliminan las propiedades de sombra y borde inferior que no están en la imagen de referencia
    // elevation: 3,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.1,
    // shadowRadius: 1.5,
    // borderBottomWidth: 1,
    // borderBottomColor: Colors.lightsteelblue,
    gap: 10, // Añadido para el espaciado entre elementos, aunque el position absolute del backButton lo hace menos relevante aquí
  },
  backButton: {
    position: 'absolute', // Permite que el botón se posicione sin afectar el flujo del título
    left: 20, // Ajustado a 20 para coincidir con el paddingHorizontal
    padding: 5,
  },
  backButtonPlaceholder: {
    // Este placeholder ocupa el mismo espacio que el botón de retroceso para mantener el centrado del título
    width: 28 + 10, // Tamaño del ícono (28) + padding/margen simulado
  },
  titleContainer: {
    flex: 1, // Permite que el contenedor del título ocupe el espacio disponible
    alignItems: 'center', // Centra el texto horizontalmente dentro de su contenedor
    justifyContent: 'center', // Centra el texto verticalmente (si hay espacio vertical)
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.white, // Se mantiene el color de texto original
    fontFamily: 'Inter',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.white, // Se mantiene el color de texto original
    fontFamily: 'Inter',
    textAlign: 'center',
    marginTop: 2,
    opacity: 0.8,
  },
});

export default Header;
