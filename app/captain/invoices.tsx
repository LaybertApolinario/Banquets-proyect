import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  StatusBar,
  TextInput,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"; 
import { invoices } from "@/data/mockEvents";
import { calculateInvoiceTotal } from "@/utils/calculations";
import InvoiceCard from "@/components/InvoiceComponents/InvoiceCard";

export default function InvoiceListScreen() {
  const [search, setSearch] = useState("");

  const invoicesWithUpdatedTotals = invoices.map((invoice) => ({
    ...invoice,
    total: calculateInvoiceTotal(invoice.id),
  }));

  const filteredInvoices = useMemo(() => {
    if (!search.trim()) return invoicesWithUpdatedTotals;
    const lower = search.toLowerCase();
    return invoicesWithUpdatedTotals.filter(
      (inv) =>
        inv.title.toLowerCase().includes(lower)
    );
  }, [search, invoicesWithUpdatedTotals]);

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right","bottom"]}>
      <StatusBar barStyle="light-content" backgroundColor="#0B1D36" />
      
      {/* Header */}
      <Text style={styles.header}>Invoices</Text>
      <Text style={styles.subHeader}>
        Hosted Bar • One invoice per event (BEO)
      </Text>
      
      {/* Search */}
      <TextInput
        placeholder="Search by BEO, venue, date..."
        placeholderTextColor="#888"
        style={styles.searchBox}
        value={search}
        onChangeText={setSearch}
      />
      
      {/* Lista con totales calculados */}
      <FlatList
        data={filteredInvoices}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <InvoiceCard item={item} />}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
      
      <Text style={styles.footer}>
        Totals calculated automatically. Each invoice belongs to a single BEO.
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B1D36",
    paddingHorizontal: 16,
  },
  header: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
  },
  subHeader: {
    color: "#A0AEC0",
    marginBottom: 10,
  },
  searchBox: {
    backgroundColor: "#132A4A",
    color: "#fff",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  footer: {
    color: "#A0AEC0",
    fontSize: 12,
    textAlign: "center",
    marginTop: 2,
  },
});