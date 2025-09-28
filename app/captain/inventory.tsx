import React, { useLayoutEffect, useMemo, useState, useEffect } from "react";
import {
  Alert,
  FlatList,
  Modal,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

/** ===== Types & seed data ===== */
type Category = "Liquor" | "Wine" | "Beer" | "Produce" | "Disposables";

type InventoryItem = {
  id: string;
  name: string;
  category: Category;
  unit: string;
  unitCost: number;
  onHand: number;
  par: number;
  inEvents: number;
};

const initialItems: InventoryItem[] = [
  { id: "1", name: "Tito's 1.75L", category: "Liquor", unit: "1.75L", unitCost: 28.0, onHand: 8,  par: 10, inEvents: 2 },
  { id: "2", name: "Jameson 1L",   category: "Liquor", unit: "1L",    unitCost: 22.0, onHand: 12, par: 12, inEvents: 0 },
  { id: "3", name: "Dom Pérignon 750ml", category: "Wine", unit: "750ml", unitCost: 210.0, onHand: 0,  par: 6,  inEvents: 0 },
  { id: "4", name: "K.-Jackson Chardonnay", category: "Wine", unit: "750ml", unitCost: 16.0, onHand: 18, par: 24, inEvents: 0 },
  { id: "5", name: "Michelob Ultra 12oz (24pk)", category: "Beer", unit: "24pk", unitCost: 2.0, onHand: 48, par: 60, inEvents: 12 },
  { id: "6", name: "Lime (lb)", category: "Produce", unit: "lb", unitCost: 1.10, onHand: 22, par: 30, inEvents: 0 },
  { id: "7", name: "Cocktail Napkins (box)", category: "Disposables", unit: "box", unitCost: 7.50, onHand: 14, par: 10, inEvents: 0 },
];

const categories: (Category | "All")[] = ["All", "Liquor", "Wine", "Beer", "Produce", "Disposables"];

/** ===== Component ===== */
export default function InventoryScreen() {
  const nav = useNavigation();
  useLayoutEffect(() => {
    nav.setOptions?.({
      title: "Inventory",
      headerTitleAlign: "center",
      headerStyle: { backgroundColor: "#1E3A8A" },
      headerTintColor: "#FFFFFF",
      headerTitleStyle: { fontWeight: "bold", fontSize: 20 }
    } as any);
  }, [nav]);

  const [items, setItems] = useState<InventoryItem[]>(initialItems);
  const [activeCategory, setActiveCategory] = useState<(Category | "All")>("All");
  const [query, setQuery] = useState("");

  // overlays / modals
  const [manageOpen, setManageOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [lockOpen, setLockOpen] = useState(false);
  const [modifyOpen, setModifyOpen] = useState(false); // Modify Inventory
  const [bulkOpen, setBulkOpen] = useState(false);     // Update Inventory (Bulk)
  const [parOpen, setParOpen] = useState(false);       // PAR & Baseline
  const [addOpen, setAddOpen] = useState(false);       // Add Products — Quick
  const [addFormOpen, setAddFormOpen] = useState(false); // Add Product (Quick) form

  // ===== NEW: Remove Products state =====
  const [removeOpen, setRemoveOpen] = useState(false);
  const [removeCategory, setRemoveCategory] = useState<(Category | "All")>("All");
  const [removeQuery, setRemoveQuery] = useState("");
  const [selectedRemoveIds, setSelectedRemoveIds] = useState<Set<string>>(new Set());
  const [removeAction, setRemoveAction] = useState<"archive" | "remove" | "delete" | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState("");

  // ===== Bottom sheets for Missing Items / Current Inventory =====
  const [missingOpen, setMissingOpen] = useState(false);
  const [missingEmail, setMissingEmail] = useState("");
  const [missingCc, setMissingCc] = useState(false);
  const [missingFormat, setMissingFormat] = useState<"PDF" | "XLSX">("PDF");

  const [currentOpen, setCurrentOpen] = useState(false);
  const [currentEmail, setCurrentEmail] = useState("");
  const [currentCc, setCurrentCc] = useState(false);
  const [currentFormat, setCurrentFormat] = useState<"PDF" | "XLSX">("PDF");

  // export form state (ya existente para “Export” general)
  const [email, setEmail] = useState("");
  const [ccMe, setCcMe] = useState(false);
  const [format, setFormat] = useState<"PDF" | "XLSX">("PDF");

  // lock state
  const [isLocked, setIsLocked] = useState(false);
  const [pin, setPin] = useState("");
  const [unlockPin, setUnlockPin] = useState("");
  const [persistedPin, setPersistedPin] = useState<string | null>(null);
  const [exportAfterLock, setExportAfterLock] = useState(true);

  // === soporte de teclado (bulk/add form/remove/missing/current) ===
  const [kbHeight, setKbHeight] = useState(0);
  useEffect(() => {
    const showEvt = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvt = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";
    const subShow = Keyboard.addListener(showEvt, (e) => setKbHeight(e.endCoordinates?.height ?? 0));
    const subHide = Keyboard.addListener(hideEvt, () => setKbHeight(0));
    return () => { subShow.remove(); subHide.remove(); };
  }, []);

  // derived
  const cohToday = useMemo(
    () => items.reduce((sum, it) => sum + it.onHand * it.unitCost, 0),
    [items]
  );
  const toOrderTotal = useMemo(
    () => items.reduce((sum, it) => sum + Math.max(it.par - it.onHand, 0), 0),
    [items]
  );
  const filtered = useMemo(() => {
    const base = activeCategory === "All" ? items : items.filter(i => i.category === activeCategory);
    const q = query.trim().toLowerCase();
    if (!q) return base;
    return base.filter(i => i.name.toLowerCase().includes(q));
  }, [items, activeCategory, query]);

  /** ===== UI helpers ===== */
  const Pill = ({ label, active, onPress }: { label: string; active?: boolean; onPress?: () => void }) => (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9} style={[styles.pill, active && styles.pillActive]}>
      <Text style={[styles.pillText, active && styles.pillTextActive]} numberOfLines={1}>{label}</Text>
    </TouchableOpacity>
  );

  const ItemCard = ({ item }: { item: InventoryItem }) => {
    const toOrder = Math.max(item.par - item.onHand, 0);
    return (
      <View style={styles.itemCard}>
        <View style={styles.itemHeader}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemMeta}>
            {item.category} • {item.unit} • ${item.unitCost.toFixed(2)}
          </Text>
        </View>
        <View style={styles.kvRow}>
          <View style={styles.kv}><Text style={styles.kvLabel}>On Hand</Text><Text style={styles.kvValue}>{item.onHand}</Text></View>
          <View style={styles.kv}><Text style={styles.kvLabel}>PAR</Text><Text style={styles.kvValue}>{item.par}</Text></View>
          <View style={styles.kv}>
            <Text style={styles.kvLabel}>To Order</Text>
            <View style={styles.toOrderPill}><Text style={styles.toOrderText}>{toOrder}</Text></View>
          </View>
          <View style={styles.kv}><Text style={styles.kvLabel}>In Events</Text><Text style={styles.kvValue}>{item.inEvents}</Text></View>
        </View>
      </View>
    );
  };

  /** ===== Actions ===== */
  const onSaveToday = () => {
    if (isLocked) { Alert.alert("Locked", "Today is locked. Unlock to edit."); return; }
    Alert.alert("Saved", "Saved today's COH snapshot.");
  };

  const onConfirmLock = () => {
    if (pin.length !== 4) { Alert.alert("PIN required", "Enter a 4-digit PIN."); return; }
    setPersistedPin(pin);
    setIsLocked(true);
    setLockOpen(false);
    setPin("");
    if (exportAfterLock) {
      Alert.alert("Locked", "Day locked. Snapshot exported.");
    } else {
      Alert.alert("Locked", "Day locked.");
    }
  };

  const onUnlock = () => {
    if (!persistedPin) { Alert.alert("No PIN set", "Nothing to unlock."); return; }
    if (unlockPin === persistedPin) {
      setIsLocked(false);
      setUnlockPin("");
      setLockOpen(false);
      Alert.alert("Unlocked", "Editing re-enabled.");
    } else {
      Alert.alert("Wrong PIN", "Please try again.");
    }
  };

  const onSendExport = () => {
    if (!email.trim()) { Alert.alert("Recipient required", "Enter an email address."); return; }
    setExportOpen(false);
    Alert.alert("Exported", `Inventory exported as ${format}${ccMe ? " (CC sent to you)" : ""}.`);
  };

  // ==== OPENERS que cierran Manage para evitar solapamiento y luego reabren Manage al cerrar ====
  const openMissingSheet = () => {
    setManageOpen(false);
    setTimeout(() => setMissingOpen(true), 0);
  };
  const openCurrentSheet = () => {
    setManageOpen(false);
    setTimeout(() => setCurrentOpen(true), 0);
  };

  const onSendMissing = () => {
    if (!missingEmail.trim()) { Alert.alert("Recipient required", "Enter an email address."); return; }
    setMissingOpen(false);
    setTimeout(() => {
      Alert.alert("Sent", `Missing Items sent as ${missingFormat}${missingCc ? " (CC to you)" : ""}.`);
      setManageOpen(true);
    }, 50);
  };

  const onSendCurrent = () => {
    if (!currentEmail.trim()) { Alert.alert("Recipient required", "Enter an email address."); return; }
    setCurrentOpen(false);
    setTimeout(() => {
      Alert.alert("Sent", `Current Inventory sent as ${currentFormat}${currentCc ? " (CC to you)" : ""}.`);
      setManageOpen(true);
    }, 50);
  };

  const openUnlockPrompt = () => {
    setUnlockPin("");
    setLockOpen(true);
  };

  /** ===== Modify Inventory (inline editor) ===== */
  type Draft = { onHand: string; unitCost: string };
  const [modifyCategory, setModifyCategory] = useState<(Category | "All")>("All");
  const [modifyQuery, setModifyQuery] = useState("");
  const [drafts, setDrafts] = useState<Record<string, Draft>>({});

  const modifyBase = useMemo(() => {
    const byCat =
      modifyCategory === "All" ? items : items.filter(i => i.category === modifyCategory);
    const q = modifyQuery.trim().toLowerCase();
    return q ? byCat.filter(i => i.name.toLowerCase().includes(q)) : byCat;
  }, [items, modifyCategory, modifyQuery]);

  const getDraft = (it: InventoryItem): Draft => {
    return drafts[it.id] ?? {
      onHand: String(it.onHand),
      unitCost: it.unitCost.toFixed(2),
    };
  };

  const updateDraft = (id: string, patch: Partial<Draft>) => {
    setDrafts((d) => ({ ...d, [id]: { ...(d[id] ?? { onHand: "", unitCost: "" }), ...patch } }));
  };

  const parseNum = (s: string) => {
    const n = parseFloat(s);
    return Number.isFinite(n) ? n : 0;
  };

  const applyRow = (it: InventoryItem) => {
    if (isLocked) return;
    const d = getDraft(it);
    const next = items.map(x =>
      x.id === it.id
        ? { ...x, onHand: Math.max(0, Math.floor(parseNum(d.onHand))), unitCost: Math.max(0, parseFloat(Number(parseNum(d.unitCost)).toFixed(2))) }
        : x
    );
    setItems(next);
    Alert.alert("Saved", `${it.name} updated.`);
  };

  const applyAll = () => {
    if (isLocked) return;
    const next = items.map(x => {
      const d = drafts[x.id];
      if (!d) return x;
      return {
        ...x,
        onHand: Math.max(0, Math.floor(parseNum(d.onHand))),
        unitCost: Math.max(0, parseFloat(Number(parseNum(d.unitCost)).toFixed(2))),
      };
    });
    setItems(next);
    Alert.alert("Saved", "All visible rows updated.");
  };

  const openModify = () => {
    const seed: Record<string, Draft> = {};
    for (const it of items) {
      seed[it.id] = { onHand: String(it.onHand), unitCost: it.unitCost.toFixed(2) };
    }
    setDrafts(seed);
    setModifyCategory("All");
    setModifyQuery("");
    setManageOpen(false);
    setModifyOpen(true);
  };

  /** ===== Update Inventory (Bulk) ===== */
  const [bulkCategory, setBulkCategory] = useState<(Category | "All")>("All");
  const [bulkQuery, setBulkQuery] = useState("");
  const [bulkDrafts, setBulkDrafts] = useState<Record<string, string>>({});
  const [bulkEmails, setBulkEmails] = useState("bar.manager@sandestin.com, beverage@resort.com");
  const [rememberEmails, setRememberEmails] = useState(false);

  const bulkBase = useMemo(() => {
    const byCat = bulkCategory === "All" ? items : items.filter(i => i.category === bulkCategory);
    const q = bulkQuery.trim().toLowerCase();
    return q ? byCat.filter(i => i.name.toLowerCase().includes(q)) : byCat;
  }, [items, bulkCategory, bulkQuery]);

  const getBulk = (it: InventoryItem) => bulkDrafts[it.id] ?? String(it.onHand);
  const setBulk = (id: string, v: string) =>
    setBulkDrafts((d) => ({ ...d, [id]: v.replace(/[^0-9]/g, "") }));

  const changes = useMemo(() => {
    let count = 0;
    let needsReview = 0;
    for (const it of items) {
      const raw = bulkDrafts[it.id];
      if (raw == null) continue;
      const n = parseInt(raw, 10);
      if (!Number.isFinite(n) || n === it.onHand) continue;
      count++;
      if (Math.abs(n - it.onHand) >= 25) needsReview++;
    }
    return { count, needsReview };
  }, [bulkDrafts, items]);

  const clearBulk = () => setBulkDrafts({});
  const applyBulk = () => {
    if (isLocked) { Alert.alert("Locked", "Unlock the day to apply."); return; }
    const next = items.map((it) => {
      const raw = bulkDrafts[it.id];
      if (raw == null) return it;
      const n = parseInt(raw, 10);
      if (!Number.isFinite(n)) return it;
      return { ...it, onHand: Math.max(0, n) };
    });
    setItems(next);

    Keyboard.dismiss();
    setKbHeight(0);
    setBulkOpen(false);

    setTimeout(() => {
      Alert.alert("Applied", "Bulk counts updated.");
    }, 50);
  };

  const openBulk = () => {
    const seed: Record<string, string> = {};
    for (const it of items) seed[it.id] = String(it.onHand);
    setBulkDrafts(seed);
    setBulkCategory("All");
    setBulkQuery("");
    setManageOpen(false);
    setBulkOpen(true);
  };

  /** ===== PAR & Baseline ===== */
  type ParDraft = { par: string; unitCost: string };
  const [parCategory, setParCategory] = useState<(Category | "All")>("All");
  const [parQuery, setParQuery] = useState("");
  const [parDrafts, setParDrafts] = useState<Record<string, ParDraft>>({});

  const parBase = useMemo(() => {
    const byCat = parCategory === "All" ? items : items.filter(i => i.category === parCategory);
    const q = parQuery.trim().toLowerCase();
    return q ? byCat.filter(i => i.name.toLowerCase().includes(q)) : byCat;
  }, [items, parCategory, parQuery]);

  const getParDraft = (it: InventoryItem): ParDraft => {
    return parDrafts[it.id] ?? {
      par: String(it.par),
      unitCost: it.unitCost.toFixed(2),
    };
  };

  const updateParDraft = (id: string, patch: Partial<ParDraft>) => {
    setParDrafts((d) => ({ ...d, [id]: { ...(d[id] ?? { par: "", unitCost: "" }), ...patch } }));
  };

  const applyParRow = (it: InventoryItem) => {
    if (isLocked) return;
    const d = getParDraft(it);
    const next = items.map(x =>
      x.id === it.id
        ? {
            ...x,
            par: Math.max(0, Math.floor(parseNum(d.par))),
            unitCost: Math.max(0, parseFloat(Number(parseNum(d.unitCost)).toFixed(2))),
          }
        : x
    );
    setItems(next);
    Alert.alert("Saved", `${it.name} baseline updated.`);
  };

  const applyParAll = () => {
    if (isLocked) return;
    const next = items.map(x => {
      const d = parDrafts[x.id];
      if (!d) return x;
      return {
        ...x,
        par: Math.max(0, Math.floor(parseNum(d.par))),
        unitCost: Math.max(0, parseFloat(Number(parseNum(d.unitCost)).toFixed(2))),
      };
    });
    setItems(next);
    setParOpen(false);
    Alert.alert("Saved", "PAR & Unit Cost updated for visible items.");
  };

  const openParBaseline = () => {
    const seed: Record<string, ParDraft> = {};
    for (const it of items) {
      seed[it.id] = { par: String(it.par), unitCost: it.unitCost.toFixed(2) };
    }
    setParDrafts(seed);
    setParCategory("All");
    setParQuery("");
    setManageOpen(false);
    setParOpen(true);
  };

  /** ===== Add Products — Quick ===== */
  type AddForm = { unitCost: string; initialOnHand: string; initialPar: string; packSize: string };
  type CatalogItem = { id: string; name: string; category: Category; unit: string; baseCost: number };

  const catalog: CatalogItem[] = [
    { id: "c1", name: "Tito's 1.75L", category: "Liquor", unit: "1.75L", baseCost: 28.0 },
    { id: "c2", name: "Jameson 1L", category: "Liquor", unit: "1L", baseCost: 22.0 },
    { id: "c3", name: "Hendrick's 1L", category: "Liquor", unit: "1L", baseCost: 31.0 },
    { id: "c4", name: "Don Julio Blanco 750ml", category: "Liquor", unit: "750ml", baseCost: 39.0 },
    { id: "c5", name: "Dom Pérignon 750ml", category: "Wine", unit: "750ml", baseCost: 210.0 },
    { id: "c6", name: "Michelob Ultra 12oz (24pk)", category: "Beer", unit: "24pk", baseCost: 2.0 },
    { id: "c7", name: "Lime (lb)", category: "Produce", unit: "lb", baseCost: 1.1 },
    { id: "c8", name: "Cocktail Napkins (box)", category: "Disposables", unit: "box", baseCost: 7.5 },
  ];

  // catálogo extra creado desde el formulario “Add Product (Quick)”
  const [catalogExtra, setCatalogExtra] = useState<CatalogItem[]>([]);
  const catalogAll = useMemo(() => [...catalog, ...catalogExtra], [catalog, catalogExtra]);

  const [addCategory, setAddCategory] = useState<(Category | "All")>("Liquor");
  const [addQuery, setAddQuery] = useState("");
  const [selectedAddIds, setSelectedAddIds] = useState<Set<string>>(new Set());
  const [addForms, setAddForms] = useState<Record<string, AddForm>>({});

  const addFiltered = useMemo(() => {
    const base = addCategory === "All" ? catalogAll : catalogAll.filter(c => c.category === addCategory);
    const q = addQuery.trim().toLowerCase();
    return q ? base.filter(c => c.name.toLowerCase().includes(q)) : base;
  }, [catalogAll, addCategory, addQuery]);

  const getFromCatalog = (id: string) => catalogAll.find(c => c.id === id)!;

  const toggleSelectAdd = (id: string) => {
    setSelectedAddIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    setAddForms(f => {
      if (f[id]) return f;
      const cat = getFromCatalog(id);
      return { ...f, [id]: { unitCost: String(cat.baseCost.toFixed(2)), initialOnHand: "", initialPar: "", packSize: "" } };
    });
  };

  const updateAddForm = (id: string, patch: Partial<AddForm>) => {
    setAddForms(f => ({ ...f, [id]: { ...(f[id] ?? { unitCost: "", initialOnHand: "", initialPar: "", packSize: "" }), ...patch } }));
  };

  // abrir form cerrando Quick para evitar superposición de modales
  const handleOpenAddForm = () => {
    setAddOpen(false);
    setTimeout(() => {
      setFormName("");
      setFormUnit("");
      setFormPack("");
      setFormCategory("Liquor");
      setFormCost("");
      setFormOnHand("");
      setAddFormOpen(true);
    }, 0);
  };

  const onSaveAddProducts = () => {
    if (isLocked) { Alert.alert("Locked", "Unlock the day to add products."); return; }
    if (selectedAddIds.size === 0) { setAddOpen(false); return; }

    const selected = catalogAll.filter(c => selectedAddIds.has(c.id));
    let next = [...items];

    for (const c of selected) {
      const form = addForms[c.id] ?? { unitCost: String(c.baseCost), initialOnHand: "0", initialPar: "0", packSize: "" };
      const unitCost = Math.max(0, parseFloat(form.unitCost || String(c.baseCost))) || 0;
      const onHand = Math.max(0, Math.floor(parseFloat(form.initialOnHand || "0"))) || 0;
      const par = Math.max(0, Math.floor(parseFloat(form.initialPar || "0"))) || 0;

      const existsIdx = next.findIndex(x => x.name === c.name);
      if (existsIdx >= 0) {
        next[existsIdx] = { ...next[existsIdx], unitCost, par, onHand };
      } else {
        next.push({
          id: `n${Date.now()}_${c.id}`,
          name: c.name,
          category: c.category,
          unit: c.unit,
          unitCost,
          onHand,
          par,
          inEvents: 0,
        });
      }
    }

    setItems(next);

    setAddOpen(false);
    Keyboard.dismiss();

    setTimeout(() => {
      Alert.alert("Saved", "Products added/updated.");
    }, 50);

    setSelectedAddIds(new Set());
    setAddForms({});
  };

  const openAddProducts = () => {
    setAddCategory("Liquor");
    setAddQuery("");
    setSelectedAddIds(new Set());
    setAddForms({});
    setManageOpen(false);
    setAddOpen(true);
  };

  /** ===== Add Product (Quick) — Form modal ===== */
  const [formName, setFormName] = useState("");
  const [formUnit, setFormUnit] = useState("");
  const [formPack, setFormPack] = useState("");
  const [formCategory, setFormCategory] = useState<Category>("Liquor");
  const [formCost, setFormCost] = useState("");
  const [formOnHand, setFormOnHand] = useState("");

  const onSaveAddProductForm = () => {
    if (!formName.trim()) { Alert.alert("Name required", "Please enter a product name."); return; }
    const baseCost = Math.max(0, parseFloat(formCost || "0")) || 0;

    const newItem: CatalogItem = {
      id: `cx_${Date.now()}`,
      name: formName.trim(),
      category: formCategory,
      unit: (formUnit || "").trim() || "unit",
      baseCost,
    };

    // agregar al catálogo, preseleccionado
    setCatalogExtra(prev => [newItem, ...prev]);
    setSelectedAddIds(prev => new Set(prev).add(newItem.id));
    setAddForms(f => ({
      ...f,
      [newItem.id]: {
        unitCost: baseCost ? String(baseCost.toFixed(2)) : "",
        initialOnHand: formOnHand.replace(/[^0-9]/g, ""),
        initialPar: "",
        packSize: formPack,
      }
    }));

    // cerrar formulario y reabrir Quick
    setAddFormOpen(false);
    setTimeout(() => setAddOpen(true), 0);
  };

  /** ===== Remove Products — logic ===== */
  const removeFiltered = useMemo(() => {
    const base = removeCategory === "All" ? items : items.filter(i => i.category === removeCategory);
    const q = removeQuery.trim().toLowerCase();
    if (!q) return base;
    return base.filter(i => i.name.toLowerCase().includes(q));
  }, [items, removeCategory, removeQuery]);

  const isLinkedToEvent = (it: InventoryItem) => it.inEvents > 0;

  const toggleRemoveSelect = (id: string) => {
    setSelectedRemoveIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const openRemove = () => {
    setRemoveCategory("All");
    setRemoveQuery("");
    setSelectedRemoveIds(new Set());
    setRemoveAction(null);
    setDeleteConfirm("");
    setManageOpen(false);
    setRemoveOpen(true);
  };

  const onApplyRemove = () => {
    if (!removeAction) {
      Alert.alert("Select action", "Choose Archive, Remove from Inventory, or Delete.");
      return;
    }
    if (selectedRemoveIds.size === 0) {
      setRemoveOpen(false);
      return;
    }
    if (removeAction === "delete") {
      const anyLinked = items.some(i => selectedRemoveIds.has(i.id) && isLinkedToEvent(i));
      if (anyLinked) {
        Alert.alert("Not allowed", "Some selected items are linked to active events.");
        return;
      }
      if (deleteConfirm.trim().toUpperCase() !== "DELETE") {
        Alert.alert("Type DELETE", "Please type DELETE to confirm.");
        return;
      }
    }

    if (removeAction === "archive") {
      Alert.alert("Archived", `${selectedRemoveIds.size} item(s) archived (kept for history).`);
      setRemoveOpen(false);
      setTimeout(() => setManageOpen(true), 0);
      return;
    }

    if (removeAction === "remove") {
      const next = items.map(it => selectedRemoveIds.has(it.id) ? { ...it, onHand: 0 } : it);
      setItems(next);
      setRemoveOpen(false);
      setTimeout(() => { Alert.alert("Removed from Inventory", "On Hand set to 0 for selected items."); setManageOpen(true); }, 50);
      return;
    }

    if (removeAction === "delete") {
      const next = items.filter(it => !selectedRemoveIds.has(it.id));
      setItems(next);
      setRemoveOpen(false);
      setTimeout(() => { Alert.alert("Deleted", "Selected items permanently deleted."); setManageOpen(true); }, 50);
    }
  };

  /** ===== Render ===== */
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1E3A8A" />

      {/* Title row */}
      <View style={styles.topRow}>
        <Text style={styles.screenTitle}>Inventory</Text>
        <View style={styles.headerRight}>
          <Text style={styles.cohLabel}>COH Today</Text>
          <Text style={styles.cohValue}>${cohToday.toLocaleString(undefined, { maximumFractionDigits: 0 })}</Text>
        </View>
      </View>

      {/* Filters */}
      <View style={styles.filtersRow}>
        <Pill label="Manage / Update" active onPress={() => setManageOpen(true)} />
        <FlatList
          data={categories}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(c) => String(c)}
          contentContainerStyle={{ paddingLeft: 10 }}
          renderItem={({ item: cat }) => (
            <Pill
              label={String(cat)}
              active={activeCategory === cat}
              onPress={() => setActiveCategory(cat)}
            />
          )}
        />
      </View>

      {/* Search */}
      <TextInput
        style={styles.search}
        placeholder="Search item / SKU..."
        placeholderTextColor="#8BA0B6"
        value={query}
        onChangeText={setQuery}
      />

      {/* List */}
      <FlatList
        data={filtered}
        keyExtractor={(it) => it.id}
        renderItem={({ item }) => <ItemCard item={item} />}
        contentContainerStyle={{ paddingBottom: 120 }}
      />

      {/* Footer actions */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          COH Total <Text style={styles.footerStrong}>${cohToday.toLocaleString(undefined, { maximumFractionDigits: 0 })}</Text>
          {"   "}•   To Order <Text style={styles.footerStrong}>{toOrderTotal}</Text>
        </Text>

        <View style={styles.footerBtns}>
          <TouchableOpacity style={[styles.footerBtn, styles.blueBtn]} onPress={() => setExportOpen(true)}>
            <Text style={styles.footerBtnText} numberOfLines={1}>Export</Text>
          </TouchableOpacity>

          {!isLocked ? (
            <>
              <TouchableOpacity style={[styles.footerBtn, styles.secondaryBtn]} onPress={onSaveToday}>
                <Text style={styles.footerBtnText} numberOfLines={1}>Save Today</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.footerBtn, styles.greenBtn]} onPress={() => setLockOpen(true)}>
                <Text style={styles.footerBtnText} numberOfLines={1}>Save & Lock</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity style={[styles.footerBtn, styles.secondaryBtn, styles.disabledBtn]} disabled>
                <Text style={styles.footerBtnText} numberOfLines={1}>Save Today</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.footerBtn, styles.orangeBtn]} onPress={() => {
                setUnlockPin("");
                setLockOpen(true);
              }}>
                <Text style={styles.footerBtnText} numberOfLines={1}>Unlock</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>

      {/* ===== Manage / Update sheet ===== */}
      <Modal visible={manageOpen} animationType="slide" transparent>
        <View style={styles.modalBackdrop}>
          <View style={styles.sheet}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Manage / Update Inventory</Text>
              <TouchableOpacity onPress={() => setManageOpen(false)}><Text style={styles.closeX}>✕</Text></TouchableOpacity>
            </View>

            {/* Modify Inventory */}
            <View style={styles.sheetRow}>
              <View style={styles.sheetTexts}>
                <Text style={styles.sheetItemTitle}>Modify Inventory</Text>
                <Text style={styles.sheetItemSub}>Edit today's On Hand & Unit Cost of existing items.</Text>
              </View>
              <TouchableOpacity style={styles.rowBtn} onPress={openModify}>
                <Text style={styles.rowBtnText}>Open</Text>
              </TouchableOpacity>
            </View>

            {/* Update Inventory (Bulk) */}
            <View style={styles.sheetRow}>
              <View style={styles.sheetTexts}>
                <Text style={styles.sheetItemTitle}>Update Inventory (Bulk)</Text>
                <Text style={styles.sheetItemSub}>Fast multi-item count or CSV import to refresh quantities.</Text>
              </View>
              <TouchableOpacity style={styles.rowBtn} onPress={openBulk}>
                <Text style={styles.rowBtnText}>Open</Text>
              </TouchableOpacity>
            </View>

            {/* PAR & Baseline */}
            <View style={styles.sheetRow}>
              <View style={styles.sheetTexts}>
                <Text style={styles.sheetItemTitle}>PAR & Baseline</Text>
                <Text style={styles.sheetItemSub}>Update PAR (reorder baseline) and Unit Cost across all items.</Text>
              </View>
              <TouchableOpacity style={styles.rowBtn} onPress={openParBaseline}>
                <Text style={styles.rowBtnText}>Open</Text>
              </TouchableOpacity>
            </View>

            {/* Add / Remove */}
            <View style={styles.sheetRow}>
              <View style={styles.sheetTexts}>
                <Text style={styles.sheetItemTitle}>Add Products</Text>
                <Text style={styles.sheetItemSub}>Create new items in Liquor/Wine/Beer/Produce/Disposables.</Text>
              </View>
              <TouchableOpacity style={styles.rowBtn} onPress={openAddProducts}>
                <Text style={styles.rowBtnText}>Add</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.sheetRow}>
              <View style={styles.sheetTexts}>
                <Text style={styles.sheetItemTitle}>Remove Products</Text>
                <Text style={styles.sheetItemSub}>Archive, remove from inventory, or delete (with safeguards).</Text>
              </View>
              <TouchableOpacity style={styles.rowBtn} onPress={openRemove}>
                <Text style={styles.rowBtnText}>Remove</Text>
              </TouchableOpacity>
            </View>

            {/* Downloads */}
            <View style={styles.sheetRow}>
              <View style={styles.sheetTexts}>
                <Text style={styles.sheetItemTitle}>Download: Missing Items (PDF)</Text>
                <Text style={styles.sheetItemSub}>Auto-generated restock list (To Order) for today.</Text>
              </View>
              <TouchableOpacity style={styles.rowBtn} onPress={openMissingSheet}>
                <Text style={styles.rowBtnText}>Send</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.sheetRow}>
              <View style={styles.sheetTexts}>
                <Text style={styles.sheetItemTitle}>Download: Current Inventory (CSV/PDF)</Text>
                <Text style={styles.sheetItemSub}>Snapshot of bottles/units on hand and in events.</Text>
              </View>
              <TouchableOpacity style={styles.rowBtn} onPress={openCurrentSheet}>
                <Text style={styles.rowBtnText}>Send</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ===== Export overlay (general) ===== */}
      <Modal visible={exportOpen} animationType="fade" transparent>
        <View style={styles.modalBackdrop}>
          <View style={styles.dialog}>
            <Text style={styles.dialogTitle}>Send Inventory Export</Text>

            <Text style={styles.inputLabel}>Recipient email</Text>
            <TextInput
              style={styles.input}
              placeholder="name@example.com"
              placeholderTextColor="#8BA0B6"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />

            <View style={styles.rowBetween}>
              <Text style={styles.inputLabel}>Format</Text>
              <View style={{ flexDirection: "row" }}>
                <TouchableOpacity
                  style={[styles.toggleChip, format === "PDF" && styles.toggleChipActive, { marginRight: 10 }]}
                  onPress={() => setFormat("PDF")}
                >
                  <Text style={[styles.toggleChipText, format === "PDF" && styles.toggleChipTextActive]}>PDF</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.toggleChip, format === "XLSX" && styles.toggleChipActive]}
                  onPress={() => setFormat("XLSX")}
                >
                  <Text style={[styles.toggleChipText, format === "XLSX" && styles.toggleChipTextActive]}>Excel (.xlsx)</Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              onPress={() => setCcMe(v => !v)}
              style={styles.checkboxRow}
              activeOpacity={0.8}
            >
              <View style={[styles.checkboxBox, ccMe && styles.checkboxBoxChecked]}>
                {ccMe ? <Text style={styles.checkboxTick}>✓</Text> : null}
              </View>
              <Text style={styles.checkboxText}>Send me a copy (CC)</Text>
            </TouchableOpacity>

            <View style={{ flexDirection: "row", marginTop: 14 }}>
              <TouchableOpacity style={[styles.dialogBtn, styles.secondaryBtn, { marginRight: 10 }]} onPress={() => setExportOpen(false)}>
                <Text style={styles.dialogBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.dialogBtn, styles.blueBtn]} onPress={onSendExport}>
                <Text style={styles.dialogBtnText}>Send</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ===== Save & Lock + Unlock (PIN) ===== */}
      <Modal visible={lockOpen} animationType="fade" transparent>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalBackdrop}>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={{ width: "100%" }}
            >
              <View style={styles.dialog}>
                <Text style={styles.dialogTitle}>Close Day — Save & Lock</Text>
                <Text style={styles.lockLine}>
                  Totals: COH ${cohToday.toLocaleString(undefined, { maximumFractionDigits: 0 })} • To Order {toOrderTotal}
                </Text>

                <Text style={styles.inputLabel}>Enter 4-digit PIN</Text>
                <TextInput
                  style={styles.input}
                  placeholder="••••"
                  placeholderTextColor="#8BA0B6"
                  value={pin}
                  onChangeText={(t) => setPin(t.replace(/[^0-9]/g, "").slice(0, 4))}
                  keyboardType="number-pad"
                  secureTextEntry
                  returnKeyType="done"
                  onSubmitEditing={onConfirmLock}
                />

                <TouchableOpacity
                  onPress={() => setExportAfterLock(v => !v)}
                  style={styles.checkboxRow}
                  activeOpacity={0.8}
                >
                  <View style={[styles.checkboxBox, exportAfterLock && styles.checkboxBoxChecked]}>
                    {exportAfterLock ? <Text style={styles.checkboxTick}>✓</Text> : null}
                  </View>
                  <Text style={styles.checkboxText}>Export snapshot after locking</Text>
                </TouchableOpacity>

                <View style={{ flexDirection: "row", marginTop: 14 }}>
                  <TouchableOpacity style={[styles.dialogBtn, styles.secondaryBtn, { marginRight: 10 }]} onPress={() => setLockOpen(false)}>
                    <Text style={styles.dialogBtnText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.dialogBtn, styles.greenBtn]} onPress={onConfirmLock}>
                    <Text style={styles.dialogBtnText}>Confirm & Lock</Text>
                  </TouchableOpacity>
                </View>

                {isLocked ? (
                  <>
                    <View style={{ height: 14 }} />
                    <Text style={styles.inputLabel}>Unlock with PIN</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="••••"
                      placeholderTextColor="#8BA0B6"
                      value={unlockPin}
                      onChangeText={(t) => setUnlockPin(t.replace(/[^0-9]/g, "").slice(0, 4))}
                      keyboardType="number-pad"
                      secureTextEntry
                      returnKeyType="done"
                      onSubmitEditing={onUnlock}
                    />
                    <TouchableOpacity style={[styles.dialogBtn, styles.orangeBtn, { marginTop: 10 }]} onPress={onUnlock}>
                      <Text style={styles.dialogBtnText}>Unlock</Text>
                    </TouchableOpacity>
                  </>
                ) : null}
              </View>
            </KeyboardAvoidingView>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* ===== Modify Inventory modal ===== */}
      <Modal visible={modifyOpen} animationType="slide" transparent>
        <View style={styles.modalBackdrop}>
          <View style={styles.modifySheet}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <View>
                <Text style={{ color: "#fff", fontSize: 26, fontWeight: "800" }}>Modify Inventory</Text>
                <Text style={{ color: "#9CB3CC", marginTop: 2 }}>Edit On Hand & Cost • Today {isLocked ? "(Locked — read only)" : "(Open)"} </Text>
              </View>
              <TouchableOpacity onPress={() => setModifyOpen(false)}><Text style={styles.closeX}>✕</Text></TouchableOpacity>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 6, paddingLeft: 4, paddingRight: 4 }}>
              {categories.map(cat => (
                <TouchableOpacity
                  key={String(cat)}
                  style={[styles.catChip, modifyCategory === cat && styles.catChipActive, { marginRight: 8 }]}
                  onPress={() => setModifyCategory(cat)}
                >
                  <Text style={[styles.catChipText, modifyCategory === cat && styles.catChipTextActive]}>{cat}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TextInput
              style={[styles.search, { marginTop: 4, marginBottom: 10 }]}
              placeholder="Search item / SKU..."
              placeholderTextColor="#8BA0B6"
              value={modifyQuery}
              onChangeText={setModifyQuery}
              editable={!isLocked}
            />

            <View style={styles.tableHeader}>
              <Text style={[styles.th, { flex: 2.4 }]}>Item</Text>
              <Text style={[styles.th, { flex: 1.3 }]}>Category</Text>
              <Text style={[styles.th, { flex: 0.9, textAlign: "center" }]}>On Hand</Text>
              <Text style={[styles.th, { flex: 1.1, textAlign: "center" }]}>Unit Cost ($)</Text>
              <Text style={[styles.th, { flex: 1.0, textAlign: "center" }]}>COH ($)</Text>
              <Text style={[styles.th, { width: 74, textAlign: "center" }]}>Action</Text>
            </View>

            <ScrollView style={{ maxHeight: "66%" }} keyboardShouldPersistTaps="handled">
              {modifyBase.map((it, idx) => {
                const d = getDraft(it);
                const coh = (parseNum(d.onHand) * parseNum(d.unitCost)) || 0;
                return (
                  <View key={it.id} style={[styles.tr, idx % 2 === 1 && styles.trAlt]}>
                    <Text style={[styles.tdText, { flex: 2.4 }]} numberOfLines={2}>{it.name}</Text>
                    <Text style={[styles.tdBadge, { flex: 1.3 }]}>{it.category}</Text>

                    <TextInput
                      style={[styles.tdInput, { flex: 0.9, textAlign: "center" }]}
                      value={d.onHand}
                      onChangeText={(t) => updateDraft(it.id, { onHand: t.replace(/[^0-9]/g, "") })}
                      keyboardType="number-pad"
                      editable={!isLocked}
                    />

                    <TextInput
                      style={[styles.tdInput, { flex: 1.1, textAlign: "center" }]}
                      value={d.unitCost}
                      onChangeText={(t) => updateDraft(it.id, { unitCost: t.replace(/[^0-9.]/g, "") })}
                      keyboardType="decimal-pad"
                      editable={!isLocked}
                    />

                    <Text style={[styles.tdText, { flex: 1.0, textAlign: "center", fontWeight: "700" }]}>
                      {coh.toFixed(2)}
                    </Text>

                    <TouchableOpacity
                      style={[styles.rowSaveBtn, isLocked && styles.btnDisabled]}
                      onPress={() => applyRow(it)}
                      disabled={isLocked}
                    >
                      <Text style={styles.rowSaveText}>Save</Text>
                    </TouchableOpacity>
                  </View>
                );
              })}
              <View style={{ height: 16 }} />
            </ScrollView>

            <View style={styles.modifyFooter}>
              <Text style={{ color: "#9CB3CC", flex: 1 }}>
                Changes affect today's COH. {isLocked ? "Locked days disable editing (Admin unlock required)." : "Locked days disable editing (Admin unlock)."}
              </Text>
              <View style={{ flexDirection: "row" }}>
                <TouchableOpacity
                  style={[styles.footerBtn, styles.blueBtn, isLocked && styles.btnDisabled, { marginRight: 10 }]}
                  onPress={applyAll}
                  disabled={isLocked}
                >
                  <Text style={styles.footerBtnText}>Save All</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.footerBtn, styles.greenBtn]}
                  onPress={() => setModifyOpen(false)}
                >
                  <Text style={styles.footerBtnText}>Done</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* ===== Update Inventory (Bulk) modal ===== */}
      <Modal visible={bulkOpen} animationType="slide" transparent>
        <View style={styles.modalBackdrop}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ width: "100%" }}
            keyboardVerticalOffset={Platform.OS === "ios" ? 12 : 0}
          >
            <ScrollView
              style={styles.modifySheet}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ paddingBottom: 24 + kbHeight }}
            >
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <View>
                  <Text style={{ color: "#fff", fontSize: 26, fontWeight: "800" }}>Update Inventory (Bulk)</Text>
                  <Text style={{ color: "#9CB3CC", marginTop: 2 }}>Fast multi-item count • CSV import • Today {isLocked ? "(Locked — read only)" : "(Open)"} </Text>
                </View>
                <TouchableOpacity onPress={() => { setKbHeight(0); setBulkOpen(false); }}>
                  <Text style={styles.closeX}>✕</Text>
                </TouchableOpacity>
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingVertical: 4, paddingLeft: 4, paddingRight: 4 }}
              >
                {categories.map(cat => (
                  <TouchableOpacity
                    key={String(cat)}
                    style={[styles.catChip, bulkCategory === cat && styles.catChipActive, { marginRight: 8 }]}
                    onPress={() => setBulkCategory(cat)}
                  >
                    <Text style={[styles.catChipText, bulkCategory === cat && styles.catChipTextActive]}>{cat}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <TextInput
                style={[styles.search, { marginTop: 4, marginBottom: 8 }]}
                placeholder="Search items..."
                placeholderTextColor="#8BA0B6"
                value={bulkQuery}
                onChangeText={setBulkQuery}
                editable={!isLocked}
              />

              <View style={styles.tableHeader}>
                <Text style={[styles.th, { flex: 2.4 }]}>Item</Text>
                <Text style={[styles.th, { flex: 1.3 }]}>Category</Text>
                <Text style={[styles.th, { flex: 1.0, textAlign: "center" }]}>Current On Hand</Text>
                <Text style={[styles.th, { flex: 0.9, textAlign: "center" }]}>New Count</Text>
              </View>

              <ScrollView style={{ maxHeight: "48%" }} keyboardShouldPersistTaps="handled">
                {bulkBase.map((it, idx) => (
                  <View key={it.id} style={[styles.tr, idx % 2 === 1 && styles.trAlt]}>
                    <Text style={[styles.tdText, { flex: 2.4 }]} numberOfLines={2}>{it.name}</Text>
                    <Text style={[styles.tdBadge, { flex: 1.3 }]}>{it.category}</Text>
                    <Text style={[styles.tdText, { flex: 1.0, textAlign: "center" }]}>{it.onHand}</Text>
                    <TextInput
                      style={[styles.tdInput, { flex: 0.9, textAlign: "center", borderColor: "#f59e0b" }]}
                      value={getBulk(it)}
                      onChangeText={(t) => setBulk(it.id, t)}
                      keyboardType="number-pad"
                      editable={!isLocked}
                    />
                  </View>
                ))}
                <View style={{ height: 10 }} />
              </ScrollView>

              <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "#0F1A2B", borderRadius: 12, padding: 12, borderWidth: 1, borderColor: "#243447", marginTop: 6 }}>
                <Text style={{ color: "#9CB3CC", flex: 1 }}>
                  Changes pending: {changes.count} items • {changes.needsReview} needs review (large delta)
                </Text>
                <TouchableOpacity style={[styles.toggleChip, { marginRight: 10 }]} onPress={clearBulk}>
                  <Text style={styles.toggleChipText}>Clear All</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.toggleChip, styles.toggleChipActive]} onPress={() => Alert.alert("Review", "Show review dialog (stub)")}>
                  <Text style={[styles.toggleChipText, styles.toggleChipTextActive]}>Review Changes</Text>
                </TouchableOpacity>
              </View>

              <View style={{ backgroundColor: "#0F1A2B", borderRadius: 12, padding: 12, borderWidth: 1, borderColor: "#243447", marginTop: 12 }}>
                <Text style={{ color: "#fff", fontWeight: "800", fontSize: 16, marginBottom: 8 }}>Export / Share</Text>
                <Text style={styles.inputLabel}>Send a copy to:</Text>
                <TextInput
                  style={[styles.input, { marginBottom: 10 }]}
                  placeholder="emails, comma-separated"
                  placeholderTextColor="#8BA0B6"
                  value={bulkEmails}
                  onChangeText={setBulkEmails}
                  autoCapitalize="none"
                />

                <View style={{ flexDirection: "row", marginBottom: 8 }}>
                  <TouchableOpacity style={[styles.toggleChip, { marginRight: 10 }]} onPress={() => Alert.alert("Export", "Download CSV (stub)")}>
                    <Text style={styles.toggleChipText}>Download CSV</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.toggleChip, { marginRight: 10 }]} onPress={() => Alert.alert("Export", "Download PDF (stub)")}>
                    <Text style={styles.toggleChipText}>Download PDF</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.toggleChip, styles.toggleChipActive]} onPress={() => Alert.alert("Email", `Sent to: ${bulkEmails}`)}>
                    <Text style={[styles.toggleChipText, styles.toggleChipTextActive]}>Email</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity onPress={() => setRememberEmails(v => !v)} style={styles.checkboxRow}>
                  <View style={[styles.checkboxBox, rememberEmails && styles.checkboxBoxChecked]}>
                    {rememberEmails ? <Text style={styles.checkboxTick}>✓</Text> : null}
                  </View>
                  <Text style={styles.checkboxText}>Remember emails</Text>
                </TouchableOpacity>

                <Text style={{ color: "#9CB3CC", marginTop: 10 }}>
                  Tip: Export includes before/after, delta, timestamp and user.
                </Text>
              </View>

              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-end", marginTop: 12 }}>
                <TouchableOpacity style={[styles.footerBtn, styles.secondaryBtn, { marginRight: 10 }]} onPress={() => { setKbHeight(0); setBulkOpen(false); }}>
                  <Text style={styles.footerBtnText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.footerBtn, styles.greenBtn]} onPress={applyBulk} disabled={isLocked}>
                  <Text style={styles.footerBtnText}>Apply All</Text>
                </TouchableOpacity>
              </View>

              <View style={{ height: kbHeight }} />
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </Modal>

      {/* ===== PAR & Baseline modal ===== */}
      <Modal visible={parOpen} animationType="slide" transparent>
        <View style={styles.modalBackdrop}>
          <View style={styles.modifySheet}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <View>
                <Text style={{ color: "#fff", fontSize: 26, fontWeight: "800" }}>PAR & Baseline</Text>
                <Text style={{ color: "#9CB3CC", marginTop: 2 }}>
                  Update PAR & Unit Cost • Today {isLocked ? "(Locked — read only)" : "(Open)"}
                </Text>
              </View>
              <TouchableOpacity onPress={() => setParOpen(false)}><Text style={styles.closeX}>✕</Text></TouchableOpacity>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 4, paddingLeft: 4, paddingRight: 4 }}>
              {categories.map(cat => (
                <TouchableOpacity
                  key={String(cat)}
                  style={[styles.catChip, parCategory === cat && styles.catChipActive, { marginRight: 8 }]}
                  onPress={() => setParCategory(cat)}
                >
                  <Text style={[styles.catChipText, parCategory === cat && styles.catChipTextActive]}>{cat}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TextInput
              style={[styles.search, { marginTop: 4, marginBottom: 8 }]}
              placeholder="Search items..."
              placeholderTextColor="#8BA0B6"
              value={parQuery}
              onChangeText={setParQuery}
              editable={!isLocked}
            />

            <View style={styles.tableHeader}>
              <Text style={[styles.th, { flex: 2.4 }]}>Item</Text>
              <Text style={[styles.th, { flex: 1.3 }]}>Category</Text>
              <Text style={[styles.th, { flex: 0.9, textAlign: "center" }]}>PAR</Text>
              <Text style={[styles.th, { flex: 1.1, textAlign: "center" }]}>Unit Cost ($)</Text>
              <Text style={[styles.th, { width: 74, textAlign: "center" }]}>Action</Text>
            </View>

            <ScrollView style={{ maxHeight: "66%" }} keyboardShouldPersistTaps="handled">
              {parBase.map((it, idx) => {
                const d = getParDraft(it);
                return (
                  <View key={it.id} style={[styles.tr, idx % 2 === 1 && styles.trAlt]}>
                    <Text style={[styles.tdText, { flex: 2.4 }]} numberOfLines={2}>{it.name}</Text>
                    <Text style={[styles.tdBadge, { flex: 1.3 }]}>{it.category}</Text>

                    <TextInput
                      style={[styles.tdInput, { flex: 0.9, textAlign: "center" }]}
                      value={d.par}
                      onChangeText={(t) => updateParDraft(it.id, { par: t.replace(/[^0-9]/g, "") })}
                      keyboardType="number-pad"
                      editable={!isLocked}
                    />

                    <TextInput
                      style={[styles.tdInput, { flex: 1.1, textAlign: "center" }]}
                      value={d.unitCost}
                      onChangeText={(t) => updateParDraft(it.id, { unitCost: t.replace(/[^0-9.]/g, "") })}
                      keyboardType="decimal-pad"
                      editable={!isLocked}
                    />

                    <TouchableOpacity
                      style={[styles.rowSaveBtn, isLocked && styles.btnDisabled]}
                      onPress={() => applyParRow(it)}
                      disabled={isLocked}
                    >
                      <Text style={styles.rowSaveText}>Save</Text>
                    </TouchableOpacity>
                  </View>
                );
              })}
              <View style={{ height: 16 }} />
            </ScrollView>

            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-end", marginTop: 12 }}>
              <TouchableOpacity style={[styles.footerBtn, styles.secondaryBtn, { marginRight: 10 }]} onPress={() => setParOpen(false)}>
                <Text style={styles.footerBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.footerBtn, styles.greenBtn]} onPress={applyParAll} disabled={isLocked}>
                <Text style={styles.footerBtnText}>Apply All</Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </Modal>

      {/* ===== Add Products — Quick modal ===== */}
      <Modal visible={addOpen} animationType="slide" transparent>
        <View style={styles.modalBackdrop}>
          <View style={styles.modifySheet}>
            {/* Header */}
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <View>
                <Text style={{ color: "#fff", fontSize: 26, fontWeight: "800" }}>Add Products — Quick</Text>
                <Text style={{ color: "#9CB3CC", marginTop: 2 }}>Step 1: Select items • Mobile-first</Text>
              </View>
              <TouchableOpacity onPress={() => setAddOpen(false)}><Text style={styles.closeX}>✕</Text></TouchableOpacity>
            </View>

            {/* Category chips */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 4, paddingLeft: 4, paddingRight: 4 }}>
              {categories.map(cat => (
                <TouchableOpacity
                  key={String(cat)}
                  style={[styles.catChip, addCategory === cat && styles.catChipActive, { marginRight: 8 }]}
                  onPress={() => setAddCategory(cat)}
                >
                  <Text style={[styles.catChipText, addCategory === cat && styles.catChipTextActive]}>{cat}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Search + Add Product */}
            <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
              <TextInput
                style={[styles.search, { flex: 1, marginBottom: 0 }]}
                placeholder="Search catalog (e.g., Tito's)..."
                placeholderTextColor="#8BA0B6"
                value={addQuery}
                onChangeText={setAddQuery}
              />
              <TouchableOpacity
                style={[styles.toggleChip, styles.toggleChipActive, { marginLeft: 10 }]}
                onPress={handleOpenAddForm}
              >
                <Text style={[styles.toggleChipText, styles.toggleChipTextActive]}>Add Product</Text>
              </TouchableOpacity>
            </View>

            {/* Catalog list */}
            <ScrollView style={{ maxHeight: "40%", marginTop: 8 }}>
              {addFiltered.map(ci => {
                const selected = selectedAddIds.has(ci.id);
                return (
                  <TouchableOpacity
                    key={ci.id}
                    onPress={() => toggleSelectAdd(ci.id)}
                    activeOpacity={0.85}
                    style={styles.addRow}
                  >
                    <View style={[styles.addCheckbox, selected && styles.addCheckboxChecked]}>
                      {selected ? <Text style={styles.addCheckboxTick}>✓</Text> : null}
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ color: "#fff", fontWeight: "800", fontSize: 16 }} numberOfLines={1}>{ci.name}</Text>
                      <Text style={{ color: "#9CB3CC", marginTop: 2 }} numberOfLines={1}>
                        {ci.category} • {ci.unit} • ${ci.baseCost.toFixed(2)} base
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Step info + Next */}
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 10 }}>
              <Text style={{ color: "#9CB3CC" }}>{selectedAddIds.size} selected • Step 2: enter quick details</Text>
              <TouchableOpacity style={styles.nextBtn}>
                <Text style={{ color: "#0B1220", fontWeight: "800" }}>Next</Text>
              </TouchableOpacity>
            </View>

            {/* Forms for each selected */}
            <ScrollView style={{ marginTop: 10 }}>
              {[...selectedAddIds].map((id) => {
                const ci = getFromCatalog(id);
                const f = addForms[id] ?? { unitCost: String(ci.baseCost.toFixed(2)), initialOnHand: "", initialPar: "", packSize: "" };
                return (
                  <View key={id} style={styles.addCard}>
                    <Text style={styles.addCardTitle}>{ci.name}</Text>
                    <View style={styles.addInputsRow}>
                      <TextInput
                        style={[styles.input, styles.addInputHalf]}
                        placeholder="Unit Cost ($)"
                        placeholderTextColor="#8BA0B6"
                        keyboardType="decimal-pad"
                        value={f.unitCost}
                        onChangeText={(t) => updateAddForm(id, { unitCost: t.replace(/[^0-9.]/g, "") })}
                      />
                      <TextInput
                        style={[styles.input, styles.addInputHalf]}
                        placeholder="Initial On Hand"
                        placeholderTextColor="#8BA0B6"
                        keyboardType="number-pad"
                        value={f.initialOnHand}
                        onChangeText={(t) => updateAddForm(id, { initialOnHand: t.replace(/[^0-9]/g, "") })}
                      />
                    </View>
                    <View style={styles.addInputsRow}>
                      <TextInput
                        style={[styles.input, styles.addInputHalf]}
                        placeholder="Initial PAR"
                        placeholderTextColor="#8BA0B6"
                        keyboardType="number-pad"
                        value={f.initialPar}
                        onChangeText={(t) => updateAddForm(id, { initialPar: t.replace(/[^0-9]/g, "") })}
                      />
                      <TextInput
                        style={[styles.input, styles.addInputHalf]}
                        placeholder="Pack Size (e.g., case of 6)"
                        placeholderTextColor="#8BA0B6"
                        value={f.packSize}
                        onChangeText={(t) => updateAddForm(id, { packSize: t })}
                      />
                    </View>
                  </View>
                );
              })}
              <View style={{ height: 10 }} />
            </ScrollView>

            {/* Footer */}
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 10 }}>
              <TouchableOpacity style={[styles.footerBtn, { backgroundColor: "#122133", minWidth: 120 }]} onPress={() => setAddOpen(false)}>
                <Text style={styles.footerBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.footerBtn, styles.greenBtn, { flex: 1, marginLeft: 12 }]} onPress={onSaveAddProducts}>
                <Text style={styles.footerBtnText}>Save & Update Inventory</Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </Modal>

      {/* ===== Add Product (Quick) — Form modal (SCROLL + KEYBOARD AWARE) ===== */}
      <Modal visible={addFormOpen} animationType="slide" transparent>
        <View style={styles.modalBackdrop}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ width: "100%" }}
            keyboardVerticalOffset={Platform.OS === "ios" ? 12 : 0}
          >
            <ScrollView
              style={styles.modifySheet}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ paddingBottom: 24 + kbHeight }}
            >
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <View>
                  <Text style={{ color: "#fff", fontSize: 26, fontWeight: "800" }}>Add Product (Quick)</Text>
                  <Text style={{ color: "#9CB3CC", marginTop: 2 }}>Minimal fields • Mobile-first</Text>
                </View>
                <TouchableOpacity onPress={() => setAddFormOpen(false)}><Text style={styles.closeX}>✕</Text></TouchableOpacity>
              </View>

              <Text style={styles.inputLabel}>Name</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Tito's Handmade Vodka 1.75L"
                placeholderTextColor="#8BA0B6"
                value={formName}
                onChangeText={setFormName}
                returnKeyType="next"
              />

              <Text style={styles.inputLabel}>Bottle Size / Unit</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., 1.75L | 750ml | 12oz"
                placeholderTextColor="#8BA0B6"
                value={formUnit}
                onChangeText={setFormUnit}
                returnKeyType="next"
              />

              <Text style={styles.inputLabel}>Pack Size (per case)</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., case of 6"
                placeholderTextColor="#8BA0B6"
                value={formPack}
                onChangeText={setFormPack}
                returnKeyType="next"
              />

              <Text style={styles.inputLabel}>Category</Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
                {(["Liquor","Wine","Beer","Produce","Disposables"] as Category[]).map(c => (
                  <TouchableOpacity key={c} style={[styles.toggleChip, formCategory === c && styles.toggleChipActive]} onPress={() => setFormCategory(c)}>
                    <Text style={[styles.toggleChipText, formCategory === c && styles.toggleChipTextActive]}>{c}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.inputLabel}>Unit Cost ($)</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., 28.00"
                placeholderTextColor="#8BA0B6"
                value={formCost}
                onChangeText={(t) => setFormCost(t.replace(/[^0-9.]/g, ""))}
                keyboardType="decimal-pad"
                returnKeyType="next"
              />

              <Text style={styles.inputLabel}>Initial On Hand (optional)</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., 12"
                placeholderTextColor="#8BA0B6"
                value={formOnHand}
                onChangeText={(t) => setFormOnHand(t.replace(/[^0-9]/g, ""))}
                keyboardType="number-pad"
                returnKeyType="done"
              />

              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 16 }}>
                <TouchableOpacity style={[styles.footerBtn, { backgroundColor: "#122133", minWidth: 120 }]} onPress={() => setAddFormOpen(false)}>
                  <Text style={styles.footerBtnText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.footerBtn, styles.greenBtn, { flex: 1, marginLeft: 12 }]} onPress={onSaveAddProductForm}>
                  <Text style={styles.footerBtnText}>Save & Close</Text>
                </TouchableOpacity>
              </View>

              <View style={{ height: kbHeight }} />
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </Modal>

      {/* ===== Remove Products modal ===== */}
      <Modal visible={removeOpen} animationType="slide" transparent>
        <View style={styles.modalBackdrop}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ width: "100%" }}
            keyboardVerticalOffset={Platform.OS === "ios" ? 12 : 0}
          >
            <ScrollView
              style={styles.modifySheet}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ paddingBottom: 24 + kbHeight }}
            >
              <View style={{ marginBottom: 8 }}>
                <Text style={{ color: "#fff", fontSize: 28, fontWeight: "800" }}>Remove Products</Text>
                <Text style={{ color: "#9CB3CC", marginTop: 4 }}>
                  Archive or delete items from catalog/inventory
                </Text>
              </View>

              {/* Tabs */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 6, paddingLeft: 4, paddingRight: 4 }}>
                {categories.map(cat => (
                  <TouchableOpacity
                    key={String(cat)}
                    style={[styles.catChip, removeCategory === cat && styles.catChipActive, { marginRight: 8 }]}
                    onPress={() => setRemoveCategory(cat)}
                  >
                    <Text style={[styles.catChipText, removeCategory === cat && styles.catChipTextActive]}>{cat}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Search */}
              <TextInput
                style={[styles.search, { marginTop: 4 }]}
                placeholder="Search (name, SKU)..."
                placeholderTextColor="#8BA0B6"
                value={removeQuery}
                onChangeText={setRemoveQuery}
              />

              {/* Warning note */}
              {selectedRemoveIds.size > 0 ? (
                <View style={styles.warnBanner}>
                  <Text style={styles.warnText}>
                    Note: {selectedRemoveIds.size} selected item{selectedRemoveIds.size > 1 ? "s" : ""} may be used recently or linked to events.
                  </Text>
                </View>
              ) : null}

              {/* List */}
              <View style={{ marginTop: 6 }}>
                {removeFiltered.map((it) => {
                  const selected = selectedRemoveIds.has(it.id);
                  return (
                    <TouchableOpacity key={it.id} onPress={() => toggleRemoveSelect(it.id)} activeOpacity={0.9} style={styles.removeRow}>
                      <View style={[styles.addCheckbox, selected && styles.addCheckboxChecked]}>
                        {selected ? <Text style={styles.addCheckboxTick}>✓</Text> : null}
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={{ color: "#fff", fontSize: 16, fontWeight: "800" }} numberOfLines={1}>{it.name}</Text>
                        <Text style={{ color: "#9CB3CC", marginTop: 2 }} numberOfLines={1}>
                          {it.category} • On Hand {it.onHand} • PAR {it.par}
                        </Text>
                      </View>
                      {isLinkedToEvent(it) ? (
                        <View style={styles.linkedPill}>
                          <Text style={styles.linkedPillText}>Linked to Event</Text>
                        </View>
                      ) : null}
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Bulk actions */}
              <View style={styles.removePanel}>
                <Text style={styles.removePanelTitle}>Bulk action for {selectedRemoveIds.size} selected</Text>

                <TouchableOpacity
                  style={[styles.actionCard, removeAction === "archive" && styles.actionCardActive]}
                  onPress={() => setRemoveAction("archive")}
                  activeOpacity={0.9}
                >
                  <Text style={styles.actionTitle}>Archive (recommended)</Text>
                  <Text style={styles.actionSub}>Hides from use but keeps history & reports.</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionCard, removeAction === "remove" && styles.actionCardActive]}
                  onPress={() => setRemoveAction("remove")}
                  activeOpacity={0.9}
                >
                  <Text style={styles.actionTitle}>Remove from Inventory</Text>
                  <Text style={styles.actionSub}>Set On Hand to 0 but keep in catalog.</Text>
                </TouchableOpacity>

                <View style={[styles.actionCard, styles.deleteCard, removeAction === "delete" && styles.actionCardActive]}>
                  <TouchableOpacity onPress={() => setRemoveAction("delete")} activeOpacity={0.9}>
                    <Text style={[styles.actionTitle, { color: "#fecaca" }]}>Delete Permanently</Text>
                    <Text style={[styles.actionSub, { color: "#fda4af" }]}>
                      Type DELETE to confirm • Not allowed if linked to active events.
                    </Text>
                  </TouchableOpacity>
                  {removeAction === "delete" ? (
                    <TextInput
                      style={[styles.input, { marginTop: 8, backgroundColor: "#1b0f13", borderColor: "#7f1d1d" }]}
                      placeholder="DELETE"
                      placeholderTextColor="#fda4af"
                      value={deleteConfirm}
                      onChangeText={setDeleteConfirm}
                      autoCapitalize="characters"
                    />
                  ) : null}
                </View>
              </View>

              {/* Footer */}
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 12 }}>
                <TouchableOpacity style={[styles.footerBtn, { backgroundColor: "#122133", minWidth: 120 }]} onPress={() => setRemoveOpen(false)}>
                  <Text style={styles.footerBtnText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.footerBtn, styles.greenBtn, { flex: 1, marginLeft: 12 }]}
                  onPress={onApplyRemove}
                >
                  <Text style={styles.footerBtnText}>Apply Action</Text>
                </TouchableOpacity>
              </View>

              <View style={{ height: kbHeight }} />
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </Modal>

      {/* ===== Bottom sheet: Send Missing Items ===== */}
      <Modal visible={missingOpen} animationType="slide" transparent>
        <View style={styles.modalBackdrop}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ width: "100%" }}
            keyboardVerticalOffset={Platform.OS === "ios" ? 12 : 0}
          >
            <View style={styles.bottomCard}>
              <Text style={styles.bsTitle}>Send Missing Items</Text>
              <Text style={styles.bsSub}>Choose where to send today’s auto-generated restock list.</Text>

              <Text style={styles.inputLabel}>Recipient email</Text>
              <TextInput
                style={styles.input}
                placeholder="name@example.com"
                placeholderTextColor="#8BA0B6"
                value={missingEmail}
                onChangeText={setMissingEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />

              <TouchableOpacity
                onPress={() => setMissingCc(v => !v)}
                style={styles.checkboxRow}
                activeOpacity={0.8}
              >
                <View style={[styles.checkboxBox, missingCc && styles.checkboxBoxChecked]}>
                  {missingCc ? <Text style={styles.checkboxTick}>✓</Text> : null}
                </View>
                <Text style={styles.checkboxText}>Send me a copy (CC)</Text>
              </TouchableOpacity>

              <Text style={[styles.inputLabel, { marginTop: 12 }]}>Format</Text>
              <View style={{ flexDirection: "row", marginBottom: 8 }}>
                <TouchableOpacity
                  style={[styles.toggleChip, missingFormat === "PDF" && styles.toggleChipActive, { marginRight: 10 }]}
                  onPress={() => setMissingFormat("PDF")}
                >
                  <Text style={[styles.toggleChipText, missingFormat === "PDF" && styles.toggleChipTextActive]}>PDF</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.toggleChip, missingFormat === "XLSX" && styles.toggleChipActive]}
                  onPress={() => setMissingFormat("XLSX")}
                >
                  <Text style={[styles.toggleChipText, missingFormat === "XLSX" && styles.toggleChipTextActive]}>Excel (.xlsx)</Text>
                </TouchableOpacity>
              </View>

              <Text style={{ color: "#D1D5DB", marginTop: 4 }}>
                Includes: product, on hand, PAR, variance, to-order quantity.
              </Text>
              <Text style={{ color: "#9CB3CC", marginTop: 2 }}>
                Tip: Add multiple emails separated by commas.
              </Text>

              <View style={styles.bottomActions}>
                <TouchableOpacity style={[styles.footerBtn, { backgroundColor: "#122133", minWidth: 120 }]} onPress={() => { setMissingOpen(false); setManageOpen(true); }}>
                  <Text style={styles.footerBtnText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.footerBtn, styles.greenBtn, { minWidth: 120 }]} onPress={onSendMissing}>
                  <Text style={styles.footerBtnText}>Send</Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>

      {/* ===== Bottom sheet: Send Current Inventory ===== */}
      <Modal visible={currentOpen} animationType="slide" transparent>
        <View style={styles.modalBackdrop}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ width: "100%" }}
            keyboardVerticalOffset={Platform.OS === "ios" ? 12 : 0}
          >
            <View style={styles.bottomCard}>
              <Text style={styles.bsTitle}>Send Current Inventory</Text>
              <Text style={styles.bsSub}>Choose where to send the snapshot of today’s inventory.</Text>

              <Text style={styles.inputLabel}>Recipient email</Text>
              <TextInput
                style={styles.input}
                placeholder="name@example.com"
                placeholderTextColor="#8BA0B6"
                value={currentEmail}
                onChangeText={setCurrentEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />

              <TouchableOpacity
                onPress={() => setCurrentCc(v => !v)}
                style={styles.checkboxRow}
                activeOpacity={0.8}
              >
                <View style={[styles.checkboxBox, currentCc && styles.checkboxBoxChecked]}>
                {currentCc ? <Text style={styles.checkboxTick}>✓</Text> : null}
                </View>
                <Text style={styles.checkboxText}>Send me a copy (CC)</Text>
              </TouchableOpacity>

              <Text style={[styles.inputLabel, { marginTop: 12 }]}>Format</Text>
              <View style={{ flexDirection: "row", marginBottom: 8 }}>
                <TouchableOpacity
                  style={[styles.toggleChip, currentFormat === "PDF" && styles.toggleChipActive, { marginRight: 10 }]}
                  onPress={() => setCurrentFormat("PDF")}
                >
                  <Text style={[styles.toggleChipText, currentFormat === "PDF" && styles.toggleChipTextActive]}>PDF</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.toggleChip, currentFormat === "XLSX" && styles.toggleChipActive]}
                  onPress={() => setCurrentFormat("XLSX")}
                >
                  <Text style={[styles.toggleChipText, currentFormat === "XLSX" && styles.toggleChipTextActive]}>Excel (.xlsx)</Text>
                </TouchableOpacity>
              </View>

              <Text style={{ color: "#D1D5DB", marginTop: 4 }}>
                Includes: item, category, unit, on hand, PAR, in events, unit cost.
              </Text>
              <Text style={{ color: "#9CB3CC", marginTop: 2 }}>
                Tip: Add multiple emails separated by commas.
              </Text>

              <View style={styles.bottomActions}>
                <TouchableOpacity style={[styles.footerBtn, { backgroundColor: "#122133", minWidth: 120 }]} onPress={() => { setCurrentOpen(false); setManageOpen(true); }}>
                  <Text style={styles.footerBtnText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.footerBtn, styles.greenBtn, { minWidth: 120 }]} onPress={onSendCurrent}>
                  <Text style={styles.footerBtnText}>Send</Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

/** ===== Styles ===== */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0B1220", paddingHorizontal: 16 },
  topRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingTop: 8, paddingBottom: 6 },
  screenTitle: { color: "#fff", fontSize: 28, fontWeight: "800" },
  headerRight: { alignItems: "flex-end" },
  cohLabel: { color: "#A0AEC0", fontSize: 12 },
  cohValue: { color: "#fff", fontWeight: "800", fontSize: 18 },

  filtersRow: { flexDirection: "row", alignItems: "center", marginTop: 8, marginBottom: 10 },
  pill: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 18, backgroundColor: "rgba(255,255,255,0.08)", marginRight: 8 },
  pillActive: { backgroundColor: "#1f3a5b" },
  pillText: { color: "#9CB3CC", fontSize: 12, fontWeight: "600" },
  pillTextActive: { color: "#fff" },

  search: {
    backgroundColor: "#132A4A",
    color: "#fff",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: Platform.select({ ios: 12, android: 10 }),
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#243447",
  },

  itemCard: { backgroundColor: "#132A4A", borderRadius: 12, padding: 12, marginBottom: 10 },
  itemHeader: { marginBottom: 6 },
  itemName: { color: "#fff", fontSize: 16, fontWeight: "700" },
  itemMeta: { color: "#93A3B5", fontSize: 12 },
  kvRow: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  kv: { flex: 1, alignItems: "center" },
  kvLabel: { color: "#93A3B5", fontSize: 11 },
  kvValue: { color: "#fff", fontSize: 16, fontWeight: "700", marginTop: 2 },
  toOrderPill: { paddingHorizontal: 10, paddingVertical: 4, backgroundColor: "#f59e0b", borderRadius: 14, minWidth: 40, alignItems: "center" },
  toOrderText: { color: "#0b1220", fontWeight: "800" },

  footer: {
    position: "absolute", left: 0, right: 0, bottom: 0,
    paddingHorizontal: 16, paddingTop: 10, paddingBottom: 16,
    backgroundColor: "#0B1220", borderTopWidth: 1, borderTopColor: "#243447",
  },
  footerText: { color: "#A0AEC0", textAlign: "center", marginBottom: 10 },
  footerStrong: { color: "#fff", fontWeight: "800" },

  footerBtns: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10 },
  footerBtn: { alignItems: "center", paddingVertical: 12, borderRadius: 10, paddingHorizontal: 16, minWidth: 110 },
  footerBtnText: { color: "#fff", fontWeight: "800" },
  blueBtn: { backgroundColor: "#0EA5E9" },
  greenBtn: { backgroundColor: "#22C55E" },
  secondaryBtn: { backgroundColor: "#1f3a5b" },
  orangeBtn: { backgroundColor: "#f59e0b" },
  disabledBtn: { opacity: 0.45 },
  btnDisabled: { opacity: 0.4 },

  modalBackdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },

  sheet: { backgroundColor: "#0F1A2B", borderTopLeftRadius: 16, borderTopRightRadius: 16, padding: 16, maxHeight: "86%" },
  sheetHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  sheetTitle: { color: "#fff", fontSize: 18, fontWeight: "800" },
  closeX: { color: "#9CB3CC", fontSize: 18, paddingHorizontal: 8, paddingVertical: 4 },
  sheetRow: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    backgroundColor: "#132A4A", borderRadius: 12, paddingVertical: 12, paddingHorizontal: 12, marginTop: 8
  },
  sheetTexts: { flexShrink: 1, paddingRight: 12 },
  sheetItemTitle: { color: "#fff", fontWeight: "700", fontSize: 15 },
  sheetItemSub: { color: "#8BA0B6", fontSize: 12, marginTop: 2 },
  rowBtn: { backgroundColor: "#0EA5E9", borderRadius: 10, paddingVertical: 8, paddingHorizontal: 14 },
  rowBtnText: { color: "#fff", fontWeight: "800" },

  dialog: { backgroundColor: "#0F1A2B", marginHorizontal: 16, borderRadius: 14, padding: 16 },
  dialogTitle: { color: "#fff", fontSize: 18, fontWeight: "800", marginBottom: 10 },
  inputLabel: { color: "#9CB3CC", marginTop: 8, marginBottom: 6, fontSize: 12 },
  input: {
    backgroundColor: "#132A4A", color: "#fff", borderRadius: 10, borderWidth: 1, borderColor: "#243447",
    paddingHorizontal: 12, paddingVertical: Platform.select({ ios: 12, android: 10 })
  },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 10 },
  toggleChip: { paddingVertical: 6, paddingHorizontal: 10, borderRadius: 14, backgroundColor: "rgba(255,255,255,0.08)" },
  toggleChipActive: { backgroundColor: "#1f3a5b" },
  toggleChipText: { color: "#9CB3CC", fontWeight: "700", fontSize: 12 },
  toggleChipTextActive: { color: "#fff" },
  checkboxRow: { flexDirection: "row", alignItems: "center", marginTop: 12 },
  checkboxBox: { width: 22, height: 22, borderRadius: 6, borderWidth: 2, borderColor: "#334155", marginRight: 10, alignItems: "center", justifyContent: "center" },
  checkboxBoxChecked: { backgroundColor: "#22C55E", borderColor: "#22C55E" },
  checkboxTick: { color: "#0B1220", fontWeight: "900" },
  checkboxText: { color: "#D1D5DB" },
  dialogBtns: { flexDirection: "row", gap: 10, marginTop: 14 },
  dialogBtn: { alignItems: "center", paddingVertical: 12, borderRadius: 10, paddingHorizontal: 16 },
  dialogBtnText: { color: "#fff", fontWeight: "800" },
  lockLine: { color: "#9CB3CC", marginBottom: 4 },

  modifySheet: {
    backgroundColor: "#0F1A2B",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    maxHeight: "92%",
  },

  // === Chips compactos ===
  catChip: {
    height: 32,
    paddingHorizontal: 10,
    paddingVertical: 0,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.08)",
    marginRight: 8,
    justifyContent: "center",
  },
  catChipActive: { backgroundColor: "#0EA5E9" },
  catChipText: { color: "#9CB3CC", fontWeight: "600", fontSize: 12, lineHeight: 16 },
  catChipTextActive: { color: "#fff" },

  tableHeader: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#132A4A",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#243447",
  },
  th: { color: "#9CB3CC", fontSize: 12, fontWeight: "800" },

  tr: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#132A4A",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#243447",
    marginTop: 8,
  },
  trAlt: { backgroundColor: "rgba(255,255,255,0.03)" },
  tdText: { color: "#D1D5DB" },
  tdBadge: {
    color: "#D1D5DB",
    backgroundColor: "rgba(255,255,255,0.06)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    overflow: "hidden",
    textAlign: "center"
  },
  tdInput: {
    backgroundColor: "#0F1A2B",
    color: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#243447",
    paddingVertical: Platform.select({ ios: 10, android: 8 }),
    marginHorizontal: 6,
  },
  rowSaveBtn: {
    width: 74,
    alignItems: "center",
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: "#22C55E",
  },
  rowSaveText: { color: "#fff", fontWeight: "800" },

  modifyFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingTop: 10,
  },

  /* ===== Add Products — Quick styles ===== */
  addRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#132A4A",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#243447",
    marginTop: 8,
    gap: 12,
  },
  addCheckbox: {
    width: 22, height: 22, borderRadius: 6, borderWidth: 2, borderColor: "#334155",
    alignItems: "center", justifyContent: "center",
  },
  addCheckboxChecked: { backgroundColor: "#0EA5E9", borderColor: "#0EA5E9" },
  addCheckboxTick: { color: "#0B1220", fontWeight: "900" },

  nextBtn: {
    backgroundColor: "#0EA5E9",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
  },

  addCard: {
    backgroundColor: "#132A4A",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#243447",
    marginTop: 12,
  },
  addCardTitle: { color: "#fff", fontSize: 18, fontWeight: "800", marginBottom: 10 },
  addInputsRow: { flexDirection: "row", gap: 10 },
  addInputHalf: { flex: 1 },

  /* ===== Remove Products styles ===== */
  warnBanner: {
    backgroundColor: "#1f2937",
    borderColor: "#f59e0b",
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginTop: 8,
  },
  warnText: { color: "#fbbf24" },

  removeRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#132A4A",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#243447",
    marginTop: 8,
    gap: 12,
  },
  linkedPill: {
    backgroundColor: "rgba(148,163,184,0.25)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  linkedPillText: { color: "#cbd5e1", fontWeight: "700", fontSize: 12 },

  removePanel: {
    backgroundColor: "#0F1A2B",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#243447",
    marginTop: 12,
  },
  removePanelTitle: { color: "#fff", fontSize: 18, fontWeight: "800", marginBottom: 8 },

  actionCard: {
    backgroundColor: "#132A4A",
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: "#243447",
    marginTop: 8,
  },
  actionCardActive: { borderColor: "#0EA5E9" },
  deleteCard: { backgroundColor: "#2a1418", borderColor: "#7f1d1d" },
  actionTitle: { color: "#fff", fontWeight: "800", fontSize: 16 },
  actionSub: { color: "#9CB3CC", marginTop: 4 },

  /* ===== Bottom sheets common ===== */
  bottomCard: {
    backgroundColor: "#0F1A2B",
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    padding: 16,
    paddingBottom: 20,
  },
  bsTitle: { color: "#fff", fontSize: 26, fontWeight: "800" },
  bsSub: { color: "#9CB3CC", marginTop: 4, marginBottom: 8 },
  bottomActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
});