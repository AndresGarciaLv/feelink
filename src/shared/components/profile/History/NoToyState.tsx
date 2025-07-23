import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Colors from "../../constants/colors";

export default function NoToyState() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        No hay un peluche asignado a este paciente.
      </Text>
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
    fontSize: 16,
    color: Colors.textSecundary,
    textAlign: "center",
    paddingVertical: 20,
  },
});