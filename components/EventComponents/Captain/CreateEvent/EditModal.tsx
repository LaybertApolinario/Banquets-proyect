// components/Modals/EditAssignmentModal.tsx
/**
 * Modal para editar asignaciones - SEPARADO
 */
import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import { ProductAssignment } from '@/hooks/useProductAssignment';
import StaffSelector from './StaffSelector';

interface EditAssignmentModalProps {
  visible: boolean;
  assignment: ProductAssignment | null;
  selectedStaff: string[];
  onClose: () => void;
  onSave: (quantity: number, staffAssign: string[]) => void;
}

export default function EditAssignmentModal({
  visible,
  assignment,
  selectedStaff,
  onClose,
  onSave
}: EditAssignmentModalProps) {
  const [editAssign, setEditAssign] = useState('');
  const [editStaffAssign, setEditStaffAssign] = useState<string[]>([]);

  useEffect(() => {
    if (assignment) {
      setEditAssign(String(assignment.assign));
      setEditStaffAssign([...assignment.assignedStaff]);
    }
  }, [assignment]);

  const handleSave = () => {
    const quantity = Number(editAssign);
    if (isNaN(quantity) || quantity <= 0) {
      return;
    }
    onSave(quantity, editStaffAssign);
  };

  const toggleEditStaffAssign = (name: string) => {
    if (editStaffAssign.includes(name)) {
      setEditStaffAssign(prev => prev.filter(s => s !== name));
    } else {
      setEditStaffAssign(prev => [...prev, name]);
    }
  };

  const availableStaff = selectedStaff.map(name => ({
    id: name,
    name,
    available: true
  }));

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.overlay}>
        <View style={styles.content}>
          <Text style={styles.title}>Edit Assignment</Text>
          
          <Text style={styles.label}>Product: {assignment?.sku}</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Quantity"
            placeholderTextColor="#888"
            value={editAssign}
            onChangeText={setEditAssign}
            keyboardType="numeric"
          />

          <StaffSelector
            availableStaff={availableStaff}
            selectedStaff={editStaffAssign}
            onToggleStaff={toggleEditStaffAssign}
            title="Assign to Staff:"
          />

          <View style={styles.buttonsRow}>
            <TouchableOpacity
              style={[styles.button, styles.cancelBtn]}
              onPress={onClose}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.saveBtn]}
              onPress={handleSave}
            >
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    backgroundColor: '#132A4A',
    padding: 20,
    borderRadius: 15,
    width: '90%',
    maxWidth: 400,
  },
  title: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  label: {
    color: '#FFF',
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#0B1220',
    color: '#FFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#2D3748',
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelBtn: {
    backgroundColor: '#6B7280',
  },
  saveBtn: {
    backgroundColor: '#22C55E',
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});