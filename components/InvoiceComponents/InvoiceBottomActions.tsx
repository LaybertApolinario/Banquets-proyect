import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface InvoiceBottomActionsProps {
  canEdit: boolean;
  onCancel: () => void;
  onClear: () => void;
  onRecalc: () => void;
  onSave: () => void;
}

export default function InvoiceBottomActions({
  canEdit,
  onCancel,
  onClear,
  onRecalc,
  onSave
}: InvoiceBottomActionsProps) {
  return (
    <View style={styles.bottomActions}>
      <TouchableOpacity style={styles.bottomButton} onPress={onCancel} activeOpacity={0.7}>
        <Text style={styles.bottomButtonText}>Cancel</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.clearButton, !canEdit && styles.disabledButton]}
        disabled={!canEdit}
        onPress={onClear}
        activeOpacity={canEdit ? 0.7 : 1}
      >
        <Text style={[styles.clearButtonText, !canEdit && styles.disabledText]}>
          Clear
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.bottomButton, !canEdit && styles.disabledButton]}
        disabled={!canEdit}
        onPress={onRecalc}
        activeOpacity={canEdit ? 0.7 : 1}
      >
        <Text style={[styles.bottomButtonText, !canEdit && styles.disabledText]}>
          Recalc
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.saveChangesButton, !canEdit && styles.disabledSaveButton]}
        disabled={!canEdit}
        onPress={onSave}
        activeOpacity={canEdit ? 0.7 : 1}
      >
        <Text style={[styles.saveChangesButtonText, !canEdit && styles.disabledText]}>
          Save
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomActions: {
    flexDirection: 'row',
    backgroundColor: "#0B1D36",
    padding: 12,
    marginBottom: 50,
    borderTopWidth: 1,
    borderTopColor: '#4A5568',
    gap: 6,
  },
  bottomButton: {
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: '#374151',
    borderWidth: 1,
    borderColor: '#4A5568',
    flex: 1,
  },
  clearButton: {
    backgroundColor: '#E53E3E',
    borderColor: '#E53E3E',
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    flex: 1,
  },
  saveChangesButton: {
    backgroundColor: '#3182CE',
    borderColor: '#3182CE',
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    flex: 1,
  },
  disabledButton: {
    opacity: 0.4,
    backgroundColor: '#374151',
  },
  disabledSaveButton: {
    opacity: 0.4,
    backgroundColor: '#374151',
  },
  bottomButtonText: {
    color: '#A0AEC0',
    fontSize: 11,
    textAlign: 'center',
    fontWeight: '500',
  },
  clearButtonText: {
    color: 'white',
    fontSize: 11,
    textAlign: 'center',
    fontWeight: '500',
  },
  saveChangesButtonText: {
    color: 'white',
    fontSize: 11,
    textAlign: 'center',
    fontWeight: '500',
  },
  disabledText: {
    color: '#6B7280',
  },
});
