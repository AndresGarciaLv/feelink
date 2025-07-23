import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Colors from "../../constants/colors";
import DateRangePicker from "./DateRangePicker";

interface NoDataStateProps {
  macAddress: string;
  fromDate: Date;
  toDate: Date;
  onFromDateChange: (date: Date) => void;
  onToDateChange: (date: Date) => void;
}

export default function NoDataState({
  macAddress,
  fromDate,
  toDate,
  onFromDateChange,
  onToDateChange,
}: NoDataStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        No se encontraron lecturas para el peluche {macAddress} en este
        período.
      </Text>
      <DateRangePicker
        fromDate={fromDate}
        toDate={toDate}
        onFromDateChange={onFromDateChange}
        onToDateChange={onToDateChange}
      />
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
  text: {
    fontSize: 14,
    color: Colors.textSecundary,
    textAlign: "center",
    marginTop: 10,
    marginBottom: 10,
  },
});