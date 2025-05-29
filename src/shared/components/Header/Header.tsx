// feelink/src/shared/components/Header/Header.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Colors from '../bluetooth/constants/colors'; // Importa tus colores
// import Icon from 'react-native-vector-icons/Ionicons'; // Asegúrate de instalar react-native-vector-icons

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
}

const Header: React.FC<HeaderProps> = ({ title, showBackButton = true }) => {
  const navigation = useNavigation();

  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.headerContainer}>
      {showBackButton && (
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          {/* <Icon name="arrow-back" size={24} color={Colors.textPrimary} /> */}
        </TouchableOpacity>
      )}
      <Text style={styles.headerTitle}>{title}</Text>
      {/* Espacio para alinear el título si no hay botón de retroceso */}
      {!showBackButton && <View style={styles.backButtonPlaceholder} />}
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // Centra el título por defecto
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: Colors.primary, // Color de fondo del encabezado
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightsteelblue,
    elevation: 3, // Sombra para Android
    shadowColor: '#000', // Sombra para iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 1.5,
  },
  backButton: {
    position: 'absolute',
    left: 15,
    padding: 5, // Aumenta el área táctil
  },
  backButtonPlaceholder: {
    width: 24 + 10, // Ancho del icono + padding
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    fontFamily: 'Inter',
    textAlign: 'center',
    flex: 1, // Permite que el título ocupe el espacio restante
  },
});

export default Header;
