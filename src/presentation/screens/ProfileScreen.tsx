// src/presentation/screens/ProfileScreen.tsx
import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import Colors from "../../shared/components/constants/colors";
import HeaderProfile from "../../shared/components/profile/HeaderProfile";
import {
  PacienteGraficas,
  EstadoEmocional,
} from "../../core/types/common/PatientChart";
import { Modal } from "react-native";

import {
  useGetPatientByIdQuery,
  useGetToyByPatientIdQuery,
  useGetPatientActivitySummaryQuery,
} from "../../core/http/requests/patientServerApi";
import { useGetToyReadingsSummaryQuery } from "../../core/http/requests/toyServerApi";
import RealTimeCharts from '../../shared/components/charts/RealTimeCharts';

type Toy = {
  id: string;
  name: string;
  macAddress: string;
  // otros campos si aplica
};



type RootStackParamList = {
  Profile: { patientId: string };
  ChartsProfile: {
    data: PacienteGraficas;
    chartType: "stress" | "emotions";
  };
  DetallesPeluche: { toy: Toy };

};

type ProfileScreenRouteProp = RouteProp<RootStackParamList, "Profile">;
type NavigationProp = StackNavigationProp<RootStackParamList>;

export default function ProfileScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<ProfileScreenRouteProp>();
const [isModalVisible, setIsModalVisible] = useState(false);
  const { patientId } = route.params;

  const [selectedMonthIndex, setSelectedMonthIndex] = useState(
    new Date().getMonth()
  );
  const currentYear = new Date().getFullYear();

  const {
    data: patientData,
    isLoading: isPatientLoading,
    error: patientError,
  } = useGetPatientByIdQuery(patientId);

  const {
    data: toyData,
    isLoading: isToyLoading,
    error: toyError,
  } = useGetToyByPatientIdQuery(patientId);

  const toyMacAddress = toyData?.macAddress;
  const patientTag = toyData?.name || "Sin Peluche";

  const {
    data: patientActivitySummary,
    isLoading: isActivitySummaryLoading,
    error: activitySummaryError,
  } = useGetPatientActivitySummaryQuery(
    { month: selectedMonthIndex + 1, dummy: false },
    { skip: !patientId }
  );

  const { fromDate, toDate } = useMemo(() => {
    const monthStart = new Date(currentYear, selectedMonthIndex, 1);
    const monthEnd = new Date(currentYear, selectedMonthIndex + 1, 0);

    return {
      fromDate: monthStart.toISOString().split("T")[0],
      toDate: monthEnd.toISOString().split("T")[0],
    };
  }, [selectedMonthIndex, currentYear]);

  const safeMacAddress = toyMacAddress ?? "";

  const {
    data: toyReadingsSummary,
    isLoading: isToyReadingsLoading,
    error: toyReadingsError,
  } = useGetToyReadingsSummaryQuery(
    { macAddress: safeMacAddress, from: fromDate, to: toDate, dummy: false },
    { skip: !toyMacAddress }
  );

  const patientInfo = useMemo(() => {
    if (!patientData) {
      return {
        id: "",
        name: "",
        age: "",
        fullAge: "",
        height: 0,
        weight: 0,
        bmi: 0,
        tag: patientTag,
      };
    }

    const calculatedAge = `${patientData.age || 0} Años`;
    const calculatedBMI =
      patientData.height && patientData.weight
        ? (
            patientData.weight /
            ((patientData.height / 100) * (patientData.height / 100))
          ).toFixed(1)
        : 0;

    return {
      id: patientData.id,
      name: `${patientData.name || ""} ${patientData.lastName || ""}`,
      age: calculatedAge,
      fullAge: "3 Años 10 Meses 2 Días",
      height: patientData.height,
      weight: patientData.weight,
      bmi: parseFloat(calculatedBMI.toString()),
      tag: patientTag,
    };
  }, [patientData, patientTag]);

  const getMonthName = (monthIndex: number): string => {
    const months = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ];
    return months[monthIndex];
  };

  const currentMonthDataForUI = useMemo(() => {
    const selectedMonthName = getMonthName(selectedMonthIndex);
    const defaultSummary = {
      title: "Estado emocional del niño",
      date: `${selectedMonthName} ${currentYear}`,
      age: patientInfo.fullAge,
      emotions: ["Feliz", "Neutro", "Triste"],
    };
    const defaultDailyData = [];

    if (patientActivitySummary) {
      const summaryData = patientActivitySummary;
      defaultSummary.title = "Resumen Mensual de Actividad";
      defaultSummary.date = summaryData.date;
      const emotionsToShow: string[] = [];
      if (summaryData.happyDays > 0) emotionsToShow.push("Feliz");
      if (summaryData.neutralDays > 0) emotionsToShow.push("Neutro");
      if (summaryData.sadDays > 0) emotionsToShow.push("Triste");
      defaultSummary.emotions =
        emotionsToShow.length > 0 ? emotionsToShow : ["Neutro"];

      // --- CAMBIO CLAVE AQUÍ: VERIFICAR dailyReadings ANTES DE MAPEAR ---
      const dailyDataMapped =
        toyReadingsSummary && Array.isArray(toyReadingsSummary.dailyReadings)
          ? toyReadingsSummary.dailyReadings.map((daily) => ({
              day: new Date(daily.date).getDate(),
              date: new Date(daily.date).toLocaleDateString("es-ES", {
                day: "numeric",
                month: "long",
                year: "numeric",
              }),
              subtitle: "Horas diarias cambio de estado",
              name: patientInfo.name,
              hours: "Datos de la API",
              emotions: daily.emotions,
            }))
          : []; // Proporciona un array vacío si dailyReadings no es un array o no existe

      return {
        summary: defaultSummary,
        dailyData: dailyDataMapped,
      };
    }

    return {
      summary: defaultSummary,
      dailyData: defaultDailyData,
    };
  }, [
    patientActivitySummary,
    toyReadingsSummary,
    selectedMonthIndex,
    currentYear,
    patientInfo.fullAge,
    patientInfo.name,
  ]);

  const convertToChartData = (
    chartType: "stress" | "emotions"
  ): PacienteGraficas => {
    const currentMonthData = currentMonthDataForUI;

    const mapEmotionToState = (emotion: string): EstadoEmocional => {
      switch (emotion) {
        case "Feliz":
          return "estable";
        case "Neutro":
        case "Ansioso": // Añade este caso si tu API devuelve "Ansioso"
          return "ansioso";
        case "Triste":
        case "Crisis": // Añade este caso si tu API devuelve "Crisis"
          return "crisis";
        default:
          return "estable";
      }
    };

    const detailedData = currentMonthData.dailyData.map((dayData) => ({
      fecha: convertDateToISO(new Date(dayData.date).toISOString()),
      estado: mapEmotionToState(getRandomEmotion(dayData.emotions)),
    }));

    const summary = detailedData.reduce(
      (acc, curr) => {
        acc[curr.estado]++;
        return acc;
      },
      { estable: 0, ansioso: 0, crisis: 0 }
    );

    return {
      pacienteId: patientInfo.id,
      nombre: patientInfo.name,
      periodo: "mensual" as const,
      rango: {
        inicio: fromDate,
        fin: toDate,
      },
      resumen: summary,
      detallado: detailedData,
    };
  };

  const convertDateToISO = (isoDateString: string): string => {
    return isoDateString.split("T")[0];
  };

  const getMonthStartDate = (monthIndex: number): string => {
    const date = new Date(currentYear, monthIndex, 1);
    return date.toISOString().split("T")[0];
  };

  const getMonthEndDate = (monthIndex: number): string => {
    const date = new Date(currentYear, monthIndex + 1, 0);
    return date.toISOString().split("T")[0];
  };

  const getRandomEmotion = (emotions: string[]): string => {
    if (!emotions || emotions.length === 0) return "Neutro";
    return emotions[Math.floor(Math.random() * emotions.length)];
  };

  const handleStressChart = () => {
    const chartData = convertToChartData("stress");
    navigation.navigate("ChartsProfile", {
      data: chartData,
      chartType: "stress",
    });
  };

  const getEmotionStyle = (emotion: string) => {
    switch (emotion) {
      case "Feliz":
        return styles.greenTag;
      case "Neutro":
        return styles.yellowTag;
      case "Triste":
        return styles.redTag;
      default:
        return styles.greenTag;
    }
  };

  const handleMonthSelect = (monthIndex: number) => {
    setSelectedMonthIndex(monthIndex);
  };

  const renderEmotionTags = (emotions: string[]) => {
    if (!emotions || emotions.length === 0) return null;
    return emotions.map((emotion, index) => (
      <Text key={index} style={[styles.tag, getEmotionStyle(emotion)]}>
        {emotion}
      </Text>
    ));
  };

  const isLoading =
    isPatientLoading ||
    isToyLoading ||
    isActivitySummaryLoading ||
    isToyReadingsLoading;

  const getErrorStatus = (error: any, label: string) => {
    if (!error || typeof error !== "object") return null;
    if ("status" in error) {
      if (error.status === 404) return `${label}: recurso no encontrado (404)`;
      return `${label}: error ${error.status}`;
    }
    return `${label}: error desconocido`;
  };

  const errorMessage =
    getErrorStatus(patientError, "Paciente") ||
    getErrorStatus(toyError, "Juguete") ||
    getErrorStatus(activitySummaryError, "Resumen actividad") ||
    getErrorStatus(toyReadingsError, "Lecturas juguete") ||
    "Error desconocido";

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>
          Cargando perfil y actividad del paciente...
        </Text>
      </View>
    );
  }

const isToyNotFound = toyError && "status" in toyError && toyError.status === 404;

const hasCriticalError =
  patientError ||
  activitySummaryError ||
  toyReadingsError ||
  (toyError && !isToyNotFound); // ⚠️ Ignora 404

if (hasCriticalError) {
  return (
    <View style={styles.errorContainer}>
      <Text style={styles.errorText}>
        Error al cargar el perfil o la actividad:
      </Text>
      <Text style={styles.errorText}>{errorMessage}</Text>
    </View>
  );
}


  if (!patientData) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Paciente no encontrado.</Text>
      </View>
    );
  }
  return (
    <ScrollView>
      <View style={styles.container}>
        <HeaderProfile />

        <View style={styles.avatarContainer}>
          <Image
            source={require("../../shared/assets/img/perfil.png")}
            style={styles.avatar}
          />
          <TouchableOpacity
  style={[styles.tagButton, !toyData && styles.disabledButton]}
  onPress={() => {
    if (toyData) {
      navigation.navigate("DetallesPeluche", { toy: toyData });
    }
  }}
  disabled={!toyData}
>
  <Text style={[styles.tagText, !toyData && styles.disabledText]}>
    {toyData ? toyData.name : "Sin peluche asignado"}
  </Text>
</TouchableOpacity>


        </View>

        


        {/* Información personal */}
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{patientInfo.name}</Text>
          <Text style={styles.subText}>{patientInfo.age}</Text>
          <Text style={styles.subTextGray}>{"321000218739812 • Niño"}</Text>
        </View>

        {/* Datos físicos con divisores */}
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statValueWithUnit}>
              {patientInfo.height}
              <Text style={styles.statUnit}>cm</Text>
            </Text>
            <Text style={styles.statLabel}>Altura</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.statBox}>
            <Text style={styles.statValueWithUnit}>
              {patientInfo.weight}
              <Text style={styles.statUnit}>kg</Text>
            </Text>
            <Text style={styles.statLabel}>Peso</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.statBox}>
            <Text style={styles.statValue}>{patientInfo.bmi}</Text>
            <Text style={styles.statUnit}>IMC</Text>
          </View>
        </View>

        {/* BOTONES CON NAVEGACIÓN */}
        <View style={styles.buttonGroup}>
     <TouchableOpacity
  style={styles.stressButton}
  onPress={() => setIsModalVisible(true)}
>
  <Text style={styles.stressText}>Ver gráficas</Text>
</TouchableOpacity>
        </View>

        {/* NAVEGACIÓN MENSUAL */}
        <View style={styles.monthTabs}>
          {/* Generar los últimos 4 meses dinámicamente */}
          {Array.from({ length: 4 }).map((_, i) => {
            const month = (new Date().getMonth() - i + 12) % 12; // Obtiene el índice del mes (0-11)
            const monthName = getMonthName(month);
            return (
              <TouchableOpacity
                key={month}
                style={[
                  styles.monthButton,
                  selectedMonthIndex === month && styles.monthButtonActive,
                ]}
                onPress={() => handleMonthSelect(month)}
              >
                <Text
                  style={[
                    styles.monthText,
                    selectedMonthIndex === month && styles.monthTextActive,
                  ]}
                >
                  {monthName}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* LÍNEA DE TIEMPO - Cards con información del mes seleccionado */}
        <View style={styles.timeline}>
          {/* RESUMEN MENSUAL - Card principal del mes */}
          <View style={styles.timelineCardPrimary}>
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.cardTitle}>
                  {currentMonthDataForUI.summary.title}
                </Text>
                <Text style={styles.cardDate}>
                  {currentMonthDataForUI.summary.date}
                </Text>
                <Text style={styles.cardSubtitle}>{patientInfo.fullAge}</Text>
              </View>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>Normal</Text>
                {/* Ajustar si la API te da un "estado" general del mes */}
              </View>
            </View>

            <View style={styles.monthStats}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>
                  {patientActivitySummary?.happyDays || 0}
                </Text>
                <Text style={styles.statLabel}>Días Feliz</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>
                  {patientActivitySummary?.neutralDays || 0}
                </Text>
                <Text style={styles.statLabel}>Días Neutro</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>
                  {patientActivitySummary?.sadDays || 0}
                </Text>
                <Text style={styles.statLabel}>Días Triste</Text>
              </View>
            </View>

            <View style={styles.cardTags}>
              {renderEmotionTags(currentMonthDataForUI.summary.emotions)}
            </View>
          </View>

          {/* EVENTOS DIARIOS - Cards con información día por día */}
          {currentMonthDataForUI.dailyData.length > 0 ? (
            currentMonthDataForUI.dailyData.map((dayData, index) => (
              <View key={index} style={styles.timelineCardSecundary}>
                <View style={styles.timelineConnector} />

                <View style={styles.cardHeader}>
                  <View>
                    <Text style={styles.cardDateSecondary}>{dayData.date}</Text>
                    <Text style={styles.cardSubtitle}>{dayData.subtitle}</Text>
                    <Text style={styles.cardSubtitle}>{dayData.name}</Text>
                  </View>
                  <View style={styles.statusBadgeSecondary}>
                    <Text style={styles.statusTextSecondary}>Normal</Text>
                    {/* Ajustar según la API */}
                  </View>
                </View>

                <View style={styles.dayStats}>
                  {/* Aquí podrías mapear métricas específicas de tu dailyData si la API las proporciona */}
                  <View style={styles.statItemSmall}>
                    <Text style={styles.statNumberSmall}>-</Text>
                    <Text style={styles.statLabelSmall}>Horas</Text>
                  </View>
                  <View style={styles.statItemSmall}>
                    <Text style={styles.statNumberSmall}>-</Text>
                    <Text style={styles.statLabelSmall}>Horas</Text>
                  </View>
                  <View style={styles.statItemSmall}>
                    <Text style={styles.statNumberSmall}>-</Text>
                    <Text style={styles.statLabelSmall}>Horas</Text>
                  </View>
                </View>

                <View style={styles.cardTags}>
                  {renderEmotionTags(dayData.emotions)}
                </View>
              </View>
            ))
          ) : (
            <View style={styles.noDataContainer}>
              <Text style={styles.noDataText}>
                No hay datos de actividad para este mes.
              </Text>
            </View>
          )}
        </View>
      </View>
<Modal
  visible={isModalVisible}
  animationType="slide"
  presentationStyle="pageSheet"
  onRequestClose={() => setIsModalVisible(false)}
>
  <View style={styles.modalContainer}>
    <View style={styles.modalHeader}>
      <Text style={styles.modalTitle}>Gráficas en Tiempo Real</Text>
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => setIsModalVisible(false)}
      >
        <Text style={styles.closeButtonText}>✕</Text>
      </TouchableOpacity>
    </View>
    <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
      <RealTimeCharts />
    </ScrollView>
  </View>
</Modal>
    </ScrollView>
  );
}

// ESTILOS (mantén todos tus estilos actuales y añade los nuevos para carga/error y noData)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    fontFamily: "sans-serif",
  },
  modalContainer: {
  flex: 1,
  backgroundColor: Colors.white,
},
modalHeader: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  padding: 20,
  paddingTop: 60,
  borderBottomWidth: 1,
  borderBottomColor: "#eee",
},
modalTitle: {
  fontSize: 18,
  fontWeight: "600",
  color: Colors.textPrimary,
},
closeButton: {
  width: 30,
  height: 30,
  borderRadius: 15,
  backgroundColor: "#f0f0f0",
  justifyContent: "center",
  alignItems: "center",
},
closeButtonText: {
  fontSize: 16,
  color: Colors.textPrimary,
  fontWeight: "600",
},modalContent: {
  flex: 1,
  paddingHorizontal: 20,
  paddingBottom: 20,
},
  avatarContainer: {
    alignItems: "center",
    marginTop: -45,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  tagButton: {
    borderColor: "#9BC4E0",
    borderWidth: 1,
    borderRadius: 50,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  subTextGray: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    textAlign: "center",
  },
  tagText: {
    color: "#9BC4E0",
    fontSize: 12,
  },
  infoContainer: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
    color: "#333",
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 6,
  },
  subText: {
    fontSize: 14,
    color: "#333",
    marginBottom: 6,
  },
  statValueWithUnit: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  verticalDivider: {
    width: 1,
    backgroundColor: "#CCC",
    marginHorizontal: 8,
    height: "100%",
    alignSelf: "center",
  },
  subTextSpacer: {
    fontSize: 14,
    color: "#333",
    marginTop: 6,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginHorizontal: 24,
    marginTop: 24,
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    alignItems: "center",
  },
  statBox: {
    alignItems: "center",
    flex: 1,
    backgroundColor: "#FFFF",
  },
  divider: {
    width: 1,
    height: "100%",
    backgroundColor: "#DDD",
    marginHorizontal: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  statUnit: {
    fontSize: 14,
    color: "#666",
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  buttonGroup: {
    marginTop: 24,
    marginHorizontal: 24,
    gap: 12,
  },
  stressButton: {
    backgroundColor: "#9BC4E0",
    padding: 12,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  stressText: {
    color: "#FFF",
    fontWeight: "500",
    fontSize: 16,
  },
  emotionsButton: {
    borderColor: "#9BC4E0",
    borderWidth: 1,
    padding: 12,
    borderRadius: 16,
    alignItems: "center",
  },
  emotionsText: {
    color: "#9BC4E0",
    fontWeight: "500",
    fontSize: 16,
  },
  monthTabs: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginVertical: 16,
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  monthButton: {
    backgroundColor: "transparent",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    flex: 1,
    alignItems: "center",
  },
  monthButtonActive: {
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  monthText: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: "500",
  },
  monthTextActive: {
    color: Colors.white,
    fontWeight: "600",
  },
  timeline: {
    marginHorizontal: 20,
    marginBottom: 80,
    position: "relative",
  },
  timelineCardPrimary: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  timelineCardSecundary: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    marginLeft: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
    position: "relative",
  },
  timelineConnector: {
    position: "absolute",
    left: -18,
    top: 20,
    width: 12,
    height: 12,
    backgroundColor: Colors.primary,
    borderRadius: 6,
    borderWidth: 3,
    borderColor: Colors.white,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  cardTitle: {
    fontWeight: "400",
    fontSize: 14,
    color: Colors.textSecundary,
    marginBottom: 4,
    opacity: 0.9,
  },
  cardDate: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  cardDateSecondary: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 13,
    color: Colors.textSecundary,
    opacity: 0.8,
    lineHeight: 18,
  },
  statusBadge: {
    backgroundColor: Colors.secondary,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  statusText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: "600",
  },
  statusBadgeSecondary: {
    backgroundColor: Colors.secondary,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  statusTextSecondary: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: "600",
  },
  monthStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    borderRadius: 12,
    padding: 12,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "500",
    color: Colors.textPrimary,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecundary,
    opacity: 0.8,
    marginTop: 2,
  },
  dayStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    backgroundColor: Colors.white,
    borderRadius: 8,
    padding: 10,
  },
  statItemSmall: {
    alignItems: "center",
    flex: 1,
  },
  statNumberSmall: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.textPrimary,
  },
  statLabelSmall: {
    fontSize: 10,
    color: Colors.textSecundary,
    marginTop: 2,
  },
  cardTags: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 16,
    marginHorizontal: 35,
    marginTop: 4,
  },
  tag: {
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 6,
    fontSize: 13,
    color: Colors.white,
    fontWeight: "600",
    textAlign: "center",
    minWidth: 60,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  greenTag: {
    backgroundColor: "#89C58B",
  },
  yellowTag: {
    backgroundColor: "#D8DB56",
  },
  redTag: {
    backgroundColor: "#D27373",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.white,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: Colors.textPrimary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.white,
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
  },
  noDataContainer: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.white,
    borderRadius: 12,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  noDataText: {
    fontSize: 16,
    color: Colors.textPrimary,
    fontStyle: "italic",
  },
  disabledButton: {
  backgroundColor: "#eee",
  borderColor: "#ccc",
},

disabledText: {
  color: "#aaa",
},

});
