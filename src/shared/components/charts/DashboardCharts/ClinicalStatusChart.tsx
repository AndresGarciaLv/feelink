import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PieChart } from "react-native-gifted-charts";
import { AggregatedData } from '../../../../core/types/common/AggregatedData';

// interface AggregatedData {
//   stableChildren: number;
//   anxiousChildren: number;
//   crisisChildren: number;
//   totalChildren: number; // Agregar para mejor validación
//   activeChildren: number; // Agregar para validación
// }

interface PieDataItem {
  value: number;
  color: string;
  text: string;
  label?: string;
  gradientCenterColor?: string;
  focused?: boolean;
}

interface ClinicalStatusChartProps {
  aggregatedData: AggregatedData;
}

const ClinicalStatusChart: React.FC<ClinicalStatusChartProps> = ({ aggregatedData }) => {
  
  // 🔍 DEBUG: Verificar datos recibidos
  // console.log('📊 [ClinicalStatusChart] Datos recibidos:', aggregatedData);
  
  const getClinicalStatusData = (): PieDataItem[] => {
    const { stableChildren, anxiousChildren, crisisChildren } = aggregatedData;
    const total = stableChildren + anxiousChildren + crisisChildren;
    
    
    if (total === 0) {
      return [];
    }

    const data = [
      {
        value: stableChildren,
        color: '#2E7D57',
        gradientCenterColor: '#4A9B6B',
        text: `${stableChildren}`,
        label: 'Estable',
        focused: stableChildren === Math.max(stableChildren, anxiousChildren, crisisChildren)
      },
      {
        value: anxiousChildren,
        color: '#F5A623',
        gradientCenterColor: '#F7BC47',
        text: `${anxiousChildren}`,
        label: 'Moderado',
      },
      {
        value: crisisChildren,
        color: '#D0021B',
        gradientCenterColor: '#E53E3E',
        text: `${crisisChildren}`,
        label: 'Crítico',
      }
    ].filter(item => item.value > 0);

    // console.log('📊 [ClinicalStatusChart] Datos para gráfica:', data);
    return data;
  };

  const clinicalStatusData = getClinicalStatusData();

  // 🔍 MEJORA 1: Mejor validación
  if (clinicalStatusData.length === 0) {
    return (
      <View style={styles.chartCard}>
        <View style={styles.chartHeader}>
          <Text style={styles.chartTitle}>ESTADO CLÍNICO ACTUAL</Text>
          <Text style={styles.chartSubtitle}>Distribución por nivel de severidad</Text>
        </View>
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>No hay pacientes con datos clínicos disponibles</Text>
          <Text style={styles.noDataSubtext}>
            {aggregatedData.totalChildren > 0 
              ? `${aggregatedData.totalChildren} pacientes registrados, ${aggregatedData.activeChildren} conectados`
              : 'No hay pacientes registrados'
            }
          </Text>
        </View>
      </View>
    );
  }

  // 🔍 MEJORA 2: Calcular total una sola vez
  const totalPatients = clinicalStatusData.reduce((sum, item) => sum + item.value, 0);
  
  return (
    <View style={styles.chartCard}>
      <View style={styles.chartHeader}>
        <Text style={styles.chartTitle}>ESTADO CLÍNICO ACTUAL</Text>
        <Text style={styles.chartSubtitle}>
          Distribución por nivel de severidad • {totalPatients} de {aggregatedData.activeChildren} activos
        </Text>
      </View>
      
      <View style={styles.chartContainer}>
        <PieChart
          data={clinicalStatusData}
          donut
          radius={85}
          innerRadius={55}
          strokeColor="white"
          strokeWidth={3}
          showGradient
          gradientCenterColor="#f8f9fa"
          centerLabelComponent={() => (
            <View style={styles.centerLabel}>
              <Text style={styles.centerMainValue}>{totalPatients}</Text>
              <Text style={styles.centerSubValue}>PACIENTES</Text>
              <Text style={styles.centerDescription}>Monitoreados</Text>
            </View>
          )}
        />
        
        <View style={styles.professionalLegend}>
          {clinicalStatusData.map((item, index) => {
            const percentage = Math.round((item.value / totalPatients) * 100);
            return (
              <View key={index} style={styles.legendRow}>
                <View style={[styles.legendIndicator, { backgroundColor: item.color }]} />
                <View style={styles.legendContent}>
                  <Text style={styles.legendLabel}>{item.label}</Text>
                  <Text style={styles.legendValue}>
                    {item.value} {item.value === 1 ? 'paciente' : 'pacientes'}
                  </Text>
                  <Text style={styles.legendPercentage}>{percentage}%</Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* 🔍 MEJORA 3: Información adicional del contexto */}
        {aggregatedData.totalChildren > aggregatedData.activeChildren && (
          <View style={styles.contextInfo}>
            <Text style={styles.contextText}>
              {aggregatedData.totalChildren - aggregatedData.activeChildren} pacientes sin conexión
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  chartCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 20,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E1E8ED',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  chartHeader: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F7FAFC',
    paddingBottom: 12,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
    letterSpacing: 0.5,
  },
  chartSubtitle: {
    fontSize: 13,
    color: '#718096',
    marginTop: 4,
  },
  chartContainer: {
    alignItems: 'center',
  },
  centerLabel: {
    alignItems: 'center',
  },
  centerMainValue: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A202C',
  },
  centerSubValue: {
    fontSize: 11,
    fontWeight: '600',
    color: '#4A5568',
    letterSpacing: 0.5,
    marginTop: 2,
  },
  centerDescription: {
    fontSize: 10,
    color: '#718096',
    marginTop: 2,
  },
  professionalLegend: {
    marginTop: 24,
    width: '100%',
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#F7FAFC',
    borderRadius: 8,
  },
  legendIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 12,
  },
  legendContent: {
    flex: 1,
  },
  legendLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D3748',
  },
  legendValue: {
    fontSize: 12,
    color: '#4A5568',
    marginTop: 2,
  },
  legendPercentage: {
    fontSize: 11,
    color: '#718096',
    marginTop: 1,
  },
  // 🔍 Nuevos estilos para mejoras
  noDataContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  noDataText: {
    fontSize: 14,
    color: '#4A5568',
    textAlign: 'center',
  },
  noDataSubtext: {
    fontSize: 12,
    color: '#718096',
    textAlign: 'center',
    marginTop: 8,
  },
  contextInfo: {
    marginTop: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#FFF3CD',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FFEAA7',
  },
  contextText: {
    fontSize: 12,
    color: '#856404',
    textAlign: 'center',
  },
});

export default ClinicalStatusChart;