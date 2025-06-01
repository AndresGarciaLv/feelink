// feelink/src/shared/components/Wifi1C/WifiInput.tsx
import React from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';
import Colors from '../bluetooth/constants/colors'; // Importa tus colores

interface WifiInputProps extends TextInputProps {
  label: string;
  placeholder: string;
}

const WifiInput: React.FC<WifiInputProps> = ({ label, placeholder, ...rest }) => {
  return (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={Colors.lightsteelblue}
        {...rest}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: Colors.textPrimary,
    marginBottom: 8,
    fontWeight: '600',
    fontFamily: 'Inter',
  },
  input: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.lightsteelblue,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.textPrimary,
    fontFamily: 'Inter',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1.5,
    elevation: 2,
  },
});

export default WifiInput;
