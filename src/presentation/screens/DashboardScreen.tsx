import React, { useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import NavBar from "../layout/Navbar";
import TabBar from "../layout/TabBar";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../core/types/common/navigation";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppSelector } from "../../core/stores/store";
import { selectUserData } from "../../core/stores/auth/authSlice";
import MyPatientsSection from "../../shared/components/dashboard/myPatients";
import DashboardCharts from "../../shared/components/charts/DashboardCharts";
import QuickActionsSection from "../../shared/components/dashboard/QuickActionsSection";
import DailyActivitySection from "../../shared/components/dashboard/DailyActivitySection";

const DashboardScreen: React.FC = () => {
  const userData = useAppSelector(selectUserData);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();
  const today = new Date().toISOString().split("T")[0]; // formato YYYY-MM-DD

  //Obtener el mes
  const currentMonth = new Date().getMonth() + 1; // +1 porque getMonth() devuelve 0-11

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <NavBar
          doctorName={`Dr. ${userData?.name}`}
          profileImage={undefined}
          onBackPress={() => navigation.goBack()}
        />

        {/* My Patients Section */}
        <MyPatientsSection />

        {/* Acciones rápidas */}
        <QuickActionsSection />

        {/* Kids Registration Section */}
        <DailyActivitySection />

        <View style={{ flex: 1 }}>
          <DashboardCharts />
        </View>

        {/* Spacer for bottom navigation */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Tab Bar Component */}
      <View style={{ paddingBottom: insets.bottom }}>
        <TabBar activeTab="Home" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  welcomeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#F8AEB9",
  },
  welcomeText: {
    marginLeft: 12,
  },
  welcomeMessage: {
    fontSize: 16,
    color: "#8D99AE",
  },
  doctorName: {
    fontSize: 14,
    color: "#8D99AE",
  },

  sectionContainer: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2D3748",
    marginBottom: 2,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#8D99AE",
    marginBottom: 12,
  },
  patientsCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5, // Android
  },

  patientsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
  },
  patientItem: {
    alignItems: "center",
  },
  patientAvatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#E8F0FE",
    justifyContent: "center",
    alignItems: "center",
  },
  patientName: {
    marginTop: 8,
    fontSize: 14,
    color: "#2D3748",
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 16,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#D1D9E6",
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: "#4A90E2",
  },
  viewMoreButton: {
    backgroundColor: "#A8C7E5",
    borderRadius: 20,
    paddingVertical: 8,
    alignItems: "center",
  },
  viewMoreText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  registeredLabel: {
    fontSize: 14,
    color: "white",
    fontWeight: "600",
    marginBottom: 8,
  },
  unregisteredLabel: {
    fontSize: 14,
    color: "white",
    fontWeight: "600",
    marginBottom: 8,
  },
  registeredNumber: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
    marginBottom: 4,
  },
  unregisteredNumber: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
    marginBottom: 4,
  },
  registeredText: {
    fontSize: 14,
    color: "white",
  },
  unregisteredText: {
    fontSize: 14,
    color: "white",
  },
  stressContainer: {
    marginTop: 8,
  },
  monthStressCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  monthLabelContainer: {
    backgroundColor: "#E8F0FE",
    padding: 12,
    borderRadius: 8,
    marginRight: 12,
    minWidth: 70,
    alignItems: "center",
  },
  monthLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2D3748",
  },
  stressContent: {
    flex: 1,
  },
  stressDays: {
    fontSize: 14,
    color: "#8D99AE",
    marginBottom: 8,
  },
  progressContainer: {
    height: 8,
    backgroundColor: "#EDF2F7",
    borderRadius: 4,
    marginVertical: 8,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#4A90E2",
    borderRadius: 4,
  },
  stressPercentage: {
    fontSize: 12,
    color: "#8D99AE",
  },
  bottomSpacer: {
    height: 20,
  },
});

export default DashboardScreen;
