import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, TextInput, Alert, Image } from 'react-native';
import PatientList from '../../shared/components/patients/PatientItem';
import Colors from '../../shared/components/constants/colors';
import HeaderPatients from '../../shared/components/HeaderPatients';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import type { RootStackParamList } from '../../core/types/common/navigation';
import TabBar from '../layout/TabBar';
import {
  useListPatientsQuery,
  useCreatePatientMutation,
  useUpdatePatientMutation,
  useDeletePatientMutation,
  useGetPatientByIdQuery,
} from '../../core/http/requests/patientServerApi';

import { Patient } from '../../core/contracts/patient/patientsDto';
import { PatientCreateDto } from '../../core/contracts/patient/patientCreateDto';
import { PatientUpdateDto } from '../../core/contracts/patient/patientUpdateDto';

export default function PatientsScreen() {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [newName, setNewName] = useState('');
  const [newLastName, setNewLastName] = useState('');
  const [newAge, setNewAge] = useState('');
  const [newGender, setNewGender] = useState('');
  const [newHeight, setNewHeight] = useState('');
  const [newWeight, setNewWeight] = useState('');
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);

  // RTK Query hooks
  // Puedes ajustar page y pageSize si necesitas paginación en la UI
  const { data: patientsData, isLoading, isError, error, refetch } = useListPatientsQuery({ page: 1, pageSize: 100 }); // Añadido 'error' para mejor depuración
  const [createPatient, { isLoading: isCreating }] = useCreatePatientMutation();
  const [updatePatient, { isLoading: isUpdating }] = useUpdatePatientMutation();
  const [deletePatient, { isLoading: isDeleting }] = useDeletePatientMutation();

  // Hook para obtener los detalles del paciente seleccionado para edición
  const { data: selectedPatientDetails, isLoading: isLoadingSelectedPatient } = useGetPatientByIdQuery(
    selectedPatientId || '',
    {
      skip: !selectedPatientId, // Solo ejecuta la query si hay un patientId seleccionado
    }
  );

  const route = useRoute<RouteProp<RootStackParamList, 'Patients'>>();
  const shouldOpenModal = route.params?.openAddModal ?? false;

  // --- DEBUGGING LOGS ---
  useEffect(() => {
    console.log("Estado de la lista de pacientes:");
    console.log("isLoading:", isLoading);
    console.log("isError:", isError);
    if (isError) {
      console.log("Error detalles:", error); // Esto te dará más info sobre el error de la API
    }
    console.log("patientsData (RAW):", patientsData);
    if (patientsData?.items) { // Ahora verificando 'items'
      console.log("Número de pacientes (de items):", patientsData.items.length);
    } else {
      console.log("patientsData.items es undefined o nulo.");
    }
  }, [isLoading, isError, patientsData, error]);
  // --- END DEBUGGING LOGS ---


  useEffect(() => {
    if (shouldOpenModal) {
      setModalVisible(true);
      // Limpia los parámetros de ruta para que no se abra el modal cada vez que se navega
      navigation.setParams({ openAddModal: false });
    }
  }, [shouldOpenModal, navigation]);

  useEffect(() => {
    if (selectedPatientDetails) {
      setNewName(selectedPatientDetails.name);
      setNewLastName(selectedPatientDetails.lastName);
      setNewAge(String(selectedPatientDetails.age));
      setNewGender(selectedPatientDetails.gender);
      setNewHeight(String(selectedPatientDetails.height));
      setNewWeight(String(selectedPatientDetails.weight));
      setModalVisible(true);
    }
  }, [selectedPatientDetails]);

  const handleEdit = (id: string) => {
    setSelectedPatientId(id);
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      'Eliminar paciente',
      '¿Deseas eliminar este paciente de la lista?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await deletePatient(id).unwrap();
              Alert.alert('Éxito', 'Paciente eliminado correctamente.');
              refetch(); // Opcional: Refetchear la lista después de eliminar para asegurar que se actualice
            } catch (error) {
              console.error('Error al eliminar paciente:', error);
              Alert.alert('Error', 'No se pudo eliminar el paciente.');
            }
          },
        },
      ]
    );
  };

  const resetForm = () => {
    setNewName('');
    setNewLastName('');
    setNewAge('');
    setNewGender('');
    setNewHeight('');
    setNewWeight('');
    setSelectedPatientId(null);
    setModalVisible(false);
  };

  const handleSave = async () => {
    if (!newName.trim() || !newLastName.trim() || !newAge.trim() || !newGender.trim() || !newHeight.trim() || !newWeight.trim()) {
      Alert.alert('Error', 'Por favor, completa todos los campos.');
      return;
    }

    const patientData = {
      name: newName,
      lastName: newLastName,
      age: parseInt(newAge),
      gender: newGender,
      height: parseFloat(newHeight),
      weight: parseFloat(newWeight),
    };

    try {
      if (selectedPatientId) {
        // Actualizar paciente
        const updateDto: PatientUpdateDto = { id: selectedPatientId, ...patientData };
        await updatePatient(updateDto).unwrap();
        Alert.alert('Éxito', 'Paciente actualizado correctamente.');
      } else {
        // Crear paciente
        const createDto: PatientCreateDto = patientData;
        await createPatient(createDto).unwrap();
        Alert.alert('Éxito', 'Paciente creado correctamente.');
      }
      resetForm();
    } catch (error) {
      console.error('Error al guardar paciente:', error);
      Alert.alert('Error', 'Hubo un problema al guardar el paciente. Por favor, revisa los datos y tu conexión.');
    }
  };

  const [genderOptionsVisible, setGenderOptionsVisible] = useState(false);
  const genderOptions = ['Masculino', 'Femenino']; // Ajusta según lo que tu backend espere para el campo 'gender'

  // Si los datos están cargando o hay un error
  if (isLoading) {
    return <Text style={styles.loadingText}>Cargando pacientes...</Text>;
  }

  if (isError) {
    // Muestra el error de la API para depuración
    return <Text style={styles.errorText}>Error al cargar pacientes. Detalles: {JSON.stringify(error)}</Text>;
  }

  // --- CAMBIO CLAVE AQUÍ: Acceder a 'items' en lugar de 'data' ---
  const patients = patientsData?.items || []; // <--- ¡Este es el cambio importante!

  return (
    <View style={styles.container}>
      <HeaderPatients />
      <View style={{ height: 20 }} />
      <TouchableOpacity style={styles.addButton} onPress={() => { setSelectedPatientId(null); resetForm(); setModalVisible(true); }}>
        <Text style={styles.addText}>Agregar paciente</Text>
      </TouchableOpacity>
      <View style={{ height: 10 }} />

      {/* Condición para mostrar la lista o un mensaje si no hay pacientes */}
      {patients.length > 0 ? (
        <PatientList data={patients} onEdit={handleEdit} onDelete={handleDelete} />
      ) : (
        <Text style={styles.noPatientsText}>No hay pacientes registrados. ¡Agrega uno!</Text>
      )}

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              {selectedPatientId ? 'Editar paciente' : 'Nuevo paciente'}
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Nombre"
              value={newName}
              onChangeText={setNewName}
            />
            <TextInput
              style={styles.input}
              placeholder="Apellido"
              value={newLastName}
              onChangeText={setNewLastName}
            />
            <TextInput
              style={styles.input}
              placeholder="Edad"
              keyboardType="numeric"
              value={newAge}
              onChangeText={setNewAge}
            />
            <TouchableOpacity
              style={[styles.input, {
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between'
              }]}
              onPress={() => setGenderOptionsVisible(true)}
            >
              <Text style={{ color: newGender ? Colors.textPrimary : '#888' }}>
                {newGender || 'Género'}
              </Text>
              <Text style={styles.arrow}>▼</Text>
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              placeholder="Altura (cm)"
              keyboardType="numeric"
              value={newHeight}
              onChangeText={setNewHeight}
            />
            <TextInput
              style={styles.input}
              placeholder="Peso (kg)"
              keyboardType="numeric"
              value={newWeight}
              onChangeText={setNewWeight}
            />
            <Modal visible={genderOptionsVisible} transparent animationType="fade">
              <TouchableOpacity
                style={styles.modalOverlay}
                onPress={() => setGenderOptionsVisible(false)}
                activeOpacity={1}
              >
                <View style={styles.pickerContainer}>
                  {genderOptions.map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={styles.pickerOption}
                      onPress={() => {
                        setNewGender(option);
                        setGenderOptionsVisible(false);
                      }}
                    >
                      <Text style={styles.pickerText}>{option}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </TouchableOpacity>
            </Modal>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.cancelButton, { marginRight: 10 }]}
                onPress={resetForm}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSave}
                disabled={isCreating || isUpdating}
              >
                <Text style={styles.buttonText}>
                  {isCreating || isUpdating ? 'Guardando...' : 'Guardar'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <TabBar activeTab="Patients" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingVertical: 20,
  },
  addButton: {
    backgroundColor: Colors.softPurple,
    borderRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignSelf: 'flex-start',
    marginBottom: 20,
    marginLeft: 15,
  },
  addText: {
    color: Colors.white,
    fontWeight: 'bold',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: Colors.white,
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.textPrimary,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  saveButton: {
    backgroundColor: Colors.lightsteelblue,
    padding: 10,
    borderRadius: 10,
    flex: 1,
    marginRight: 5,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: Colors.palevioletred,
    padding: 10,
    borderRadius: 10,
    flex: 1,
    marginLeft: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: Colors.white,
    fontWeight: 'bold',
  },
  pickerContainer: {
    backgroundColor: Colors.white,
    marginHorizontal: 30,
    borderRadius: 10,
    padding: 10,
  },
  pickerOption: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  pickerText: {
    fontSize: 16,
    color: Colors.textPrimary,
  },
  arrow: {
    fontSize: 16,
    color: '#888',
    marginRight: 10,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 18,
    color: Colors.textPrimary,
  },
  errorText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 18,
    color: Colors.palevioletred,
  },
  noPatientsText: { // Nuevo estilo para cuando no hay pacientes
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: Colors.textPrimary,
  },
});