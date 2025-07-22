// src/components/realtime/ConnectionStatusCard.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ClinicalColors from '../../constants/clinicalcolors';

interface Props {
  isConnected: boolean;
}

const ConnectionStatusCard: React.FC<Props> = ({ isConnected }) => {
  return (
    <View style={[styles.connectionCard, {
      backgroundColor: isConnected ? ClinicalColors.stable : ClinicalColors.crisis
    }]}> 
      <View style={styles.connectionContent}>
        <Text style={styles.connectionIcon}>{isConnected ? '🟢' : '🔴'}</Text>
        <View>
          <Text style={styles.connectionStatus}>
            {isConnected ? 'Sistema Activo' : 'Desconectado'}
          </Text>
          <Text style={styles.connectionSubtext}>
            {isConnected ? 'Recopilando datos sensoriales' : 'Intentando reconectar...'}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  connectionCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  connectionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  connectionIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  connectionStatus: {
    fontSize: 16,
    fontWeight: '600',
    color: ClinicalColors.white,
  },
  connectionSubtext: {
    fontSize: 14,
    color: ClinicalColors.white,
    opacity: 0.9,
  },
});

export default ConnectionStatusCard;
