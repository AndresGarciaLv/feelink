import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import * as Progress from "react-native-progress";

interface Props {
  identifier: string; // MAC address del peluche
}

const PressureProgressBar: React.FC<Props> = ({ identifier }) => {
  const [pressurePercent, setPressurePercent] = useState(0);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!identifier) return;

    const wsUrl = `ws://feelink-api.runasp.net/ws/sensor-data?device=esp32&identifier=${identifier}`;
    ws.current = new WebSocket(wsUrl);

    ws.current.onopen = () => {
      console.log("✅ WebSocket conectado");
    };

    ws.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const pressureSensor = data.Sensors?.find(
          (sensor: any) => sensor.Metric === "pressurePercent"
        );
        if (pressureSensor) {
          const value = pressureSensor.Value;
          setPressurePercent(Math.min(Math.max(value / 100, 0), 1)); // Clamp entre 0 y 1
        }
      } catch (error) {
        console.error("❌ Error parseando mensaje WebSocket", error);
      }
    };

    ws.current.onerror = (error) => {
      console.error("🚨 Error en WebSocket:", error);
    };

    ws.current.onclose = () => {
      console.log("🔌 WebSocket cerrado");
    };

    return () => {
      ws.current?.close();
    };
  }, [identifier]);

  const getBarColor = (value: number) => {
    if (value <= 0.60) return "#4CAF50"; // Verde
    if (value <= 0.87) return "#FFB300"; // Amarillo
    return "#E53935"; // Rojo
  };

  const getStatusText = (value: number) => {
    if (value <= 0.60) return "Estable";
    if (value <= 0.87) return "Ansioso";
    return "Crisis";
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Presión detectada</Text>
      <Progress.Bar
        progress={pressurePercent}
        width={null}
        color={getBarColor(pressurePercent)}
        unfilledColor="#e0e0e0"
        borderRadius={10}
        height={20}
      />
      <Text style={[styles.percentage, { color: getBarColor(pressurePercent) }]}>
        {Math.round(pressurePercent * 100)}%
      </Text>
      <Text style={[styles.statusText, { color: getBarColor(pressurePercent) }]}>
        {getStatusText(pressurePercent)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginVertical: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  percentage: {
    marginTop: 6,
    fontSize: 14,
    textAlign: "right",
  },
  statusText: {
    marginTop: 4,
    fontSize: 15,
    fontWeight: "500",
    textAlign: "center",
  },
});

export default PressureProgressBar;
