// screens/InvoiceListScreen.tsx
import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  StatusBar,
  TextInput,
  TouchableOpacity,
  Alert,
  Platform,
  Share,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { invoices } from "@/data/mockEvents";
import { calculateInvoiceTotal } from "@/utils/calculations";
import InvoiceCard from "@/components/InvoiceComponents/InvoiceCard";

/* =========================
   Tipos (seguros / opcionales)
   ========================= */

type InvoiceLine = {
  sku: string;
  deliveredFull?: number;       // C
  deliveredPartialOz?: number;  // D
  returnedFull?: number;        // F
  returnedPartialOz?: number;   // G
};

type InvoiceData = {
  id: string;
  title?: string;
  date?: string;
  venue?: string;
  pack?: string;                // tipo de paquete
  tier?: string;                // compatibilidad
  mode?: "Cash" | "Hosted";     // selector global para $E$4
  total?: number;
  lines?: InvoiceLine[];
  [key: string]: any;
};

/* =========================
   Config por defecto (drinks)
   ========================= */

type ConfigRow = {
  Item: string;
  Bottle_oz: number;
  Pour_oz_Cash: number;
  Pour_oz_Hosted: number;
};

const DEFAULT_CONFIG: ConfigRow[] = [
  { Item: "Tito's 1.75L",        Bottle_oz: 59.18, Pour_oz_Cash: 1.25, Pour_oz_Hosted: 1.50 },
  { Item: "Tito's 1 L",          Bottle_oz: 33.81, Pour_oz_Cash: 1.25, Pour_oz_Hosted: 1.50 },
  { Item: "Grey Goose 750ml",    Bottle_oz: 25.36, Pour_oz_Cash: 1.25, Pour_oz_Hosted: 1.50 },
  { Item: "Dom Pérignon 750ml",  Bottle_oz: 25.36, Pour_oz_Cash: 5.00,  Pour_oz_Hosted: 5.00  },
  { Item: "Red Wine House 750ml",Bottle_oz: 25.36, Pour_oz_Cash: 5.00,  Pour_oz_Hosted: 5.00  },
  { Item: "Michelob Ultra 12oz", Bottle_oz: 12.00, Pour_oz_Cash: 12.00, Pour_oz_Hosted: 12.00 },
  { Item: "Heineken 12oz",       Bottle_oz: 12.00, Pour_oz_Cash: 12.00, Pour_oz_Hosted: 12.00 },
  { Item: "Patrón Silver 750ml", Bottle_oz: 25.36, Pour_oz_Cash: 1.25, Pour_oz_Hosted: 1.50 },
];

/* =========================
   Utilidades
   ========================= */

function linesFromInvoice(item: InvoiceData): InvoiceLine[] {
  if (Array.isArray(item.lines) && item.lines.length) return item.lines;
  // fallback si aún no tienes líneas
  return [
    {
      sku: item.title || "Tito's 1.75L",
      deliveredFull: 6,
      deliveredPartialOz: 0,
      returnedFull: 2,
      returnedPartialOz: 0,
    },
  ];
}

/** Escapa comillas y separadores para CSV */
function escapeCSV(v: string | number) {
  const s = String(v ?? "");
  if (s.includes(",") || s.includes('"') || s.includes("\n")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

/** Convierte array de arrays a CSV string */
function toCSV(rows: (string | number)[][]): string {
  return rows.map(r => r.map(escapeCSV).join(",")).join("\n");
}

/**
 * Exporta a CSV con fórmulas Excel y tabla Config en la misma hoja (columna M).
 * Mantiene:
 * - $E$4 como selector global (Cash/Hosted)
 * - XLOOKUP hacia Config (rango M:P)
 * - Cálculo por botellas equivalentes
 */
async function exportInvoiceToCSV(inv: InvoiceData) {
  try {
    const packType = (inv.pack || inv.tier || "Premium") as string;
    const settlementMode = (inv.mode || "Hosted") as "Cash" | "Hosted";
    const lines = linesFromInvoice(inv);

    const rows: (string | number)[][] = [];

    // Header (E4 y E5)
    rows.push(["Invoice / Banquets"]);
    rows.push(["BEO / Title", inv.title ?? inv.id ?? ""]);
    rows.push(["Pack Type", packType]);
    rows.push(["", "", "", "", "Mode (Cash/Hosted)"]); // fila 4 (E4)
    rows.push(["", "", "", "", settlementMode]);        // fila 5 (E5)
    rows.push([]); // fila 6 vacía

    // Encabezado de tabla principal (fila 7)
    rows.push([
      "Item",          // A
      "Bottle_oz",     // B (XLOOKUP a Config)
      "DelivFull",     // C
      "DelivPartialOz",// D
      "DeliveredEqBot",// E = C + D/B
      "RetFull",       // F
      "RetPartialOz",  // G
      "ReturnedEqBot", // H = F + G/B
      "ConsumedBot",   // I = MAX(E-H,0)
      "Drinks",        // J = ROUND(I * pourFactor, 0)
    ]);

    // Filas de datos (comienzan en fila 8)
    for (let i = 0; i < lines.length; i++) {
      const r = 8 + i; // fila real
      const A = `A${r}`;
      const B = `B${r}`;
      const C = `C${r}`;
      const D = `D${r}`;
      const E = `E${r}`;
      const F = `F${r}`;
      const G = `G${r}`;
      const H = `H${r}`;
      const I = `I${r}`;
      const J = `J${r}`;

      // B = XLOOKUP al Config (M:P)
      const bottleOz = `=XLOOKUP(${A},$M:$M,$N:$N,0)`;
      // pourFactor = Bottle_oz / Pour según $E$4
      const pourFactor = `=XLOOKUP(${A},$M:$M,IF($E$4="Cash",$N:$N/$O:$O,$N:$N/$P:$P),0)`;

      const row: (string | number)[] = [
        lines[i].sku,                      // A
        bottleOz,                          // B (FÓRMULA)
        lines[i].deliveredFull ?? 0,       // C
        lines[i].deliveredPartialOz ?? 0,  // D
        `=${C}+${D}/${B}`,                 // E (FÓRMULA)
        lines[i].returnedFull ?? 0,        // F
        lines[i].returnedPartialOz ?? 0,   // G
        `=${F}+${G}/${B}`,                 // H (FÓRMULA)
        `=MAX(${E}-${H},0)`,               // I (FÓRMULA)
        `=ROUND(${I}*${pourFactor},0)`,    // J (FÓRMULA)
      ];
      rows.push(row);
    }

    // Separador visual
    rows.push([]);
    rows.push([]);

    // Tabla Config a partir de columna M (M..P)
    // Para desplazar a la columna M, anteponemos 12 celdas vacías (A..L)
    const pad = new Array(12).fill("");
    rows.push([...pad, "Item", "Bottle_oz", "Pour_oz_Cash", "Pour_oz_Hosted"]);
    for (const cfg of DEFAULT_CONFIG) {
      rows.push([...pad, cfg.Item, cfg.Bottle_oz, cfg.Pour_oz_Cash, cfg.Pour_oz_Hosted]);
    }

    // Crear CSV
    const csv = toCSV(rows);

    if (Platform.OS === "web") {
      // Descarga directa en web (sin base64)
      const url = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
      // @ts-ignore
      window.open(url, "_blank");
      return;
    }

    // iOS / Android: compartir texto CSV
    await Share.share({
      title: `invoice_${inv.id || inv.title || Date.now()}.csv`,
      message: csv,
    });
  } catch (e: any) {
    console.error(e);
    Alert.alert("Export error", e?.message ?? "Unknown error");
  }
}

/* =========================
   Pantalla de listado
   ========================= */

export default function InvoiceListScreen() {
  const [search, setSearch] = useState("");

  const invoicesWithUpdatedTotals: InvoiceData[] = (invoices as any[]).map(
    (invoice) =>
      ({
        ...invoice,
        total: calculateInvoiceTotal((invoice as any).id),
      } as InvoiceData)
  );

  const filteredInvoices = useMemo(() => {
    if (!search.trim()) return invoicesWithUpdatedTotals;
    const lower = search.toLowerCase();
    return invoicesWithUpdatedTotals.filter((inv) => {
      const t = (inv.title ?? "").toLowerCase();
      const v = (inv.venue ?? "").toLowerCase();
      const d = (inv.date ?? "").toLowerCase();
      return t.includes(lower) || v.includes(lower) || d.includes(lower);
    });
  }, [search, invoicesWithUpdatedTotals]);

  return (
    <SafeAreaView style={styles.container} edges={["left", "right", "bottom"]}>
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

      {/* Lista */}
      <FlatList
        data={filteredInvoices}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const packType = (item.pack || item.tier || "Premium") as string;
          const mode = (item.mode || "Hosted") as "Cash" | "Hosted";

          return (
            <View style={{ marginBottom: 12 }}>
              <InvoiceCard item={item as any} />

              {/* Chips y Export */}
              <View style={styles.row}>
                <View
                  style={[
                    styles.chip,
                    {
                      backgroundColor: "rgba(14,165,233,0.15)",
                      borderColor: "#0EA5E9",
                    },
                  ]}
                >
                  <Text style={styles.chipTxt}>Pack: {packType}</Text>
                </View>
                <View
                  style={[
                    styles.chip,
                    {
                      backgroundColor: "rgba(34,197,94,0.12)",
                      borderColor: "#22C55E",
                    },
                  ]}
                >
                  <Text style={styles.chipTxt}>Mode: {mode}</Text>
                </View>
                <TouchableOpacity
                  style={styles.exportBtn}
                  onPress={() => exportInvoiceToCSV(item)}
                >
                  <Text style={styles.exportTxt}>Export CSV</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      <Text style={styles.footer}>
        Totals calculated automatically. Each invoice belongs to a single BEO.
      </Text>
    </SafeAreaView>
  );
}

/* =========================
   Estilos
   ========================= */

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
    marginTop: 4,
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
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  row: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
  },
  chipTxt: {
    color: "#E7EEF7",
    fontSize: 12,
    fontWeight: "700",
  },
  exportBtn: {
    marginLeft: "auto",
    backgroundColor: "#22C55E",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  exportTxt: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 12,
  },
  footer: {
    color: "#A0AEC0",
    fontSize: 12,
    textAlign: "center",
    marginTop: 2,
  },
});
