import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface EmotionalSummary {
  id: string;
  stablePercentage: number;
  anxiousPercentage: number;
  crisisPercentage: number;
}

interface PatientData {
  id: string;
  name: string;
  lastName: string;
  age: number;
  gender: string;
  height: number;
  weight: number;
}

interface Props {
  patientId: string;
  accessToken: string;
}

const ResumenEmocional: React.FC<Props> = ({ patientId, accessToken }) => {
  const [summary, setSummary] = useState<EmotionalSummary | null>(null);

  useEffect(() => {
  const fetchSummary = async () => {
    if (!patientId || !accessToken) {
      console.warn("Patient ID o accessToken no disponibles.");
      return;
    }

    try {
      const res = await fetch(`http://feelink-api.runasp.net/api/Patients/${patientId}/summary`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!res.ok) {
        console.warn("Respuesta de API inválida:", res.status);
        return;
      }

      const data = await res.json();
      setSummary(data);
    } catch (error) {
      console.error("Error al obtener el resumen emocional:", error);
    }
  };

  fetchSummary();
}, [patientId, accessToken]);


  const todayStats = summary
    ? [
        { type: 'estable', label: 'Estable', percentage: `${summary.stablePercentage}%` },
        { type: 'ansioso', label: 'Ansioso', percentage: `${summary.anxiousPercentage}%` },
        { type: 'crisis', label: 'Crisis', percentage: `${summary.crisisPercentage}%` },
      ]
    : [];

  const getEmotionColor = (type: string) => {
    switch (type) {
      case 'estable': return '#4CAF50';
      case 'ansioso': return '#FFC107';
      case 'crisis': return '#F44336';
      default: return '#BDBDBD';
    }
  };

  const getEmotionIcon = (type: string) => {
    switch (type) {
      case 'estable': return '😊';
      case 'ansioso': return '😟';
      case 'crisis': return '😰';
      default: return '❓';
    }
  };

  return (
    <View style={styles.emotionalStatsCard}>
      <Text style={styles.sectionTitle}>Estados emocionales del día</Text>
      <View style={styles.emotionalStatsContainer}>
        {todayStats.map((stat, index) => (
          <View key={index} style={styles.emotionalStatItem}>
            <View style={[
              styles.emotionalIcon,
              { backgroundColor: getEmotionColor(stat.type) }
            ]}>
              <Text style={styles.emotionalIconText}>{getEmotionIcon(stat.type)}</Text>
            </View>
            <Text style={styles.emotionalLabel}>{stat.label}</Text>
            <Text style={styles.emotionalPercentage}>{stat.percentage}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  emotionalStatsCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    marginTop: 24,
    elevation: 2,
    margin:16,
  },
  sectionTitle: {
    fontSize: 18,
    
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  emotionalStatsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  emotionalStatItem: {
    alignItems: 'center',
  },
  emotionalIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  emotionalIconText: {
    fontSize: 24,
  },
  emotionalLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#555',
  },
  emotionalPercentage: {
    fontSize: 14,
    color: '#888',
  },
});

export default ResumenEmocional;
