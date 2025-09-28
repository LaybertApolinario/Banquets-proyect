import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { InvoiceDetailData } from '@/types/events';
import ExportPanel from '@/components/InvoiceComponents/ExportPanel';

interface InvoiceInfoPanelProps {
  activeTab: string;
  invoiceData: InvoiceDetailData;
  onExport: (type: string) => void;
}

export default function InvoiceInfoPanel({ 
  activeTab, 
  invoiceData, 
  onExport 
}: InvoiceInfoPanelProps) {
  if (activeTab === 'view') {
    return (
      <View style={styles.infoPanel}>
        <Text style={styles.infoPanelTitle}>📋 View Only</Text>
        <Text style={styles.infoPanelText}>
          Data can only be viewed. No changes can be made, Calculations are automatic.
        </Text>
        <Text style={styles.infoPanelText}>
          Service Charge: {(invoiceData.serviceChargeRate * 100).toFixed(0)}% • Tax: {(invoiceData.taxRate * 100).toFixed(1)}%
        </Text>
      </View>
    );
  }

  if (activeTab === 'export') {
    return <ExportPanel onExport={onExport} />;
  }

  return null;
}

const styles = StyleSheet.create({
  infoPanel: {
    backgroundColor: "#132A4A",
    padding: 14,
    borderRadius: 8,
    marginBottom: 20,
  },
  infoPanelTitle: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 8,
  },
  infoPanelText: {
    color: '#D1D5DB',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
});
