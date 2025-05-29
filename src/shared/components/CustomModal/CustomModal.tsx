// feelink/src/shared/components/CustomModal/CustomModal.tsx
import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Colors from '../bluetooth/constants/colors'; // Importa tus colores
import CustomButton from '../CustomButton/CustomButton'; // Importa el botón personalizado

interface CustomModalProps {
  isVisible: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel?: () => void; // Opcional, para modales de confirmación
  confirmText?: string;
  cancelText?: string;
}

const CustomModal: React.FC<CustomModalProps> = ({
  isVisible,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Aceptar',
  cancelText = 'Cancelar',
}) => {
  return (
    <Modal
      animationType="fade" // Animación suave
      transparent={true}
      visible={isVisible}
      onRequestClose={onCancel || onConfirm} // Para cerrar con el botón de retroceso en Android
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>{title}</Text>
          <Text style={styles.modalMessage}>{message}</Text>
          <View style={styles.buttonContainer}>
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
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)', // Fondo semitransparente
  },
  modalView: {
    margin: 20,
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '80%', // Ancho del modal
    maxWidth: 400, // Ancho máximo
  },
  modalTitle: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    fontFamily: 'Inter',
  },
  modalMessage: {
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 16,
    color: Colors.textPrimary,
    fontFamily: 'Inter',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  cancelButton: {
    backgroundColor: Colors.palevioletred, // Un color diferente para cancelar
    flex: 1,
    marginHorizontal: 5,
  },
  confirmButton: {
    flex: 1,
    marginHorizontal: 5,
  },
  cancelButtonText: {
    color: Colors.white,
  }
});

export default CustomModal;
