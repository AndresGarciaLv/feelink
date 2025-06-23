import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import Colors from '../constants/colors';
import CustomButton from './CustomButton';

interface CustomModalProps {
  isVisible: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
  showInput?: boolean;
  password?: string;
  setPassword?: (text: string) => void;
  isLoading?: boolean;
}

const CustomModal: React.FC<CustomModalProps> = ({
  isVisible,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Aceptar',
  cancelText = 'Cancelar',
  showInput = false,
  password = '',
  setPassword,
  isLoading = false,
}) => {
  return (
    <Modal
      animationType="fade"
      transparent
      visible={isVisible}
      onRequestClose={onCancel || onConfirm}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          {/* 🔄 Loader mientras se conecta */}
          {isLoading && (
            <ActivityIndicator
              size="large"
              color={Colors.secondary}
              style={{ marginBottom: 20 }}
            />
          )}

          {/* 🔐 Input solo si no está cargando */}
          {showInput && !isLoading && (
            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              placeholderTextColor={Colors.textSecundary}
            />
          )}

          {/* 🔘 Botones solo si no está cargando */}
          {!isLoading && (
            <View style={styles.buttonGroup}>
              {onCancel && (
                <CustomButton
                  title={cancelText}
                  onPress={onCancel}
                  style={styles.cancelButton}
                  textStyle={styles.cancelButtonText}
                />
              )}
              <CustomButton
                title={confirmText}
                onPress={onConfirm}
                style={styles.confirmButton}
                textStyle={styles.confirmButtonText}
              />
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingHorizontal: 20,
  },
  modalContainer: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 30,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 15,
    fontFamily: 'Inter-SemiBold',
  },
  message: {
    fontSize: 16,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'Inter',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: Colors.lightsteelblue,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    fontFamily: 'Inter',
    marginBottom: 20,
    color: Colors.textPrimary,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  cancelButton: {
    backgroundColor: Colors.palevioletred,
    paddingVertical: 10,
    borderRadius: 12,
    flex: 1,
  },
  confirmButton: {
    backgroundColor: Colors.secondary,
    paddingVertical: 10,
    borderRadius: 12,
    flex: 1,
  },
  cancelButtonText: {
    color: Colors.white,
    fontWeight: '600',
  },
  confirmButtonText: {
    color: Colors.white,
    fontWeight: '600',
  },
});

export default CustomModal;
