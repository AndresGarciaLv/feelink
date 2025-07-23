import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { format } from "date-fns";
import { es } from "date-fns/locale";

import {
  useGetToyReadingsSummaryQuery,
  ToyReadingsSummary,
} from "../../../core/http/requests/toyServerApi";
import Colors from "../constants/colors";

// import DateRangePicker from "/DateRangePicker";
import DateRangePicker from "./History/DateRangePicker";
import LoadingState from "./History/LoadingState";
import ErrorState from "./History/ErrorState";
import NoToyState from "./History/NoToyState";
import NoDataState from "./History/NoDataState";
import SummaryCard from "./History/SummaryCard";
import DailySummarySection from "./History/DailySummarySection";

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

  // Manejo de estados condicionales
  if (!macAddress) {
    return <NoToyState />;
  }

  if (isLoading) {
    return <LoadingState />;
  }

  if (isError) {
    return <ErrorState error={error} onRetry={refetch} />;
  }

  // Si `summaryData` es `undefined` o `null` después de cargar sin error.
  if (
    !summaryData ||
    (!summaryData.totalItems && summaryData.totalItems !== 0)
  ) {
    return (
      <NoDataState
        macAddress={macAddress}
        fromDate={fromDate}
        toDate={toDate}
        onFromDateChange={setFromDate}
        onToDateChange={setToDate}
      />
    );
  }

  const dailySummaries = summaryData.items ?? [];
  const hasDailyDetails = dailySummaries.length > 0;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Historial del peluche</Text>

      <DateRangePicker
        fromDate={fromDate}
        toDate={toDate}
        onFromDateChange={setFromDate}
        onToDateChange={setToDate}
      />

      <SummaryCard
        summaryData={summaryData}
        fromDate={fromDate}
        toDate={toDate}
      />

      {hasDailyDetails && (
        <DailySummarySection dailySummaries={dailySummaries} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: Colors.white,
    borderRadius: 10,
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.textPrimary,
    marginBottom: 15,
    textAlign: "center",
  },
});