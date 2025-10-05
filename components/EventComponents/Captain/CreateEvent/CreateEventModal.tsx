/**
 * Modal completo para crear eventos
 * FIX: SafeAreaView viene de 'react-native-safe-area-context' para poder usar `edges`
 */
import React, { useEffect, useMemo, useState } from 'react';
import {
  Modal,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; // 👈 CORRECTO

import { useEventForm } from '@/hooks/useEventForm';
import { useStaffSelection } from '@/hooks/useStaffSelection';
import { useProductAssignments, Product } from '@/hooks/useProductAssignment';

import BasicInfoSection from './BasicInfoSection';
import VenueSection from './VenueInfoSection';
import PricingSection, { PackName } from './PricingInfoSection';
import StaffProductSection from './StaffProductSection';

interface CreateEventModalProps {
  visible: boolean;
  onClose: () => void;
  onCreateEvent?: (eventData: any) => void;
}

const availableStaff = [
  { id: '1', name: 'Joy', available: true },
  { id: '2', name: 'Soncha', available: true },
  { id: '3', name: 'Alex', available: true },
  { id: '4', name: 'Mia', available: true },
  { id: '5', name: 'Leo', available: true },
  { id: '6', name: 'Kim', available: true },
];

const ALL_PRODUCTS: Product[] = [
  { sku: "Tito's 1.75L", available: 48 },
  { sku: 'Dom Pérignon 750ml', available: 18 },
  { sku: 'Michelob Ultra 12oz (case)', available: 22 },
  { sku: 'Lemons (lb)', available: 65 },
  { sku: 'Grey Goose 750ml', available: 35 },
  { sku: 'Heineken 12oz (case)', available: 40 },
  { sku: 'Patrón Silver 750ml', available: 20 },
  { sku: 'Red Wine House 750ml', available: 60 },
];

const PACK_DEFS: Record<PackName, { staffCount: number; whitelist?: string[] }> = {
  'Superior': {
    staffCount: 3,
    whitelist: ["Tito's 1.75L", 'Michelob Ultra 12oz (case)', 'Red Wine House 750ml'],
  },
  'Premium': {
    staffCount: 4,
    whitelist: ["Grey Goose 750ml", 'Heineken 12oz (case)', 'Red Wine House 750ml', "Tito's 1.75L"],
  },
  'Superior Cash': {
    staffCount: 3,
    whitelist: ["Tito's 1.75L", 'Michelob Ultra 12oz (case)', 'Lemons (lb)'],
  },
  'Premium Cash': {
    staffCount: 4,
    whitelist: ['Grey Goose 750ml', 'Heineken 12oz (case)', 'Lemons (lb)'],
  },
  'San Destin': {
    staffCount: 3,
    whitelist: ["Tito's 1.75L", 'Heineken 12oz (case)'],
  },
  'San Destin Cash': {
    staffCount: 4,
    whitelist: ["Tito's 1.75L", 'Heineken 12oz (case)', 'Lemons (lb)'],
  },
  'Personalizado': { staffCount: 0 },
};

export default function CreateEventModal({ 
  visible, 
  onClose, 
  onCreateEvent 
}: CreateEventModalProps) {
  const { form, handleChange, resetForm, validateForm } = useEventForm();
  const { selectedStaff, toggleStaff, resetSelection } = useStaffSelection(6);

  const [pack, setPack] = useState<PackName>('Superior');
  const [liquorPaid, setLiquorPaid] = useState<string>('');

  const availableProductsByPack = useMemo(() => {
    const def = PACK_DEFS[pack];
    if (!def.whitelist || pack === 'Personalizado') return ALL_PRODUCTS;
    const set = new Set(def.whitelist);
    return ALL_PRODUCTS.filter(p => set.has(p.sku));
  }, [pack]);

  const { productAssignments } = useProductAssignments(availableProductsByPack);

  useEffect(() => {
    const def = PACK_DEFS[pack];
    resetSelection();
    const n = Math.min(def.staffCount, availableStaff.length);
    for (let i = 0; i < n; i++) toggleStaff(availableStaff[i].name);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pack]);

  const handleCreateEvent = () => {
    const validation = validateForm();
    if (!validation.isValid) {
      Alert.alert('Error', validation.errors.join('\n'));
      return;
    }

    const eventData = {
      ...form,
      id: Date.now().toString(),
      status: 'PLANNED' as const,
      pack,
      liquorPaid,
      selectedStaff,
      productAssignments,
    };

    onCreateEvent?.(eventData);
    Alert.alert('Éxito', 'Evento creado correctamente');

    resetForm();
    resetSelection();
    setPack('Superior');
    setLiquorPaid('');
    onClose();
  };

  const handleClose = () => {
    resetForm();
    resetSelection();
    setPack('Superior');
    setLiquorPaid('');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide">
      {/* SafeAreaView correcto con edges */}
      <SafeAreaView style={styles.modalContainer} edges={['left','right','bottom']}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.header}>
            <Text style={styles.modalHeader}>Create Event</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <BasicInfoSection form={form} onChangeText={handleChange} />
          <VenueSection form={form} onChangeText={handleChange} />

          <PricingSection
            form={form}
            onChangeText={handleChange}
            pack={pack}
            onChangePack={setPack}
            liquorPaid={liquorPaid}
            onChangeLiquorPaid={setLiquorPaid}
          />

          <StaffProductSection
            availableStaff={availableStaff}
            availableProducts={availableProductsByPack}
            selectedStaff={selectedStaff}
            onToggleStaff={toggleStaff}
          />

          <View style={styles.buttonsRow}>
            <TouchableOpacity
              style={[styles.button, styles.draftBtn]}
              onPress={handleClose}
            >
              <Text style={styles.buttonText}>Save Draft</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.createBtn]}
              onPress={handleCreateEvent}
            >
              <Text style={styles.buttonText}>Create Event</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: '#0B1220',
  },
  scroll: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  closeButton: {
    width: 32,
    height: 32,
    backgroundColor: '#374151',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 18,
    marginBottom: 8,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  draftBtn: { backgroundColor: '#6B7280' },
  createBtn: { backgroundColor: '#22C55E' },
  buttonText: { color: '#FFF', fontWeight: 'bold' },
});
