import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";

// Importa tus hooks y tipos de la API de juguetes
import {
  useGetToyReadingsSummaryQuery,
  ToyReadingsSummary,
} from "../../../core/http/requests/toyServerApi";
import Colors from "../constants/colors";

// --- Interfaz para un resumen diario simplificado (Ajustar según tu API real) ---
export interface DailyToySummary {
  date: string; // YYYY-MM-DD
  averageValue?: number;
  totalReadings?: number;
  // Añade cualquier otra métrica diaria que el resumen pudiera contener
}

interface ToyHistoryComponentProps {
  macAddress: string;
  patientId: string; // Puede ser útil si quieres refetch por paciente o si el summary de la API lo usa
}

export default function ToyHistoryComponent({
  macAddress,
  patientId,
}: ToyHistoryComponentProps) {
  // --- Estados para el rango de fechas ---
  // Default: Últimos 30 días
  const [fromDate, setFromDate] = useState<Date>(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d;
  });
  const [toDate, setToDate] = useState<Date>(new Date());
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [pickingDateFor, setPickingDateFor] = useState<"from" | "to" | null>(
    null
  );

  // RTK Query Hook para el resumen de lecturas
  const {
    data: summaryData,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetToyReadingsSummaryQuery(
    {
      macAddress: macAddress,
      From: format(fromDate, "yyyy-MM-dd"),
      To: format(toDate, "yyyy-MM-dd"),
      Dummy: false, // O true si necesitas datos de prueba
    },
    {
      skip: !macAddress, // Solo ejecuta la query si tenemos una macAddress
    }
  );

  const handleConfirmDate = (date: Date) => {
    if (pickingDateFor === "from") {
      setFromDate(date);
    } else if (pickingDateFor === "to") {
      setToDate(date);
    }
    hideDatePicker();
  };

  const showDatePicker = (forDate: "from" | "to") => {
    setPickingDateFor(forDate);
    setDatePickerVisible(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisible(false);
    setPickingDateFor(null);
  };

  // --- DEBUGGING LOGS ---
  useEffect(() => {
    console.log(
      "ToyHistoryComponent - Estado del resumen de lecturas de juguete:"
    );
    console.log("  macAddress:", macAddress);
    console.log("  isLoading:", isLoading);
    console.log("  isError:", isError);
    if (isError) {
      console.log("  Error detalles:", error);
    }
    console.log("  summaryData:", summaryData);
  }, [isLoading, isError, summaryData, error, macAddress]);
  // --- END DEBUGGING LOGS ---

  if (!macAddress) {
    return (
      <View style={styles.container}>
        <Text style={styles.noToyText}>
          No hay un peluche asignado a este paciente.
        </Text>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color={Colors.primary} />
        <Text style={styles.loadingText}>
          Cargando historial del peluche...
        </Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          Error al cargar historial: {JSON.stringify(error)}
        </Text>
        <TouchableOpacity style={styles.retryButton} onPress={refetch}>
          <Text style={styles.retryButtonText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Si `summaryData` es `undefined` o `null` después de cargar sin error.
  if (
    !summaryData ||
    (!summaryData.totalItems && summaryData.totalItems !== 0)
  ) {
    // Verifica si no hay datos significativos
    return (
      <View style={styles.container}>
        <Text style={styles.noDataText}>
          No se encontraron lecturas para el peluche {macAddress} en este
          período.
        </Text>
        <View style={styles.datePickerContainer}>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => showDatePicker("from")}
          >
            <Text style={styles.dateButtonText}>
              Desde: {format(fromDate, "dd MMMM yyyy", { locale: es })}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => showDatePicker("to")}
          >
            <Text style={styles.dateButtonText}>
              Hasta: {format(toDate, "dd MMMM yyyy", { locale: es })}
            </Text>
          </TouchableOpacity>
        </View>
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirmDate}
          onCancel={hideDatePicker}
          date={pickingDateFor === "from" ? fromDate : toDate}
        />
      </View>
    );
  }

  const dailySummaries = summaryData.items ?? [];
  const hasDailyDetails = dailySummaries.length > 0;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Historial del Peluche</Text>

      <View style={styles.datePickerContainer}>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => showDatePicker("from")}
        >
          <Text style={styles.dateButtonText}>
            Desde: {format(fromDate, "dd MMMM yyyy", { locale: es })}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => showDatePicker("to")}
        >
          <Text style={styles.dateButtonText}>
            Hasta: {format(toDate, "dd MMMM yyyy", { locale: es })}
          </Text>
        </TouchableOpacity>
      </View>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirmDate}
        onCancel={hideDatePicker}
        date={pickingDateFor === "from" ? fromDate : toDate}
      />

      <View style={styles.summaryCard}>
        <Text style={styles.cardTitle}>
          Resumen General ({format(fromDate, "dd/MM/yy")} -{" "}
          {format(toDate, "dd/MM/yy")})
        </Text>
        <Text style={styles.summaryText}>
          Total de Lecturas: {summaryData.totalItems}
        </Text>
        <Text style={styles.summaryText}>
          Estables: {summaryData.summary.estable}
        </Text>
        <Text style={styles.summaryText}>
          Ansiosos: {summaryData.summary.ansioso}
        </Text>
        <Text style={styles.summaryText}>
          En crisis: {summaryData.summary.crisis}
        </Text>
      </View>

      {/* --- Sección de Resumen por Día (si está disponible) --- */}

      {hasDailyDetails && (
        <>
          <Text style={styles.sectionTitle}>Resumen Diario</Text>
          <ScrollView horizontal style={styles.dailySummariesScrollView}>
            {dailySummaries.map((day, index) => (
              <View key={index} style={styles.dailySummaryCard}>
                <Text style={styles.dailyDate}>
                  {format(parseISO(day.date), "EEEE, dd MMMM", { locale: es })}
                </Text>
                <Text>Estado: {day.status}</Text>
              </View>
            ))}
          </ScrollView>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // No flex: 1 aquí, el padre controlará su tamaño
    padding: 15,
    backgroundColor: Colors.background, // Usa un color de fondo de tus constantes
    borderRadius: 10,
    marginHorizontal: 20, // Para darle espacio en los lados
    marginTop: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  loadingContainer: {
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: Colors.textPrimary,
  },
  errorContainer: {
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 14,
    // color: Colors.error,
    textAlign: "center",
    marginHorizontal: 10,
    marginBottom: 10,
  },
  retryButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginTop: 5,
  },
  retryButtonText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: "bold",
  },
  noToyText: {
    fontSize: 16,
    color: Colors.textSecundary,
    textAlign: "center",
    paddingVertical: 20,
  },
  noDataText: {
    fontSize: 14,
    color: Colors.textSecundary,
    textAlign: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.textPrimary,
    marginBottom: 15,
    textAlign: "center",
  },
  datePickerContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 15,
  },
  dateButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  dateButtonText: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: "600",
  },
  summaryCard: {
    backgroundColor: Colors.background,
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.textSecundary,
    marginBottom: 10,
  },
  summaryText: {
    fontSize: 15,
    color: Colors.textPrimary,
    marginBottom: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.textPrimary,
    marginBottom: 10,
    marginTop: 5,
    textAlign: "center",
  },
  dailySummariesScrollView: {
    // Estilos si necesitas scroll horizontal para los resúmenes diarios
    marginBottom: 10,
  },
  dailySummaryCard: {
    backgroundColor: Colors.white,
    borderRadius: 8,
    padding: 12,
    marginRight: 10, // Espacio entre tarjetas diarias si es horizontal
    width: 150, // Ancho fijo para las tarjetas diarias
    borderLeftWidth: 4,
    borderLeftColor: Colors.lightBlue,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  dailyDate: {
    fontSize: 14,
    fontWeight: "bold",
    color: Colors.textPrimary,
    marginBottom: 5,
  },
  noDailyDataText: {
    fontSize: 13,
    color: Colors.textSecundary,
    textAlign: "center",
    fontStyle: "italic",
    marginTop: 10,
  },
});
