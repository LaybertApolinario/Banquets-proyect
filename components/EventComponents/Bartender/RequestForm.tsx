import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function RequestProductForm() {
  const [product, setProduct] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);

  const decrease = () => {
    if (amount > 0) setAmount(amount - 1);
  };

  const increase = () => {
    setAmount(amount + 1);
  };

  return (
    <View style={styles.card}>
      <Text style={styles.label}>Request product</Text>

      {/* Input product */}
      <TextInput
        style={styles.input}
        placeholder="SKU product/list"
        placeholderTextColor="#9CA3AF"
        value={product}
        onChangeText={setProduct}
      />

      {/* Input amount con controles */}
      <Text style={[styles.label, { marginTop: 12 }]}>amount</Text>
      <View style={styles.amountContainer}>
        <TouchableOpacity onPress={decrease}>
          <Ionicons name="remove-circle-outline" size={28} color="#3B82F6" />
        </TouchableOpacity>

        <Text style={styles.amountText}>{amount}</Text>

        <TouchableOpacity onPress={increase}>
          <Ionicons name="add-circle-outline" size={28} color="#22C55E" />
        </TouchableOpacity>
      </View>

      {/* Botones */}
      <View style={styles.actions}>
        <TouchableOpacity style={[styles.button, { backgroundColor: "#10B981" }]}>
          <Text style={styles.buttonText}>Submit request</Text>
        </TouchableOpacity>

        <View style={styles.rowButtons}>
          <TouchableOpacity style={[styles.smallButton, { backgroundColor: "#10B981" }]}>
            <Text style={styles.buttonText}>save</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.smallButton, { backgroundColor: "#3B82F6" }]}>
            <Text style={styles.buttonText}>submit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#0F1C2E",
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    overflow: 'hidden'
  },
  label: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#111827",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: "#FFFFFF",
    fontSize: 14,
  },
  amountContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    marginTop: 6,
  },
  amountText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  actions: {
    marginTop: 20,
    alignItems: "center",
  },
  button: {
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 14,
    textAlign: "center",
  },
  rowButtons: {
    flexDirection: "row",
    gap: 12,
  },
  smallButton: {
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 18,
  },
});
