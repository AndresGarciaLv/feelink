import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import * as Progress from "react-native-progress";

interface Props {
  identifier: string;
}

const PressureProgressBar: React.FC<Props> = ({ identifier }) => {
  const [pressurePercent, setPressurePercent] = useState(0);
  const [pressureGrams, setPressureGrams] = useState(0);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!identifier) return;

    const wsUrl = `ws://feelink-api.runasp.net/ws/sensor-data?device=esp32&identifier=${identifier}`;
    ws.current = new WebSocket(wsUrl);

    // ws.current.onopen = () => {
    //   console.log("✅ WebSocket conectado");
    // };

    ws.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const pressureData = data.Sensors?.p;
        if (pressureData) {
          const pc = typeof pressureData.pc === "number" ? pressureData.pc : 0;
          const gr = typeof pressureData.gr === "number" ? pressureData.gr : 0;

          setPressurePercent(Math.min(Math.max(pc / 100, 0), 1));
          setPressureGrams(gr);
        }
      } catch (error) {
        // console.error("❌ Error parseando mensaje WebSocket", error);
      }
    };

    ws.current.onerror = (error) => {
      console.log("🚨 Error en WebSocket:", error);
    };

    ws.current.onclose = () => {
      // console.log("🔌 WebSocket cerrado");
    };

    return () => {
      ws.current?.close();
    };
  }, [identifier]);

  const getBarColor = (value: number) => {
    if (value <= 0.6) return "#4CAF50"; // Verde
    if (value <= 0.87) return "#FFB300"; // Amarillo
    return "#E53935"; // Rojo
  };

  const getStatusText = (value: number) => {
    if (value <= 0.6) return "Estable";
    if (value <= 0.87) return "Ansioso";
    return "Crisis";
  };

  const statusText = getStatusText(pressurePercent);
  const barColor = getBarColor(pressurePercent);

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Presión Detectada</Text>

      <View style={styles.statusContainer}>
        <Text style={[styles.statusBadge, { backgroundColor: barColor }]}>
          {statusText}
        </Text>
      </View>

      <Progress.Bar
        progress={pressurePercent}
        width={null}
        color={barColor}
        unfilledColor="#eee"
        borderRadius={10}
        height={18}
      />
      <Text style={[styles.percentage, { color: barColor }]}>
        {Math.round(pressurePercent * 100)}%
      </Text>

      <View style={styles.forceContainer}>
        <Text style={styles.forceIcon}>💪</Text>
        <Text style={styles.forceText}>Fuerza aplicada:</Text>
        <Text style={styles.forceValue}>{pressureGrams} g</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    padding: 16,
    marginHorizontal: 20,
    borderRadius: 14,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    textAlign: "center",
    color: "#333",
  },
  statusContainer: {
    alignItems: "center",
    marginBottom: 6,
  },
  statusBadge: {
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 20,
    color: "white",
    fontWeight: "600",
    fontSize: 13,
    overflow: "hidden",
  },
  percentage: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },
  forceContainer: {
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F5F8FA",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    gap: 6,
  },
  forceIcon: {
    fontSize: 18,
  },
  forceText: {
    fontSize: 14,
    color: "#666",
  },
  forceValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
  },
});

export default PressureProgressBar;
