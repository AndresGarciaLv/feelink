// feelink/src/shared/components/Header/Header.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native'; // Importa ViewStyle
import { useNavigation } from '@react-navigation/native';
import Colors from '../bluetooth/constants/colors';

// Importa SVG para los íconos
import Svg, { Path } from 'react-native-svg';

interface HeaderProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
}

// Componente de ícono de flecha hacia atrás (simulando Ionicons arrow-back)
// AHORA ACEPTA LA PROPIEDAD 'style'
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
          {/* Aquí se pasa el estilo al BackIcon */}
          <BackIcon size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
      )}
      <View style={styles.titleContainer}>
        <Text style={styles.headerTitle}>{title}</Text>
        {subtitle && <Text style={styles.headerSubtitle}>{subtitle}</Text>}
      </View>
      {!showBackButton && <View style={styles.backButtonPlaceholder} />}
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: Colors.primary,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightsteelblue,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 1.5,
  },
  backButton: {
    position: 'absolute',
    left: 15,
    padding: 5,
  },
  backButtonPlaceholder: {
    width: 24 + 10,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    fontFamily: 'Inter',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.textPrimary,
    fontFamily: 'Inter',
    textAlign: 'center',
    marginTop: 2,
    opacity: 0.8,
  },
});

export default Header;
