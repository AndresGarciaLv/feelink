import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import Colors from "../../constants/colors";

// Colores por estado
const STATUS_COLORS = {
  estable: '#4CAF50',
  ansioso: '#FF9800',
  crisis: '#F44336',
};

// Mapeo de estados para normalización
const normalizeStatus = (status: string): keyof typeof STATUS_COLORS => {
  const lowerStatus = status.toLowerCase();
  if (lowerStatus.includes('estable') || lowerStatus.includes('stable')) return 'estable';
  if (lowerStatus.includes('ansioso') || lowerStatus.includes('anxious')) return 'ansioso';
  if (lowerStatus.includes('crisis')) return 'crisis';
  return 'estable'; // default
};

interface DailySummaryItem {
  date: string;
  status: string;
}

interface DailySummarySectionProps {
  dailySummaries: DailySummaryItem[];
}

export default function DailySummarySection({
  dailySummaries,
}: DailySummarySectionProps) {
  const getStatusColor = (status: string) => {
    return STATUS_COLORS[normalizeStatus(status)];
  };

  const getStatusLabel = (status: string) => {
    const normalized = normalizeStatus(status);
    switch (normalized) {
      case 'estable': return 'Estable';
      case 'ansioso': return 'Ansioso';
      case 'crisis': return 'En Crisis';
      default: return status;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Historial por día</Text>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        nestedScrollEnabled={true}
      >
        {dailySummaries.map((day, index) => {
          const statusColor = getStatusColor(day.status);
          const statusLabel = getStatusLabel(day.status);
          
          return (
            <View key={index} style={styles.dailySummaryCard}>
              <View style={styles.cardHeader}>
                <View style={styles.dateContainer}>
                  <Text style={styles.dayName}>
                    {format(parseISO(day.date), "EEEE", { locale: es })}
                  </Text>
                  <Text style={styles.dateNumber}>
                    {format(parseISO(day.date), "dd", { locale: es })}
                  </Text>
                  <Text style={styles.monthYear}>
                    {format(parseISO(day.date), "MMM yyyy", { locale: es })}
                  </Text>
                </View>
                <View style={styles.statusContainer}>
                  <View 
                    style={[
                      styles.statusIndicator, 
                      { backgroundColor: statusColor }
                    ]} 
                  />
                  <Text style={[styles.statusText, { color: statusColor }]}>
                    {statusLabel}
                  </Text>
                </View>
              </View>
              <View style={[styles.statusBar, { backgroundColor: statusColor }]} />
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.textPrimary,
    marginBottom: 15,
    textAlign: "left",
    paddingLeft: 5,
  },
  scrollView: {
    maxHeight: 300, // Reducir un poco la altura
    flex: 0, // Evita que tome todo el espacio disponible
  },
  scrollContent: {
    paddingBottom: 10,
  },
  dailySummaryCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  dateContainer: {
    flex: 1,
  },
  dayName: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.textPrimary,
    textTransform: 'capitalize',
    marginBottom: 2,
  },
  dateNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.textPrimary,
    lineHeight: 28,
  },
  monthYear: {
    fontSize: 12,
    color: Colors.textSecundary,
    textTransform: 'capitalize',
    marginTop: 2,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'rgba(0,0,0,0.02)',
    borderRadius: 8,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
    fontWeight: "600",
  },
  statusBar: {
    height: 4,
    width: '100%',
  },
});