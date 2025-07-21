import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import { useNavigation } from '@react-navigation/native';
import Colors from '../../../shared/components/constants/colors';
import { useGetPatientByIdQuery } from '../../../core/http/requests/patientServerApi';
import { useState } from 'react';
import { Modal, TextInput, Alert } from 'react-native';
import { 
  useCreateToyMutation, 
  useDeleteToyMutation, 
  useUpdateToyMutation   
} from '../../../core/http/requests/toyServerApi';
import { useListPatientsQuery } from '../../../core/http/requests/patientServerApi';

const ToyItem = ({ data }) => {

    // Estados para el modal
const [modalVisible, setModalVisible] = useState(false);
const [editingToyId, setEditingToyId] = useState(null);
const [toyName, setToyName] = useState('');
const [toyMacAddress, setToyMacAddress] = useState('');
const [selectedPatientId, setSelectedPatientId] = useState('');
const [patientSelectorVisible, setPatientSelectorVisible] = useState(false);

// Hooks para las mutations y queries
const [createToy] = useCreateToyMutation();
const [deleteToy] = useDeleteToyMutation();
const [updateToy] = useUpdateToyMutation(); // AGREGAR ESTA LÍNEA

// Para obtener la lista de pacientes
const { data: patientsData } = useListPatientsQuery({ page: 1, pageSize: 100 });
const patients = patientsData?.items || [];
  const navigation = useNavigation();
  const PatientName = ({ patientId }) => {
    const { data: patient, isLoading } = useGetPatientByIdQuery(patientId, {
        skip: !patientId, // Solo ejecuta si hay patientId
    });

    if (isLoading) return <Text style={styles.detail}>Cargando...</Text>;
    if (!patient) return <Text style={styles.detail}>Sin asignar</Text>;

    return <Text style={styles.detail}>{patient.name} {patient.lastName}</Text>;
  };

const handleEdit = (toy) => {
  setEditingToyId(toy.id);
  setToyName(toy.name);
  setToyMacAddress(toy.macAddress);
  setSelectedPatientId(toy.patientId);
  setModalVisible(true);
};

const handleDelete = (toyId) => {
  Alert.alert(
    'Eliminar peluche',
    '¿Deseas eliminar este peluche?',
    [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteToy(toyId).unwrap();
            Alert.alert('Éxito', 'Peluche eliminado correctamente.');
          } catch (error) {
            Alert.alert('Error', 'No se pudo eliminar el peluche.');
          }
        },
      },
    ]
  );
};

const handleSave = async () => {
  if (!toyName.trim()) {
    Alert.alert('Error', 'Por favor, ingresa el nombre del peluche.');
    return;
  }

  // AGREGAR validación para MAC Address al editar
  if (editingToyId && !toyMacAddress.trim()) {
    Alert.alert('Error', 'Por favor, ingresa la dirección MAC.');
    return;
  }

  try {
    if (editingToyId) {
      // Al editar, enviamos nombre y macAddress
      const result = await updateToy({ 
        id: editingToyId, 
        name: toyName,
        macAddress: toyMacAddress 
      }).unwrap();
      
      Alert.alert('Éxito', 'Peluche actualizado correctamente.');
    } else {
      // Al crear, validamos y enviamos todos los campos
      if (!toyMacAddress.trim() || !selectedPatientId) {
        Alert.alert('Error', 'Por favor, completa todos los campos.');
        return;
      }
      
      const toyData = {
        name: toyName,
        macAddress: toyMacAddress,
        patientId: selectedPatientId,
      };
      
      await createToy(toyData).unwrap();
      Alert.alert('Éxito', 'Peluche creado correctamente.');
    }
    resetForm();
  } catch (error) {
    console.error('Error:', error);
    Alert.alert('Error', 'Hubo un problema al guardar el peluche.');
  }
};
const resetForm = () => {
  setToyName('');
  setToyMacAddress('');
  setSelectedPatientId('');
  setEditingToyId(null);
  setModalVisible(false);
};
  const renderItem = ({ item }) => (

    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => {
        console.log('Toy pressed:', item.id);
      }}
      style={styles.rowFront}
    >
      <View style={styles.card}>
        <Image
          source={require('../../assets/img/icon.png')}
          style={styles.image}
        />
        <View style={styles.info}>
          <View style={styles.mainInfo}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.detail}>MAC: {item.macAddress}</Text>
          </View>
          <View style={styles.secondaryInfo}>
            <PatientName patientId={item.patientId} />
            {/* <Text style={[styles.status, { color: item.isActive ? Colors.success : Colors.error }]}>
              {item.isActive ? 'Activo' : 'Inactivo'}
            </Text> */}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderHiddenItem = ({ item }) => (
    <View style={styles.hiddenContainer}>
        <TouchableOpacity style={styles.editBtn} onPress={() => handleEdit(item)}>
        <Text style={styles.hiddenText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(item.id)}>
        <Text style={styles.hiddenText}>Eliminar</Text>
        </TouchableOpacity>
    </View>
  );

  return (
    <>
    <SwipeListView
      data={data}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      renderHiddenItem={renderHiddenItem}
      rightOpenValue={-170}
      disableRightSwipe
      stopRightSwipe={-170}
      previewRowKey={'0'}
      previewOpenValue={-40}
      previewOpenDelay={3000}
      friction={10}
      tension={70}
      directionalLockEnabled={true}
    />
<Modal visible={modalVisible} animationType="slide" transparent>
  <View style={styles.modalOverlay}>
    <View style={styles.modalContainer}>
      <Text style={styles.modalTitle}>
        {editingToyId ? 'Editar Peluche' : 'Nuevo Peluche'}
      </Text>
      <Text style={styles.infoLabel}>Nombre del peluche:</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre del peluche"
        value={toyName}
        onChangeText={setToyName}
      />
      <Text style={styles.infoLabel}>Dirección MAC:</Text>
      <TextInput
        style={styles.input}
        placeholder="Dirección MAC"
        value={toyMacAddress}
        onChangeText={setToyMacAddress}
      />
      
      {!editingToyId && (
        <>
          <TouchableOpacity
            style={styles.patientSelector}
            onPress={() => setPatientSelectorVisible(true)}
          >
            <Text style={{ color: selectedPatientId ? Colors.textPrimary : '#888' }}>
              {selectedPatientId ? 
                patients.find(p => p.id === selectedPatientId)?.name + ' ' + 
                patients.find(p => p.id === selectedPatientId)?.lastName 
                : 'Seleccionar paciente'}
            </Text>
          </TouchableOpacity>
          
          <Modal visible={patientSelectorVisible} transparent>
            <TouchableOpacity
              style={styles.modalOverlay}
              onPress={() => setPatientSelectorVisible(false)}
            >
              <View style={styles.pickerContainer}>
                {patients.map((patient) => (
                  <TouchableOpacity
                    key={patient.id}
                    style={styles.pickerOption}
                    onPress={() => {
                      setSelectedPatientId(patient.id);
                      setPatientSelectorVisible(false);
                    }}
                  >
                    <Text>{patient.name} {patient.lastName}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </TouchableOpacity>
          </Modal>
        </>
      )}
      
      {editingToyId && (
        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>Paciente asignado:</Text>
          <Text style={styles.infoValue}>
            {selectedPatientId ? 
              patients.find(p => p.id === selectedPatientId)?.name + ' ' + 
              patients.find(p => p.id === selectedPatientId)?.lastName 
              : 'Sin asignar'}
          </Text>
        </View>
      )}
      
      <View style={styles.modalButtons}>
        <TouchableOpacity style={styles.cancelButton} onPress={resetForm}>
          <Text style={styles.buttonText}>Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.buttonText}>Guardar</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
</Modal>
    </>
  );
};

const styles = StyleSheet.create({
  rowFront: {
    alignItems: 'center',
    backgroundColor: Colors.white,
    justifyContent: 'center',
    height: 120,
  },infoContainer: {
  marginBottom: 15,
},
infoLabel: {
  fontSize: 14,
  color: Colors.textSecondary,
  marginBottom: 2,
  marginTop: 10,
},
infoValue: {
  fontSize: 16,
  color: Colors.textPrimary,
  backgroundColor: '#f5f5f5',
  padding: 12,
  borderRadius: 8,
},
  card: {
    backgroundColor: Colors.white,
    borderRadius: 6,
    padding: 15,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    height: 120,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginHorizontal: 16,
    width: '100%',
  },
  image: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 16,
    resizeMode: 'cover',
  },
  info: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  mainInfo: {
    marginBottom: 8,
  },
  name: {
    fontSize: 16,
    color: Colors.textPrimary,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  detail: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  secondaryInfo: {
    flexDirection: 'column',
  },
  status: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 2,
  },
  hiddenContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 12,
    height: 120,
    alignItems: 'center',
    backgroundColor: 'transparent',
    marginHorizontal: 16,
  },
  editBtn: {
    backgroundColor: Colors.lightsteelblue,
    justifyContent: 'center',
    alignItems: 'center',
    width: 75,
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
    height: '100%',
  },
  deleteBtn: {
    backgroundColor: Colors.palevioletred,
    justifyContent: 'center',
    alignItems: 'center',
    width: 75,
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
    height: '100%',
  },
  hiddenText: {
    color: '#fff',
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
  marginBottom: 15,
},
input: {
  borderWidth: 1,
  borderColor: '#ddd',
  borderRadius: 8,
  padding: 12,
  marginBottom: 10,
},
patientSelector: {
  borderWidth: 1,
  borderColor: '#ddd',
  borderRadius: 8,
  padding: 12,
  marginBottom: 10,
},
modalButtons: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginTop: 15,
},
saveButton: {
  backgroundColor: Colors.lightsteelblue,
  padding: 12,
  borderRadius: 8,
  flex: 1,
  marginRight: 5,
  alignItems: 'center',
},
cancelButton: {
  backgroundColor: Colors.palevioletred,
  padding: 12,
  borderRadius: 8,
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
  borderRadius: 10,
  padding: 10,
  maxHeight: 300,
},
pickerOption: {
  padding: 15,
  borderBottomWidth: 1,
  borderBottomColor: '#eee',
},
});

export default ToyItem;