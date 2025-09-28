import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Products } from "@/types/events";
import { Ionicons } from "@expo/vector-icons";

type ProductCardProps = {
  product: Products;
};

export default function Item({ product }: ProductCardProps) {
  const [count, setCount] = useState<number>(0);

  const decrease = () => {
    if (count > 0) setCount(count - 1);
  };

  const increase = () => {
    if (count < product.assign) setCount(count + 1);
  };

  return (
    <View style={styles.card}>
      {/* Header con nombre y badge */}
      <View style={styles.header}>
        <View>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.sku}>SKU: {product.name.slice(0, 3).toUpperCase()}-{product.assign}</Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>assig {product.assign}</Text>
        </View>
      </View>

      {/* Controles de cantidad */}
      <View style={styles.controls}>
        <TouchableOpacity onPress={decrease} style={styles.iconButton}>
          <Ionicons name="remove-circle-outline" size={24} color="#3B82F6" />
        </TouchableOpacity>

        <Text style={styles.counter}>{count}</Text>

        <TouchableOpacity onPress={increase} style={styles.iconButton}>
          <Ionicons name="add-circle-outline" size={24} color="#22C55E" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#0F1C2E",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    marginHorizontal: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  sku: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 2,
  },
  badge: {
    backgroundColor: "#111827",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  controls: {
    display: 'flex',
    flexDirection: "row",
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 20,
  },
  iconButton: {
    padding: 5,
  },
  counter: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
});