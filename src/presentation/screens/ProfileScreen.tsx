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
import { useSensorSocket } from '../../shared/hooks/useSensorSocket';

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
  const socketData = useSensorSocket();
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
    <ScrollView style={styles.container}>
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

    {/* AQUI SE INTEGRARA LO NUEVO IMPLEMENTADO POR RICHI */}


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
      <RealTimeCharts socketData={socketData} />
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
  statLabel: {
    fontSize: 12,
    color: Colors.textSecundary,
    opacity: 0.8,
    marginTop: 2,
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
  disabledButton: {
  backgroundColor: "#eee",
  borderColor: "#ccc",
},

disabledText: {
  color: "#aaa",
},

});
