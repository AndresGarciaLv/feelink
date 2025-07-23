import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { format } from "date-fns";
import { ToyReadingsSummary } from "../../../../core/http/requests/toyServerApi";
import Colors from "../../constants/colors";

// Colores para cada estado
const STATUS_COLORS = {
  estable: '#4CAF50',
  ansioso: '#FF9800',
  crisis: '#F44336',
};

interface SummaryCardProps {
  summaryData: ToyReadingsSummary;
  fromDate: Date;
  toDate: Date;
}

export default function SummaryCard({
  summaryData,
  fromDate,
  toDate,
}: SummaryCardProps) {
  const total = summaryData.totalItems || 0;
  const estable = summaryData.summary.estable || 0;
  const ansioso = summaryData.summary.ansioso || 0;
  const crisis = summaryData.summary.crisis || 0;

  // Calcular porcentajes
  const getPercentage = (value: number) => {
    return total > 0 ? Math.round((value / total) * 100) : 0;
  };

  const estadisticas = [
    {
      label: 'Estables',
      valor: estable,
      porcentaje: getPercentage(estable),
      color: STATUS_COLORS.estable,
    },
    {
      label: 'Ansiosos',
      valor: ansioso,
      porcentaje: getPercentage(ansioso),
      color: STATUS_COLORS.ansioso,
    },
    {
      label: 'En Crisis',
      valor: crisis,
      porcentaje: getPercentage(crisis),
      color: STATUS_COLORS.crisis,
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Resumen general</Text>
        <Text style={styles.dateRange}>
          {format(fromDate, "dd/MM/yy")} - {format(toDate, "dd/MM/yy")}
        </Text>
      </View>

      <View style={styles.totalContainer}>
        <Text style={styles.totalNumber}>{total}</Text>
        <Text style={styles.totalLabel}>Total de lecturas</Text>
      </View>

      <View style={styles.statsContainer}>
        {estadisticas.map((stat, index) => (
          <View key={index} style={styles.statItem}>
            <View style={styles.statHeader}>
              <View 
                style={[styles.colorIndicator, { backgroundColor: stat.color }]} 
              />
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
            <View style={styles.statValues}>
              <Text style={[styles.statNumber, { color: stat.color }]}>
                {stat.valor}
              </Text>
              <Text style={styles.statPercentage}>
                {stat.porcentaje}%
              </Text>
            </View>
            <View style={styles.progressBarContainer}>
              <View 
                style={[
                  styles.progressBar, 
                  { 
                    width: `${stat.porcentaje}%`, 
                    backgroundColor: stat.color 
                  }
                ]} 
              />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    elevation: 1,
  },
  header: {
    marginBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  dateRange: {
    fontSize: 14,
    color: Colors.textSecundary,
    fontWeight: '500',
  },
  totalContainer: {
    alignItems: 'center',
    marginBottom: 24,
    paddingVertical: 16,
    backgroundColor: Colors.softPurple,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.softPurple,
  },
  totalNumber: {
    fontSize: 36,
    fontWeight: "bold",
    color: Colors.white,
    lineHeight: 40,
  },
  totalLabel: {
    fontSize: 16,
    color: Colors.white,
    fontWeight: '500',
    marginTop: 4,
  },
  statsContainer: {
    gap: 16,
  },
  statItem: {
    paddingVertical: 12,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  colorIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  statLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    flex: 1,
  },
  statValues: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    lineHeight: 28,
  },
  statPercentage: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textSecundary,
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: 'rgba(0,0,0,0.06)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
    minWidth: 2,
  },
});