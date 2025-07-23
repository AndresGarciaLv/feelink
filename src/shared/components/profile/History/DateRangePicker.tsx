import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import Colors from "../../constants/colors";

interface DateRangePickerProps {
  fromDate: Date;
  toDate: Date;
  onFromDateChange: (date: Date) => void;
  onToDateChange: (date: Date) => void;
}

export default function DateRangePicker({
  fromDate,
  toDate,
  onFromDateChange,
  onToDateChange,
}: DateRangePickerProps) {
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [pickingDateFor, setPickingDateFor] = useState<"from" | "to" | null>(
    null
  );

  const handleConfirmDate = (date: Date) => {
    if (pickingDateFor === "from") {
      onFromDateChange(date);
    } else if (pickingDateFor === "to") {
      onToDateChange(date);
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

  return (
    <View style={styles.container}>
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

const styles = StyleSheet.create({
  container: {
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
});