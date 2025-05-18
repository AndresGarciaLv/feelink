import React, { useState, useEffect } from 'react';
import {View,Text,TouchableOpacity,StyleSheet,Modal,TextInput,Alert,} from 'react-native';
import PatientList from '../shared/components/bluetooth/patients/PatientItem';
import Colors from '../shared/components/bluetooth/constants/colors';

const initialPatients = [
  { id: '1', name: 'Julian Gonzalez', age: 19 },
  { id: '2', name: 'Luis Ramirez', age: 10 },
  { id: '3', name: 'Álvaro Díaz', age: 17 },
  { id: '4', name: 'Astrid López', age: 5 },
];

export default function PatientsScreen() {
  const [patients, setPatients] = useState(initialPatients);
  const [modalVisible, setModalVisible] = useState(false);
  const [newName, setNewName] = useState('');
  const [newAge, setNewAge] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<{ id: string, name: string, age: number } | null>(null);

  useEffect(() => {
    if (selectedPatient) {
      setNewName(selectedPatient.name);
      setNewAge(String(selectedPatient.age));
      setModalVisible(true);
    }
  }, [selectedPatient]);

  const handleEdit = (id: string) => {
    const patientToEdit = patients.find(p => p.id === id);
    if (patientToEdit) {
      setSelectedPatient(patientToEdit);
    }
  };

  const handleDelete = (id: string) => {
    setPatients(prev => prev.filter(p => p.id !== id));
  };

  const resetForm = () => {
    setNewName('');
    setNewAge('');
    setSelectedPatient(null);
    setModalVisible(false);
  };

  const handleSave = () => {
    if (!newName.trim() || !newAge.trim()) {
      Alert.alert('Error', 'Por favor, completa todos los campos.');
      return;
    }

    if (selectedPatient) {
      const updatedList = patients.map(p =>
        p.id === selectedPatient.id ? { ...p, name: newName, age: parseInt(newAge) } : p
      );
      setPatients(updatedList);
    } else {
      const newPatient = {
        id: Date.now().toString(),
        name: newName,
        age: parseInt(newAge),
      };
      setPatients(prev => [...prev, newPatient]);
    }

    resetForm();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.addText}>Agregar paciente</Text>
      </TouchableOpacity>

      <PatientList data={patients} onEdit={handleEdit} onDelete={handleDelete} />

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              {selectedPatient ? 'Editar paciente' : 'Nuevo paciente'}
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Nombre"
              value={newName}
              onChangeText={setNewName}
            />
            <TextInput
              style={styles.input}
              placeholder="Edad"
              keyboardType="numeric"
              value={newAge}
              onChangeText={setNewAge}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
                <Text style={styles.buttonText}>Guardar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={resetForm} style={styles.cancelButton}>
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: 20,
  },
  addButton: {
    backgroundColor: Colors.softPurple,
    borderRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  addText: {
    color: Colors.white,
    fontWeight: 'bold',
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
    backgroundColor: Colors.softPurple,
    padding: 10,
    borderRadius: 10,
    flex: 1,
    marginRight: 5,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#FF3B30',
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
});
