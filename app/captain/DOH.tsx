// DOH.tsx
import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Switch,
  TextInput,
  Alert,
  Modal,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from "react-native";

/* ===================== PALETA GLOBAL ===================== */
const PALETTE = {
  bg: "#0D1A26",
  card: "#0F2233",
  text: "#E8F1F8",
  sub: "#9EB6C7",
  line: "rgba(255,255,255,0.08)",
  pill: "#0B5AA2",
  mint: "#1EDC96",
  warning: "#FFB020",
  danger: "#FF5A5F",
  button: "#1185E0",
  buttonAlt: "#0A6AC0",
  ok: "#16C784",
  darkBtn: "#1C2A35",
  highlight: "#F5A524",
  success: "#109D68",
};

/* ===================== CONFIG MOCK ===================== */
const ADMIN_PIN = "1234";

/* ===================== TIPOS ===================== */
type ViewMode = "home" | "coh" | "cogs" | "monthly";
type EventRow = { id: string; name: string; venue: string; shift: "AM" | "PM" };
type Category = "Liquor" | "Wine" | "Beer";
type Item = {
  id: string;
  name: string;
  sku?: string;
  category: Category;
  onHand: number;
  par: number;
  unitCost: number;
};
type Derived = Item & { variance: number; toOrder: number; lineCost: number };

type CogsRow = {
  id: string;
  name: string;
  category: Category;
  taken: number;
  added: number;
  returned: number;
  unitCost: number;
};

type MonthlyDay = {
  id: string;
  dowLabel: string;
  revenue: number;
  coh: number;
  toOrder: number;
  cogs: number;
  perc: { L: number; B: number; W: number };
};

/* ===================== DATA MOCK ===================== */
const TODAY_EVENTS: EventRow[] = [
  { id: "ev1", name: "Ballroom A — Wedding", venue: "Ballroom A", shift: "PM" },
  { id: "ev2", name: "Beach Pavilion — Corporate", venue: "Pavilion", shift: "PM" },
  { id: "ev3", name: "Sunset Deck — Social", venue: "Deck", shift: "AM" },
];

const INITIAL_DATA: Item[] = [
  { id: "1", name: "Tito's 1.75L", category: "Liquor", onHand: 8, par: 10, unitCost: 28 },
  { id: "2", name: "Dom Pérignon 750ml", category: "Wine", onHand: 0, par: 6, unitCost: 210 },
  { id: "3", name: "Michelob Ultra 12oz", category: "Beer", onHand: 48, par: 60, unitCost: 2 },
  { id: "4", name: "Johnnie Walker Black 1L", category: "Liquor", onHand: 5, par: 6, unitCost: 42 },
];

const COGS_DATA: CogsRow[] = [
  { id: "c1", name: "Tito's 1.75L", category: "Liquor", taken: 5, added: 1, returned: 2, unitCost: 28 },
  { id: "c2", name: "Dom Pérignon 750ml", category: "Wine", taken: 6, added: 2, returned: 2, unitCost: 210 },
  { id: "c3", name: "Michelob Ultra 12oz", category: "Beer", taken: 60, added: 0, returned: 52, unitCost: 2 },
  { id: "c4", name: "Johnnie Walker Black 1L", category: "Liquor", taken: 3, added: 0, returned: 0, unitCost: 42 },
  { id: "c5", name: "Patrón Silver 750ml", category: "Liquor", taken: 4, added: 0, returned: 1, unitCost: 36.5 },
];

const MONTHLY_DATA: MonthlyDay[] = [
  { id: "d1", dowLabel: "Sun 1", revenue: 5804, coh: 4100, toOrder: 24, cogs: 1410, perc: { L: 18, B: 31, W: 8 } },
  { id: "d2", dowLabel: "Mon 2", revenue: 5825, coh: 3950, toOrder: 33, cogs: 571, perc: { L: 20, B: 20, W: 21 } },
  { id: "d3", dowLabel: "Tue 3", revenue: 5834, coh: 4200, toOrder: 19, cogs: 688, perc: { L: 21, B: 6, W: 20 } },
  { id: "d4", dowLabel: "Wed 4", revenue: 14425, coh: 5200, toOrder: 41, cogs: 915, perc: { L: 22, B: 13, W: 12 } },
  { id: "d5", dowLabel: "Thu 5", revenue: 15038, coh: 5400, toOrder: 28, cogs: 675, perc: { L: 18, B: 5, W: 5 } },
  { id: "d6", dowLabel: "Fri 6", revenue: 1781, coh: 2000, toOrder: 14, cogs: 143, perc: { L: 13, B: 13, W: 11 } },
  { id: "d7", dowLabel: "Sat 7", revenue: 18683, coh: 6200, toOrder: 35, cogs: 216, perc: { L: 4, B: 4, W: 3 } },
];

const categoryTabs: (Category | "All")[] = ["All", "Liquor", "Wine", "Beer"] as const;
type Tab = (typeof categoryTabs)[number];

/* ===================== UTILES ===================== */
const money = (n: number) =>
  `$${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

/* ===================== PRINCIPAL ===================== */
export default function DOH() {
  const [mode, setMode] = useState<ViewMode>("home");
  const [currentEvent, setCurrentEvent] = useState<EventRow | null>(null);
  const [monthLabel, setMonthLabel] = useState("Sep 2025");
  const [showLock, setShowLock] = useState(false);
  const [showMonthPicker, setShowMonthPicker] = useState(false);

  const totals = useMemo(() => {
    const totalCOH = 5412;
    const totalToOrder = 22;
    const reorderGuide = 1245;
    return { totalCOH, totalToOrder, reorderGuide };
  }, []);

  if (mode === "monthly") {
    return (
      <MonthlyList
        monthLabel={monthLabel}
        setMonthLabel={setMonthLabel}
        onBack={() => setMode("home")}
        onOpenDay={(d) => {
          setCurrentEvent({ id: "ev-global", name: `${d.dowLabel} — Global`, venue: "All", shift: "PM" });
          setMode("coh");
        }}
      />
    );
  }

  if (mode === "coh" && currentEvent) {
    return (
      <DailyCOHEmbedded
        eventName={currentEvent.name}
        onBack={() => setMode("home")}
        onOpenCOGS={() => setMode("cogs")}
      />
    );
  }

  if (mode === "cogs" && currentEvent) {
    return (
      <DailyCOGS
        scopeLabel="All Venues / All Events (Global)"
        eventName={currentEvent.name}
        onBack={() => setMode("home")}
        onGoDCOH={() => setMode("coh")}
        onMonthly={() => setMode("monthly")}
      />
    );
  }

  // -------- HUB (HOME) --------
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>DOH — Today</Text>
        <Text style={styles.sub}>Global • Tap an event</Text>

        <View style={styles.summaryRow}>
          <SumPill label="Total COH" value={money(totals.totalCOH)} />
          <SumPill label="Total To Order" value={`${totals.totalToOrder} btls`} />
          <SumPill label="Reorder Guide" value={money(totals.reorderGuide)} />
        </View>

        <View style={styles.navRow}>
          <TabPill label="DOH" active />
          <TabPill
            label="COGS"
            onPress={() => {
              setCurrentEvent({ id: "ev-global", name: "Global", venue: "All", shift: "PM" });
              setMode("cogs");
            }}
          />
          <TabPill label="Monthly" onPress={() => setShowMonthPicker(true)} />
          <View style={{ flex: 1 }} />
          <MonthBtn label={monthLabel} onPress={() => setShowMonthPicker(true)} />
        </View>

        <Text style={styles.section}>Event Cards</Text>
        <FlatList
          data={TODAY_EVENTS}
          keyExtractor={(e) => e.id}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          contentContainerStyle={{ paddingBottom: 24 }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.eventTitle}>{item.name}</Text>
              <View style={styles.btnRow}>
                <MiniBtn label="COH" onPress={() => { setCurrentEvent(item); setMode("coh"); }} />
                <MiniBtn label="COGS" onPress={() => { setCurrentEvent(item); setMode("cogs"); }} />
                <MiniBtn
                  label="Save & Lock"
                  alt
                  onPress={() => {
                    setCurrentEvent(item);
                    setShowLock(true);
                  }}
                />
              </View>
            </View>
          )}
        />

        {/* Save & Lock */}
        <SaveLockModal
          visible={showLock}
          totals={{ coh: 6640, toOrder: 22, cogs: 1624 }}
          onClose={() => setShowLock(false)}
          onConfirm={(pin) => {
            setShowLock(false);
            Alert.alert("Locked", `Snapshot saved. PIN ${pin} valid.`);
          }}
        />

        {/* Selector Mes/Año */}
        <MonthPickerModal
          visible={showMonthPicker}
          initialLabel={monthLabel}
          onClose={() => setShowMonthPicker(false)}
          onPick={(label) => {
            setMonthLabel(label);
            setShowMonthPicker(false);
            setMode("monthly");
          }}
        />
      </View>
    </SafeAreaView>
  );
}

/* =========================================================
    MONTHLY — LIST VIEW
   ========================================================= */
function MonthlyList({
  monthLabel,
  setMonthLabel,
  onBack,
  onOpenDay,
}: {
  monthLabel: string;
  setMonthLabel: (s: string) => void;
  onBack: () => void;
  onOpenDay: (d: MonthlyDay) => void;
}) {
  const [tab, setTab] = useState<Tab>("All");

  const mtd = useMemo(() => {
    const rev = MONTHLY_DATA.reduce((s, d) => s + d.revenue, 0);
    const coh = MONTHLY_DATA.reduce((s, d) => s + d.coh, 0);
    const toOrder = MONTHLY_DATA.reduce((s, d) => s + d.toOrder, 0);
    const cogs = MONTHLY_DATA.reduce((s, d) => s + d.cogs, 0);
    return { rev, coh, toOrder, cogs };
  }, []);

  const exportMonth = () => {
    console.log("Export Month ->", MONTHLY_DATA);
    Alert.alert("Export", "Monthly summary exported (check console/log).");
  };
  const exportSummary = () => {
    console.log("Export Summary (MTD) ->", mtd);
    Alert.alert("Export", "Summary exported (check console/log).");
  };
  const exportDailyDetail = () => {
    const detail = MONTHLY_DATA.map((d) => ({
      Day: d.dowLabel,
      Revenue: d.revenue,
      COH: d.coh,
      ToOrder: d.toOrder,
      COGS: d.cogs,
      Percents: d.perc,
    }));
    console.log("Export Daily Detail ->", detail);
    Alert.alert("Export", "Daily detail exported (check console/log).");
  };

  const renderDay = ({ item }: { item: MonthlyDay }) => (
    <TouchableOpacity style={stylesM.dayCard} onPress={() => onOpenDay(item)}>
      <View style={{ flex: 1 }}>
        <Text style={stylesM.dayTitle}>{item.dowLabel}</Text>
        <View style={{ height: 6 }} />
        <Text style={stylesM.subLine}>Rev {money(item.revenue)}</Text>
        <Text style={stylesM.subLine}>COH {money(item.coh)}</Text>
        <Text style={stylesM.subLine}>ToOrder {item.toOrder}</Text>
      </View>

      <View style={{ width: 156, alignItems: "flex-end", gap: 8 }}>
        <View style={stylesM.cogsPill}>
          <Text style={stylesM.cogsPillText}>COGS {money(item.cogs)}</Text>
        </View>
        <View style={{ flexDirection: "row", gap: 10 }}>
          <View style={stylesM.percChip}><Text style={stylesM.percText}>L {item.perc.L}%</Text></View>
          <View style={stylesM.percChip}><Text style={stylesM.percText}>B {item.perc.B}%</Text></View>
          <View style={stylesM.percChip}><Text style={stylesM.percText}>W {item.perc.W}%</Text></View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
          <TouchableOpacity onPress={onBack} style={styles.backBtn}>
            <Text style={{ color: PALETTE.text, fontWeight: "900" }}>◀</Text>
          </TouchableOpacity>
          <Text style={[styles.title, { marginLeft: 8 }]}>Monthly — List View</Text>
        </View>
        <Text style={styles.sub}>{monthLabel} • Global • Tap a day to open details</Text>

        <View style={stylesM.tabRow}>
          <TouchableOpacity
            style={stylesM.monthSwitcher}
            onPress={() => {
              const [m, y] = monthLabel.split(" ");
              const idx = Math.max(0, MONTHS.indexOf(m) - 1);
              setMonthLabel(`${MONTHS[idx]} ${y}`);
            }}
          >
            <Text style={stylesM.monthText}>◀ {monthLabel}</Text>
          </TouchableOpacity>

          {["All", "Liquor", "Wine", "Beer"].map((t) => (
            <TouchableOpacity
              key={t}
              onPress={() => setTab(t as Tab)}
              style={[
                stylesM.catPill,
                { backgroundColor: (t as Tab) === tab ? "#163349" : "transparent", borderColor: PALETTE.line },
              ]}
            >
              <Text style={stylesM.catText}>{t}</Text>
            </TouchableOpacity>
          ))}

          <View style={{ flex: 1 }} />
          <TouchableOpacity style={stylesM.exportMonthBtn} onPress={exportMonth}>
            <Text style={stylesM.exportMonthText}>Export Month</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={MONTHLY_DATA}
          keyExtractor={(d) => d.id}
          renderItem={renderDay}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          contentContainerStyle={{ paddingBottom: 140 }}
        />

        <View style={stylesM.mtdBar}>
          <Text style={stylesM.mtdText}>
            Month to date: Rev {money(mtd.rev)} • COH {money(mtd.coh)} • ToOrder {mtd.toOrder} • COGS {money(mtd.cogs)}
          </Text>
        </View>

        <View style={stylesM.bottomRow}>
          <TouchableOpacity style={[stylesM.bottomBtn, { backgroundColor: PALETTE.darkBtn }]} onPress={exportSummary}>
            <Text style={stylesM.bottomBtnText}>Export Summary (CS’</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[stylesM.bottomBtn, { backgroundColor: PALETTE.darkBtn }]} onPress={exportDailyDetail}>
            <Text style={stylesM.bottomBtnText}>Export Daily Detail</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[stylesM.bottomBtn, { backgroundColor: PALETTE.success }]} onPress={() => onOpenDay(MONTHLY_DATA[0])}>
            <Text style={[stylesM.bottomBtnText, { color: "white" }]}>Open Today</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

/* =========================================================
    COH — con Save & Lock + PIN
   ========================================================= */
function DailyCOHEmbedded({
  eventName,
  onBack,
  onOpenCOGS,
}: {
  eventName: string;
  onBack: () => void;
  onOpenCOGS: () => void;
}) {
  const [tab, setTab] = useState<Tab>("All");
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<"name" | "variance" | "cost">("name");
  const [fillToParPreview, setFillToParPreview] = useState(false);
  const [locked, setLocked] = useState(false);
  const [showLock, setShowLock] = useState(false);
  const [data, setData] = useState<Item[]>(INITIAL_DATA);

  const filtered: Derived[] = useMemo(() => {
    let rows = data.filter((r) => (tab === "All" ? true : r.category === tab));
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      rows = rows.filter((r) => r.name.toLowerCase().includes(q));
    }
    const rowsWithDerived: Derived[] = rows.map((r) => ({
      ...r,
      variance: r.par - r.onHand,
      toOrder: Math.max(0, r.par - r.onHand),
      lineCost: r.onHand * r.unitCost,
    }));
    switch (sortKey) {
      case "variance":
        rowsWithDerived.sort((a, b) => (b.variance - a.variance) || a.name.localeCompare(b.name));
        break;
      case "cost":
        rowsWithDerived.sort((a, b) => (b.lineCost - a.lineCost) || a.name.localeCompare(b.name));
        break;
      default:
        rowsWithDerived.sort((a, b) => a.name.localeCompare(b.name));
    }
    return rowsWithDerived;
  }, [data, tab, query, sortKey]);

  const summary = useMemo(() => {
    const derived = data.map((r) => ({
      ...r,
      variance: r.par - r.onHand,
      toOrder: Math.max(0, r.par - r.onHand),
      lineCost: r.onHand * r.unitCost,
      reorderCost: Math.max(0, r.par - r.onHand) * r.unitCost,
    }));
    const totalCOH = derived.reduce((s, r) => s + r.lineCost, 0);
    const totalToOrder = derived.reduce((s, r) => s + r.toOrder, 0);
    const reorderGuide = derived.reduce((s, r) => s + r.reorderCost, 0);
    return { totalCOH, totalToOrder, reorderGuide };
  }, [data]);

  const adjust = (id: string, delta: number, field: "onHand" | "par") => {
    if (locked) return;
    setData((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: Math.max(0, (r as any)[field] + delta) } : r))
    );
  };

  const SaveToday = () => {
    Alert.alert("Saved", "Daily COH saved for today.");
    console.log("SaveToday payload:", data);
  };
  const ExportCOH = () => {
    const rows = data.map((r) => ({
      Item: r.name,
      Category: r.category,
      OnHand: r.onHand,
      PAR: r.par,
      Variance: r.par - r.onHand,
      UnitCost: r.unitCost,
      LineCost: (r.onHand * r.unitCost).toFixed(2),
    }));
    console.log("Export COH -> rows", rows);
    Alert.alert("Export", "COH exported (check console/log).");
  };

  const renderItem = ({ item }: { item: Derived }) => {
    const baseVariance = item.variance;
    const previewOnHand = fillToParPreview ? item.par : item.onHand;
    const previewVariance = fillToParPreview ? 0 : baseVariance; // <-- FIX
    const toOrderPreview = Math.max(0, previewVariance);
    const lineCost = previewOnHand * item.unitCost;

    return (
      <View style={stylesC.card}>
        <View style={stylesC.rowBetween}>
          <Text style={stylesC.itemTitle}>{item.name}</Text>
          <Text style={stylesC.costText}>{money(item.unitCost)}</Text>
        </View>

        <View style={[stylesC.chip, { alignSelf: "flex-start", marginTop: 6 }]}>
          <Text style={stylesC.chipText}>{item.category}</Text>
        </View>

        <View style={stylesC.tableRow}>
          <Text style={stylesC.colHeader}>On Hand</Text>
          <Text style={stylesC.colHeader}>PAR</Text>
          <Text style={stylesC.colHeader}>Variance / To Order</Text>
          <Text style={stylesC.colHeader}>Unit / Guide</Text>
        </View>

        <View style={stylesC.tableRow}>
          <View style={stylesC.colCell}>
            <View style={stylesC.counterRow}>
              <RoundBtn label="–" onPress={() => adjust(item.id, -1, "onHand")} disabled={locked} />
              <Text style={stylesC.num}>{previewOnHand}</Text>
              <RoundBtn label="+" onPress={() => adjust(item.id, +1, "onHand")} disabled={locked} />
            </View>
          </View>

          <View style={stylesC.colCell}>
            <View style={stylesC.counterRow}>
              <RoundBtn label="–" onPress={() => adjust(item.id, -1, "par")} disabled={locked} />
              <Text style={stylesC.num}>{item.par}</Text>
              <RoundBtn label="+" onPress={() => adjust(item.id, +1, "par")} disabled={locked} />
            </View>
          </View>

          <View style={stylesC.colCell}>
            <Text
              style={[
                stylesC.num,
                previewVariance > 0 && { color: PALETTE.warning },
                previewVariance < 0 && { color: PALETTE.mint },
                previewVariance === 0 && { color: PALETTE.sub },
              ]}
            >
              {previewVariance > 0 ? `+${previewVariance}` : previewVariance}
            </Text>
            <Text style={stylesC.subTiny}>Order {toOrderPreview}</Text>
          </View>

          <View style={stylesC.colCell}>
            <Text style={stylesC.num}>{money(item.unitCost)}</Text>
            <Text style={stylesC.subTiny}>{money(lineCost)}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
          <TouchableOpacity onPress={onBack} style={styles.backBtn}>
            <Text style={{ color: PALETTE.text, fontWeight: "900" }}>◀</Text>
          </TouchableOpacity>
          <Text style={[styles.title, { marginLeft: 8 }]}>DCOH — Today</Text>
        </View>
        <Text style={styles.sub}>Aug 28 • Global • Edit On Hand / PAR</Text>

        {locked && (
          <View style={styles.lockedPill}>
            <Text style={styles.lockedText}>Status: LOCKED (read-only)</Text>
          </View>
        )}

        <View style={stylesC.tabs}>
          {categoryTabs.map((t) => (
            <TouchableOpacity
              key={t}
              onPress={() => setTab(t)}
              style={[
                stylesC.tabPill,
                { backgroundColor: t === tab ? PALETTE.button : "transparent", borderColor: PALETTE.line },
              ]}
            >
              <Text style={[stylesC.tabText, { opacity: t === tab ? 1 : 0.75 }]}>{t}</Text>
            </TouchableOpacity>
          ))}
          <View style={{ flex: 1 }} />
          <SmallButton label="Export COGS" onPress={onOpenCOGS} />
          <SmallButton
            label="Sort"
            onPress={() =>
              setSortKey((prev) => (prev === "name" ? "variance" : prev === "variance" ? "cost" : "name"))
            }
          />
        </View>

        <TextInput
          style={stylesC.search}
          placeholder="Search item…"
          placeholderTextColor={PALETTE.sub}
          value={query}
          onChangeText={setQuery}
        />

        <View style={styles.summaryRow}>
          <SumPill label="Liquor COH" value={money(3210)} />
          <SumPill label="Wine COH" value={money(2450)} />
          <SumPill label="Beer COH" value={money(980)} />
        </View>

        <FlatList
          data={filtered}
          keyExtractor={(i) => i.id}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <View style={stylesC.separator} />}
          contentContainerStyle={{ paddingBottom: 220 }}
        />

        {/* STICKY FOOTER — DCOH */}
        <SafeAreaView style={stylesC.stickyFooter}>
          <View style={stylesC.footerRow}>
            <TouchableOpacity style={styles.footerDarkBtn} onPress={ExportCOH}>
              <Text style={styles.footerDarkText}>Export COH</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.footerDarkBtn} onPress={onOpenCOGS}>
              <Text style={styles.footerDarkText}>Export COGS</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.footerAction, { backgroundColor: "#2BA6F7" }]} onPress={SaveToday}>
              <Text style={styles.footerActionText}>Save Today</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.footerAction, { backgroundColor: "#26D07C" }]}
              onPress={() => setShowLock(true)}
              disabled={locked}
            >
              <Text style={styles.footerActionText}>Save</Text>
            </TouchableOpacity>
          </View>

          <View style={stylesC.footerSwitchRow}>
            <Switch
              value={fillToParPreview}
              onValueChange={setFillToParPreview}
              thumbColor={fillToParPreview ? PALETTE.mint : "#ccc"}
              trackColor={{ true: "rgba(30,220,150,0.3)", false: "rgba(255,255,255,0.1)" }}
            />
            <Text style={stylesC.fillText}>Fill to PAR (preview only)</Text>
          </View>
        </SafeAreaView>

        {/* Confirm Lock */}
        <SaveLockModal
          visible={showLock}
          totals={{ coh: 6640, toOrder: summary.totalToOrder, cogs: 1624 }}
          onClose={() => setShowLock(false)}
          onConfirm={(pin) => {
            setShowLock(false);
            setLocked(true);
            Alert.alert("Locked", `Day locked with PIN ${pin}.`);
          }}
        />
      </View>
    </SafeAreaView>
  );
}

/* =========================================================
    DAILY COGS — footer fijo abajo
   ========================================================= */
function DailyCOGS({
  scopeLabel,
  eventName,
  onBack,
  onGoDCOH,
  onMonthly,
}: {
  scopeLabel: string;
  eventName: string;
  onBack: () => void;
  onGoDCOH: () => void;
  onMonthly: () => void;
}) {
  const [tab, setTab] = useState<Tab>("All");
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<"name" | "used" | "lineCost">("name");

  const rows = useMemo(() => {
    let list = COGS_DATA.filter((r) => (tab === "All" ? true : r.category === tab));
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((r) => r.name.toLowerCase().includes(q));
    }
    const derived = list.map((r) => {
      const used = Math.max(0, r.taken + r.added - r.returned);
      const lineCost = used * r.unitCost;
      return { ...r, used, lineCost };
    });
    switch (sortKey) {
      case "used":
        derived.sort((a, b) => b.used - a.used || a.name.localeCompare(b.name));
        break;
      case "lineCost":
        derived.sort((a, b) => b.lineCost - a.lineCost || a.name.localeCompare(b.name));
        break;
      default:
        derived.sort((a, b) => a.name.localeCompare(b.name));
    }
    return derived;
  }, [tab, query, sortKey]);

  const catTotals = useMemo(() => {
    const base = { Liquor: 0, Wine: 0, Beer: 0 } as Record<Category, number>;
    COGS_DATA.forEach((r) => {
      const used = Math.max(0, r.taken + r.added - r.returned);
      base[r.category] += used * r.unitCost;
    });
    return base;
  }, []);

  const totalCOGS = useMemo(() => rows.reduce((s, r: any) => s + r.lineCost, 0), [rows]);

  const exportCOGS = () => {
    const payload = rows.map((r: any) => ({
      Item: r.name,
      Category: r.category,
      Taken: r.taken,
      Added: r.added,
      Returned: r.returned,
      Used: r.used,
      UnitCost: r.unitCost,
      LineCost: r.lineCost.toFixed(2),
    }));
    console.log("Export COGS ->", payload);
    Alert.alert("Export", "COGS exported (check console/log).");
  };

  const renderRow = ({ item }: { item: any }) => (
    <View style={stylesG.rowCard}>
      <Text style={stylesG.itemTitle}>{item.name}</Text>
      <View style={[stylesG.chip, { alignSelf: "flex-start", marginTop: 6, marginBottom: 8 }]}>
        <Text style={stylesG.chipText}>{item.category}</Text>
      </View>

      <View style={stylesG.tableHeader}>
        <Text style={[stylesG.th, { flex: 2, textAlign: "left" }]}>Item</Text>
        <Text style={stylesG.th}>Taken</Text>
        <Text style={stylesG.th}>Added</Text>
        <Text style={stylesG.th}>Returned</Text>
        <Text style={stylesG.th}>Used</Text>
        <Text style={stylesG.th}>Bottle Cost</Text>
        <Text style={stylesG.th}>Line</Text>
      </View>

      <View style={stylesG.tableRow}>
        <Text style={[stylesG.td, { flex: 2, textAlign: "left" }]} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={stylesG.td}>{item.taken}</Text>
        <Text style={stylesG.td}>{item.added}</Text>
        <Text style={stylesG.td}>{item.returned}</Text>
        <Text style={[stylesG.td, { fontWeight: "800" }]}>{item.used}</Text>
        <Text style={stylesG.td}>{money(item.unitCost)}</Text>
        <Text style={[stylesG.td, { fontWeight: "800" }]}>{money(item.lineCost)}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
          <TouchableOpacity onPress={onBack} style={styles.backBtn}>
            <Text style={{ color: PALETTE.text, fontWeight: "900" }}>◀</Text>
          </TouchableOpacity>
          <Text style={[styles.title, { marginLeft: 8 }]}>Daily COGS — Aug 28</Text>
        </View>
        <Text style={styles.sub}>Scope: {scopeLabel}</Text>

        <View style={stylesG.tabs}>
          {categoryTabs.map((t) => (
            <TouchableOpacity
              key={t}
              onPress={() => setTab(t)}
              style={[
                stylesG.tabPill,
                { backgroundColor: t === tab ? PALETTE.button : "transparent", borderColor: PALETTE.line },
              ]}
            >
              <Text style={[stylesG.tabText, { opacity: t === tab ? 1 : 0.75 }]}>{t}</Text>
            </TouchableOpacity>
          ))}
          <View style={{ flex: 1 }} />
          <TouchableOpacity
            onPress={() => setSortKey((p) => (p === "name" ? "used" : p === "used" ? "lineCost" : "name"))}
            style={stylesG.smallBtn}
          >
            <Text style={stylesG.smallBtnText}>Sort</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.summaryRow}>
          <SumPill label="Liquor COGS" value={money(catTotals.Liquor)} />
          <SumPill label="Wine COGS" value={money(catTotals.Wine)} />
          <SumPill label="Beer COGS" value={money(catTotals.Beer)} />
        </View>

        <FlatList
          data={rows}
          keyExtractor={(i) => i.id}
          renderItem={renderRow}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          contentContainerStyle={{ paddingBottom: 200 }}
        />

        {/* STICKY FOOTER — COGS */}
        <SafeAreaView style={stylesG.stickyFooter}>
          <View style={stylesG.footerTotalBarInline}>
            <Text style={stylesG.footerLabel}>Aug 28 — Total COGS (Global)</Text>
            <Text style={stylesG.footerTotal}>{money(totalCOGS)}</Text>
          </View>

          <View style={stylesG.footerBtnRowInline}>
            <TouchableOpacity style={[stylesG.footerBtn, { backgroundColor: PALETTE.darkBtn }]} onPress={exportCOGS}>
              <Text style={stylesG.footerBtnText}>Export COGS (CSV/XLSX)</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[stylesG.footerBtn, { backgroundColor: PALETTE.darkBtn }]} onPress={onGoDCOH}>
              <Text style={stylesG.footerBtnText}>Go to DCOH</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[stylesG.footerBtn, { backgroundColor: PALETTE.success }]} onPress={onMonthly}>
              <Text style={[stylesG.footerBtnText, { color: "white" }]}>Monthly</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    </SafeAreaView>
  );
}

/* =========================================================
    MODAL SAVE & LOCK con PIN (teclado corregido)
   ========================================================= */
function SaveLockModal({
  visible,
  totals,
  onClose,
  onConfirm,
}: {
  visible: boolean;
  totals: { coh: number; toOrder: number; cogs: number };
  onClose: () => void;
  onConfirm: (pin: string) => void;
}) {
  const [reviewed, setReviewed] = useState(true);
  const [exportAfter, setExportAfter] = useState(true);
  const [pin, setPin] = useState("");

  const handleConfirm = () => {
    if (pin.length !== 4) {
      Alert.alert("PIN", "Ingresa un PIN de 4 dígitos.");
      return;
    }
    if (pin !== ADMIN_PIN) {
      Alert.alert("PIN incorrecto", "El PIN no coincide.");
      return;
    }
    Keyboard.dismiss();
    if (exportAfter) console.log("Auto-export snapshot after lock…");
    onConfirm(pin);
    setPin("");
  };

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss(); onClose(); }}>
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}>
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 24 : 0}
          >
            <SafeAreaView style={{ flex: 1, justifyContent: "flex-end" }}>
              <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <View style={styles.sheet}>
                  <Text style={styles.sheetTitle}>Close Day — Save & Lock</Text>
                  <Text style={styles.sub}>
                    This will freeze today’s numbers (COH & COGS) and disable edits.
                  </Text>

                  <View style={styles.totalBox}>
                    <Text style={styles.totalText}>
                      Totals: COH {money(totals.coh)} • To Order {totals.toOrder} • COGS {money(totals.cogs)}
                    </Text>
                  </View>

                  <View style={styles.sheetRow}>
                    <Switch value={reviewed} onValueChange={setReviewed} />
                    <Text style={styles.sheetRowText}>✓ I reviewed On Hand & PAR differences</Text>
                  </View>
                  <View style={styles.sheetRow}>
                    <Switch value={exportAfter} onValueChange={setExportAfter} />
                    <Text style={styles.sheetRowText}>✓ Export snapshot after locking</Text>
                  </View>

                  {/* PIN */}
                  <View style={{ marginTop: 14 }}>
                    <Text style={{ color: PALETTE.text, fontWeight: "800", marginBottom: 6 }}>
                      Enter 4-digit PIN
                    </Text>
                    <TextInput
                      value={pin}
                      onChangeText={(t) => setPin(t.replace(/[^0-9]/g, "").slice(0, 4))}
                      keyboardType="number-pad"
                      secureTextEntry
                      maxLength={4}
                      style={styles.pinInput}
                      placeholder="••••"
                      placeholderTextColor={PALETTE.sub}
                      blurOnSubmit
                      returnKeyType="done"
                      onSubmitEditing={handleConfirm}
                    />
                  </View>

                  <View style={{ flexDirection: "row", gap: 10, marginTop: 16 }}>
                    <Btn label="Cancel" onPress={() => { Keyboard.dismiss(); onClose(); }} />
                    <Btn label="Confirm & Lock" ok onPress={handleConfirm} />
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </SafeAreaView>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

/* =========================================================
    MonthPickerModal — selector de Mes/Año
   ========================================================= */
function MonthPickerModal({
  visible,
  initialLabel,
  onClose,
  onPick,
}: {
  visible: boolean;
  initialLabel: string;
  onClose: () => void;
  onPick: (label: string) => void;
}) {
  const [selMonth, setSelMonth] = useState(() => {
    const [m] = initialLabel.split(" ");
    const idx = MONTHS.indexOf(m);
    return idx >= 0 ? idx : new Date().getMonth();
  });
  const [selYear, setSelYear] = useState(() => {
    const [, y] = initialLabel.split(" ");
    const ny = parseInt(y || "", 10);
    return Number.isFinite(ny) ? ny : new Date().getFullYear();
  });

  const years = [new Date().getFullYear() - 1, new Date().getFullYear(), new Date().getFullYear() + 1];

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }} />
      </TouchableWithoutFeedback>

      <SafeAreaView style={{ marginTop: "auto" }}>
        <View style={styles.sheet}>
          <Text style={styles.sheetTitle}>Select Month</Text>
          <Text style={[styles.sub, { marginBottom: 12 }]}>Pick a month and year</Text>

          {/* Meses */}
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {MONTHS.map((m, idx) => (
              <TouchableOpacity
                key={m}
                onPress={() => setSelMonth(idx)}
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: PALETTE.line,
                  backgroundColor: selMonth === idx ? PALETTE.button : "transparent",
                }}
              >
                <Text style={{ color: PALETTE.text, fontWeight: "800" }}>{m}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Años */}
          <View style={{ flexDirection: "row", gap: 8, marginTop: 12 }}>
            {years.map((y) => (
              <TouchableOpacity
                key={y}
                onPress={() => setSelYear(y)}
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: PALETTE.line,
                  backgroundColor: selYear === y ? PALETTE.button : "transparent",
                }}
              >
                <Text style={{ color: PALETTE.text, fontWeight: "800" }}>{y}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={{ flexDirection: "row", gap: 10, marginTop: 16 }}>
            <Btn label="Cancel" onPress={onClose} />
            <Btn label="Confirm" ok onPress={() => onPick(`${MONTHS[selMonth]} ${selYear}`)} />
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

/* ===================== UI GENÉRICOS ===================== */
function SumPill({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.sumPill}>
      <Text style={styles.sumLabel}>{label}</Text>
      <Text style={styles.sumValue}>{value}</Text>
    </View>
  );
}
function TabPill({ label, active, onPress }: { label: string; active?: boolean; onPress?: () => void }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={active}
      style={[
        styles.tab,
        { backgroundColor: active ? PALETTE.button : "transparent", borderColor: PALETTE.line, opacity: active ? 1 : 0.9 },
      ]}
    >
      <Text style={styles.tabText}>{label}</Text>
    </TouchableOpacity>
  );
}
function MonthBtn({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.monthBtn} onPress={onPress}>
      <Text style={styles.monthText}>{label} ▸</Text>
    </TouchableOpacity>
  );
}
function MiniBtn({ label, onPress, alt }: { label: string; onPress: () => void; alt?: boolean }) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.miniBtn, alt && { backgroundColor: PALETTE.buttonAlt }]}>
      <Text style={styles.miniBtnText}>{label}</Text>
    </TouchableOpacity>
  );
}
function SmallButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} style={stylesC.smallBtn}>
      <Text style={stylesC.smallBtnText}>{label}</Text>
    </TouchableOpacity>
  );
}
function RoundBtn({ label, onPress, disabled }: { label: string; onPress: () => void; disabled?: boolean }) {
  return (
    <TouchableOpacity onPress={onPress} disabled={disabled} style={[stylesC.roundBtn, disabled && { opacity: 0.4 }]}>
      <Text style={stylesC.roundBtnText}>{label}</Text>
    </TouchableOpacity>
  );
}
function Btn({ label, onPress, ok }: { label: string; onPress: () => void; ok?: boolean }) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.btn, ok && { backgroundColor: PALETTE.ok }]}>
      <Text style={{ color: "white", fontWeight: "900" }}>{label}</Text>
    </TouchableOpacity>
  );
}

/* ===================== STYLES HUB/MODAL ===================== */
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: PALETTE.bg },
  container: { flex: 1, paddingHorizontal: 16, paddingTop: 8 },
  title: { color: PALETTE.text, fontSize: 28, fontWeight: "900" },
  sub: { color: PALETTE.sub, marginBottom: 12 },

  summaryRow: { flexDirection: "row", gap: 10, marginBottom: 12 },
  sumPill: {
    flex: 1,
    backgroundColor: PALETTE.card,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: PALETTE.line,
  },
  sumLabel: { color: PALETTE.sub, fontSize: 12, marginBottom: 4 },
  sumValue: { color: PALETTE.text, fontSize: 20, fontWeight: "800" },

  navRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 12 },
  tab: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12, borderWidth: 1 },
  tabText: { color: PALETTE.text, fontWeight: "800" },
  monthBtn: { backgroundColor: PALETTE.success, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 8 },
  monthText: { color: "white", fontWeight: "900" },

  section: { color: PALETTE.text, fontSize: 18, fontWeight: "800", marginBottom: 8 },

  card: { backgroundColor: PALETTE.card, borderRadius: 16, padding: 14, borderWidth: 1, borderColor: PALETTE.line },
  eventTitle: { color: PALETTE.text, fontSize: 16, fontWeight: "900", marginBottom: 10 },
  btnRow: { flexDirection: "row", gap: 10 },
  miniBtn: { flex: 1, backgroundColor: PALETTE.button, borderRadius: 12, paddingVertical: 12, alignItems: "center" },
  miniBtnText: { color: "white", fontWeight: "900" },

  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: "rgba(255,255,255,0.06)", alignItems: "center", justifyContent: "center" },

  // Modal sheet base
  sheet: {
    marginTop: "auto",
    backgroundColor: PALETTE.card,
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderWidth: 1,
    borderColor: PALETTE.line,
  },
  sheetTitle: { color: PALETTE.text, fontSize: 22, fontWeight: "900" },
  sheetRow: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 12 },
  sheetRowText: { color: PALETTE.text, flex: 1 },
  btn: { flex: 1, backgroundColor: "#2B2F36", paddingVertical: 12, alignItems: "center", borderRadius: 12 },

  totalBox: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: PALETTE.line,
    padding: 12,
    marginTop: 10,
  },
  totalText: { color: PALETTE.text, fontWeight: "800" },

  pinInput: {
    backgroundColor: PALETTE.card,
    borderColor: PALETTE.line,
    borderWidth: 1,
    borderRadius: 12,
    color: PALETTE.text,
    paddingHorizontal: 14,
    paddingVertical: 10,
    letterSpacing: 6,
    fontWeight: "900",
    fontSize: 18,
  },

  footerDarkBtn: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: PALETTE.line,
  },
  footerDarkText: { color: PALETTE.text, fontWeight: "800" },
  footerAction: { flex: 1, borderRadius: 12, paddingVertical: 12, alignItems: "center" },
  footerActionText: { color: "white", fontWeight: "900" },

  lockedPill: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(30,220,150,0.18)",
    borderColor: "rgba(30,220,150,0.4)",
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    marginBottom: 8,
  },
  lockedText: { color: PALETTE.mint, fontWeight: "900" },
});

/* ===================== STYLES COH ===================== */
const stylesC = StyleSheet.create({
  tabs: { flexDirection: "row", gap: 8, alignItems: "center", marginBottom: 10 },
  tabPill: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12, borderWidth: 1 },
  tabText: { color: PALETTE.text, fontWeight: "700" },

  search: {
    backgroundColor: PALETTE.card,
    color: PALETTE.text,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: PALETTE.line,
    marginBottom: 10,
  },

  separator: { height: 10 },

  card: {
    backgroundColor: PALETTE.card,
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: PALETTE.line,
  },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  itemTitle: { color: PALETTE.text, fontSize: 17, fontWeight: "800" },
  costText: { color: PALETTE.text, fontSize: 16, fontWeight: "700", opacity: 0.9 },

  chip: { backgroundColor: "rgba(17,133,224,0.2)", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  chipText: { color: PALETTE.text, fontSize: 12 },

  tableRow: { flexDirection: "row", alignItems: "center", marginTop: 10, gap: 10 },
  colHeader: { color: PALETTE.sub, fontSize: 12, flex: 1, textAlign: "center" },
  colCell: { flex: 1, alignItems: "center", gap: 4 },

  counterRow: { flexDirection: "row", gap: 10, alignItems: "center", justifyContent: "center" },
  roundBtn: { width: 28, height: 28, borderRadius: 14, backgroundColor: PALETTE.pill, alignItems: "center", justifyContent: "center" },
  roundBtnText: { color: "white", fontWeight: "900", fontSize: 16 },

  num: { color: PALETTE.text, fontWeight: "800", fontSize: 16 },
  subTiny: { color: PALETTE.sub, fontSize: 12 },

  smallBtn: {
    backgroundColor: PALETTE.card,
    borderColor: PALETTE.line,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  smallBtnText: { color: PALETTE.text, fontWeight: "700" },

  /* Footer fijo abajo */
  stickyFooter: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: 10,
    paddingBottom: 12,
    paddingHorizontal: 16,
    backgroundColor: "#0E1E2B",
    borderTopWidth: 1,
    borderTopColor: PALETTE.line,
    gap: 10,
  },
  footerRow: { flexDirection: "row", gap: 10 },
  footerSwitchRow: { flexDirection: "row", alignItems: "center", gap: 10, paddingLeft: 2 },
  fillText: { color: PALETTE.sub },
});

/* ===================== STYLES COGS ===================== */
const stylesG = StyleSheet.create({
  tabs: { flexDirection: "row", gap: 8, alignItems: "center", marginBottom: 12 },
  tabPill: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12, borderWidth: 1 },
  tabText: { color: PALETTE.text, fontWeight: "700" },

  smallBtn: {
    backgroundColor: PALETTE.card,
    borderColor: PALETTE.line,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  smallBtnText: { color: PALETTE.text, fontWeight: "700" },

  rowCard: {
    backgroundColor: PALETTE.card,
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: PALETTE.line,
  },
  itemTitle: { color: PALETTE.text, fontSize: 16, fontWeight: "800" },

  chip: { backgroundColor: "rgba(17,133,224,0.2)", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  chipText: { color: PALETTE.text, fontSize: 12 },

  tableHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    paddingTop: 6,
    borderTopWidth: 1,
    borderColor: PALETTE.line,
  },
  tableRow: { flexDirection: "row", alignItems: "center", paddingBottom: 4 },
  th: { flex: 1, color: PALETTE.sub, fontSize: 12, textAlign: "center" },
  td: { flex: 1, color: PALETTE.text, fontSize: 14, textAlign: "center" },

  /* Footer fijo abajo */
  stickyFooter: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: 10,
    paddingBottom: 12,
    paddingHorizontal: 16,
    backgroundColor: "#0E1E2B",
    borderTopWidth: 1,
    borderTopColor: PALETTE.line,
    gap: 10,
  },
  footerTotalBarInline: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: PALETTE.line,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerLabel: { color: PALETTE.sub, fontSize: 14 },
  footerTotal: { color: PALETTE.text, fontSize: 22, fontWeight: "900" },

  footerBtnRowInline: { flexDirection: "row", gap: 10 },
  footerBtn: { flex: 1, borderRadius: 12, paddingVertical: 12, alignItems: "center" },
  footerBtnText: { color: PALETTE.text, fontWeight: "800" },
});

/* ===================== STYLES MONTHLY ===================== */
const stylesM = StyleSheet.create({
  tabRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 12 },
  monthSwitcher: { backgroundColor: "#132635", borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8 },
  monthText: { color: PALETTE.text, fontWeight: "800" },

  catPill: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, borderWidth: 1 },
  catText: { color: PALETTE.text, fontWeight: "800" },

  exportMonthBtn: { backgroundColor: PALETTE.success, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8 },
  exportMonthText: { color: "white", fontWeight: "900" },

  dayCard: {
    backgroundColor: PALETTE.card,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: PALETTE.line,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  dayTitle: { color: PALETTE.text, fontSize: 22, fontWeight: "900" },
  subLine: { color: PALETTE.sub, fontSize: 14 },

  cogsPill: {
    alignSelf: "flex-end",
    backgroundColor: "rgba(255,255,255,0.06)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: PALETTE.line,
  },
  cogsPillText: { color: PALETTE.text, fontWeight: "900" },

  percChip: {
    backgroundColor: "rgba(255,255,255,0.06)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: PALETTE.line,
  },
  percText: { color: PALETTE.sub, fontSize: 12, fontWeight: "800" },

  mtdBar: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 76,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: PALETTE.line,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  mtdText: { color: PALETTE.sub, fontSize: 14 },

  bottomRow: { position: "absolute", left: 16, right: 16, bottom: 16, flexDirection: "row", gap: 10 },
  bottomBtn: { flex: 1, borderRadius: 12, paddingVertical: 12, alignItems: "center" },
  bottomBtnText: { color: PALETTE.text, fontWeight: "800" },
});
