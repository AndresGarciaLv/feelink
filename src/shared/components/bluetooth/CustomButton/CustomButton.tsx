// feelink/src/shared/components/CustomButton/CustomButton.tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import Colors from '../../constants/colors'; // Importa tus colores

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle; // Permite sobrescribir estilos del contenedor
  textStyle?: TextStyle; // Permite sobrescribir estilos del texto
  disabled?: boolean;
}

const CustomButton: React.FC<CustomButtonProps> = ({ title, onPress, style, textStyle, disabled = false }) => {
  return (
    <TouchableOpacity
      style={[styles.button, style, disabled && styles.disabledButton]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Text style={[styles.buttonText, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.secondary, // Color de fondo del botón
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10, // Bordes redondeados
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000', // Sombra para un efecto 3D
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  disabledButton: {
    backgroundColor: Colors.lightsteelblue, // Color para botón deshabilitado
    opacity: 0.7,
  },
  buttonText: {
    color: Colors.white, // Color del texto del botón
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Inter', // Asegúrate de que esta fuente esté cargada en tu proyecto si la usas
  },
});

export default CustomButton;
