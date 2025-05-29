import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import HeaderTutor from '../../components/HeaderTutor';

const ProfileTutor: React.FC = () => {
  return (
    <View style={styles.container}>
      <HeaderTutor />
      
      <View style={styles.avatarContainer}>
        <Image
          source={require('../../../../assets/perfil.png')}
          style={styles.avatar}
        />
        <TouchableOpacity style={styles.tagButton}>
          <Text style={styles.tagText}>peluchin</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.name}>Álvaro Díaz</Text>
        <Text style={styles.subText}>3 Años</Text>
        <Text style={styles.subTextGray}>321000218739812 • Niño</Text>
      </View>
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statValueWithUnit}>73 
            <Text style={styles.statUnit}>cm</Text>
            </Text>
          <Text style={styles.statLabel}>Altura</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.statBox}>
          <Text style={styles.statValueWithUnit}>12
             <Text style={styles.statUnit}>kg</Text>
             </Text>
          <Text style={styles.statLabel}>Peso</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.statBox}>
          <Text style={styles.statValue}>12</Text>
          <Text style={styles.statUnit}>IMC</Text>
        </View>
      </View>
      <View style={styles.buttonGroup}>
        <TouchableOpacity style={styles.wifiButton}>
          <Text style={styles.wifiText}>Conectar a Wifi</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bluetoothButton}>
          <Text style={styles.bluetoothText}>Conectar por Bluetooth</Text>
        </TouchableOpacity>
      </View>
      
    </View>
  );
};

export default ProfileTutor;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
        fontFamily: 'sans-serif',
    },
    avatarContainer: {
        alignItems: 'center',
        marginTop: -45,
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
    },
    tagButton: {
        borderColor: '#9BC4E0',
        borderWidth: 1,
        borderRadius: 50,
        paddingHorizontal: 12,
        paddingVertical: 4,
    },
    subTextGray: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
        textAlign: 'center',
    },
    tagText: {
        color: '#9BC4E0',
        fontSize: 12,
    },
    infoContainer: {
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 20,
        color: '#333',
    },
    name: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 6,
    },
    subText: {
        fontSize: 14,
        color: '#333',
        marginBottom: 6,
    },
    statValueWithUnit: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
    },
    verticalDivider: {
        width: 1,
        backgroundColor: '#CCC',
        marginHorizontal: 8,
        height: '100%',
        alignSelf: 'center',
    },
    subTextSpacer: {
        fontSize: 14,
        color: '#333',
        marginTop: 6,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginHorizontal: 24,
        marginTop: 24,
        backgroundColor: '#FFF',
        padding: 16,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
        alignItems: 'center',
    },
    statBox: {
        alignItems: 'center',
        flex: 1,
        backgroundColor: '#FFFF',
    },
    divider: {
        width: 1,
        height: '100%',
        backgroundColor: '#DDD',
        marginHorizontal: 8,
    },
    statValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    statUnit: {
        fontSize: 14,
        color: '#666',
    },
    statLabel: {
        fontSize: 12,
        marginTop: 4,
    },
    buttonGroup: {
        marginTop: 24,
        marginHorizontal: 24,
        gap: 12,
    },
    wifiButton: {
        backgroundColor: '#9BC4E0',
        padding: 12,
        borderRadius: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    wifiText: {
        color: '#FFF',
        fontWeight: '500',
        fontSize: 16,
    },
    bluetoothButton: {
        borderColor: '#9BC4E0',
        borderWidth: 1,
        padding: 12,
        borderRadius: 16,
        alignItems: 'center',
    },
    bluetoothText: {
        color: '#9BC4E0',
        fontWeight: '500',
        fontSize: 16,
    },
});
