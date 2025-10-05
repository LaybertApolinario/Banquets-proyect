import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ProductAssignment } from '@/hooks/useProductAssignment';

interface AssignmentsTableProps {
  assignments: ProductAssignment[];
  onEdit: (assignment: ProductAssignment) => void;
  onDelete: (id: string) => void;
}

export default function AssignmentsTable({
  assignments,
  onEdit,
  onDelete
}: AssignmentsTableProps) {
  return (
    <>
      <Text style={styles.subTitle}>Current Assignments:</Text>
      <View style={styles.tableHeader}>
        <Text style={[styles.tableHeaderText, { flex: 2 }]}>SKU</Text>
        <Text style={[styles.tableHeaderText, { flex: 1 }]}>Assign</Text>
        <Text style={[styles.tableHeaderText, { flex: 2 }]}>Split</Text>
        <Text style={[styles.tableHeaderText, { flex: 1 }]}>Actions</Text>
      </View>
      
      {assignments.map((assignment) => (
        <TouchableOpacity
          key={assignment.id}
          style={styles.tableRow}
          onPress={() => onEdit(assignment)}
        >
          <Text style={[styles.tableText, { flex: 2 }]}>{assignment.sku}</Text>
          <Text style={[styles.tableText, { flex: 1 }]}>{assignment.assign}</Text>
          <Text style={[styles.tableText, { flex: 2 }]}>{assignment.split}</Text>
          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={() => onDelete(assignment.id)}
          >
            <Text style={styles.deleteBtnText}>×</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  subTitle: {
    color: '#FFF',
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 10,
    fontSize: 14,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#4A5568',
    paddingBottom: 8,
    marginBottom: 8,
  },
  tableHeaderText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: 6,
    marginBottom: 4,
    paddingHorizontal: 8,
  },
  tableText: {
    color: '#FFF',
    fontSize: 11,
  },
  deleteBtn: {
    backgroundColor: '#EF4444',
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  deleteBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
