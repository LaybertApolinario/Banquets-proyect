import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  ScrollView,
} from "react-native";
import {
  computeRow,
  DEFAULT_CONFIG,
  Mode,
  safeLinesFromAny,
} from "./utils";

/** =========================
 *  Tipos
 *  ========================= */
export type Category = "Liquor" | "Wine" | "Beer" | "Other";

export type InvoiceRow = {
  sku: string;
  starting: number;
  added: number;
  returned: number;
  category?: Category; // opcional: si no viene, se infiere por sku
};

type Props = {
  lines?: InvoiceRow[] | any;
  mode?: Mode; // default "Hosted"
  editable?: boolean; // si true, muestra inputs
  onChange?: (index: number, field: keyof InvoiceRow, value: number) => void;
};

/** =========================
 *  Config UI
 *  ========================= */
// true => SOLO "Returned" es editable (como pediste);
// false => también Starting y Added editables.
const EDIT_ONLY_RETURNED = true;

const COL_ITEM = 220;
const COL_NUM = 92;
const TABLE_WIDTH = COL_ITEM + COL_NUM * 6; // 7 columnas

const ORDERED_CATS: Category[] = ["Liquor", "Wine", "Beer", "Other"];

/** =========================
 *  Helpers
 *  ========================= */
const guessCategory = (sku: string): Category => {
  const s = sku.toLowerCase();
  if (/(vodka|gin|rum|tequila|whiskey|whisky|scotch|bourbon|patrón|patron|tito|johnnie|hennessy)/.test(s))
    return "Liquor";
  if (/(wine|merlot|cabernet|chardonnay|brut|rosé|rose|dom|perignon|champagne|mimosa|pinot)/.test(s))
    return "Wine";
  if (/(beer|lager|ipa|stella|michelob|heineken|modelo|corona|light|ale)/.test(s))
    return "Beer";
  return "Other";
};

type Section = {
  category: Category;
  rows: InvoiceRow[];
  subtotal: { total: number; returned: number; consumption: number; drinks: number };
};

/** demo por si no llega nada del padre */
const demoLines: InvoiceRow[] = [
  { sku: "Tito's 1.75L", starting: 4, added: 2, returned: 1, category: "Liquor" },
  { sku: "Dom Pérignon 750ml", starting: 0, added: 2, returned: 0, category: "Wine" },
  { sku: "Michelob Ultra 12oz", starting: 120, added: 24, returned: 30, category: "Beer" },
  { sku: "Patrón Silver 750ml", starting: 3, added: 1, returned: 0, category: "Liquor" },
];

/** =========================
 *  Componente
 *  ========================= */
export default function InvoiceTable({
  lines,
  mode = "Hosted",
  editable = false,
  onChange,
}: Props) {
  // normaliza y rellena demo
  const normalized = useMemo(() => {
    const norm = safeLinesFromAny(lines) as InvoiceRow[] | [];
    const base = (Array.isArray(norm) && norm.length ? norm : demoLines).map((r) => ({
      ...r,
      category: r.category ?? guessCategory(r.sku),
    }));
    // agrupa y aplanamos respetando el orden
    const byCat: Record<Category, InvoiceRow[]> = { Liquor: [], Wine: [], Beer: [], Other: [] };
    base.forEach((r) => byCat[(r.category ?? "Other") as Category].push(r));
    return ORDERED_CATS.flatMap((c) => byCat[c]);
  }, [lines]);

  // estado interno para edición local (evita reseteos)
  const [rows, setRows] = useState<InvoiceRow[]>(normalized);

  // solo sincroniza desde props cuando NO estás editando
  useEffect(() => {
    if (!editable) setRows(normalized);
  }, [normalized, editable]);

  // construir secciones + subtotales
  const sections: Section[] = useMemo(() => {
    const result: Section[] = [];
    ORDERED_CATS.forEach((cat) => {
      const catRows = rows.filter((r) => (r.category ?? "Other") === cat);
      if (!catRows.length) return;
      const subtotal = catRows.reduce(
        (acc, l) => {
          const r = computeRow(l, mode, DEFAULT_CONFIG);
          acc.total += r.total;
          acc.returned += l.returned ?? 0;
          acc.consumption += r.consumption;
          acc.drinks += r.drinks;
          return acc;
        },
        { total: 0, returned: 0, consumption: 0, drinks: 0 }
      );
      result.push({ category: cat, rows: catRows, subtotal });
    });
    return result;
  }, [rows, mode]);

  // total general
  const grand = useMemo(() => {
    return sections.reduce(
      (acc, s) => {
        acc.total += s.subtotal.total;
        acc.returned += s.subtotal.returned;
        acc.consumption += s.subtotal.consumption;
        acc.drinks += s.subtotal.drinks;
        return acc;
      },
      { total: 0, returned: 0, consumption: 0, drinks: 0 }
    );
  }, [sections]);

  const applyChange = (
    absoluteIndex: number, // índice global en "rows"
    field: keyof InvoiceRow,
    value: number
  ) => {
    setRows((prev) => {
      const next = [...prev];
      if (!next[absoluteIndex]) return prev;
      next[absoluteIndex] = { ...next[absoluteIndex], [field]: value };
      return next;
    });
    onChange?.(absoluteIndex, field, value);
  };

  // Render de una fila de item
  const renderItemRow = (item: InvoiceRow, absoluteIndex: number) => {
    const r = computeRow(item, mode, DEFAULT_CONFIG);
    const inputCommon = {
      keyboardType: "numeric" as const,
      selectTextOnFocus: true,
      blurOnSubmit: true,
      returnKeyType: "done" as const,
    };

    const renderNum = (text: string) => (
      <Text style={[styles.td, { width: COL_NUM }]}>{text}</Text>
    );

    const renderEditable = (
      value: number,
      field: keyof InvoiceRow,
      square?: boolean
    ) => (
      <TextInput
        {...inputCommon}
        style={[square ? styles.boxInput : styles.input, { width: COL_NUM }]}
        value={String(value)}
        onChangeText={(t) => applyChange(absoluteIndex, field, Math.max(0, Number(t) || 0))}
      />
    );

    return (
      <View style={styles.tr} key={`${item.sku}-${absoluteIndex}`} pointerEvents="auto">
        <Text style={[styles.td, { width: COL_ITEM }]} numberOfLines={2}>
          {item.sku}
        </Text>

        {/* Starting */}
        {editable && !EDIT_ONLY_RETURNED
          ? renderEditable(item.starting, "starting")
          : renderNum(String(item.starting))}

        {/* Added */}
        {editable && !EDIT_ONLY_RETURNED
          ? renderEditable(item.added, "added")
          : renderNum(String(item.added))}

        {/* Total (solo lectura) */}
        {renderNum(String(r.total))}

        {/* Returned (cuadritos) */}
        {editable
          ? renderEditable(item.returned, "returned", true)
          : renderNum(String(item.returned))}

        {/* Consumption (solo lectura) */}
        {renderNum(String(r.consumption))}

        {/* # of Drinks (solo lectura) */}
        <Text style={[styles.td, { width: COL_NUM, fontWeight: "800" }]}>{r.drinks}</Text>
      </View>
    );
  };

  return (
    <ScrollView
      horizontal
      keyboardShouldPersistTaps="handled"
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 0 }}
    >
      <View style={{ width: TABLE_WIDTH }}>
        {/* Header global */}
        <View style={[styles.tr, styles.thRow]}>
          <Text style={[styles.th, { width: COL_ITEM }]}>Item Description</Text>
          <Text style={[styles.th, { width: COL_NUM }]}>Starting</Text>
          <Text style={[styles.th, { width: COL_NUM }]}>Added</Text>
          <Text style={[styles.th, { width: COL_NUM }]}>Total</Text>
          <Text style={[styles.th, { width: COL_NUM }]}>Returned</Text>
          <Text style={[styles.th, { width: COL_NUM }]}>Consumption</Text>
          <Text style={[styles.th, { width: COL_NUM }]}># of Drinks</Text>
        </View>

        {/* Secciones por categoría */}
        <FlatList
          data={sections}
          keyExtractor={(s) => s.category}
          renderItem={({ item: section }) => {
            // necesitamos el índice absoluto para onChange
            const pairs = rows
              .map<[InvoiceRow, number]>((r, i) => [r, i])
              .filter(([r]) => (r.category ?? "Other") === section.category);

            return (
              <View>
                {/* Encabezado de sección */}
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>{section.category}</Text>
                </View>

                {/* Filas de la sección */}
                {pairs.map(([row, absoluteIndex]) => renderItemRow(row, absoluteIndex))}

                {/* Subtotal de la sección */}
                <View style={[styles.tr, styles.subtotalRow]}>
                  <Text style={[styles.tf, { width: COL_ITEM }]}>
                    {section.category} — Subtotal
                  </Text>
                  <Text style={[styles.tf, { width: COL_NUM }]}>—</Text>
                  <Text style={[styles.tf, { width: COL_NUM }]}>—</Text>
                  <Text style={[styles.tf, { width: COL_NUM }]}>{section.subtotal.total}</Text>
                  <Text style={[styles.tf, { width: COL_NUM }]}>{section.subtotal.returned}</Text>
                  <Text style={[styles.tf, { width: COL_NUM }]}>{section.subtotal.consumption}</Text>
                  <Text style={[styles.tf, { width: COL_NUM, fontWeight: "900" }]}>
                    {section.subtotal.drinks}
                  </Text>
                </View>
              </View>
            );
          }}
          scrollEnabled={false}
          keyboardShouldPersistTaps="handled"
          nestedScrollEnabled
          removeClippedSubviews={false}  // <- evita recortes que comen el foco en iOS
          ListFooterComponent={
            <View style={[styles.tr, styles.grandRow]}>
              <Text style={[styles.tf, { width: COL_ITEM }]}>Totals</Text>
              <Text style={[styles.tf, { width: COL_NUM }]}>—</Text>
              <Text style={[styles.tf, { width: COL_NUM }]}>—</Text>
              <Text style={[styles.tf, { width: COL_NUM }]}>{grand.total}</Text>
              <Text style={[styles.tf, { width: COL_NUM }]}>{grand.returned}</Text>
              <Text style={[styles.tf, { width: COL_NUM }]}>{grand.consumption}</Text>
              <Text style={[styles.tf, { width: COL_NUM, fontWeight: "900" }]}>
                {grand.drinks}
              </Text>
            </View>
          }
        />
      </View>
    </ScrollView>
  );
}

/** =========================
 *  Estilos
 *  ========================= */
const styles = StyleSheet.create({
  tr: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.06)",
    paddingHorizontal: 10,
  },
  thRow: {
    backgroundColor: "#0F2746",
    borderRadius: 10,
    marginBottom: 6,
    paddingVertical: 10,
  },
  th: {
    color: "#9FB2C8",
    fontSize: 12,
    fontWeight: "800",
    textAlign: "center",
  },
  td: {
    color: "#E7EEF7",
    fontSize: 14,
    textAlign: "center",
  },
  tf: {
    color: "#E7EEF7",
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
  },
  input: {
    color: "#E7EEF7",
    fontSize: 14,
    textAlign: "center",
    backgroundColor: "#132A4A",
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  // "Cuadritos" para Returned en Edit
  boxInput: {
    color: "#E7EEF7",
    fontSize: 14,
    textAlign: "center",
    backgroundColor: "#10253F",
    paddingVertical: 6,
    height: 36,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: "#0EA5E9",
    shadowColor: "#0EA5E9",
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  sectionHeader: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 10,
    marginTop: 8,
    marginBottom: 2,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  sectionTitle: {
    color: "#E7EEF7",
    fontWeight: "800",
    fontSize: 14,
  },
  subtotalRow: {
    backgroundColor: "rgba(255,255,255,0.03)",
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.08)",
  },
  grandRow: {
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.12)",
    marginTop: 8,
  },
});
