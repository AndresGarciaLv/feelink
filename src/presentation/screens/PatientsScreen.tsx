import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Modal, TextInput, Alert, Image} from 'react-native';
import PatientList from '../../shared/components/patients/PatientItem';
import Colors from '../../shared/components/constants/colors';
import HeaderPatients from '../../shared/components/HeaderPatients';
import {useRoute, RouteProp} from '@react-navigation/native';
import type {RootStackParamList} from "../../core/types/common/navigation"
import TabBar from '../layout/TabBar';

const initialPatients = [
    {id: '1', name: 'Julian Gonzalez', age: 19, avatar: require('../../shared/assets/img/perfil.png')},
    {id: '2', name: 'Luis Ramirez', age: 10, avatar: require('../../shared/assets/img/perfil.png')},
    {id: '3', name: 'Álvaro Díaz', age: 17, avatar: require('../../shared/assets/img/perfil.png')},
    {id: '4', name: 'Astrid López', age: 5, avatar: require('../../shared/assets/img/perfil.png')},
];

export default function PatientsScreen() {
    const [patients, setPatients] = useState(initialPatients);
    const [modalVisible, setModalVisible] = useState(false);
    const [newName, setNewName] = useState('');
    const [newAge, setNewAge] = useState('');
    const [newSexo, setNewSexo] = useState('');
    const [newAltura, setNewAltura] = useState('');
    const [newPeso, setNewPeso] = useState('');
    const [selectedPatient, setSelectedPatient] = useState<{ id: string, name: string, age: number } | null>(null);


// Al principio del componente:
    const route = useRoute<RouteProp<RootStackParamList, 'Patients'>>();
    const shouldOpenModal = route.params?.openAddModal ?? false;
    const loadPatients = async () => {
    try {
        const response = await fetch('http://192.168.18.7:5002/api/patients?page=1&pageSize=100');
        if (!response.ok) throw new Error('Error al cargar pacientes');
        const data = await response.json();
        const patientsFromApi = data.items.map((p: any) => ({
            id: p.id.toString(),
            name: p.name,
            age: p.age,
            //avatar: getRandomAvatar(),
        }));
        setPatients(patientsFromApi);
    } catch (error) {
        console.error('Error al cargar pacientes:', error);
        Alert.alert('Error', 'No se pudieron cargar los pacientes.');
    }
};

useEffect(() => { loadPatients(); }, []);


    useEffect(() => {
        if (shouldOpenModal) {
            setModalVisible(true);
        }
    }, [shouldOpenModal]);

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
        Alert.alert(
            'Eliminar paciente', '¿Deseas eliminar este paciente de la lista?',
            [
                {text: 'Cancelar', style: 'cancel'},
                {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress:async () => {
                        try {
                            const response =await fetch(`http://192.168.18.7:5002/api/patients/${id}`, {
                                method: 'DELETE'
                            });
                            if (!response.ok) 
                                throw new Error('Error al eliminar el paciente');
                            await loadPatients();
                        } catch (error) {
                            console.error('Error al eliminar paciente:', error);
                            Alert.alert('Error', 'No se pudo eliminar el paciente.');
                        }    
                    }
                }
            ]
        );
    };

   const resetForm = () => {
    setNewName('');
    setNewAge('');
    setNewSexo('');
    setNewAltura('');
    setNewPeso('');
    setSelectedPatient(null);
    setModalVisible(false);
};


    const handleSave = async () => {
        if (!newName.trim() || !newAge.trim() || !newSexo.trim() || !newAltura.trim() || !newPeso.trim()) {
            Alert.alert('Error', 'Por favor, completa todos los campos.');
            return;
        }

        const patientPayload = {
                name: newName,
                age: parseInt(newAge),
                gender: newSexo,
                height: parseInt(newAltura),
                weight: parseInt(newPeso),
                //avatar: getRandomAvatar(),
            };
            
            try {
                if (selectedPatient) {
                    // UPDATE paciente existente
                const response = await fetch(`http://192.168.18.7:5002/api/patients/${selectedPatient.id}`, {
                    method: 'PUT',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({...patientPayload, id: selectedPatient.id}),
                });
                if (!response.ok) 
                    throw new Error('Error al guardar el paciente');
                //Recargar pacientes
                await loadPatients();
                } else {
                // CREATE nuevo paciente
                const response = await fetch('http://192.168.18.7:5002/api/patients', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(patientPayload),
                });
                if (!response.ok)
                    throw new Error('Error al guardar el paciente');
                //recargar pacientes
                await loadPatients();
                }
                resetForm();
            } catch (error) {
    console.error('Error al guardar paciente:', error);
    Alert.alert('Error', 'No se pudo guardar el paciente.');
    }
    };

    
    const getRandomAvatar = () => {
        const avatars = [
            require('../../shared/assets/img/perfil.png'),
        ];
        return avatars[Math.floor(Math.random() * avatars.length)];
    };
    const [sexoOptionsVisible, setSexoOptionsVisible] = useState(false);
    const sexoOptions = ['Masculino', 'Femenino'];

    return (
        <View style={styles.container}>
            <HeaderPatients/>
            <View style={{height: 20}}/>
            <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
                <Text style={styles.addText}>Agregar paciente</Text>
            </TouchableOpacity>
            <View style={{height: 10}}/>
            <PatientList data={patients} onEdit={handleEdit} onDelete={handleDelete}/>
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
                        <TouchableOpacity
                            style={[styles.input, {
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between'
                            }]}
                            onPress={() => setSexoOptionsVisible(true)}
                        >
                            <Text style={{color: newSexo ? Colors.textPrimary : '#888'}}>
                                {newSexo || 'Sexo'}
                            </Text>
                            <Text style={styles.arrow}>▼</Text>
                        </TouchableOpacity>
                        <TextInput
                            style={styles.input}
                            placeholder="Altura (cm)"
                            keyboardType="numeric"
                            value={newAltura}
                            onChangeText={setNewAltura}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Peso (kg)"
                            keyboardType="numeric"
                            value={newPeso}
                            onChangeText={setNewPeso}
                        />
                        <Modal visible={sexoOptionsVisible} transparent animationType="fade">
                            <TouchableOpacity
                                style={styles.modalOverlay}
                                onPress={() => setSexoOptionsVisible(false)}
                                activeOpacity={1}
                            >
                                <View style={styles.pickerContainer}>
                                    {sexoOptions.map((option) => (
                                        <TouchableOpacity
                                            key={option}
                                            style={styles.pickerOption}
                                            onPress={() => {
                                                setNewSexo(option);
                                                setSexoOptionsVisible(false);
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
                                style={[styles.cancelButton, {marginRight: 10}]}
                                onPress={resetForm}
                            >
                                <Text style={styles.buttonText}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.saveButton}
                                onPress={handleSave}
                            >
                                <Text style={styles.buttonText}>Guardar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
            <TabBar activeTab="Patients"/>
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
});
