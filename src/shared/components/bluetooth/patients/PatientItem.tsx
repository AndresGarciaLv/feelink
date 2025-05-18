import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import Colors from '../constants/colors';

type Patient = {
  id: string;
  name: string;
  age: number;
};

type Props = {
  data: Patient[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
};

export default function PatientList({ data, onEdit, onDelete }: Props) {
  return (
    <SwipeListView
      data={data}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.card}>
            
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.age}>{item.age} años</Text>
        </View>
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
      rightOpenValue={-150}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: 6,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  name: {
    fontSize: 16,
    color: Colors.textPrimary,
  },
  age: {
    fontSize: 16,
    color: Colors.textPrimary,
  },
  hiddenContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 12,
  },
  editBtn: {
    backgroundColor: Colors.secondary, 
    justifyContent: 'center',
    alignItems: 'center',
    width: 75,
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
  },
  deleteBtn: {
    backgroundColor: '#FF3B30', 
    justifyContent: 'center',
    alignItems: 'center',
    width: 75,
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
  },
  hiddenText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
