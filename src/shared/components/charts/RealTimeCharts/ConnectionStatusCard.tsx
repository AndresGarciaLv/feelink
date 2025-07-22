// src\shared\components\charts\RealTimeCharts\ConnectionStatusCard.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ClinicalColors from '../../constants/clinicalcolors';


interface Props {
  isConnected: boolean;
  isReceivingData: boolean;
}


const ConnectionStatusCard: React.FC<Props> = ({ isConnected, isReceivingData }) => {
  const isFullyConnected = isConnected && isReceivingData;

  const cardColor = !isConnected
    ? ClinicalColors.crisis
    : isReceivingData
    ? ClinicalColors.stable
    : ClinicalColors.anxious;

  const icon = !isConnected ? '🔴' : isReceivingData ? '🟢' : '🟠';

  const statusText = !isConnected
    ? 'Desconectado'
    : isReceivingData
    ? 'Sistema Activo'
    : 'Esperando Dispositivo';

  const subText = !isConnected
    ? 'Intentando reconectar...'
    : isReceivingData
    ? 'Recopilando datos sensoriales'
    : 'En espera de señal del peluche';

  return (
    <View style={[styles.connectionCard, { backgroundColor: cardColor }]}>
      <View style={styles.connectionContent}>
        <Text style={styles.connectionIcon}>{icon}</Text>
        <View>
          <Text style={styles.connectionStatus}>{statusText}</Text>
          <Text style={styles.connectionSubtext}>{subText}</Text>
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
