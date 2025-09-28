import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { InvoiceDetailData } from '@/types/events';
import TabButton from '@/components/InvoiceComponents/TabButton';

interface InvoiceHeaderProps {
  invoiceData: InvoiceDetailData;
  activeTab: string;
  canEdit: boolean;
  onViewTab: () => void;
  onEditTab: () => void;
  onExportTab: () => void;
  onRecalculate: () => void;
  onSave: () => void;
}


export default function InvoiceHeader({
  invoiceData,
  activeTab,
  canEdit,
  onViewTab,
  onEditTab,
  onExportTab,
  onRecalculate,
  onSave
}: InvoiceHeaderProps) {
  return (

    <View style={styles.header}>
      <Text style={styles.headerTitle}>Invoice • {invoiceData.invoiceId}</Text>
      <Text style={styles.headerSubtitle}>
        {invoiceData.geo} • {invoiceData.location} • Tier: {invoiceData.tier}
      </Text>
      
      {/* Tabs */}
      <View style={styles.headerButtons}>
        <TabButton title="View" isActive={activeTab === 'view'} onPress={onViewTab} />
        <TabButton title="Edit" isActive={activeTab === 'edit'} onPress={onEditTab} />
        <TabButton title="Export" isActive={activeTab === 'export'} onPress={onExportTab} />
      </View>
      
      {/* Action buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={[styles.actionButton, !canEdit && styles.disabledButton]}
          disabled={!canEdit}
          onPress={onRecalculate}
          activeOpacity={canEdit ? 0.7 : 1}
        >
          <Text style={[styles.actionButtonText, !canEdit && styles.disabledText]}>
            Apply & Recalc
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.saveButton, !canEdit && styles.disabledSaveButton]}
          disabled={!canEdit}
          onPress={onSave}
          activeOpacity={canEdit ? 0.7 : 1}
        >
          <Text style={[styles.saveButtonText, !canEdit && styles.disabledText]}>
            Save
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#0B1D36",
    padding: 16,
    paddingTop: 8,
  },
  headerTitle: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  headerSubtitle: {
    color: '#A0AEC0',
    fontSize: 13,
    marginBottom: 16,
  },
  headerButtons: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  actionButtons: {
    flexDirection: 'row',
  },
  actionButton: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    marginRight: 6,
    borderRadius: 6,
    backgroundColor: '#374151',
    borderWidth: 1,
    borderColor: '#4A5568',
  },
  saveButton: {
    backgroundColor: '#38A169',
    borderColor: '#38A169',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 6,
    borderWidth: 1,
  },
  disabledButton: {
    opacity: 0.4,
    backgroundColor: '#374151',
  },
  disabledSaveButton: {
    opacity: 0.4,
    backgroundColor: '#374151',
  },
  actionButtonText: {
    color: '#A0AEC0',
    fontSize: 13,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 13,
  },
  disabledText: {
    color: '#6B7280',
  },
});