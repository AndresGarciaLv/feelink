import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { AggregatedData } from "../../../../core/types/common/AggregatedData";

interface ClinicalEvaluationProps {
  aggregatedData: AggregatedData;
}

const ClinicalEvaluation: React.FC<ClinicalEvaluationProps> = ({
  aggregatedData,
}) => {
  
  // Asegurar que crisisChildren sea un número válido
  const crisisChildrenCount = Number(aggregatedData?.crisisChildren) || 0;
  const averageBatteryHealth = Number(aggregatedData?.averageBatteryHealth) || 100;
  
  
  const hasCrisis = crisisChildrenCount > 0;

  return (
    <View style={styles.recommendationsPanel}>
      <Text style={styles.recommendationsTitle}>EVALUACIÓN CLÍNICA</Text>
      
      {/* Debug visual - mostrar valores */}
      <Text style={styles.debugText}>
        Debug: Crisis={crisisChildrenCount}, Batería={averageBatteryHealth}%
      </Text>
      
      <View style={styles.recommendationItem}>
        <View
          style={[
            styles.alertLevel,
            {
              backgroundColor: hasCrisis ? "#FFE6E6" : "#E8F5E8",
              borderLeftColor: hasCrisis ? "#D0021B" : "#2E7D57",
            },
          ]}
        >
          <Text
            style={[
              styles.alertText,
              {
                color: hasCrisis ? "#D0021B" : "#2E7D57",
              },
            ]}
          >
            {hasCrisis
              ? `ATENCIÓN: ${crisisChildrenCount} paciente(s) en estado crítico requieren intervención inmediata.`
              : "Sistema estable. Continuar con protocolos de monitoreo estándar."}
          </Text>
        </View>
      </View>

      {averageBatteryHealth < 30 && (
        <View style={styles.recommendationItem}>
          <View
            style={[
              styles.alertLevel,
              { backgroundColor: "#FFF5E6", borderLeftColor: "#F5A623" },
            ]}
          >
            <Text style={[styles.alertText, { color: "#F5A623" }]}>
              MANTENIMIENTO: Batería promedio baja ({averageBatteryHealth}%). 
              Programar reemplazo de dispositivos.
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  recommendationsPanel: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginTop: 20,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E1E8ED",
  },
  recommendationsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2D3748",
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  debugText: {
    fontSize: 12,
    color: "#666",
    marginBottom: 10,
    fontStyle: "italic",
  },
  recommendationItem: {
    marginBottom: 12,
  },
  alertLevel: {
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
  },
  alertText: {
    fontSize: 13,
    fontWeight: "500",
    lineHeight: 18,
  },
});

export default ClinicalEvaluation;