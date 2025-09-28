/**
 * Sección D completa - Staff & Products
 */
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useProductAssignments, Product } from '@/hooks/useProductAssignment';
import StaffSelector from './StaffSelector';
import ProductSelector from './ProductSelector';
import AssignmentsTable from './AssignmentTable';
import EditAssignmentModal from './EditModal';

interface StaffProductSectionProps {
  availableStaff: Array<{ id: string; name: string; available: boolean }>;
  availableProducts: Product[];
  selectedStaff: string[];
  onToggleStaff: (name: string) => void;
}

export default function StaffProductSection({
  availableStaff,
  availableProducts,
  selectedStaff,
  onToggleStaff
}: StaffProductSectionProps) {
  const {
    productAssignments,
    addAssignment,
    updateAssignment,
    deleteAssignment
  } = useProductAssignments(availableProducts);

  // Estados para nueva asignación
  const [newSku, setNewSku] = useState('');
  const [newAssign, setNewAssign] = useState('');
  const [newStaffAssign, setNewStaffAssign] = useState<string[]>([]);
  const [productSearch, setProductSearch] = useState('');
  
  // Estados para modal de edición
  const [editModal, setEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  const handleAddAssignment = () => {
    const quantity = Number(newAssign);
    const success = addAssignment(newSku, quantity, newStaffAssign);
    
    if (success) {
      setNewSku('');
      setNewAssign('');
      setNewStaffAssign([]);
      setProductSearch('');
    }
  };

  const handleEditAssignment = (assignment: any) => {
    setEditingItem(assignment);
    setEditModal(true);
  };

  const handleSaveEdit = (quantity: number, staffAssign: string[]) => {
    const success = updateAssignment(editingItem.id, quantity, staffAssign);
    
    if (success) {
      setEditModal(false);
      setEditingItem(null);
    }
  };

  const toggleNewStaffAssign = (name: string) => {
    if (newStaffAssign.includes(name)) {
      setNewStaffAssign(prev => prev.filter(s => s !== name));
    } else {
      setNewStaffAssign(prev => [...prev, name]);
    }
  };

  return (
    <>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>D) Assign Staff & Products</Text>

        <StaffSelector
          availableStaff={availableStaff}
          selectedStaff={selectedStaff}
          onToggleStaff={onToggleStaff}
        />

        <ProductSelector
          availableProducts={availableProducts}
          productAssignments={productAssignments}
          selectedSku={newSku}
          searchText={productSearch}
          onSelectSku={setNewSku}
          onSearchChange={setProductSearch}
        />

        <View style={styles.assignmentRow}>
          <TextInput
            style={styles.quantityInput}
            placeholder="Quantity"
            placeholderTextColor="#888"
            value={newAssign}
            onChangeText={setNewAssign}
            keyboardType="numeric"
          />
        </View>

        <StaffSelector
          availableStaff={availableStaff.filter(staff => 
            selectedStaff.includes(staff.name)
          )}
          selectedStaff={newStaffAssign}
          onToggleStaff={toggleNewStaffAssign}
          title="Assign to Staff:"
        />

        <TouchableOpacity 
          style={styles.addAssignmentBtn} 
          onPress={handleAddAssignment}
        >
          <Text style={styles.buttonText}>Add Assignment</Text>
        </TouchableOpacity>

        <AssignmentsTable
          assignments={productAssignments}
          onEdit={handleEditAssignment}
          onDelete={deleteAssignment}
        />
      </View>

      <EditAssignmentModal
        visible={editModal}
        assignment={editingItem}
        selectedStaff={selectedStaff}
        onClose={() => setEditModal(false)}
        onSave={handleSaveEdit}
      />
    </>
  );
}

const styles = StyleSheet.create({
  section: {
    backgroundColor: '#132A4A',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#FFF',
    fontWeight: 'bold',
    marginBottom: 10,
    fontSize: 16,
  },
  assignmentRow: {
    marginBottom: 15,
  },
  quantityInput: {
    backgroundColor: '#0B1220',
    color: '#FFF',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2D3748',
  },
  addAssignmentBtn: {
    backgroundColor: '#22C55E',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});