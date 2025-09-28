/**
 * Modal completo para crear eventos - SEPARADO
 */
import React, { useState } from 'react';
import {
  Modal,
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet
} from 'react-native';
import { useEventForm } from '@/hooks/useEventForm';
import { useStaffSelection } from '@/hooks/useStaffSelection';
import { useProductAssignments, Product } from '@/hooks/useProductAssignment';

// Componentes de las secciones
import BasicInfoSection from './BasicInfoSection';
import VenueSection from './VenueInfoSection';
import PricingSection from './PricingInfoSection';
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
];

const availableProducts: Product[] = [
  { sku: "Tito's 1.75L", available: 48 },
  { sku: 'Dom Pérignon 750ml', available: 18 },
  { sku: 'Michelob Ultra 12oz (case)', available: 22 },
  { sku: 'Lemons (lb)', available: 65 },
  { sku: 'Grey Goose 750ml', available: 35 },
  { sku: 'Heineken 12oz (case)', available: 40 },
];

export default function CreateEventModal({ 
  visible, 
  onClose, 
  onCreateEvent 
}: CreateEventModalProps) {
  const { form, handleChange, resetForm, validateForm } = useEventForm();
  const { selectedStaff, toggleStaff, resetSelection } = useStaffSelection(4);
  const { productAssignments } = useProductAssignments(availableProducts);

  const handleCreateEvent = () => {
    const validation = validateForm();
    if (!validation.isValid) {
      Alert.alert('Error', validation.errors.join('\n'));
      return;
    }

    const eventData = {
      ...form,
      selectedStaff,
      productAssignments,
      id: Date.now().toString(),
      status: 'PLANNED' as const
    };

    onCreateEvent?.(eventData);
    Alert.alert('Éxito', 'Evento creado correctamente');
    resetForm();
    resetSelection();
    onClose();
  };

  const handleClose = () => {
    resetForm();
    resetSelection();
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide">
      <SafeAreaView style={styles.modalContainer}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.header}>
            <Text style={styles.modalHeader}>Create Event</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <BasicInfoSection form={form} onChangeText={handleChange} />
          <VenueSection form={form} onChangeText={handleChange} />
          <PricingSection form={form} onChangeText={handleChange} />
          
          <StaffProductSection
            availableStaff={availableStaff}
            availableProducts={availableProducts}
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
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
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
    marginTop: 20,
  },
  button: {
    flex: 1,
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  draftBtn: {
    backgroundColor: '#6B7280',
  },
  createBtn: {
    backgroundColor: '#22C55E',
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});