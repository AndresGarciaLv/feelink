import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useListPatientsQuery } from '../../../core/http/requests/patientServerApi';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../core/types/common/navigation';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width * 0.25;
const VISIBLE_ITEMS = 4;

const MyPatientsSection: React.FC = () => {
  const { data: patientsData, isFetching } = useListPatientsQuery({ page: 1, pageSize: 10 });
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(offsetX / (ITEM_WIDTH + 12)); // incluye gap
    setCurrentIndex(newIndex);
  };

  const renderItem = ({ item }: any) => (
    <View style={styles.patientItem}>
      <View style={styles.patientAvatarContainer}>
        <Ionicons name={'person'} size={40} color="#8D99AE" />
      </View>
      <Text style={styles.patientName}>{item.name}</Text>
    </View>
  );

  const totalDots = patientsData?.items ? Math.ceil(patientsData.items.length / VISIBLE_ITEMS) : 0;
  const activeDotIndex = Math.floor(currentIndex / VISIBLE_ITEMS);

  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>Mis pacientes</Text>
      <View style={styles.patientsCard}>
        {isFetching && <Text>Cargando pacientes...</Text>}

        {patientsData?.items && (
          <FlatList
            ref={flatListRef}
            horizontal
            data={patientsData.items}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.patientsContainer}
            onScroll={handleScroll}
            scrollEventThrottle={16}
          />
        )}

        {/* Pagination Dots */}
        <View style={styles.paginationContainer}>
          {Array.from({ length: totalDots }).map((_, index) => (
            <View
              key={index}
              style={[
                styles.paginationDot,
                index === activeDotIndex && styles.activeDot,
              ]}
            />
          ))}
        </View>

       
      </View>
       <TouchableOpacity
          style={styles.viewMoreButton}
          onPress={() => navigation.navigate('Patients', { openAddModal: false })}
        >
          <Text style={styles.viewMoreText}>Ver más</Text>
        </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 2,
  },
  patientsCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  patientsContainer: {
    gap: 12,
    marginBottom: 16,
  },
  patientItem: {
    width: ITEM_WIDTH,
    alignItems: 'center',
  },
  patientAvatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E8F0FE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  patientName: {
    marginTop: 8,
    fontSize: 14,
    color: '#2D3748',
    textAlign: 'center',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 8,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D1D9E6',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#4A90E2',
  },
 viewMoreButton: {
  backgroundColor: '#A8C7E5',
  borderRadius: 20,
  paddingVertical: 8,
  paddingHorizontal: 24,
  alignItems: 'center',
  alignSelf: 'center', 
  marginTop: 15,       
},

  viewMoreText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default MyPatientsSection;
