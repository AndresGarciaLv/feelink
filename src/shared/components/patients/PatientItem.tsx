import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import { useNavigation } from '@react-navigation/native';
import Colors from '../bluetooth/constants/colors';
import perfil from "../../assets/img/perfil.png";

type Patient = {
  id: string;
  name: string;
  age: number;
  image?: any;
};
type Props = {
  data: Patient[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
};

export default function PatientList({ data, onEdit, onDelete }: Props) {
   const navigation = useNavigation();
  return (
    <SwipeListView
      data={data}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TouchableOpacity
          activeOpacity={15}
          onPress={() => navigation.navigate('Profile', { patient: item })}
        >
        <View style={styles.card}>
          <Image
            source={item.image ? item.image : perfil}
            style={styles.image}
          />
          <View style={styles.info}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.age}>{item.age} años</Text>
          </View>
        </View>
        </TouchableOpacity>
      )}
      renderHiddenItem={({ item }) => (
        <View style={styles.hiddenContainer}>
          <TouchableOpacity style={styles.editBtn} onPress={() => onEdit(item.id)}>
            <Text style={styles.hiddenText}>Editar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteBtn} onPress={() => onDelete(item.id)}>
            <Text style={styles.hiddenText}>Eliminar</Text>
          </TouchableOpacity>
        </View>
      )}
      rightOpenValue={-145}
      disableRightSwipe
    />
  );
}

const styles = StyleSheet.create({
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
    height: 80,
    alignItems: 'center',
    backgroundColor: 'transparent',
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
    marginRight: 16,
  },
  hiddenText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
