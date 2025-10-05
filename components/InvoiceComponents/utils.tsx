// components/InvoiceComponents/utils.ts
export type Mode = "Hosted" | "Cash";

export type InvoiceLine = {
  sku: string;      // Item Description
  starting: number; // Starting Count (full bottles)
  added: number;    // Added (full bottles)
  returned: number; // Returned (full bottles)
};

export type ConfigRow = {
  item: string;
  bottleOz: number;
  pourCash: number;
  pourHosted: number;
};

// Tabla de conversión por SKU (ajústala a tu catálogo)
export const DEFAULT_CONFIG: ConfigRow[] = [
  { item: "Tito's 1.75L",        bottleOz: 59.18, pourCash: 1.25, pourHosted: 1.50 },
  { item: "Tito's 1 L",          bottleOz: 33.81, pourCash: 1.25, pourHosted: 1.50 },
  { item: "Grey Goose 750ml",    bottleOz: 25.36, pourCash: 1.25, pourHosted: 1.50 },
  { item: "Dom Pérignon 750ml",  bottleOz: 25.36, pourCash: 5.00,  pourHosted: 5.00  },
  { item: "Red Wine House 750ml",bottleOz: 25.36, pourCash: 5.00,  pourHosted: 5.00  },
  { item: "Michelob Ultra 12oz", bottleOz: 12.00, pourCash: 12.00, pourHosted: 12.00 },
  { item: "Heineken 12oz",       bottleOz: 12.00, pourCash: 12.00, pourHosted: 12.00 },
  { item: "Patrón Silver 750ml", bottleOz: 25.36, pourCash: 1.25, pourHosted: 1.50 },
];

export function findCfg(item: string, cfg: ConfigRow[] = DEFAULT_CONFIG) {
  return cfg.find(c => c.item.toLowerCase() === item.toLowerCase());
}

/**
 * Total = starting + added (botellas)
 * Consumption = MAX(Total - returned, 0) (botellas)
 * Drinks = ROUND(Consumption * (Bottle_oz / Pour_mode))
 */
export function computeRow(line: InvoiceLine, mode: Mode = "Hosted", cfgTbl: ConfigRow[] = DEFAULT_CONFIG) {
  const total = (line?.starting ?? 0) + (line?.added ?? 0);
  const consumption = Math.max(total - (line?.returned ?? 0), 0);
  const cfg = findCfg(line?.sku ?? "", cfgTbl);

  let drinks = 0;
  if (cfg) {
    const factor = cfg.bottleOz / (mode === "Cash" ? cfg.pourCash : cfg.pourHosted);
    drinks = Math.round(consumption * factor);
  }
  return { total, consumption, drinks };
}

/** Normaliza lo que venga del detalle a un arreglo de InvoiceLine[] seguro */
export function safeLinesFromAny(anyLines: any): InvoiceLine[] {
  if (!anyLines) return [];
  if (Array.isArray(anyLines)) {
    // ya está en forma de líneas o algo parecido
    return anyLines.map((x: any) => ({
      sku: String(x?.sku ?? x?.name ?? x?.title ?? "Unknown Item"),
      starting: Number(x?.starting ?? x?.start ?? x?.startingCount ?? 0),
      added: Number(x?.added ?? x?.add ?? 0),
      returned: Number(x?.returned ?? x?.ret ?? 0),
    }));
  }
  // si te llega un objeto con items dentro
  if (anyLines?.items && Array.isArray(anyLines.items)) {
    return anyLines.items.map((x: any) => ({
      sku: String(x?.sku ?? x?.name ?? "Unknown Item"),
      starting: Number(x?.starting ?? 0),
      added: Number(x?.added ?? 0),
      returned: Number(x?.returned ?? 0),
    }));
  }
  return [];
}

// Helpers CSV (opcional para exportación simple)
const escapeCSV = (v: string | number) => {
  const s = String(v ?? "");
  return s.includes(",") || s.includes('"') || s.includes("\n")
    ? `"${s.replace(/"/g, '""')}"`
    : s;
};
export const toCSV = (rows: (string | number)[][]) =>
  rows.map(r => r.map(escapeCSV).join(",")).join("\n");
