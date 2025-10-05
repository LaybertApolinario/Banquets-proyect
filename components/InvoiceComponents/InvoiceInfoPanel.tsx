import React, { useMemo } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import InvoiceTable, { InvoiceRow } from "./InvoiceTable";
import { DEFAULT_CONFIG, computeRow } from "./utils";

type Props = {
  /** Filas de la invoice (pueden venir vacías) */
  lines?: InvoiceRow[];
  /** Modo de servicio */
  mode?: "Cash" | "Hosted";
  /**
   * Tab actual. Debes pasarlo desde tu header/tabs:
   *  - "view" | "edit" | "export"
   * Si no lo pasas, queda "view" y no aparecerán inputs.
   */
  activeTab?: "view" | "edit" | "export";
  /**
   * Si ya traes el subtotal calculado desde afuera,
   * puedes pasarlo y evitamos calcularlo aquí.
   * (Este archivo NO dibuja el summary para no romper tu UI,
   * pero lo dejamos disponible por si lo necesitas.)
   */
  externalSubtotal?: number;
};

export default function InvoiceInfoPanel({
  lines,
  mode = "Hosted",
  activeTab = "view",
  externalSubtotal,
}: Props) {
  const editable = activeTab === "edit";

  // Subtotal seguro (por si te sirve en tu Summary)
  const subtotal = useMemo(() => {
    if (typeof externalSubtotal === "number") return externalSubtotal;
    const rows = Array.isArray(lines) ? lines : [];
    return rows.reduce(
      (acc, l) => acc + computeRow(l, mode, DEFAULT_CONFIG).total,
      0
    );
  }, [externalSubtotal, lines, mode]);

  return (
    <View style={styles.container}>
      {/* MUY IMPORTANTE: esto permite que los TextInput reciban foco */}
      <ScrollView
        style={{ flex: 1 }}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {/* Tabla: activamos edición SOLO cuando el tab es "edit" */}
        <InvoiceTable lines={lines} mode={mode} editable={editable} />

        {/* Si quieres renderizar tu resumen aquí, descomenta y usa "subtotal":
        <View style={{ marginTop: 12 }}>
          <InvoiceSummary subtotal={subtotal} servicePct={18} taxPct={7.5} />
        </View>
        */}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
