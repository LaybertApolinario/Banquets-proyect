import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { StaffMember } from '@/hooks/useStaffSelection';

interface StaffSelectorProps {
  availableStaff: StaffMember[];
  selectedStaff: string[];
  onToggleStaff: (name: string) => void;
  title?: string;
}

export default function StaffSelector({
  availableStaff,
  selectedStaff,
  onToggleStaff,
  title = 'Available Staff:'
}: StaffSelectorProps) {
  return (
    <>
      <Text style={styles.subTitle}>{title}</Text>
      <View style={styles.staffRow}>
        {availableStaff.map((staff) => (
          <TouchableOpacity
            key={staff.id}
            style={[
              styles.staffButton,
              selectedStaff.includes(staff.name) && styles.staffButtonActive,
            ]}
            onPress={() => onToggleStaff(staff.name)}
          >
            <Text
              style={[
                styles.staffButtonText,
                selectedStaff.includes(staff.name) && styles.staffButtonTextActive,
              ]}
            >
              {staff.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
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
  staffRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  staffButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  staffButtonActive: {
    backgroundColor: '#0EA5E9',
    borderColor: '#0EA5E9',
  },
  staffButtonText: {
    color: '#9CA3AF',
    fontSize: 12,
  },
  staffButtonTextActive: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});
