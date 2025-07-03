import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import { useNavigation } from '@react-navigation/native';
import Colors from '../constants/colors';
import perfil from "../../assets/img/perfil.png"; // Avatar por defecto
import { Patient } from '../../../core/contracts/patient/patientsDto';

type Props = {
  data: Patient[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
};

export default function PatientList({ data, onEdit, onDelete }: Props) {
  const navigation = useNavigation();

  const renderItem = ({ item }: { item: Patient }) => (
    // Asegúrate de que no haya espacios o saltos de línea aquí,
    // directamente después de <TouchableOpacity y antes de <View
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => navigation.navigate('Profile', { patientId: item.id })}
      style={styles.rowFront}
    >
      <View style={styles.card}>
        <Image
          source={item.profileImageUrl ? { uri: item.profileImageUrl } : perfil}
          style={styles.image}
        />
        <View style={styles.info}>
          <Text style={styles.name}>{item.name} {item.lastName}</Text>
          <Text style={styles.age}>{item.age} años</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderHiddenItem = ({ item }: { item: Patient }) => (
    // Asegúrate de que no haya espacios o saltos de línea aquí,
    // directamente después de <View y antes de <TouchableOpacity
    <View style={styles.hiddenContainer}>
      <TouchableOpacity style={styles.editBtn} onPress={() => onEdit(item.id)}>
        <Text style={styles.hiddenText}>Editar</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.deleteBtn} onPress={() => onDelete(item.id)}>
        <Text style={styles.hiddenText}>Eliminar</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SwipeListView
      data={data}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      renderHiddenItem={renderHiddenItem}
      rightOpenValue={-145}
      disableRightSwipe
      stopRightSwipe={-145}
      previewRowKey={'0'}
      previewOpenValue={-40}
      previewOpenDelay={3000}
      friction={10}
      tension={70}
      directionalLockEnabled={true}
    />
  );
}

const styles = StyleSheet.create({
  rowFront: {
    alignItems: 'center',
    backgroundColor: Colors.white,
    justifyContent: 'center',
    height: 85,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 6,
    padding: 15,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    height: 85,
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 16,
    color: Colors.textPrimary,
    fontWeight: 'normal',
  },
  age: {
    fontSize: 14,
    color: Colors.textPrimary,
    marginLeft: 12,
  },
  hiddenContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 12,
    height: 85,
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
});