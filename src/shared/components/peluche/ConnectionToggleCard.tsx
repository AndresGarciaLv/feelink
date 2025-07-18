import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

interface Props {
  title: string; 
  icon: React.ReactNode;
  connected: boolean;
  onToggle: () => void;
}


export default function ConnectionToggleCard({
  title,
  icon,
  connected,
  onToggle,
}: Props) {
  return (
    <View style={styles.card}>
      {/* Izquierda: Contenido dinámico según estado */}
      <View style={styles.leftSection}>
        
        {connected ? (
          <>
            <Text style={styles.ssidText}>Peluchin</Text>
            <Text style={[styles.statusText, styles.connectedText]}>Conectado</Text>
          </>
        ) : (
          <Text style={[styles.statusText, styles.disconnectedText]}>No conectado</Text>
        )}
      </View>

      {/* Derecha: Toggle + Título */}
      <View style={styles.rightSection}>
        <TouchableOpacity
          style={[styles.toggleContainer, connected && styles.connectedToggle]}
          onPress={onToggle}
        >
          <View style={[styles.toggleCircle, connected && styles.circleActive]} />
        </TouchableOpacity>
        <Text style={styles.cardTitle}>{title}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F0F0F0',
    borderRadius: 15,
    padding: 16,
    marginHorizontal: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  leftSection: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 4,
    paddingLeft: 35,
    minWidth: 100,
    flex: 1,
  },
  rightSection: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
  },
  ssidText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  statusText: {
    fontSize: 12,
    minWidth: 100,
    alignSelf: 'flex-start',
  },
  connectedText: {
    color: '#9BC4E0',
    fontWeight: '600',
  },
  disconnectedText: {
    color: '#D8A5C2',
    fontWeight: '600',
    marginTop: 8,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 6,
    color: '#333',
  },
  toggleContainer: {
    width: 40,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#E0C7DB',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  connectedToggle: {
    backgroundColor: '#9BC4E0',
  },
  toggleCircle: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: 'white',
    marginLeft: 0,
  },
  circleActive: {
    marginLeft: 18,
  },
  iconContainer: {
    paddingLeft: 20,
  },
  
});