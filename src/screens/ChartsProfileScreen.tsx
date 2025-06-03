// /screens/ChartsProfileScreen.tsx
import React from 'react';
import { ScrollView, Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { PacienteGraficas } from '../types/PatientChart';
import SummaryChart from '../shared/components/charts/SummaryChart';
import TrendChart from '../shared/components/charts/TrendChart';
import { fakeData } from '../utils/fakeChartData';
import Colors from '../shared/components/bluetooth/constants/colors';
import { Ionicons } from '@expo/vector-icons';

// Tipos para los parámetros de ruta
type RootStackParamList = {
  ChartsProfile: {
    data: PacienteGraficas;
    chartType: 'stress' | 'emotions';
  };
  ProfileScreen: undefined;
};

type ChartsProfileScreenRouteProp = RouteProp<RootStackParamList, 'ChartsProfile'>;
type NavigationProp = StackNavigationProp<RootStackParamList>;

interface Props {
  route: ChartsProfileScreenRouteProp;
}

const ChartsProfileScreen: React.FC<Props> = ({ route }) => {
  const navigation = useNavigation<NavigationProp>();
  
  // Validación defensiva con fallback
  const data: PacienteGraficas = route?.params?.data || fakeData;
  const chartType = route?.params?.chartType || 'emotions';

  // Si no hay datos válidos, mostrar mensaje de error
  if (!data || !data.pacienteId) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          Error: No se pudieron cargar los datos del paciente
        </Text>
        <Text style={styles.errorSubtext}>
          Verifica que la navegación se haga correctamente con los parámetros necesarios
        </Text>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Volver al perfil</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Función para obtener el título según el tipo de gráfica
  const getChartTitle = (): string => {
    switch (chartType) {
      case 'stress':
        return 'Gráfica de Estrés';
      case 'emotions':
        return 'Gráfica de Emociones';
      default:
        return 'Gráfica del Paciente';
    }
  };

  // Función para obtener el subtítulo descriptivo
  const getChartDescription = (): string => {
    switch (chartType) {
      case 'stress':
        return 'Análisis de los niveles de estrés del paciente a lo largo del tiempo';
      case 'emotions':
        return 'Seguimiento del estado emocional y cambios anímicos del paciente';
      default:
        return 'Análisis de datos del paciente';
    }
  };

  // Función para obtener el color del tema según el tipo
  const getThemeColor = (): string => {
    switch (chartType) {
      case 'stress':
        return '#FF6B6B'; // Rojo para estrés
      case 'emotions':
        return '#4ECDC4'; // Verde azulado para emociones
      default:
        return Colors.primary;
    }
  };

  // Función para formatear las fechas
  const formatDateRange = (inicio: string, fin: string): string => {
    const startDate = new Date(inicio);
    const endDate = new Date(fin);
    
    const formatOptions: Intl.DateTimeFormatOptions = { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    };
    
    const startFormatted = startDate.toLocaleDateString('es-ES', formatOptions);
    const endFormatted = endDate.toLocaleDateString('es-ES', formatOptions);
    
    return `${startFormatted} - ${endFormatted}`;
  };

  // Función para calcular estadísticas adicionales
  const getAdditionalStats = () => {
    const total = data.resumen.estable + data.resumen.ansioso + data.resumen.crisis;
    const establePercentage = Math.round((data.resumen.estable / total) * 100);
    const ansiosoPercentage = Math.round((data.resumen.ansioso / total) * 100);
    const crisisPercentage = Math.round((data.resumen.crisis / total) * 100);

    return {
      total,
      establePercentage,
      ansiosoPercentage,
      crisisPercentage
    };
  };

  const stats = getAdditionalStats();
  const themeColor = getThemeColor();

  return (
    <ScrollView style={styles.container}>
      {/* Header con botón de regreso */}
      <View style={[styles.header, { backgroundColor: Colors.secondary }]}>
        <TouchableOpacity 
          style={styles.backIconButton}
          onPress={() => navigation.goBack()}
        >
        <Ionicons name="arrow-back" size={28} color="white" />

        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>{getChartTitle()}</Text>
          <Text style={styles.headerSubtitle}>{data.nombre}</Text>
        </View>
      </View>

      {/* Información del paciente y período */}
      <View style={styles.infoSection}>
        <Text style={styles.patientName}>{data.nombre}</Text>
        <Text style={styles.chartDescription}>{getChartDescription()}</Text>
        <View style={styles.periodContainer}>
          <Text style={styles.periodLabel}>Período analizado:</Text>
          <Text style={styles.periodText}>
            {data.periodo.charAt(0).toUpperCase() + data.periodo.slice(1)} | {formatDateRange(data.rango.inicio, data.rango.fin)}
          </Text>
        </View>
      </View>

      {/* Estadísticas rápidas */}
      <View style={styles.quickStatsContainer}>
        <Text style={styles.quickStatsTitle}>Resumen General</Text>
        <View style={styles.quickStats}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.total}</Text>
            <Text style={styles.statLabel}>Total días</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNumber, { color: '#89C58B' }]}>
              {stats.establePercentage}%
            </Text>
            <Text style={styles.statLabel}>Estable</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNumber, { color: '#D8DB56' }]}>
              {stats.ansiosoPercentage}%
            </Text>
            <Text style={styles.statLabel}>Ansioso</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNumber, { color: '#D27373' }]}>
              {stats.crisisPercentage}%
            </Text>
            <Text style={styles.statLabel}>Crisis</Text>
          </View>
        </View>
      </View>

      {/* Gráficas */}
      <View style={styles.chartsContainer}>
        <SummaryChart 
          resumen={data.resumen} 
          chartType={chartType}
          themeColor={themeColor}
        />
        <TrendChart 
          detallado={data.detallado} 
          chartType={chartType}
          themeColor={themeColor}
        />
      </View>

      {/* Información adicional basada en el tipo de gráfica */}
      <View style={styles.additionalInfo}>
        <Text style={styles.additionalInfoTitle}>
          {chartType === 'stress' ? 'Sobre el Estrés' : 'Sobre las Emociones'}
        </Text>
        <Text style={styles.additionalInfoText}>
          {chartType === 'stress' 
            ? 'El estrés se mide en base a indicadores fisiológicos y comportamentales. Los picos pueden indicar momentos que requieren atención especial.'
            : 'Las emociones se categorizan en tres estados principales: estable (estado óptimo), ansioso (requiere observación) y crisis (necesita intervención inmediata).'
          }
        </Text>
      </View>
    </ScrollView>
  );
};
export default ChartsProfileScreen;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backIconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  backIcon: {
    fontSize: 20,
    color: '#FFF',
    fontWeight: 'bold',
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  infoSection: {
    backgroundColor: '#FFF',
    margin: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  patientName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  chartDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 16,
  },
  periodContainer: {
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    paddingTop: 16,
  },
  periodLabel: {
    fontSize: 12,
    color: '#999',
    textTransform: 'uppercase',
    fontWeight: '500',
    marginBottom: 4,
  },
  periodText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  quickStatsContainer: {
    backgroundColor: '#FFF',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  quickStatsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  quickStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  chartsContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  additionalInfo: {
    backgroundColor: '#FFF',
    marginHorizontal: 16,
    marginBottom: 32,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  additionalInfoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  additionalInfoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#F8F9FA',
  },
  errorText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F44336',
    textAlign: 'center',
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: Colors.primary || '#9BC4E0',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#FFF',
    fontWeight: '500',
    fontSize: 14,
  },
});